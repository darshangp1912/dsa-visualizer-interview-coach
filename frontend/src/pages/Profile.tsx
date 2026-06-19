import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Flame, Target, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  streakCount: number;
  problemsSolved: number;
  averageAccuracy: number;
  totalPoints: number;
  rankPosition: number;
  badges: { name: string; description: string }[];
}

const Profile: React.FC = () => {
  const { user } = useAuth();

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: () => axios.get('/api/dashboard/statistics').then(r => r.data),
    staleTime: 30_000,
  });

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-dark-800 bg-dark-950 p-8"
        >
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8">
            {/* Avatar */}
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent text-4xl font-extrabold text-white shadow-glow-indigo">
              {user?.username?.[0]?.toUpperCase()}
            </div>

            <div className="mt-4 text-center sm:mt-0 sm:text-left flex-1">
              <h1 className="text-2xl font-extrabold text-white">{user?.username}</h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 sm:justify-start text-sm text-gray-400">
                <span className="flex items-center gap-1.5"><Mail size={14} /> {user?.email}</span>
                <span className="flex items-center gap-1.5"><User size={14} /> {user?.roles?.includes('ROLE_ADMIN') ? 'Administrator' : 'Member'}</span>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap justify-center sm:justify-start">
                {user?.roles?.map(r => (
                  <span key={r} className="rounded-full border border-brand-primary/40 bg-brand-primary/10 px-3 py-0.5 text-xs font-bold text-brand-primary">
                    {r.replace('ROLE_', '')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: <Flame className="text-orange-400" size={20} />, label: 'Streak', value: `${stats?.streakCount ?? 0} days` },
              { icon: <Target className="text-green-400" size={20} />, label: 'Solved', value: stats?.problemsSolved ?? 0 },
              { icon: <Trophy className="text-yellow-400" size={20} />, label: 'Points', value: stats?.totalPoints ?? 0 },
              { icon: <Calendar className="text-blue-400" size={20} />, label: 'Accuracy', value: `${(stats?.averageAccuracy ?? 0).toFixed(1)}%` },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-dark-800 p-4 text-center">
                <div className="flex justify-center mb-2">{s.icon}</div>
                <p className="text-xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { label: 'View Achievements', to: '/achievements', desc: 'See all your earned badges.' },
            { label: 'View Leaderboard', to: '/leaderboard', desc: `You are currently ranked #${stats?.rankPosition ?? '?'}.` },
            { label: 'Practice More', to: '/algorithms', desc: 'Explore all available algorithms.' },
            { label: 'Dashboard', to: '/dashboard', desc: 'See your overall progress stats.' },
          ].map((l, i) => (
            <Link
              key={i}
              to={l.to}
              className="rounded-2xl border border-dark-800 bg-dark-950 p-5 transition hover:border-dark-700 hover:bg-dark-900"
            >
              <p className="font-bold text-white">{l.label}</p>
              <p className="mt-1 text-sm text-gray-500">{l.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Profile;
