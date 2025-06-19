import React,{useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Play, Film } from 'lucide-react';
import { checkAuth } from "../api/auth";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../api/auth';
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  if (!!localStorage.getItem("userId")) {
    navigate("/dashboard");
  }
}, []);

  
  const initialValues = {
    email: '',
    password: '',
    rememberMe: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

const handleSubmit = async (values, { setSubmitting }) => {
  try {
    const res = await loginUser(values);
    if (res.status) {
      // toast.success(res.message);

      // Check user from /me API
      const userRes = await checkAuth();
      if (userRes && userRes?.user?.userId) {
        localStorage.setItem("userId", userRes?.user?.userId);
      }
      navigate('/dashboard');
    } else {
      toast.error(res.error);
    }
  } catch (err) {
    toast.error("Something went wrong");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      <div className="relative w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4">
            <Film className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">VideoEdit Pro</h1>
          <p className="text-gray-400">Create stunning videos with ease</p>
        </div>

        <div className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-gray-400">Sign in to continue editing your videos</p>
          </div>

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({  errors, touched , isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="email" className="mt-2 block text-sm font-medium text-gray-300 mb-2">
                    Email address
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                  {errors.email && touched.email && <div style={{ color: '#FFB09C', fontSize: '14px', marginTop: '4px' }}>{errors.email}</div>}
                </div>

                <div>
                  <label htmlFor="password" className="mt-2 block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && touched.password && <div style={{ color: '#FFB09C', fontSize: '14px', marginTop: '4px' }}>{errors.password}</div>}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <label className="flex items-center">
                    <Field
                      type="checkbox"
                      name="rememberMe"
                      className="w-4 h-4 text-purple-500 bg-white/5 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-300">Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Play className="w-5 h-5" />
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
