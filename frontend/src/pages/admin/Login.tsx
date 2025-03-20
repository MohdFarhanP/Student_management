import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import bannerImg from '../../assets/hand-drawn-study-abroad-illustration.png';
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
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    if (user) {
      navigate('/admin/dashboard');
    }
    if (error) {
      console.log(error);
      toast.error(error);
    }
  }, [user, error, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex h-[500px] w-full max-w-4xl rounded-lg shadow-lg">
        <div className="hidden items-center justify-center rounded-s-lg border-r-1 border-r-gray-300 bg-white md:flex md:w-1/2">
          <img className="h-80 w-80" src={bannerImg} alt="" />
        </div>

        {/* Right Side - Form */}
        <div className="flex w-full flex-col justify-center p-10 md:w-1/2">
          <h1 className="pb-2 text-3xl font-bold text-black">
            Log in to your account
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back! Enter your credentials to log in.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
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
        </div>
      </div>
    </div>
  );
};

export default Login;
