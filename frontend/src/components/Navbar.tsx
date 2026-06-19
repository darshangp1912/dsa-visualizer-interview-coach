import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Database, Trophy, Award, User as UserIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-brand-primary text-white shadow-glow-indigo'
        : 'text-gray-400 hover:bg-dark-800 hover:text-white'
    }`;

  return (
    <nav className="border-b border-dark-700 bg-dark-900 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent text-lg font-bold text-white shadow-glow-indigo">
            Ω
          </div>
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
            AlgoCoach
          </span>
        </Link>

        {/* Links */}
        {user && (
          <div className="hidden items-center space-x-4 md:flex">
            <Link to="/dashboard" className={linkClass('/dashboard')}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/algorithms" className={linkClass('/algorithms')}>
              <Database size={18} />
              <span>Algorithms</span>
            </Link>
            <Link to="/leaderboard" className={linkClass('/leaderboard')}>
              <Trophy size={18} />
              <span>Leaderboard</span>
            </Link>
            <Link to="/achievements" className={linkClass('/achievements')}>
              <Award size={18} />
              <span>Achievements</span>
            </Link>
            <Link to="/profile" className={linkClass('/profile')}>
              <UserIcon size={18} />
              <span>Profile</span>
            </Link>
            {user.roles.includes('ROLE_ADMIN') && (
              <Link to="/admin" className={linkClass('/admin')}>
                <span>Admin</span>
              </Link>
            )}
          </div>
        )}

        {/* User Info & Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden flex-col items-end text-xs md:flex">
                <span className="font-semibold text-gray-200">{user.username}</span>
                <span className="text-gray-500">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 rounded-lg border border-dark-700 px-3 py-2 text-sm font-semibold text-gray-400 transition hover:bg-dark-800 hover:text-red-400 hover:border-red-900"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-glow-indigo"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
