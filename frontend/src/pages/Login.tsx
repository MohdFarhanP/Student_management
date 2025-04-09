import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, updatePassword } from '../redux/slices/authSlice';
import { RootState, AppDispatch } from '../redux/store';
import { toast } from 'react-toastify';
import bannerImg from '../assets/hand-drawn-study-abroad-illustration.png';
import { PiSpinnerBallFill } from 'react-icons/pi';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (user && !loading) {
      if (user.role !== 'Admin' && user.isInitialLogin) {
        setShowResetPassword(true);
      } else {
        setShowResetPassword(false);
      }
    }
    if (error) {
      toast.error(error);
    }
  }, [user, loading, error]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }
    dispatch(loginUser({ ...data, role: selectedRole }));
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await dispatch(updatePassword(newPassword)).unwrap();
      toast.success('Password updated successfully');
      setShowResetPassword(false); // Hide reset form after success
      // Removed navigate; let App.tsx handle redirection
    } catch (err) {
      console.log(err);
      toast.error('Failed to update password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex h-[500px] w-full max-w-4xl rounded-lg shadow-lg">
        <div className="hidden items-center justify-center rounded-s-lg border-r-1 border-r-gray-300 bg-white md:flex md:w-1/2">
          <img className="h-80 w-80" src={bannerImg} alt="" />
        </div>

        <div className="flex w-full flex-col justify-center p-10 md:w-1/2">
          <h1 className="pb-2 text-3xl font-bold text-black">
            Log in to your account
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back! Enter your credentials to log in.
          </p>

          <div className="mt-6">
            <h2 className="mb-3 text-center text-xl font-semibold text-black">
              Please Select Your Role
            </h2>
            <div className="flex justify-center gap-4">
              {['Admin', 'Student', 'Teacher'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-black shadow-sm transition-all hover:bg-gray-100 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    selectedRole === role
                      ? 'border-blue-500 bg-gray-200'
                      : 'bg-white'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {!showResetPassword ? (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
              <div className="mb-4">
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Invalid email format',
                    },
                  })}
                  placeholder="Email"
                  className="w-full rounded-lg border border-gray-300 p-3 text-black focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  placeholder="Password"
                  className="w-full rounded-lg border border-gray-300 p-3 text-black focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="mt-4 w-full rounded-lg bg-gray-800 p-3 text-white transition hover:bg-black"
                disabled={loading}
              >
                {loading ? (
                  <span className="mx-auto flex items-center gap-2">
                    <PiSpinnerBallFill className="animate-spin" /> Login...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          ) : (
            <div className="mt-6">
              <h2 className="mb-4 text-center text-xl font-semibold text-black">
                Reset Your Password
              </h2>
              <p className="mb-4 text-center text-sm text-gray-500">
                This is your first login. Please set a new password.
              </p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full rounded-lg border border-gray-300 p-3 text-black focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                onClick={handleResetPassword}
                className="mt-4 w-full rounded-lg bg-gray-800 p-3 text-white transition hover:bg-black"
                disabled={loading}
              >
                {loading ? (
                  <span className="mx-auto flex items-center gap-2">
                    <PiSpinnerBallFill className="animate-spin" /> Updating...
                  </span>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;