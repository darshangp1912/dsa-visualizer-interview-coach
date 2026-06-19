import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';

interface DashboardStats {
  badges: { name: string; description: string; iconUrl: string }[];
}

const ALL_BADGES = [
  { name: 'First Quiz', description: 'Completed your very first algorithm quiz!', emoji: '🎯' },
  { name: '10 Problems', description: 'Successfully visualized 10 different algorithms.', emoji: '💡' },
  { name: '100 Problems', description: 'Visualized 100 algorithms — absolute grinder!', emoji: '🚀' },
  { name: 'Perfect Score', description: 'Scored 100% on any algorithm interview quiz.', emoji: '⭐' },
  { name: '7 Day Streak', description: 'Maintained a 7-day daily practice streak.', emoji: '🔥' },
  { name: '30 Day Streak', description: 'Maintained a 30-day daily practice streak.', emoji: '🏆' },
  { name: 'Sorting Expert', description: 'Completed quizzes for all sorting algorithms.', emoji: '📊' },
  { name: 'Tree Expert', description: 'Completed quizzes for all tree algorithms.', emoji: '🌲' },
  { name: 'Master of Graph', description: 'Completed quizzes for all graph algorithms.', emoji: '🕸️' },
];

const Achievements: React.FC = () => {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: () => axios.get('/api/dashboard/statistics').then(r => r.data),
    staleTime: 30_000,
  });

  const unlockedNames = new Set((stats?.badges ?? []).map(b => b.name));

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Award className="text-yellow-400" size={30} /> Achievements
          </h1>
          <p className="mt-1 text-gray-400">
            {unlockedNames.size} / {ALL_BADGES.length} badges unlocked
          </p>
          {/* Progress bar */}
          <div className="mt-3 h-2 w-full rounded-full bg-dark-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-700"
              style={{ width: `${(unlockedNames.size / ALL_BADGES.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_BADGES.map((badge, i) => {
            const unlocked = unlockedNames.has(badge.name);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className={`relative rounded-2xl border p-6 transition ${
                  unlocked
                    ? 'border-yellow-800/50 bg-yellow-950/20 shadow-glow-indigo'
                    : 'border-dark-800 bg-dark-950 opacity-60'
                }`}
              >
                {!unlocked && (
                  <div className="absolute right-4 top-4">
                    <Lock size={14} className="text-gray-600" />
                  </div>
                )}
                <div className="text-4xl mb-3">{unlocked ? badge.emoji : '🔒'}</div>
                <h3 className={`text-base font-bold ${unlocked ? 'text-yellow-300' : 'text-gray-400'}`}>
                  {badge.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{badge.description}</p>
                {unlocked && (
                  <span className="mt-3 inline-block rounded-full bg-yellow-900/40 px-2.5 py-0.5 text-xs font-bold text-yellow-400">
                    ✓ Unlocked
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Achievements;
