import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, UserPlus, Eye, EyeOff } from 'lucide-react';
import { ErrorMessage } from '../components/ErrorMessage';
import { SuccessMessage } from '../components/SuccessMessage';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = 'Full name is required';
    }

    if (!username.trim()) {
      errs.username = 'Username is required';
    } else if (username.length < 3) {
      errs.username = 'Username must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm password is required';
    } else if (confirmPassword !== password) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register(fullName.trim(), username.trim(), email.trim(), password);
      setSuccessMsg('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { state: { registered: true } });
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#8E7CF8] text-white shadow-xl shadow-[#6C5CE7]/30 mb-3">
            <Wallet className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Join SpendWise
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create an account to master your student finances
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
          {successMsg && <SuccessMessage message={successMsg} className="mb-4" />}
          {errorMsg && <ErrorMessage message={errorMsg} onDismiss={() => setErrorMsg('')} className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (validationErrors.fullName) {
                    setValidationErrors({ ...validationErrors, fullName: '' });
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 ${
                  validationErrors.fullName
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#6C5CE7] focus:ring-[#6C5CE7]/20'
                }`}
              />
              {validationErrors.fullName && (
                <p className="text-xs text-rose-600 font-semibold mt-1">
                  {validationErrors.fullName}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Username *
              </label>
              <input
                type="text"
                placeholder="e.g. rahul24"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (validationErrors.username) {
                    setValidationErrors({ ...validationErrors, username: '' });
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 ${
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

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="e.g. rahul@college.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: '' });
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 ${
                  validationErrors.email
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#6C5CE7] focus:ring-[#6C5CE7]/20'
                }`}
              />
              {validationErrors.email && (
                <p className="text-xs text-rose-600 font-semibold mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Password (min 6 characters) *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors({ ...validationErrors, password: '' });
                    }
                  }}
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-sm font-medium transition-colors text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 ${
                    validationErrors.password
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-[#6C5CE7] focus:ring-[#6C5CE7]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (validationErrors.confirmPassword) {
                    setValidationErrors({ ...validationErrors, confirmPassword: '' });
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 ${
                  validationErrors.confirmPassword
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#6C5CE7] focus:ring-[#6C5CE7]/20'
                }`}
              />
              {validationErrors.confirmPassword && (
                <p className="text-xs text-rose-600 font-semibold mt-1">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-[#6C5CE7] hover:bg-[#5848c4] disabled:bg-slate-300 text-white font-bold text-sm shadow-md shadow-[#6C5CE7]/30 transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Student Account</span>
                </>
              )}
            </button>
          </form>

          {/* Link to login */}
          <div className="mt-6 text-center text-sm text-slate-500">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-bold text-[#6C5CE7] hover:text-[#5848c4] hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
