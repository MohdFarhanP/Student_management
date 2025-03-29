import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.tsx';
import AdminRoutes from './routes/AdminRoutes.tsx';
import UserRoutes from './routes/StudentRoutes.tsx';
import TeacherRoutes from './routes/TeacherRoutes.tsx';
function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <ToastContainer theme="dark" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/student/*" element={<UserRoutes />} />
            <Route path="/teacher/*" element={<TeacherRoutes />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
