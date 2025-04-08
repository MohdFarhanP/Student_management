import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { refreshToken } from '../redux/slices/authSlice';

const InitAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  return null;
};

export default InitAuth;
