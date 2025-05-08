import { useEffect, useState, useRef, useCallback } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { socket } from '../socket';
import { Class } from '../pages/admin/TimetableManagement';
import { fetchClasses, getStudentsIdByClass } from '../api/admin/classApi';

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
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [sessionTitle, setSessionTitle] = useState<string>('');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const isJoiningRef = useRef<boolean>(false);

  const agoraClient: IAgoraRTCClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

  useEffect(() => {
    if (userRole === 'Teacher') {
      const getClasses = async () => {
        try {
          const fetchedClasses = await fetchClasses();
          setClasses(fetchedClasses || []);
          if (fetchedClasses!.length > 0 && fetchedClasses![0]._id) {
            setSelectedClassId(fetchedClasses![0]._id ?? '');
          }
        } catch (err) {
          setError('Failed to load classes: ' + (err instanceof Error ? err.message : String(err)));
        }
      };
      getClasses();
    }
  }, [userRole]);

  useEffect(() => {
    if (userRole === 'Teacher' && selectedClassId) {
      const fetchStudentIds = async () => {
        try {
          const studentIdsData = await getStudentsIdByClass(selectedClassId);
          setStudentIds(studentIdsData?.studentIds || []);
        } catch (err) {
          setError('Failed to load student list: ' + (err instanceof Error ? err.message : String(err)));
          setStudentIds([]);
        }
      };
      fetchStudentIds();
    }
  }, [userRole, selectedClassId]);

  const joinSession = useCallback((sessionId: string) => {
    setLoading(true);
    socket.emit('join-live-session', {
      sessionId,
      participantId: userId,
    });
  }, [userId]);

  const renewToken = useCallback(async (sessionId: string, retries = 3) => {
    setLoading(true);
    const attemptRenew = async (attempt: number): Promise<void> => {
      return new Promise((resolve, reject) => {
        socket.emit('renew-token', { sessionId, participantId: userId }, (response: { token?: string; error?: string }) => {
          if (response.token) {
            console.log('Token renewed:', response.token);
            agoraClient.renewToken(response.token);
            setLoading(false);
            resolve();
          } else {
            const errorMessage = response.error || 'Failed to renew token';
            if (attempt < retries) {
              console.log(`Retrying token renewal, attempt ${attempt + 1}/${retries}...`);
              setTimeout(() => attemptRenew(attempt + 1).then(resolve).catch(reject), 1000);
            } else {
              setError(errorMessage);
              setLoading(false);
              reject(new Error(errorMessage));
            }
          }
        });
      });
    };
    try {
      await attemptRenew(1);
    } catch (err) {
      console.error('Token renewal failed after retries:', err);
    }
  }, [userId, agoraClient]);

  useEffect(() => {
    if (!appId) {
      setError('Agora App ID is not set. Please check VITE_AGORA_APP_ID in your environment variables.');
      return;
    }

    console.log('Frontend Agora App ID:', appId);

    const onLiveSessionScheduled = (data: SessionInfo) => {
      setSessionInfo(data);
    };

    const onLiveSessionStart = (data: SessionInfo) => {
      setSessionInfo(data);
      alert(`Live session "${data.title}" is starting now! Joining the session...`);
      joinSession(data.sessionId);
    };

    const onError = ({ message }: { message: string }) => {
      setError(message);
      setLoading(false);
    };

    const onLiveSessionJoined = async ({ roomId, token, participants }: { roomId: string; token: string; participants: UserInfo[] }) => {
      if (!sessionInfo) return;

      setLoading(true);
      isJoiningRef.current = true;

      try {
        console.log('Joining Agora session:', { appId, roomId, token, userId });
        await agoraClient.join(appId, roomId, token, userId);
        console.log('Successfully joined Agora session');

        console.log('Creating microphone and camera tracks...');
        const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks({
          audioTrack: tracks[0],
          videoTrack: tracks[1],
        });
        console.log('Local tracks created:', tracks);

        if (sessionInfo) {
          console.log('Publishing tracks to Agora session...');
          await agoraClient.publish(tracks);
          console.log('Tracks published successfully');

          const localVideoElement = document.getElementById(`local-video-${userId}`);
          if (!localVideoElement) {
            throw new Error(`Local video element local-video-${userId} not found in DOM`);
          }
          console.log('Playing local video...');
          tracks[1].play(`local-video-${userId}`);
          console.log('Local video playing');
        } else {
          tracks[0]?.stop();
          tracks[1]?.stop();
          await agoraClient.leave();
          return;
        }

        setUserList(participants);

        agoraClient.on('token-privilege-will-expire', () => {
          console.log('Token will expire soon, renewing...');
          renewToken(sessionInfo.sessionId);
        });

        agoraClient.on('token-privilege-did-expire', () => {
          console.log('Token has expired, renewing...');
          renewToken(sessionInfo.sessionId);
        });

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
        isJoiningRef.current = false;
      }
    };

    const onLiveSessionEnded = async ({ sessionId }: { sessionId: string }) => {
      if (sessionInfo?.sessionId === sessionId) {
        while (isJoiningRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 100));
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

    socket.on('live-session-scheduled', onLiveSessionScheduled);
    socket.on('live-session-start', onLiveSessionStart);
    socket.on('error', onError);
    socket.on('live-session-joined', onLiveSessionJoined);
    socket.on('live-session-ended', onLiveSessionEnded);

    return () => {
      socket.off('live-session-scheduled', onLiveSessionScheduled);
      socket.off('live-session-start', onLiveSessionStart);
      socket.off('error', onError);
      socket.off('live-session-joined', onLiveSessionJoined);
      socket.off('live-session-ended', onLiveSessionEnded);

      const cleanup = async () => {
        while (isJoiningRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        await agoraClient.leave();
        if (localTracks) {
          localTracks.audioTrack?.stop();
          localTracks.videoTrack?.stop();
        }
      };
      cleanup();
    };
  }, [userRole, userId, sessionInfo, agoraClient, localTracks, joinSession, renewToken]);

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
    const sessionId = Date.now().toString();
    socket.emit('schedule-live-session', {
      sessionId,
      title: sessionTitle,
      teacherId: userId,
      studentIds: studentIds,
      scheduledAt: new Date().toISOString(),
    });
  };

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
    const sessionId = Date.now().toString();
    socket.emit('schedule-live-session', {
      sessionId,
      title: sessionTitle,
      teacherId: userId,
      studentIds: studentIds,
      scheduledAt: new Date(scheduledAt).toISOString(),
    });
    alert(`Session "${sessionTitle}" scheduled for ${new Date(scheduledAt).toLocaleString()}`);
    setSessionTitle('');
    setScheduledAt('');
    setLoading(false);
  };

  const endSession = async () => {
    if (sessionInfo) {
      socket.emit('end-live-session', { sessionId: sessionInfo.sessionId });
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

        {userRole === 'Student' && !sessionInfo && !localTracks && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Waiting for a Live Session</h2>
            <p className="text-gray-600">Your teacher will start a live session soon. Please wait...</p>
          </div>
        )}

        {sessionInfo && (
          <div className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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