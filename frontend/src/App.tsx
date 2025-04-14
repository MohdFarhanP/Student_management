import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './redux/store.ts';
import './App.css';
import { ToastContainer } from 'react-toastify';
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import Login from './pages/Login.tsx';
import AdminRoutes from './routes/AdminRoutes.tsx';
import UserRoutes from './routes/StudentRoutes.tsx';
import TeacherRoutes from './routes/TeacherRoutes.tsx';
import { Unauthorized } from './pages/Unauthorized.tsx';
import PrivateRoute from './routes/PrivateRoute.tsx';
import { useEffect } from 'react';
import { checkAuthOnLoad } from './redux/slices/authSlice';
import { RootState, AppDispatch } from './redux/store';

const AppContent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(checkAuthOnLoad());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && user) {
      const currentPath = location.pathname;

      if (
        currentPath === '/' ||
        currentPath === '/login' ||
        currentPath === '/admin' ||
        currentPath === '/student' ||
        currentPath === '/teacher'
      ) {
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
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) {
    return <div>Loading...</div>; // Optional: Show a loading indicator
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
