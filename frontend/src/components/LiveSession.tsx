import { useEffect, useState, useRef, useCallback } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { socket } from '../socket';
import { Class } from '../pages/admin/TimetableManagement';
import { fetchClasses, getStudentsIdByClass } from '../api/admin/classApi';

// Define the type for sessionInfo based on the data received from the socket
interface SessionInfo {
  sessionId: string;
  title: string;
  scheduledAt?: string;
}

interface UserInfo {
  id: string;
  email: string;
  role: string;
}

const appId = import.meta.env.VITE_AGORA_APP_ID;

const LiveSession = ({ userRole, userId }: { userRole: 'Teacher' | 'Student'; userId: string }) => {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [localTracks, setLocalTracks] = useState<{ audioTrack: IMicrophoneAudioTrack; videoTrack: ICameraVideoTrack } | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]); // Track remote users for video rendering
  const [sessionTitle, setSessionTitle] = useState<string>(''); // For starting a new session
  const [scheduledAt, setScheduledAt] = useState<string>(''); // For scheduling a session
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // For loading states
  const [userList, setUserList] = useState<UserInfo[]>([]); // To display participants
  const [classes, setClasses] = useState<Class[]>([]); 
  const [selectedClassId, setSelectedClassId] = useState<string>(''); // Selected class for scheduling
  const [studentIds, setStudentIds] = useState<string[]>([]); // To store student IDs for the selected class
  const isJoiningRef = useRef<boolean>(false); // Track if a join operation is in progress

  // Initialize Agora client
  const agoraClient: IAgoraRTCClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

  // Fetch classes for the teacher
  useEffect(() => {
    if (userRole === 'Teacher') {
      const getClasses = async () => {
        try {
          const fetchedClasses = await fetchClasses();
          setClasses(fetchedClasses || []); // Fallback to empty array if undefined

          if (fetchedClasses?.length > 0 && fetchedClasses[0]._id) {
            setSelectedClassId(fetchedClasses[0]._id ?? '');
          }
        } catch (err) {
          setError('Failed to load classes: ' + (err instanceof Error ? err.message : String(err)));
        }
      };
      getClasses();
    }
  }, [userRole]);

  // Fetch student IDs for the selected class
  useEffect(() => {
    if (userRole === 'Teacher' && selectedClassId) {
      const fetchStudentIds = async () => {
        try {
          const studentIdsData = await getStudentsIdByClass(selectedClassId);
          setStudentIds(studentIdsData?.studentIds || []); // Fallback to empty array if undefined
        } catch (err) {
          setError('Failed to load student list: ' + (err instanceof Error ? err.message : String(err)));
          setStudentIds([]); // Reset to empty array on error
        }
      };
      fetchStudentIds();
    }
  }, [userRole, selectedClassId]);

  // Memoize joinSession to ensure it doesn't change unnecessarily
  const joinSession = useCallback((sessionId: string) => {
    setLoading(true);
    socket.emit('join-live-session', {
      sessionId,
      participantId: userId,
    });
  }, [userId]);

  useEffect(() => {
    if (!appId) {
      setError('Agora App ID is not set. Please check VITE_AGORA_APP_ID in your environment variables.');
      return;
    }

    // Socket event handlers
    const onLiveSessionScheduled = (data: SessionInfo) => {
      setSessionInfo(data);
      // Removed immediate join logic; wait for live-session-start event
    };

    const onLiveSessionStart = (data: SessionInfo) => {
      setSessionInfo(data);
      // Auto-join for both teacher and student when the session starts
      alert(`Live session "${data.title}" is starting now! Joining the session...`);
      joinSession(data.sessionId);
    };

    const onError = ({ message }: { message: string }) => {
      setError(message);
      setLoading(false);
    };

    const onLiveSessionJoined = async ({ roomId, token, participants }: { roomId: string; token: string; participants: UserInfo[] }) => {
      if (!sessionInfo) return; // Skip if session has already ended

      setLoading(true);
      isJoiningRef.current = true; // Mark that a join operation is in progress

      try {
        console.log('Joining Agora session:', { appId, roomId, token, userId });
        // Join the Agora session
        await agoraClient.join(appId, roomId, token, userId);
        console.log('Successfully joined Agora session');

        // Create and publish local tracks
        console.log('Creating microphone and camera tracks...');
        const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks({
          audioTrack: tracks[0], // Microphone track
          videoTrack: tracks[1], // Camera track
        });
        console.log('Local tracks created:', tracks);

        // Only publish if the session is still active
        if (sessionInfo) {
          console.log('Publishing tracks to Agora session...');
          await agoraClient.publish(tracks);
          console.log('Tracks published successfully');

          // Play local video
          const localVideoElement = document.getElementById(`local-video-${userId}`);
          if (!localVideoElement) {
            throw new Error(`Local video element local-video-${userId} not found in DOM`);
          }
          console.log('Playing local video...');
          tracks[1].play(`local-video-${userId}`);
          console.log('Local video playing');
        } else {
          // If session ended during join, clean up tracks
          tracks[0]?.stop();
          tracks[1]?.stop();
          await agoraClient.leave();
          return;
        }

        // Update participant list
        setUserList(participants);

        // Handle remote users
        agoraClient.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
          console.log(`Remote user published: ${user.uid}, mediaType: ${mediaType}`);
          await agoraClient.subscribe(user, mediaType);
          if (mediaType === 'video') {
            const remoteVideoTrack = user.videoTrack;
            if (remoteVideoTrack) {
              const remoteVideoElement = document.getElementById(`remote-video-${user.uid}`);
              if (!remoteVideoElement) {
                console.error(`Remote video element remote-video-${user.uid} not found in DOM`);
                return;
              }
              remoteVideoTrack.play(`remote-video-${user.uid}`);
              console.log(`Playing remote video for user ${user.uid}`);
            }
          }
          if (mediaType === 'audio') {
            const remoteAudioTrack = user.audioTrack;
            if (remoteAudioTrack) {
              remoteAudioTrack.play();
              console.log(`Playing remote audio for user ${user.uid}`);
            }
          }
          setRemoteUsers((prev) => [...prev, user]);
        });

        agoraClient.on('user-unpublished', (user: IAgoraRTCRemoteUser) => {
          console.log(`Remote user unpublished: ${user.uid}`);
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        });

        agoraClient.on('user-left', (user: IAgoraRTCRemoteUser) => {
          console.log(`Remote user left: ${user.uid}`);
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
          setUserList((prev) => prev.filter((u) => u.id !== user.uid));
        });

        setLoading(false);
      } catch (err) {
        const errorMessage = 'Failed to join session: ' + (err instanceof Error ? err.message : String(err));
        console.error('Error in onLiveSessionJoined:', errorMessage);
        setError(errorMessage);
        setLoading(false);
      } finally {
        isJoiningRef.current = false; // Mark join operation as complete
      }
    };

    const onLiveSessionEnded = async ({ sessionId }: { sessionId: string }) => {
      if (sessionInfo?.sessionId === sessionId) {
        // Wait for any ongoing join operation to complete
        while (isJoiningRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 100)); // Poll every 100ms
        }

        setSessionInfo(null);
        setLocalTracks((tracks) => {
          if (tracks) {
            tracks.audioTrack?.stop();
            tracks.videoTrack?.stop();
          }
          return null;
        });
        setRemoteUsers([]);
        setUserList([]);
        await agoraClient.leave();
        alert('Live session has ended.');
      }
    };

    // Register socket event listeners
    socket.on('live-session-scheduled', onLiveSessionScheduled);
    socket.on('live-session-start', onLiveSessionStart);
    socket.on('error', onError);
    socket.on('live-session-joined', onLiveSessionJoined);
    socket.on('live-session-ended', onLiveSessionEnded);

    // Cleanup on unmount
    return () => {
      socket.off('live-session-scheduled', onLiveSessionScheduled);
      socket.off('live-session-start', onLiveSessionStart);
      socket.off('error', onError);
      socket.off('live-session-joined', onLiveSessionJoined);
      socket.off('live-session-ended', onLiveSessionEnded);

      // Wait for any ongoing join operation to complete before leaving
      const cleanup = async () => {
        while (isJoiningRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 100)); // Poll every 100ms
        }
        await agoraClient.leave();
        if (localTracks) {
          localTracks.audioTrack?.stop();
          localTracks.videoTrack?.stop();
        }
      };
      cleanup();
    };
  }, [userRole, userId, sessionInfo, agoraClient, localTracks, joinSession]);

  // Teacher starts a session immediately
  const startSession = () => {
    if (!sessionTitle || !selectedClassId) {
      setError('Please enter a session title and select a class');
      return;
    }
    if (studentIds.length === 0) {
      setError('No students found in the selected class');
      return;
    }
    setLoading(true);
    const sessionId = Date.now().toString(); // Use UUID in production
    socket.emit('schedule-live-session', {
      sessionId, // Include sessionId in the emitted data
      title: sessionTitle,
      teacherId: userId,
      studentIds: studentIds, // Already an array of strings
      scheduledAt: new Date().toISOString(), // Start immediately
    });
  };

  // Teacher schedules a session for a future time
  const scheduleSession = () => {
    if (!sessionTitle || !scheduledAt || !selectedClassId) {
      setError('Please enter a session title, select a class, and select a date/time');
      return;
    }
    if (studentIds.length === 0) {
      setError('No students found in the selected class');
      return;
    }
    setLoading(true);
    const sessionId = Date.now().toString(); // Use UUID in production
    socket.emit('schedule-live-session', {
      sessionId, // Include sessionId in the emitted data
      title: sessionTitle,
      teacherId: userId,
      studentIds: studentIds, // Already an array of strings
      scheduledAt: new Date(scheduledAt).toISOString(),
    });
    alert(`Session "${sessionTitle}" scheduled for ${new Date(scheduledAt).toLocaleString()}`);
    setSessionTitle('');
    setScheduledAt('');
    setLoading(false);
  };

  // End a session (for teachers)
  const endSession = async () => {
    if (sessionInfo) {
      socket.emit('end-live-session', { sessionId: sessionInfo.sessionId });
      // The rest of the cleanup is handled by onLiveSessionEnded
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {userRole === 'Teacher' ? 'Teacher Dashboard - Live Session' : 'Student Dashboard - Join Live Session'}
        </h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
            <p>Loading...</p>
          </div>
        )}

        {/* Teacher UI: Start or Schedule a Session */}
        {userRole === 'Teacher' && !sessionInfo && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Start or Schedule a Live Session</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="classSelect" className="block text-sm font-medium text-gray-600">
                  Select Class
                </label>
                <select
                  id="classSelect"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {classes.length === 0 ? (
                    <option value="">No classes available</option>
                  ) : (
                    classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="sessionTitle" className="block text-sm font-medium text-gray-600">
                  Session Title
                </label>
                <input
                  id="sessionTitle"
                  type="text"
                  placeholder="e.g., Math Class - Algebra Basics"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-600">
                  Schedule Date & Time (Optional)
                </label>
                <input
                  id="scheduledAt"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={startSession}
                  disabled={loading || !selectedClassId || studentIds?.length === 0}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  Start Session Now
                </button>
                <button
                  onClick={scheduleSession}
                  disabled={loading || !scheduledAt || !selectedClassId || studentIds?.length === 0}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-300"
                >
                  Schedule for Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Student UI: Waiting for a Session */}
        {userRole === 'Student' && !sessionInfo && !localTracks && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Waiting for a Live Session</h2>
            <p className="text-gray-600">Your teacher will start a live session soon. Please wait...</p>
          </div>
        )}

        {/* Active Session UI: For Both Teacher and Student */}
        {sessionInfo && (
          <div className="space-y-6">
            {/* Session Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Active Session: {sessionInfo.title}</h2>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Session ID: {sessionInfo.sessionId}</p>
                {userRole === 'Student' && !localTracks && (
                  <button
                    onClick={() => joinSession(sessionInfo.sessionId)}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    Join Session
                  </button>
                )}
                {userRole === 'Teacher' && !localTracks && (
                  <button
                    onClick={() => joinSession(sessionInfo.sessionId)}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    Join Session
                  </button>
                )}
                {userRole === 'Teacher' && (
                  <button
                    onClick={endSession}
                    disabled={loading}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-red-300"
                  >
                    End Session
                  </button>
                )}
              </div>
            </div>

            {/* Participants List */}
            {userList.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Participants ({userList.length})</h3>
                <ul className="space-y-2">
                  {userList.map((user) => (
                    <li key={user.id} className="text-gray-600">
                      {user.email} ({user.role})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Video Streams */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Local Video */}
              {localTracks ? (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Video</h3>
                  <div
                    id={`local-video-${userId}`}
                    className="w-full h-64 bg-gray-200 rounded-md"
                  ></div>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Video</h3>
                  <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Waiting for video...</p>
                  </div>
                </div>
              )}

              {/* Remote Videos */}
              {remoteUsers.length > 0 ? (
                remoteUsers.map((user) => (
                  <div key={user.uid} className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {userList.find((u) => u.id === user.uid)?.email || 'Remote User'} (
                      {userList.find((u) => u.id === user.uid)?.role || 'Unknown'})
                    </h3>
                    <div
                      id={`remote-video-${user.uid}`}
                      className="w-full h-64 bg-gray-200 rounded-md"
                    ></div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Remote Video</h3>
                  <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">No remote users yet...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveSession;