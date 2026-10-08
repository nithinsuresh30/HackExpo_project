import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api, API_BASE_URL, USE_REAL_BACKEND } from '../services/api';
import {
  User,
  Mail,
  AtSign,
  LogOut,
  GraduationCap,
  Shield,
  RotateCcw,
  CheckCircle2,
  Database,
  Calendar,
} from 'lucide-react';
import { SuccessMessage } from '../components/SuccessMessage';

export const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [resetMsg, setResetMsg] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleResetDemoData = () => {
    api.resetDemoData();
    setResetMsg('Demo student transactions and budget reset to default values.');
    setTimeout(() => {
      setResetMsg('');
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Manage your account information and preferences.
        </p>
      </div>

      {resetMsg && <SuccessMessage message={resetMsg} />}

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#8E7CF8] text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-[#6C5CE7]/30">
            {currentUser?.fullName?.[0]?.toUpperCase() || 'S'}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {currentUser?.fullName || 'Rahul Sharma'}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#6C5CE7]/10 text-[#6C5CE7] border border-[#6C5CE7]/20 self-center sm:self-auto">
                College Scholar
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-0.5 font-medium">
              @{currentUser?.username || 'student01'}
            </p>
            <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2 text-xs text-slate-500">
              <GraduationCap className="w-4 h-4 text-[#6C5CE7]" />
              <span>National Institute of Technology</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            type="button"
            className="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold text-sm hover:bg-rose-50 transition-colors flex items-center space-x-2 shadow-2xs self-center sm:self-start"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Profile Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              <User className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>Full Name</span>
            </div>
            <p className="text-base font-bold text-slate-800">
              {currentUser?.fullName || 'Rahul Sharma'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              <AtSign className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>Username</span>
            </div>
            <p className="text-base font-bold text-slate-800">
              {currentUser?.username || 'student01'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Mail className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>Email Address</span>
            </div>
            <p className="text-base font-bold text-slate-800 truncate">
              {currentUser?.email || 'student@example.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Backend Integration & Spring Boot Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Backend Integration Settings
            </h3>
            <p className="text-xs text-slate-400">
              Spring Boot + Hibernate REST API connectivity
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Configured API Base URL:</span>
            <code className="bg-slate-200 px-2 py-0.5 rounded-md font-mono text-slate-800">
              {API_BASE_URL}
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Active Mode:</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-purple-100 text-[#6C5CE7]">
              {USE_REAL_BACKEND ? 'Connected to Spring Boot' : 'Demo Mode (LocalStorage Mock Engine)'}
            </span>
          </div>
          <p className="text-slate-400 pt-1">
            When your Spring Boot application is running on port 8080, set <code className="text-slate-700">USE_REAL_BACKEND = true</code> in <code className="text-slate-700">src/services/api.ts</code>.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleResetDemoData}
            type="button"
            className="text-xs text-slate-500 hover:text-slate-700 font-semibold flex items-center space-x-1 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Transactions & Budget</span>
          </button>
        </div>
      </div>
    </div>
  );
};
