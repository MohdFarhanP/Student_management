import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.tsx';
import AdminRoutes from './routes/AdminRoutes.tsx';
import UserRoutes from './routes/StudentRoutes.tsx';
import TeacherRoutes from './routes/TeacherRoutes.tsx';
import { Unauthorized } from './pages/Unauthorized.tsx';
import PrivateRoute from './routes/PrivateRoute.tsx';

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <ToastContainer theme="dark" />

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
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
