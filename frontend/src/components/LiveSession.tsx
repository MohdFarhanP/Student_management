import { useEffect, useState, useRef, useCallback } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteVideoTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
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

interface RemoteUserInfo {
  user: IAgoraRTCRemoteUser;
  hasVideo: boolean;
  hasAudio: boolean;
}

const appId = import.meta.env.VITE_AGORA_APP_ID;

const LiveSession = ({ userRole, userId }: { userRole: 'Teacher' | 'Student'; userId: string }) => {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [localTracks, setLocalTracks] = useState<{ audioTrack: IMicrophoneAudioTrack; videoTrack: ICameraVideoTrack | null } | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUserInfo[]>([]);
  const [sessionTitle, setSessionTitle] = useState<string>('');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [micOn, setMicOn] = useState<boolean>(false);
  const [videoOn, setVideoOn] = useState<boolean>(false);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const isJoiningRef = useRef<boolean>(false);
  const isSessionActiveRef = useRef<boolean>(false);
  const playedVideosRef = useRef<Set<string>>(new Set());
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const agoraClientRef = useRef<IAgoraRTCClient>(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));

  useEffect(() => {
    const checkDevices = async () => {
      try {
        const devices = await AgoraRTC.getDevices();
        const videoDevices = devices.filter((device: MediaDeviceInfo) => device.kind === 'videoinput');
        if (videoDevices.length === 0) {
          setHasCamera(false);
          setError('No camera detected. You can still join the session with audio only.');
        }
      } catch (err) {
        console.error('Failed to check devices:', err);
        setError('Failed to access devices. Please check your permissions.');
      }
    };
    checkDevices();
  }, []);

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
          const ids = Array.isArray(studentIdsData?.studentIds) ? studentIdsData.studentIds : [];
          setStudentIds(ids);
        } catch (err) {
          setError('Failed to load student list: ' + (err instanceof Error ? err.message : String(err)));
          setStudentIds([]);
        }
      };
      fetchStudentIds();
    }
  }, [userRole, selectedClassId]);

  const joinSession = useCallback((sessionId: string) => {
    if (isJoiningRef.current || hasJoined) {
      console.log('[DEBUG] Skipping joinSession: already joining or joined', { sessionId, isJoining: isJoiningRef.current, hasJoined });
      return;
    }
    console.log('joinSession: Emitting join-live-session', { sessionId, participantId: userId });
    setLoading(true);
    isJoiningRef.current = true;
    socket.emit('join-live-session', {
      sessionId,
      participantId: userId,
    });

    // Set a timeout to reset loading state if joining takes too long
    loadingTimeoutRef.current = setTimeout(() => {
      setLoading(false);
      setError('Failed to join session: Timeout waiting for server response.');
    }, 10000); // 10 seconds timeout
  }, [userId]);

  const playVideoWithRetry = async (track: ILocalVideoTrack | IRemoteVideoTrack, elementId: string, retries: number = 5, delay: number = 1500) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      const element = document.getElementById(elementId);
      if (!element) {
        console.error(`Element ${elementId} not found in DOM on attempt ${attempt}`);
        if (attempt === retries) {
          throw new Error(`Element ${elementId} not found in DOM after ${retries} attempts`);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      try {
        console.log(`Attempt ${attempt} to play video on element ${elementId}`);
        await track.play(element);
        console.log('Video playing successfully on', elementId);
        return;
      } catch (err) {
        const error = err as Error;
        if (error.name === 'AbortError' && attempt < retries) {
          console.warn(`AbortError on attempt ${attempt} for ${elementId}, retrying after ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          throw err;
        }
      }
    }
  };

  const toggleMic = () => {
    if (localTracks && localTracks.audioTrack && !(localTracks.audioTrack as any).isClosed) {
      localTracks.audioTrack.setEnabled(!micOn);
      setMicOn(!micOn);
    }
  };

  const toggleVideo = () => {
    if (localTracks && localTracks.videoTrack && !(localTracks.videoTrack as any).isClosed) {
      localTracks.videoTrack.setEnabled(!videoOn);
      setVideoOn(!videoOn);
    }
  };

  const cleanup = async () => {
    if (localTracks) {
      if (localTracks.audioTrack && !(localTracks.audioTrack as any).isClosed) {
        try {
          await localTracks.audioTrack.setEnabled(false);
          localTracks.audioTrack.stop();
          localTracks.audioTrack.close();
        } catch (err) {
          console.error('Error closing audio track:', err);
        }
      }
      if (localTracks.videoTrack && !(localTracks.videoTrack as any).isClosed) {
        try {
          await localTracks.videoTrack.setEnabled(false);
          localTracks.videoTrack.stop();
          localTracks.videoTrack.close();
        } catch (err) {
          console.error('Error closing video track:', err);
        }
      }
      setLocalTracks(null);
    }
    if (hasJoined) {
      try {
        await agoraClientRef.current.unpublish();
        await agoraClientRef.current.leave();
        console.log('Successfully left Agora session');
      } catch (err) {
        console.error('Error leaving Agora session:', err);
      }
      setHasJoined(false);
    }
    setRemoteUsers([]);
    setUserList([]);
    setMicOn(false);
    setVideoOn(false);
    playedVideosRef.current.clear();
  };

  const leaveSession = async () => {
    await cleanup();
    setSessionInfo(null);
    isSessionActiveRef.current = false;

    if (sessionInfo) {
      socket.emit('leave-live-session', {
        sessionId: sessionInfo.sessionId,
        participantId: userId,
      });
    }

    alert('You have left the session.');
  };

  const playLocalVideo = useCallback(async () => {
    if (localTracks && localTracks.videoTrack && videoOn && !(localTracks.videoTrack as any).isClosed) {
      const localVideoElementId = `local-video-${userId}`;
      try {
        await playVideoWithRetry(localTracks.videoTrack, localVideoElementId);
      } catch (err) {
        console.error(`Failed to play local video for user ${userId}:`, err);
        setError((prevError) => {
          const newError = 'Failed to play your video. Please check your camera.';
          return prevError === newError ? prevError : newError;
        });
      }
    }
  }, [localTracks, videoOn, userId]);

  useEffect(() => {
    playLocalVideo();
  }, [playLocalVideo]);

  useEffect(() => {
    const playRemoteVideos = async () => {
      for (const remoteUser of remoteUsers) {
        const user = remoteUser.user;
        if (playedVideosRef.current.has(user.uid.toString())) {
          continue;
        }

        if (user.videoTrack && remoteUser.hasVideo) {
          console.log(`Playing video for user ${user.uid}, videoTrack available:`, !!user.videoTrack);
          const remoteVideoElementId = `remote-video-${user.uid}`;
          try {
            await playVideoWithRetry(user.videoTrack, remoteVideoElementId);
            playedVideosRef.current.add(user.uid.toString());
          } catch (err) {
            console.error(`Failed to play video for user ${user.uid}:`, err);
            setError(`Failed to play video for user ${user.uid}. Please check the console for details.`);
          }
        } else {
          console.warn(`No video track available for user ${user.uid}`);
        }
      }
    };

    if (remoteUsers.length > 0) {
      playRemoteVideos();
    }
  }, [remoteUsers]);

  useEffect(() => {
    if (!appId) {
      setError('Agora App ID is not set. Please check VITE_AGORA_APP_ID in your environment variables.');
      return;
    }

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
      setError((prevError) => {
        const newError = 'Failed to connect to the live session server. Please try again later.';
        return prevError === newError ? prevError : newError;
      });
      setLoading(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    });

    socket.on('connect', () => {
      console.log('Socket.IO connected successfully');
      setError(null);
    });

    const onLiveSessionScheduled = (data: SessionInfo) => {
      console.log('Received live-session-scheduled:', data);
      setSessionInfo(data);
    };

    const onLiveSessionStart = (data: SessionInfo) => {
      console.log('Received live-session-start:', data);
      setSessionInfo(data);
      alert(`Live session "${data.title}" is starting now! Joining the session...`);
      joinSession(data.sessionId);
    };

    const onError = ({ message }: { message: string }) => {
      console.log('Received error:', message);
      setError(message);
      setLoading(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };

    const onLiveSessionJoined = async ({ roomId, token, participants }: { roomId: string; token: string; participants?: UserInfo[] }) => {
      if (!sessionInfo) return;

      setLoading(true);
      isJoiningRef.current = true;
      isSessionActiveRef.current = true;

      try {
        socket.emit('join-session-room', sessionInfo.sessionId);

        console.log('Joining Agora session:', { appId, roomId, token, userId });
        await agoraClientRef.current.join(appId, roomId, token, userId);
        console.log('Successfully joined Agora session with userId:', userId);
        setHasJoined(true);

        console.log('Creating microphone and camera tracks...');
        let audioTrack: IMicrophoneAudioTrack;
        let videoTrack: ICameraVideoTrack | null = null;

        try {
          const tracks = await AgoraRTC.createMicrophoneAndCameraTracks({}, { encoderConfig: '720p' });
          audioTrack = tracks[0] as IMicrophoneAudioTrack;
          videoTrack = tracks[1] as ICameraVideoTrack;
        } catch (err) {
          console.error('Failed to create both tracks:', err);
          try {
            audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            setError('Failed to access camera. Joining with audio only.');
          } catch (audioErr) {
            console.error('Failed to create audio track:', audioErr);
            throw new Error('Failed to access microphone: ' + (audioErr instanceof Error ? audioErr.message : String(audioErr)));
          }
        }

        console.log('Tracks created:', {
          audioTrack: !!audioTrack,
          videoTrack: !!videoTrack,
        });
        setLocalTracks((prev) => {
          if (prev?.audioTrack !== audioTrack || prev?.videoTrack !== videoTrack) {
            return { audioTrack, videoTrack };
          }
          return prev;
        });

        console.log('Received participants:', participants);
        const participantList = Array.isArray(participants) ? participants : [];
        console.log('Matching user IDs:', participantList.map(p => p.id), 'with userId:', userId);
        setUserList(participantList);

        agoraClientRef.current.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
          console.log(`Remote user published: ${user.uid}, mediaType: ${mediaType}, hasVideo: ${user.hasVideo}, hasAudio: ${user.hasAudio}`);
          if (user.uid.toString() === userId) {
            console.log(`Skipping subscription for self (userId: ${userId})`);
            return;
          }

          try {
            await agoraClientRef.current.subscribe(user, mediaType);
            console.log(`Subscribed to ${mediaType} for user ${user.uid}`);
          } catch (subscribeErr) {
            console.error(`Failed to subscribe to ${mediaType} for user ${user.uid}:`, subscribeErr);
            return;
          }

          if (mediaType === 'audio') {
            const remoteAudioTrack = user.audioTrack;
            if (remoteAudioTrack) {
              if (user.uid.toString() === userId) {
                console.log(`Skipping audio playback for self (userId: ${userId})`);
                return;
              }
              remoteAudioTrack.play();
              console.log(`Playing remote audio for user ${user.uid}`);
            } else {
              console.warn(`No audio track available for user ${user.uid}`);
            }
          }

          setRemoteUsers((prev) => {
            const userExists = prev.find((u) => u.user.uid === user.uid);
            if (userExists) {
              const updatedUsers = prev.map((u) =>
                u.user.uid === user.uid
                  ? { ...u, hasVideo: mediaType === 'video' ? user.hasVideo : u.hasVideo, hasAudio: mediaType === 'audio' ? user.hasAudio : u.hasAudio }
                  : u
              );
              console.log(`Updated remote users: Total ${updatedUsers.length}`, updatedUsers.map(u => u.user.uid));
              return updatedUsers;
            }
            const newUsers = [...prev, { user, hasVideo: user.hasVideo, hasAudio: user.hasAudio }];
            console.log(`New remote user joined: ${user.uid}, Total remote users: ${newUsers.length}`, newUsers.map(u => u.user.uid));
            return newUsers;
          });
        });

        agoraClientRef.current.on('user-unpublished', (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
          console.log(`Remote user unpublished: ${user.uid}, mediaType: ${mediaType}`);
          setRemoteUsers((prev) => {
            const updatedUsers = prev.map((u) =>
              u.user.uid === user.uid
                ? { ...u, hasVideo: mediaType === 'video' ? false : u.hasVideo, hasAudio: mediaType === 'audio' ? false : u.hasAudio }
                : u
            );
            console.log(`Remote user unpublished, Total remote users: ${updatedUsers.length}`, updatedUsers.map(u => u.user.uid));
            return updatedUsers;
          });
          playedVideosRef.current.delete(user.uid.toString());
        });

        agoraClientRef.current.on('user-left', (user: IAgoraRTCRemoteUser) => {
          console.log(`Remote user left: ${user.uid}`);
          setRemoteUsers((prev) => {
            const updatedUsers = prev.filter((u) => u.user.uid !== user.uid);
            console.log(`Remote user ${user.uid} left, Total remote users: ${updatedUsers.length}`, updatedUsers.map(u => u.user.uid));
            return updatedUsers;
          });
          setUserList((prev) => {
            const updatedList = Array.isArray(prev) ? prev.filter((u) => u.id !== user.uid.toString()) : [];
            console.log(`After user left, userList: Total ${updatedList.length}`, updatedList.map(u => u.id));
            return updatedList;
          });
          playedVideosRef.current.delete(user.uid.toString());
        });

        agoraClientRef.current.on('connection-state-change', (curState: string, prevState: string) => {
          console.log(`Connection state changed from ${prevState} to ${curState}`);
        });

        setLoading(false);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      } catch (err) {
        const errorMessage = 'Failed to join session: ' + (err instanceof Error ? err.message : String(err));
        console.error('Error in onLiveSessionJoined:', errorMessage);
        setError(errorMessage);
        setLoading(false);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      } finally {
        isJoiningRef.current = false;
      }
    };

    const onLiveSessionEnded = async ({ sessionId }: { sessionId: string }) => {
      console.log('Received live-session-ended:', { sessionId });
      if (sessionInfo?.sessionId === sessionId) {
        while (isJoiningRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        isSessionActiveRef.current = false;
        await cleanup();
        setSessionInfo(null);
        alert('Live session has ended.');
      }
    };

    const onParticipantJoined = ({ participants }: { participants: UserInfo[] }) => {
      const participantList = Array.isArray(participants) ? participants : [];
      setUserList(participantList);
      console.log(`Participants updated, Total: ${participantList.length}`, participantList.map(p => p.id));
    };

    socket.on('live-session-scheduled', onLiveSessionScheduled);
    socket.on('live-session-start', onLiveSessionStart);
    socket.on('error', onError);
    socket.on('live-session-joined', onLiveSessionJoined);
    socket.on('participants-updated', onParticipantJoined);
    socket.on('live-session-ended', onLiveSessionEnded);

    return () => {
      socket.off('connect_error');
      socket.off('connect');
      socket.off('live-session-scheduled', onLiveSessionScheduled);
      socket.off('live-session-start', onLiveSessionStart);
      socket.off('error', onError);
      socket.off('live-session-joined', onLiveSessionJoined);
      socket.off('participants-updated', onParticipantJoined);
      socket.off('live-session-ended', onLiveSessionEnded);

      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      cleanup();
    };
  }, [userRole, userId, sessionInfo, joinSession ]);

  useEffect(() => {
    const publishTracks = async () => {
      if (!hasJoined || !sessionInfo || !localTracks) return;

      try {
        const tracksToPublish: (IMicrophoneAudioTrack | ICameraVideoTrack)[] = [];
        if (localTracks.audioTrack && micOn && !(localTracks.audioTrack as any).isClosed) {
          tracksToPublish.push(localTracks.audioTrack);
        }
        if (localTracks.videoTrack && videoOn && !(localTracks.videoTrack as any).isClosed) {
          tracksToPublish.push(localTracks.videoTrack);
        }
        if (tracksToPublish.length > 0) {
          await agoraClientRef.current.publish(tracksToPublish);
          console.log('Tracks published successfully:', tracksToPublish);
        }
      } catch (publishErr) {
        console.error('Failed to publish tracks:', publishErr);
        setError('Failed to publish tracks: ' + (publishErr instanceof Error ? publishErr.message : String(publishErr)));
      }
    };

    publishTracks();
  }, [micOn, videoOn, localTracks, hasJoined, sessionInfo]);

  const startSession = () => {
    if (!sessionTitle || !selectedClassId) {
      setError('Please enter a session title and select a class');
      return;
    }
    if (!studentIds || studentIds.length === 0) {
      setError('No students found in the selected class');
      return;
    }
    setLoading(true);
    const sessionId = Date.now().toString();
    console.log('startSession: Emitting schedule-live-session', {
      sessionId,
      title: sessionTitle,
      teacherId: userId,
      studentIds,
      scheduledAt: new Date().toISOString(),
    });
    socket.emit('schedule-live-session', {
      sessionId,
      title: sessionTitle,
      classId: selectedClassId,
      teacherId: userId,
      studentIds,
      scheduledAt: new Date().toISOString(),
    });

    // Set a timeout to reset loading state if the session doesn't start
    loadingTimeoutRef.current = setTimeout(() => {
      setLoading(false);
      setError('Failed to start session: Timeout waiting for server response.');
    }, 10000); // 10 seconds timeout
  };

  const scheduleSession = () => {
    if (!sessionTitle || !scheduledAt || !selectedClassId) {
      setError('Please enter a session title, select a class, and select a date/time');
      return;
    }
    if (!studentIds || studentIds.length === 0) {
      setError('No students found in the selected class');
      return;
    }
    setLoading(true);
    const sessionId = Date.now().toString();
    console.log('scheduleSession: Emitting schedule-live-session', {
      sessionId,
      title: sessionTitle,
      classId: selectedClassId,
      teacherId: userId,
      studentIds,
      scheduledAt: new Date(scheduledAt).toISOString(),
    });
    socket.emit('schedule-live-session', {
      sessionId,
      title: sessionTitle,
      classId: selectedClassId,
      teacherId: userId,
      studentIds,
      scheduledAt: new Date(scheduledAt).toISOString(),
    });
    alert(`Session "${sessionTitle}" scheduled for ${new Date(scheduledAt).toLocaleString()}`);
    setSessionTitle('');
    setScheduledAt('');
    setLoading(false);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  };

  const endSession = async () => {
    if (sessionInfo) {
      console.log('endSession: Emitting end-live-session', { sessionId: sessionInfo.sessionId });
      socket.emit('end-live-session', { sessionId: sessionInfo.sessionId });
    }
  };

  const activeParticipants = userList.filter((user) =>
    user.id === userId ||
    remoteUsers.some((remoteUser) => remoteUser.user.uid.toString() === user.id)
  );

  // Combine local and remote users for the grid
  const allParticipants = [];
  if (localTracks) {
    allParticipants.push({
      id: userId,
      email: userList.find((u) => u.id === userId)?.email || 'You',
      role: userRole,
      isLocal: true,
      hasVideo: videoOn && localTracks.videoTrack != null,
    });
  }
  remoteUsers.forEach((remoteUser) => {
    const userInfo = userList.find((u) => u.id === remoteUser.user.uid.toString());
    allParticipants.push({
      id: remoteUser.user.uid.toString(),
      email: userInfo?.email || `User ${remoteUser.user.uid}`,
      role: userInfo?.role || 'Unknown',
      isLocal: false,
      hasVideo: remoteUser.hasVideo,
    });
  });

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
                  disabled={loading || !selectedClassId || !studentIds || studentIds.length === 0}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  Start Session Now
                </button>
                <button
                  onClick={scheduleSession}
                  disabled={loading || !scheduledAt || !selectedClassId || !studentIds || studentIds.length === 0}
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
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-blue-300"
                  >
                    End Session
                  </button>
                )}
              </div>
            </div>

            {Array.isArray(activeParticipants) && activeParticipants.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Participants ({activeParticipants.length})</h3>
                <ul className="space-y-2">
                  {activeParticipants.map((user) => (
                    <li key={user.id} className="text-gray-600">
                      {user.email} ({user.role})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {allParticipants.length > 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Video Feeds</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {allParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="relative bg-gray-200 rounded-lg shadow overflow-hidden aspect-video"
                    >
                      <div
                        id={participant.isLocal ? `local-video-${participant.id}` : `remote-video-${participant.id}`}
                        className="w-full h-full"
                      >
                        {!participant.hasVideo && (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <p className="text-gray-600 text-sm">
                              {participant.isLocal ? 'Your camera is off' : 'No video'}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2">
                        {participant.email} ({participant.role})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Video Feeds</h3>
                <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">No participants with video yet...</p>
                </div>
              </div>
            )}

            {localTracks && (
              <div className="fixed bottom-4 right-4 flex space-x-4">
                <button
                  onClick={toggleMic}
                  className={`px-4 py-2 rounded-md text-white ${micOn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                  {micOn ? 'Disable Mic' : 'Enable Mic'}
                </button>
                {hasCamera && (
                  <button
                    onClick={toggleVideo}
                    className={`px-4 py-2 rounded-md text-white ${videoOn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    disabled={!localTracks.videoTrack}
                  >
                    {videoOn ? 'Disable Camera' : 'Enable Camera'}
                  </button>
                )}
                <button
                  onClick={leaveSession}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Leave Session
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveSession;