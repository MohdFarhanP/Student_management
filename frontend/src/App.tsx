import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, AppDispatch } from './redux/store';
import './App.css';
import { ToastContainer } from 'react-toastify';
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import Login from './pages/Login';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/StudentRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import { Unauthorized } from './pages/Unauthorized';
import PrivateRoute from './routes/PrivateRoute';
import { useEffect, useState } from 'react';
import { checkAuthOnLoad } from './redux/slices/authSlice';
import { socket } from './socket';

const AppContent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (!hasCheckedAuth && !user) {
      dispatch(checkAuthOnLoad()).finally(() => {
        setHasCheckedAuth(true);
      });
    }
  }, [dispatch, hasCheckedAuth, user]);

  // Manage socket connection at the app level
  useEffect(() => {
    if (loading || !hasCheckedAuth) {
      console.log('App.tsx: Still loading or checking auth, skipping socket connection');
      return;
    }

    if (!user) {
      console.log('App.tsx: No user, disconnecting socket');
      if (socket.connected) {
        socket.disconnect();
      }
      return;
    }

    console.log('App.tsx: Connecting socket for user:', user.id);
    socket.auth = { userId: user.id, userRole: user.role };

    if (!socket.connected) {
      socket.connect();
    }

    socket.on('connect', () => {
      console.log('App.tsx: Socket connected, socket ID:', socket.id);
      socket.emit('joinNotification');
    });

    socket.on('connect_error', (error: Error) => {
      console.error('App.tsx: Socket connection error:', error.message);
    });

    socket.on('disconnect', (reason: string) => {
      console.log('App.tsx: Socket disconnected, reason:', reason);
      if (reason === 'io server disconnect' && user) {
        // Server disconnected us, attempt to reconnect
        socket.connect();
      }
    });

    return () => {
      console.log('App.tsx: Cleaning up socket listeners');
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      // Do NOT disconnect socket here unless the app is unmounting completely
    };
  }, [user, loading, hasCheckedAuth]);

  useEffect(() => {
    if (loading || !hasCheckedAuth) return;
    if (user) {
      if (location.pathname === '/' || location.pathname === '/login') {
        const redirectPath =
          user.role === 'Admin'
            ? '/admin/dashboard'
            : user.role === 'Student'
              ? '/student/profile'
              : user.role === 'Teacher'
                ? '/teacher/profile'
                : '/login';
        const shouldRedirectToLogin =
          user.role !== 'Admin' && user.isInitialLogin;
        if (shouldRedirectToLogin) {
          navigate('/login', { replace: true });
        } else {
          navigate(redirectPath, { replace: true });
        }
      }
    } else if (!['/login', '/unauthorized'].includes(location.pathname)) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate, location.pathname, hasCheckedAuth]);

  if (loading || !hasCheckedAuth) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Route>
      <Route element={<PrivateRoute allowedRoles={['Student']} />}>
        <Route path="/student/*" element={<UserRoutes />} />
      </Route>
      <Route element={<PrivateRoute allowedRoles={['Teacher']} />}>
        <Route path="/teacher/*" element={<TeacherRoutes />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <ToastContainer theme="dark" />
      <AppContent />
    </BrowserRouter>
  </Provider>
);

export default App;