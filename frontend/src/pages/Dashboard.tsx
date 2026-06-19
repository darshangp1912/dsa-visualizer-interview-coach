import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Flame, Target, Trophy, Star, Activity, TrendingUp, Clock, CheckCircle2
} from 'lucide-react';

interface DashboardStats {
  streakCount: number;
  problemsSolved: number;
  averageAccuracy: number;
  totalPoints: number;
  rankPosition: number;
  topicProgress: { algorithmName: string; category: string; completed: boolean }[];
  recentActivity: { activityType: string; description: string; createdAt: string }[];
  topRankers: { username: string; score: number; rankPosition: number }[];
  badges: { name: string; description: string; iconUrl: string }[];
  practiceGraphData: { date: string; count: number }[];
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; sub?: string; glow?: string }> = ({ icon, label, value, sub, glow }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-2xl border border-dark-800 bg-dark-950 p-6 ${glow ?? ''}`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-400">{label}</p>
        <p className="mt-2 text-3xl font-extrabold text-white">{value}</p>
        {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
      </div>
      <div className="rounded-xl bg-dark-800 p-3">{icon}</div>
    </div>
  </motion.div>
);

const ActivityBadge: React.FC<{ type: string }> = ({ type }) => {
  const map: Record<string, string> = {
    LOGIN: 'bg-blue-900/50 text-blue-400',
    SIGNUP: 'bg-green-900/50 text-green-400',
    VISUALIZATION: 'bg-purple-900/50 text-purple-400',
    QUIZ: 'bg-yellow-900/50 text-yellow-400',
    BADGE_UNLOCKED: 'bg-pink-900/50 text-pink-400',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${map[type] ?? 'bg-dark-800 text-gray-400'}`}>
      {type.replace('_', ' ')}
    </span>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: () => axios.get('/api/dashboard/statistics').then(r => r.data),
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-dark-900">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-brand-primary border-dark-700" />
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...(stats?.practiceGraphData?.map(d => d.count) ?? [1]), 1);

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back, <span className="text-brand-primary">{user?.username}</span> 👋
          </h1>
          <p className="mt-1 text-gray-400">Here's your DSA progress at a glance.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Flame className="text-orange-400" size={22} />}
            label="Day Streak"
            value={`${stats?.streakCount ?? 0} 🔥`}
            sub="Keep it going!"
          />
          <StatCard
            icon={<CheckCircle2 className="text-green-400" size={22} />}
            label="Problems Solved"
            value={stats?.problemsSolved ?? 0}
            sub="Total unique algorithms"
          />
          <StatCard
            icon={<Target className="text-blue-400" size={22} />}
            label="Avg Accuracy"
            value={`${(stats?.averageAccuracy ?? 0).toFixed(1)}%`}
            sub="Quiz performance"
          />
          <StatCard
            icon={<Trophy className="text-yellow-400" size={22} />}
            label="Total Points"
            value={stats?.totalPoints ?? 0}
            sub={stats?.rankPosition ? `Rank #${stats.rankPosition}` : 'Unranked'}
            glow="shadow-glow-indigo"
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Activity Graph */}
          <div className="col-span-2 rounded-2xl border border-dark-800 bg-dark-950 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><TrendingUp size={18} className="text-brand-primary" /> Practice Activity (Last 7 Days)</h2>
            </div>
            <div className="flex h-32 items-end space-x-2">
              {(stats?.practiceGraphData?.slice(-7) ?? Array(7).fill({ date: '', count: 0 })).map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-brand-primary/80 transition-all duration-500"
                    style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? '8px' : '2px' }}
                  />
                  <span className="text-[10px] text-gray-600">{d.date?.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rankers */}
          <div className="rounded-2xl border border-dark-800 bg-dark-950 p-6">
            <h2 className="mb-4 text-lg font-bold text-white flex items-center gap-2"><Star size={18} className="text-yellow-400" /> Top Rankers</h2>
            <div className="space-y-3">
              {(stats?.topRankers ?? []).slice(0, 5).map((r, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                      #{i + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-200">{r.username}</span>
                  </div>
                  <span className="text-sm font-bold text-brand-primary">{r.score} pts</span>
                </div>
              ))}
              {!stats?.topRankers?.length && <p className="text-sm text-gray-500">No rankers yet. Be the first!</p>}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="rounded-2xl border border-dark-800 bg-dark-950 p-6">
            <h2 className="mb-4 text-lg font-bold text-white flex items-center gap-2"><Activity size={18} className="text-brand-accent" /> Recent Activity</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {(stats?.recentActivity ?? []).map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-dark-800 p-3">
                  <ActivityBadge type={a.activityType} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm text-gray-300">{a.description}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{new Date(a.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {!stats?.recentActivity?.length && <p className="text-sm text-gray-500">No activity yet. Start learning!</p>}
            </div>
          </div>

          {/* Topic Progress */}
          <div className="rounded-2xl border border-dark-800 bg-dark-950 p-6">
            <h2 className="mb-4 text-lg font-bold text-white flex items-center gap-2"><Clock size={18} className="text-green-400" /> Topic Progress</h2>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {(stats?.topicProgress ?? []).map((p, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-dark-800 px-4 py-2.5">
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{p.algorithmName}</p>
                    <p className="text-xs text-gray-500">{p.category}</p>
                  </div>
                  {p.completed ? (
                    <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border-2 border-dark-600 flex-shrink-0" />
                  )}
                </div>
              ))}
              {!stats?.topicProgress?.length && <p className="text-sm text-gray-500">No topics started yet. Head to Algorithms!</p>}
            </div>
          </div>
        </div>

        {/* Badges */}
        {(stats?.badges?.length ?? 0) > 0 && (
          <div className="mt-8 rounded-2xl border border-dark-800 bg-dark-950 p-6">
            <h2 className="mb-6 text-lg font-bold text-white">🏅 Your Badges</h2>
            <div className="flex flex-wrap gap-4">
              {stats!.badges.map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 rounded-xl border border-yellow-900/50 bg-yellow-950/20 px-5 py-4">
                  <span className="text-3xl">🏆</span>
                  <span className="text-sm font-bold text-yellow-300">{b.name}</span>
                  <span className="text-xs text-gray-500 text-center max-w-[120px]">{b.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
