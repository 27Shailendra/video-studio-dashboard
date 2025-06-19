import React, { useState } from 'react';
import { signupUser } from '../api/auth'; 
import { Link, useNavigate  } from 'react-router-dom';
import { Eye, EyeOff, Check } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from "sonner";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    agreeToTerms: false
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Min 2 characters').required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
    agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to the terms')
  });

const handleSubmit = async (values, { setSubmitting }) => {
  try {
    const res = await signupUser(values);
    if (res.status) {
        toast.success("Signup successfully!");
        navigate('/login');
      }else{
        toast.error(res.error);
      }
  } catch (err) {
    toast.error(err);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="w-full max-w-2xl w-1/2 mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Create account</h2>
        <p className="text-gray-400">Join thousands of creators worldwide</p>
      </div>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched , isSubmitting }) => (
          <Form className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <Field
                type="text"
                name="name"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your name"
              />
              {errors.name && touched.name && <div style={{ color: '#FFB09C', fontSize: '14px', marginTop: '4px' }}>{errors.name}</div>}
            </div>

            <div>
              <label className="mt-2 block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <Field
                type="email"
                name="email"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
              />
              {errors.email && touched.email && <div style={{ color: '#FFB09C', fontSize: '14px', marginTop: '4px' }}>{errors.email}</div>}
            </div>

            <div>
              <label className="mt-2 block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Create a password"
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

            <div className="flex items-start">
              <Field
                type="checkbox"
                name="agreeToTerms"
                className="mt-2 w-4 h-4 text-purple-500 bg-white/5 border-white/20 rounded focus:ring-purple-500"
              />
              <label htmlFor="agreeToTerms" className="mt-2 ml-6 text-sm text-gray-300">
                I agree to the{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
              </label>
            </div>
                  {errors.agreeToTerms && touched.agreeToTerms && <div style={{ color: '#FFB09C', fontSize: '14px', marginTop: '4px' }}>{errors.agreeToTerms}</div>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
