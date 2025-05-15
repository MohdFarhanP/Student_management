import { useEffect, useState, useRef, useCallback } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteVideoTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { socket } from '../../socket';
import StudentSidebar from '../../components/StudentSidebar';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';

interface SessionInfo {
  sessionId: string;
  title: string;
  scheduledAt?: string;
}

interface UserInfo {
  id: string;
  name: string; // Added name field
  email: string;
  role: string;
}

interface RemoteUserInfo {
  user: IAgoraRTCRemoteUser;
  hasVideo: boolean;
  hasAudio: boolean;
}

const appId = import.meta.env.VITE_AGORA_APP_ID;

const StudentLiveSession = ({ userRole, userId }: { userRole: 'Student'; userId: string }) => {
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

    loadingTimeoutRef.current = setTimeout(() => {
      setLoading(false);
      setError('Failed to join session: Timeout waiting for server response.');
    }, 10000);
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
  }, [userId, sessionInfo, joinSession]);

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
      role: userInfo?.role || 'Unknown',
      isLocal: false,
      hasVideo: remoteUser.hasVideo,
    });
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900 overflow-hidden">
      <StudentSidebar />
      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-6 max-h-screen`}
      >
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

        {sessionInfo && (
          <div className="space-y-6">
            <div className="card bg-base-100 dark:bg-gray-800 shadow-xl rounded-xl p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white mb-4">
                Active Session: {sessionInfo.title}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Session ID: {sessionInfo.sessionId}
                </p>
                {!localTracks && (
                  <button
                    onClick={() => joinSession(sessionInfo.sessionId)}
                    disabled={loading}
                    className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                  >
                    Join Session
                  </button>
                )}
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
                >
                  {micOn ? 'Disable Mic' : 'Enable Mic'}
                </button>
                {hasCamera && (
                  <button
                    onClick={toggleVideo}
                    className={`btn btn-sm sm:btn-md ${videoOn ? 'btn-error' : 'btn-success'}`}
                    disabled={!localTracks.videoTrack}
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
      </div>
    </div>
  );
};

export default StudentLiveSession;