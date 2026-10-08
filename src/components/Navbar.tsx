import React from 'react';
import { Menu, Plus, Wallet, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenSidebar: () => void;
  onOpenAddModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar, onOpenAddModal }) => {
  const { currentUser } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Mobile Hamburger */}
        <button
          onClick={onOpenSidebar}
          type="button"
          aria-label="Open sidebar menu"
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6C5CE7] to-[#8E7CF8] flex items-center justify-center text-white">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 text-base">SpendWise</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            type="button"
            className="px-3.5 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5848c4] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}

        <Link
          to="/profile"
          className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          title="View Profile"
        >
          <div className="w-8 h-8 rounded-full bg-[#6C5CE7]/15 text-[#6C5CE7] flex items-center justify-center font-bold text-xs ring-2 ring-white">
            {currentUser?.fullName?.[0]?.toUpperCase() || <UserIcon className="w-4 h-4" />}
          </div>
        </Link>
      </div>
    </header>
  );
};
