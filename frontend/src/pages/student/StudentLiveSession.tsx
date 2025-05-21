import { useState, useEffect, useRef, useCallback, Suspense, lazy, memo } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteVideoTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { toast } from 'react-toastify';
import { socket } from '../../socket';
import ErrorBoundary from '../../components/ErrorBoundary';

// Lazy load components
const StudentSidebar = lazy(() => import('../../components/StudentSidebar'));
const ErrorMessage = lazy(() => import('../../components/ErrorMessage'));
const LoadingSpinner = lazy(() => import('../../components/LoadingSpinner'));

interface SessionInfo {
  sessionId: string;
  title: string;
  scheduledAt?: string;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface RemoteUserInfo {
  user: IAgoraRTCRemoteUser;
  hasVideo: boolean;
  hasAudio: boolean;
}

interface StudentLiveSessionProps {
  userRole: 'Student';
  userId: string;
}

const appId = import.meta.env.VITE_AGORA_APP_ID;

// Enable AgoraRTC logging for debugging
AgoraRTC.setLogLevel(1); // 1: INFO, 2: DEBUG

const StudentLiveSession: React.FC<StudentLiveSessionProps> = ({ userRole, userId }) => {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [localTracks, setLocalTracks] = useState<{ audioTrack: IMicrophoneAudioTrack; videoTrack: ICameraVideoTrack | null } | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUserInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [micOn, setMicOn] = useState<boolean>(false);
  const [videoOn, setVideoOn] = useState<boolean>(false);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const [joinTime, setJoinTime] = useState<Date | null>(null);
  const isJoiningRef = useRef<boolean>(false);
  const isSessionActiveRef = useRef<boolean>(false);
  const playedVideosRef = useRef<Set<string>>(new Set());
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const joinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCleaningUpRef = useRef<boolean>(false);
  const tracksClosedRef = useRef<{ audio: boolean; video: boolean }>({ audio: false, video: false });

  const agoraClientRef = useRef<IAgoraRTCClient>(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));

  // Log component lifecycle
  useEffect(() => {
    console.log('[StudentLiveSession] Component mounted at 2025-05-19 03:44 PM IST');
    const loadingTimeout = loadingTimeoutRef.current;
    const joinTimeout = joinTimeoutRef.current;
    return () => {
      console.log('[StudentLiveSession] Component unmounted at', new Date().toISOString());
      if (joinTimeout) clearTimeout(joinTimeout);
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, []);

  // Test socket connection
  useEffect(() => {
    console.log('[Socket Test] Sending test-event at 2025-05-19 03:44 PM IST');
    socket.emit('test-event', { message: 'Hello from client', timestamp: '2025-05-19 03:44 PM IST' });
    socket.on('test-response', (data) => {
      console.log('[Socket Test] Received test-response at', new Date().toISOString(), data);
    });
    return () => {
      socket.off('test-response');
    };
  }, []);

  useEffect(() => {
    const checkDevices = async () => {
      try {
        const devices = await AgoraRTC.getDevices();
        const videoDevices = devices.filter((device: MediaDeviceInfo) => device.kind === 'videoinput');
        if (videoDevices.length === 0) {
          setHasCamera(false);
          setError('No camera detected. You can still join with audio only.');
          toast.warn('No camera detected.');
        }
      } catch (err) {
        console.error('[checkDevices] Failed to check devices at', new Date().toISOString(), err);
        setError('Failed to access devices. Please check permissions.');
        toast.error('Failed to access devices.');
      }
    };
    checkDevices();
  }, []);

  const joinSession = useCallback((sessionId: string) => {
    if (isJoiningRef.current || hasJoined) {
      console.log('[joinSession] Skipping: already joining or joined at', new Date().toISOString(), { sessionId, isJoining: isJoiningRef.current, hasJoined });
      return;
    }
    console.log('[joinSession] Emitting join-live-session at', new Date().toISOString(), { sessionId, participantId: userId });
    setLoading(true);
    isJoiningRef.current = true;
    socket.emit('join-live-session', {
      sessionId,
      participantId: userId,
    });

    joinTimeoutRef.current = setTimeout(() => {
      console.warn('[joinSession] Timeout waiting for live-session-joined at', new Date().toISOString());
      setLoading(false);
      setError('Failed to join session: Server did not respond in time.');
      toast.error('Failed to join session: Server timeout.');
      isJoiningRef.current = false;
      setHasJoined(false);
    }, 10000);
  }, [userId, hasJoined]);

  const playVideoWithRetry = async (track: ILocalVideoTrack | IRemoteVideoTrack, elementId: string, retries: number = 5, delay: number = 1500) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      const element = document.getElementById(elementId);
      if (!element) {
        console.error(`[playVideoWithRetry] Element ${elementId} not found on attempt ${attempt}`);
        if (attempt === retries) {
          throw new Error(`Element ${elementId} not found after ${retries} attempts`);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      try {
        console.log(`[playVideoWithRetry] Attempt ${attempt} to play video on ${elementId}`);
        await track.play(element);
        console.log('[playVideoWithRetry] Video playing on', elementId);
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError' && attempt < retries) {
          console.warn(`[playVideoWithRetry] AbortError on attempt ${attempt} for ${elementId}, retrying...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          throw err;
        }
      }
    }
  };

  const toggleMic = () => {
    if (!localTracks?.audioTrack || tracksClosedRef.current.audio || !localTracks.audioTrack.getMediaStreamTrack()) {
      console.warn('[toggleMic] Audio track not available or closed at', new Date().toISOString());
      toast.error('Audio track not available.');
      return;
    }
    try {
      localTracks.audioTrack.setEnabled(!micOn);
      setMicOn(!micOn);
      console.log('[toggleMic] Microphone toggled to', !micOn, 'at', new Date().toISOString());
    } catch (err) {
      console.error('[toggleMic] Failed to toggle microphone at', new Date().toISOString(), err);
      toast.error('Failed to toggle microphone: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const toggleVideo = () => {
    if (!localTracks?.videoTrack || tracksClosedRef.current.video || !localTracks.videoTrack.getMediaStreamTrack()) {
      console.warn('[toggleVideo] Video track not available or closed at', new Date().toISOString());
      toast.error('Video track not available.');
      return;
    }
    try {
      localTracks.videoTrack.setEnabled(!videoOn);
      setVideoOn(!videoOn);
      console.log('[toggleVideo] Video toggled to', !videoOn, 'at', new Date().toISOString());
    } catch (err) {
      console.error('[toggleVideo] Failed to toggle video at', new Date().toISOString(), err);
      toast.error('Failed to toggle video: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const cleanup = useCallback(async () => {
    if (isCleaningUpRef.current) {
      console.log('[cleanup] Already in progress, skipping at', new Date().toISOString());
      return;
    }
    isCleaningUpRef.current = true;
    console.log('[cleanup] Starting at', new Date().toISOString());

    try {
      if (localTracks) {
        if (localTracks.audioTrack && !tracksClosedRef.current.audio) {
          try {
            if (localTracks.audioTrack.getMediaStreamTrack()) {
              await localTracks.audioTrack.setEnabled(false).catch(() => {});
              localTracks.audioTrack.stop();
              localTracks.audioTrack.close();
              tracksClosedRef.current.audio = true;
              console.log('[cleanup] Audio track closed');
            }
          } catch (err) {
            console.warn('[cleanup] Error closing audio track:', err);
          }
        }
        if (localTracks.videoTrack && !tracksClosedRef.current.video) {
          try {
            if (localTracks.videoTrack.getMediaStreamTrack()) {
              await localTracks.videoTrack.setEnabled(false).catch(() => {});
              localTracks.videoTrack.stop();
              localTracks.videoTrack.close();
              tracksClosedRef.current.video = true;
              console.log('[cleanup] Video track closed');
            }
          } catch (err) {
            console.warn('[cleanup] Error closing video track:', err);
          }
        }
        setLocalTracks(null);
      }

      if (hasJoined && agoraClientRef.current.connectionState === 'CONNECTED') {
        try {
          if (agoraClientRef.current.localTracks.length > 0) {
            await agoraClientRef.current.unpublish();
            console.log('[cleanup] Tracks unpublished');
          }
          await agoraClientRef.current.leave();
          console.log('[cleanup] Left Agora session');
          setHasJoined(false);
        } catch (err) {
          console.error('[cleanup] Error leaving Agora session:', err);
        }
      }
      setRemoteUsers([]);
      setUserList([]);
      setMicOn(false);
      setVideoOn(false);
      playedVideosRef.current.clear();
    } finally {
      isCleaningUpRef.current = false;
      console.log('[cleanup] Completed at', new Date().toISOString());
    }
  }, [localTracks, hasJoined]);

  const leaveSession = useCallback(async () => {
    console.log('[leaveSession] Leaving at', new Date().toISOString());
    
    const leaveTime = new Date();
    if (joinTime && sessionInfo) {
      const durationMs = leaveTime.getTime() - joinTime.getTime();
      const durationSeconds = Math.floor(durationMs / 1000);
      console.log('[leaveSession] Student duration:', { userId, sessionId: sessionInfo.sessionId, durationSeconds });

      // Send duration to the server
      socket.emit('student-session-duration', {
        userId,
        sessionId: sessionInfo.sessionId,
        durationSeconds,
        joinTime: joinTime.toISOString(),
        leaveTime: leaveTime.toISOString(),
      });
    }

    await cleanup();
    setSessionInfo(null);
    isSessionActiveRef.current = false;

    if (sessionInfo) {
      socket.emit('leave-live-session', {
        sessionId: sessionInfo.sessionId,
        participantId: userId,
      });
    }

    toast.success('You have left the session.');
  }, [cleanup, sessionInfo, userId]);

  const playLocalVideo = useCallback(async () => {
    if (localTracks?.videoTrack && videoOn && !tracksClosedRef.current.video) {
      const localVideoElementId = `local-video-${userId}`;
      try {
        console.log('[playLocalVideo] Playing local video');
        await playVideoWithRetry(localTracks.videoTrack, localVideoElementId);
      } catch (err) {
        console.error('[playLocalVideo] Failed to play local video:', err);
        setError('Failed to play your video. Please check your camera.');
        toast.error('Failed to play your video.');
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
          const remoteVideoElementId = `remote-video-${user.uid}`;
          try {
            console.log('[playRemoteVideos] Playing remote video for', user.uid);
            await playVideoWithRetry(user.videoTrack, remoteVideoElementId);
            playedVideosRef.current.add(user.uid.toString());
          } catch (err) {
            console.error('[playRemoteVideos] Failed to play video for', user.uid, err);
            setError(`Failed to play video for user ${user.uid}.`);
            toast.error(`Failed to play video for user ${user.uid}.`);
          }
        }
      }
    };
    if (remoteUsers.length > 0) {
      playRemoteVideos();
    }
  }, [remoteUsers]);

  useEffect(() => {
    if (!appId) {
      setError('Agora App ID is not set. Please check VITE_AGORA_APP_ID.');
      toast.error('Agora App ID is missing.');
      return;
    }

    // Copy refs to variables to avoid stale references in cleanup
    const agoraClient = agoraClientRef.current;
    const loadingTimeout = loadingTimeoutRef.current;
    const joinTimeout = joinTimeoutRef.current;

    socket.on('connect', () => {
      console.log('[Socket] Connected at', new Date().toISOString());
      setError(null);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connect error at', new Date().toISOString(), err);
      setError('Failed to connect to the server.');
      toast.error('Failed to connect to the server.');
      setLoading(false);
      if (loadingTimeout) clearTimeout(loadingTimeout);
      if (joinTimeout) clearTimeout(joinTimeout);
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected at', new Date().toISOString());
      setError('Disconnected from the server.');
      toast.error('Disconnected from the server.');
      setLoading(false);
      if (joinTimeout) clearTimeout(joinTimeout);
    });

    const onLiveSessionScheduled = (data: SessionInfo) => {
      console.log('[Socket] live-session-scheduled at', new Date().toISOString(), data);
      setSessionInfo(data);
      toast.info(`Session "${data.title}" scheduled.`);
    };

    const onLiveSessionStart = (data: SessionInfo) => {
      console.log('[Socket] live-session-start at', new Date().toISOString(), data);
      setSessionInfo(data);
      toast.success(`Live session "${data.title}" is starting now! Joining...`);
      console.log('[onLiveSessionStart] Before join at', new Date().toISOString(), { sessionInfo: data, hasJoined, loading });
      joinSession(data.sessionId);
    };

    const onError = ({ message }: { message: string }) => {
      console.log('[Socket] Error at', new Date().toISOString(), message);
      setError(message);
      toast.error(message);
      setLoading(false);
      if (loadingTimeout) clearTimeout(loadingTimeout);
      if (joinTimeout) clearTimeout(joinTimeout);
    };

    const onLiveSessionJoined = async ({ roomId, token, participants }: { roomId: string; token: string; participants?: UserInfo[] }) => {
      console.log('[Socket] live-session-joined at', new Date().toISOString(), { roomId, token, participants });
      if (!sessionInfo) {
        console.warn('[onLiveSessionJoined] No sessionInfo, aborting at', new Date().toISOString());
        return;
      }

      if (joinTimeout) clearTimeout(joinTimeout);

      setLoading(true);
      isJoiningRef.current = true;
      isSessionActiveRef.current = true;

      try {
        socket.emit('join-session-room', sessionInfo.sessionId);

        console.log('[onLiveSessionJoined] Joining Agora:', { appId, roomId, token, userId });
        const joinPromise = agoraClient.join(appId, roomId, token, userId);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Agora join timed out')), 10000);
        });
        await Promise.race([joinPromise, timeoutPromise]);
        console.log('[onLiveSessionJoined] Joined Agora session at', new Date().toISOString());

        console.log('[onLiveSessionJoined] Creating tracks...');
        let audioTrack: IMicrophoneAudioTrack | null = null;
        let videoTrack: ICameraVideoTrack | null = null;

        try {
          const tracks = await AgoraRTC.createMicrophoneAndCameraTracks({}, { encoderConfig: '720p' });
          audioTrack = tracks[0] as IMicrophoneAudioTrack;
          videoTrack = tracks[1] as ICameraVideoTrack;
        } catch (err) {
          console.error('[onLiveSessionJoined] Failed to create tracks:', err);
          try {
            audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            setError('Failed to access camera. Joining with audio only.');
            toast.warn('Joining with audio only.');
          } catch (audioErr) {
            console.error('[onLiveSessionJoined] Failed to create audio track:', audioErr);
            throw new Error('Failed to access microphone: ' + (audioErr instanceof Error ? audioErr.message : String(audioErr)));
          }
        }

        if (!audioTrack) {
          throw new Error('Audio track creation failed');
        }

        console.log('[onLiveSessionJoined] Tracks created:', { audioTrack: !!audioTrack, videoTrack: !!videoTrack });
        setLocalTracks({ audioTrack, videoTrack });
        tracksClosedRef.current = { audio: false, video: false };

        const tracksToPublish: (IMicrophoneAudioTrack | ICameraVideoTrack)[] = [];
        if (audioTrack && micOn) {
          tracksToPublish.push(audioTrack);
        }
        if (videoTrack && videoOn) {
          tracksToPublish.push(videoTrack);
        }
        if (tracksToPublish.length > 0) {
          console.log('[onLiveSessionJoined] Publishing tracks:', tracksToPublish);
          await agoraClient.publish(tracksToPublish);
          console.log('[onLiveSessionJoined] Tracks published');
        }

        setUserList(Array.isArray(participants) ? participants : []);
        setHasJoined(true);
        setJoinTime(new Date());
        setLoading(false);
        console.log('[onLiveSessionJoined] Join complete at', new Date().toISOString(), { sessionInfo, hasJoined: true, loading: false });
      } catch (err) {
        const errorMessage = 'Failed to join session: ' + (err instanceof Error ? err.message : String(err));
        console.error('[onLiveSessionJoined] Error at', new Date().toISOString(), errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
        setHasJoined(false);
        if (loadingTimeout) clearTimeout(loadingTimeout);
      } finally {
        isJoiningRef.current = false;
        console.log('[onLiveSessionJoined] Finally at', new Date().toISOString(), { isJoining: isJoiningRef.current, sessionInfo, hasJoined });
      }
    };

    const onLiveSessionEnded = async ({ sessionId }: { sessionId: string }) => {
      console.log('[Socket] live-session-ended at', new Date().toISOString(), { sessionId });
      if (sessionInfo?.sessionId === sessionId) {
       
        const leaveTime = new Date();
        if (joinTime) {
          const durationMs = leaveTime.getTime() - joinTime.getTime();
          const durationSeconds = Math.floor(durationMs / 1000);
          console.log('[onLiveSessionEnded] Student duration:', { userId, sessionId, durationSeconds });

          // Send duration to the server
          socket.emit('student-session-duration', {
            userId,
            sessionId,
            durationSeconds,
            joinTime: joinTime.toISOString(),
            leaveTime: leaveTime.toISOString(),
          });
        }
        while (isJoiningRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        isSessionActiveRef.current = false;
        await cleanup();
        setSessionInfo(null);
        setJoinTime(null);
        toast.info('Live session has ended.');
      }
    };

    const onParticipantJoined = ({ participants }: { participants: UserInfo[] }) => {
      const participantList = Array.isArray(participants) ? participants : [];
      setUserList(participantList);
      console.log('[Socket] Participants updated at', new Date().toISOString(), participantList.length);
    };

    socket.on('live-session-scheduled', onLiveSessionScheduled);
    socket.on('live-session-start', onLiveSessionStart);
    socket.on('error', onError);
    socket.on('live-session-joined', onLiveSessionJoined);
    socket.on('participants-updated', onParticipantJoined);
    socket.on('live-session-ended', onLiveSessionEnded);

    agoraClient.on('user-published', async (user, mediaType) => {
      try {
        await agoraClient.subscribe(user, mediaType);
        setRemoteUsers((prev) => {
          const existing = prev.find((u) => u.user.uid === user.uid);
          if (existing) {
            return prev.map((u) =>
              u.user.uid === user.uid
                ? { ...u, hasVideo: mediaType === 'video' ? !!user.videoTrack : u.hasVideo, hasAudio: mediaType === 'audio' ? !!user.audioTrack : u.hasAudio }
                : u
            );
          }
          return [...prev, { user, hasVideo: mediaType === 'video' && !!user.videoTrack, hasAudio: mediaType === 'audio' && !!user.audioTrack }];
        });
      } catch (err) {
        console.error('[Agora] Failed to subscribe to user:', err);
        toast.error(`Failed to subscribe to user ${user.uid}.`);
      }
    });

    agoraClient.on('user-unpublished', (user, mediaType) => {
      setRemoteUsers((prev) =>
        prev.map((u) =>
          u.user.uid === user.uid
            ? { ...u, hasVideo: mediaType === 'video' ? false : u.hasVideo, hasAudio: mediaType === 'audio' ? false : u.hasAudio }
            : u
        )
      );
    });

    agoraClient.on('user-left', (user) => {
      setRemoteUsers((prev) => prev.filter((u) => u.user.uid !== user.uid));
      playedVideosRef.current.delete(user.uid.toString());
    });

    return () => {
      console.log('[useEffect] Cleaning up at', new Date().toISOString());
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('live-session-scheduled', onLiveSessionScheduled);
      socket.off('live-session-start', onLiveSessionStart);
      socket.off('error', onError);
      socket.off('live-session-joined', onLiveSessionJoined);
      socket.off('participants-updated', onParticipantJoined);
      socket.off('live-session-ended', onLiveSessionEnded);
      agoraClient.removeAllListeners();
      if (loadingTimeout) clearTimeout(loadingTimeout);
      if (joinTimeout) clearTimeout(joinTimeout);
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, joinSession, cleanup, sessionInfo]);

  useEffect(() => {
    const publishTracks = async () => {
      if (!hasJoined || !sessionInfo || !localTracks) return;
      try {
        const tracksToPublish: (IMicrophoneAudioTrack | ICameraVideoTrack)[] = [];
        if (localTracks.audioTrack && micOn && !tracksClosedRef.current.audio && localTracks.audioTrack.getMediaStreamTrack()) {
          tracksToPublish.push(localTracks.audioTrack);
        }
        if (localTracks.videoTrack && videoOn && !tracksClosedRef.current.video && localTracks.videoTrack.getMediaStreamTrack()) {
          tracksToPublish.push(localTracks.videoTrack);
        }
        if (tracksToPublish.length > 0) {
          console.log('[publishTracks] Publishing:', tracksToPublish);
          await agoraClientRef.current.publish(tracksToPublish);
          console.log('[publishTracks] Published');
        }
      } catch (err) {
        console.error('[publishTracks] Failed to publish:', err);
        setError('Failed to publish tracks: ' + (err instanceof Error ? err.message : String(err)));
        toast.error('Failed to publish tracks.');
      }
    };
    publishTracks();
  }, [micOn, videoOn, localTracks, hasJoined, sessionInfo]);

  const activeParticipants = userList.filter((user) =>
    user.id === userId ||
    remoteUsers.some((remoteUser) => remoteUser.user.uid.toString() === user.id)
  );

  const allParticipants = [];
  if (localTracks) {
    allParticipants.push({
      id: userId,
      name: userList.find((u) => u.id === userId)?.name || 'You',
      role: userRole,
      isLocal: true,
      hasVideo: videoOn && localTracks.videoTrack != null,
    });
  }
  remoteUsers.forEach((remoteUser) => {
    const userInfo = userList.find((u) => u.id === remoteUser.user.uid.toString());
    allParticipants.push({
      id: remoteUser.user.uid.toString(),
      name: userInfo?.name || 'Unknown User',
      role: userInfo?.role || 'Participant',
      isLocal: false,
      hasVideo: remoteUser.hasVideo,
      hasAudio: remoteUser.hasAudio,
    });
  });

  if (loading) return <Suspense fallback={<div>Loading...</div>}><LoadingSpinner /></Suspense>;
  if (error) return <Suspense fallback={<div>Loading...</div>}><ErrorMessage message={error} /></Suspense>;

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900 overflow-hidden">
      <Suspense fallback={<div className="p-4">Loading Sidebar...</div>}>
        <StudentSidebar />
      </Suspense>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-h-screen">
        <ErrorBoundary>
          <div className="my-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-base-content dark:text-white">
              Student Dashboard - Join Live Session
            </h1>
          </div>

          {!sessionInfo && !localTracks && (
            <div className="card bg-base-100 dark:bg-gray-800 shadow-xl rounded-xl p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white mb-4">
                Waiting for a Live Session
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your teacher will start a live session soon. Please wait...
              </p>
            </div>
          )}

          {sessionInfo && !hasJoined && (
            <div className="card bg-base-100 dark:bg-gray-800 shadow-xl rounded-xl p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white mb-4">
                Joining Session: {sessionInfo.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Waiting to join the session...
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={() => {
                    console.log('[UI] Retry join at', new Date().toISOString(), sessionInfo.sessionId);
                    joinSession(sessionInfo.sessionId);
                  }}
                  className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                >
                  Retry Join
                </button>
                <button
                  onClick={() => {
                    console.log('[UI] Cancel join at', new Date().toISOString());
                    setSessionInfo(null);
                    setError(null);
                    setHasJoined(false);
                    setLoading(false);
                  }}
                  className="btn btn-secondary btn-sm sm:btn-md w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {sessionInfo && hasJoined && (
            <div className="space-y-6">
              <div className="card bg-base-100 dark:bg-gray-800 shadow-xl rounded-xl p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white mb-4">
                  Active Session: {sessionInfo.title}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Session ID: {sessionInfo.sessionId}
                  </p>
                </div>
              </div>

              {Array.isArray(activeParticipants) && activeParticipants.length > 0 && (
                <div className="card bg-base-100 dark:bg-gray-800 shadow-xl rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-base-content dark:text-white mb-4">
                    Participants ({activeParticipants.length})
                  </h3>
                  <ul className="space-y-2">
                    {activeParticipants.map((user) => (
                      <li key={user.id} className="text-gray-600 dark:text-gray-300">
                        {user.name} ({user.role})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {allParticipants.length > 0 ? (
                <div className="card bg-base-100 dark:bg-gray-800 shadow-xl rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-base-content dark:text-white mb-4">
                    Video Feeds
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {allParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="relative bg-gray-200 dark:bg-gray-700 rounded-lg shadow overflow-hidden aspect-video"
                      >
                        <div
                          id={participant.isLocal ? `local-video-${participant.id}` : `remote-video-${participant.id}`}
                          className="w-full h-full"
                        >
                          {!participant.hasVideo && (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600">
                              <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {participant.isLocal ? 'Your camera is off' : 'No video'}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2">
                          {participant.name} ({participant.role})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="card bg-base-100 dark:bg-gray-800 shadow-xl rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-base-content dark:text-white mb-4">
                    Video Feeds
                  </h3>
                  <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No participants with video yet...</p>
                  </div>
                </div>
              )}

              {localTracks && (
                <div className="fixed bottom-4 right-4 sm:right-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 z-50">
                  <button
                    onClick={toggleMic}
                    className={`btn btn-sm sm:btn-md ${micOn ? 'btn-error' : 'btn-success'}`}
                    disabled={!localTracks.audioTrack || tracksClosedRef.current.audio}
                  >
                    {micOn ? 'Disable Mic' : 'Enable Mic'}
                  </button>
                  {hasCamera && (
                    <button
                      onClick={toggleVideo}
                      className={`btn btn-sm sm:btn-md ${videoOn ? 'btn-error' : 'btn-success'}`}
                      disabled={!localTracks.videoTrack || tracksClosedRef.current.video}
                    >
                      {videoOn ? 'Disable Camera' : 'Enable Camera'}
                    </button>
                  )}
                  <button
                    onClick={leaveSession}
                    className="btn btn-neutral btn-sm sm:btn-md"
                  >
                    Leave Session
                  </button>
                </div>
              )}
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default memo(StudentLiveSession);