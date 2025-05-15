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
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [selectedRole, setSelectedRole] = useState<string>('Admin');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await dispatch(updatePassword(newPassword)).unwrap();
      toast.success('Password updated successfully');
      setShowResetPassword(false);
    } catch (err) {
      console.log(err);
      toast.error('Failed to update password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 dark:bg-gray-900 px-4">
      <div className="card w-full max-w-4xl bg-base-100 dark:bg-gray-800 shadow-xl rounded-xl">
        <div className="flex flex-col md:flex-row h-full">
          {/* Banner Image */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center p-6 bg-base-200 dark:bg-gray-700 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
            <img
              src={bannerImg}
              alt="Study Abroad Illustration"
              className="max-h-80 w-auto object-contain"
            />
          </div>

          {/* Login Form */}
          <div className="flex w-full md:w-1/2 flex-col justify-center p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content dark:text-white mb-2">
              Log in to your account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Welcome back! Enter your credentials to log in.
            </p>

            {/* Role Selection */}
            {!showResetPassword && (
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white mb-3 text-center">
                  Please Select Your Role
                </h2>
                <div className="flex justify-center gap-3 flex-wrap">
                  {['Student', 'Teacher'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`btn btn-sm sm:btn-md ${
                        selectedRole === role ? 'btn-primary' : 'btn-outline btn-neutral'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Login Form or Reset Password */}
            {!showResetPassword ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
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
                    className="input input-bordered w-full text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-error">{errors.email.message}</p>
                  )}
                </div>

                <div>
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
                    className="input input-bordered w-full text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-error">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full btn-sm sm:btn-md"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <PiSpinnerBallFill className="animate-spin" /> Login...
                    </span>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white text-center">
                  Reset Your Password
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  This is your first login. Please set a new password.
                </p>
                <div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="input input-bordered w-full text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="input input-bordered w-full text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <button
                  onClick={handleResetPassword}
                  className="btn btn-primary w-full btn-sm sm:btn-md"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
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
    </div>
  );
};

export default Login;