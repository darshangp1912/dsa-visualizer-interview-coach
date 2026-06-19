import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  score: number;
  rankPosition: number;
}

const medalColor = (rank: number) => {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-gray-300';
  if (rank === 3) return 'text-amber-600';
  return 'text-gray-500';
};

const Leaderboard: React.FC = () => {
  const { user } = useAuth();

  const { data: entries = [], isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard'],
    queryFn: () => axios.get('/api/leaderboard').then(r => r.data),
    staleTime: 30_000,
  });

  const myEntry = entries.find(e => e.username === user?.username);

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
            <Trophy className="text-yellow-400" size={32} /> Global Leaderboard
          </h1>
          <p className="mt-2 text-gray-400">Compete, practice, and climb the ranks.</p>
        </div>

        {/* My Rank Banner */}
        {myEntry && (
          <div className="mb-6 rounded-2xl border border-brand-primary/30 bg-brand-primary/5 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Your Rank</p>
              <p className="text-2xl font-extrabold text-white">#{myEntry.rankPosition}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Total Points</p>
              <p className="text-2xl font-extrabold text-brand-primary">{myEntry.score}</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-2xl border border-dark-800 bg-dark-950 overflow-hidden">
          {/* Top 3 podium */}
          {!isLoading && entries.length >= 3 && (
            <div className="flex items-end justify-center gap-4 px-6 pt-8 pb-4">
              {[entries[1], entries[0], entries[2]].map((e, pi) => {
                const heights = ['h-20', 'h-28', 'h-16'];
                const labels = ['2nd', '1st', '3rd'];
                const colors = ['bg-gray-700', 'bg-yellow-600', 'bg-amber-800'];
                return (
                  <div key={pi} className="flex flex-col items-center gap-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dark-800 text-sm font-bold text-white">
                      {e?.username?.[0]?.toUpperCase()}
                    </div>
                    <p className="text-xs font-semibold text-gray-300">{e?.username}</p>
                    <p className="text-xs text-gray-500">{e?.score} pts</p>
                    <div className={`${heights[pi]} ${colors[pi]} w-16 rounded-t-lg flex items-end justify-center pb-2`}>
                      <span className="text-xs font-bold text-white">{labels[pi]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full table */}
          <div className="divide-y divide-dark-800">
            {isLoading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-14 animate-pulse bg-dark-900/50 mx-4 my-2 rounded-xl" />
              ))
            ) : (
              entries.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center justify-between px-6 py-4 transition hover:bg-dark-900 ${
                    entry.username === user?.username ? 'bg-brand-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 text-lg font-extrabold ${medalColor(entry.rankPosition)}`}>
                      {entry.rankPosition <= 3 ? <Medal size={20} /> : `#${entry.rankPosition}`}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-dark-800 text-sm font-bold text-white">
                      {entry.username[0]?.toUpperCase()}
                    </div>
                    <span className={`font-semibold ${entry.username === user?.username ? 'text-brand-primary' : 'text-gray-200'}`}>
                      {entry.username}
                      {entry.username === user?.username && <span className="ml-2 text-xs text-gray-500">(You)</span>}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-white">{entry.score} <span className="text-sm text-gray-500">pts</span></span>
                </motion.div>
              ))
            )}
            {!isLoading && entries.length === 0 && (
              <p className="py-12 text-center text-gray-500">No entries yet. Be the first to earn points!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
