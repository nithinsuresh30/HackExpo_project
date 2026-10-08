import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  User,
  LogOut,
  Wallet,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/transactions', label: 'Transactions', icon: ReceiptText },
    { to: '/budget', label: 'Budget', icon: PieChart },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
            <NavLink
              to="/dashboard"
              onClick={onClose}
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#8E7CF8] flex items-center justify-center text-white shadow-md shadow-[#6C5CE7]/30 group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1">
                  SpendWise
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#6C5CE7] block -mt-1">
                  Student Finance
                </span>
              </div>
            </NavLink>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              type="button"
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const { icon: Icon } = item;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-3 rounded-xl font-semibold text-sm transition-all ${
                      isActive
                        ? 'bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/25'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Student Status Card */}
          <div className="px-4 mt-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#6C5CE7]/10 via-[#8E7CF8]/10 to-transparent border border-[#6C5CE7]/15">
              <div className="flex items-center space-x-2 text-[#6C5CE7] font-bold text-xs mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Campus Mode</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Track campus food, hostel bills & internship income with 80% alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Footer / User & Logout */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 px-2 py-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#6C5CE7]/15 text-[#6C5CE7] flex items-center justify-center font-bold text-sm">
              {currentUser?.fullName?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentUser?.fullName || 'Student'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                @{currentUser?.username || 'student01'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
