import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Eye, EyeOff, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';
import { ErrorMessage } from '../components/ErrorMessage';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Check if routed with a success registration message
  const registeredSuccess = location.state?.registered;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!username.trim()) {
      errs.username = 'Username or email is required';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Unable to log in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('student01');
    setPassword('password123');
    setValidationErrors({});
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#8E7CF8] text-white shadow-xl shadow-[#6C5CE7]/30 mb-4 transform hover:rotate-3 transition-transform">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            SpendWise
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Student Expense & Budget Tracker
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-slate-800">Welcome Back!</h2>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to manage your monthly college budget
            </p>
          </div>

          {registeredSuccess && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Registration successful! Please login with your credentials.</span>
            </div>
          )}

          {error && <ErrorMessage message={error} onDismiss={() => setError('')} className="mb-5" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username/Email */}
            <div>
              <label
                htmlFor="username-input"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Username or Email
              </label>
              <input
                id="username-input"
                type="text"
                autoComplete="username"
                placeholder="e.g. student01 or student@example.com"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (validationErrors.username) {
                    setValidationErrors({ ...validationErrors, username: '' });
                  }
                }}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-colors text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 ${
                  validationErrors.username
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#6C5CE7] focus:ring-[#6C5CE7]/20'
                }`}
              />
              {validationErrors.username && (
                <p className="text-xs text-rose-600 font-semibold mt-1">
                  {validationErrors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors({ ...validationErrors, password: '' });
                    }
                  }}
                  className={`w-full pl-4 pr-11 py-3 rounded-xl border text-sm font-medium transition-colors text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 ${
                    validationErrors.password
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-[#6C5CE7] focus:ring-[#6C5CE7]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg focus:outline-hidden"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-xs text-rose-600 font-semibold mt-1">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#6C5CE7] hover:bg-[#5848c4] disabled:bg-slate-300 text-white font-bold text-sm shadow-md shadow-[#6C5CE7]/30 transition-all flex items-center justify-center space-x-2 active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-[#6C5CE7] hover:text-[#5848c4] font-semibold inline-flex items-center space-x-1.5 py-1 px-2.5 rounded-lg bg-[#6C5CE7]/10 hover:bg-[#6C5CE7]/15 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Demo Account (student01)</span>
            </button>
          </div>

          {/* Registration Link */}
          <div className="mt-6 text-center text-sm text-slate-500">
            <span>Don't have an account? </span>
            <Link
              to="/register"
              className="font-bold text-[#6C5CE7] hover:text-[#5848c4] hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
