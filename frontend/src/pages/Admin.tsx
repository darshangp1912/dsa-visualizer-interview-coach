import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Shield } from 'lucide-react';

const Admin: React.FC = () => {
  const { data: algorithms = [], isLoading: algoLoading } = useQuery({
    queryKey: ['algorithms'],
    queryFn: () => axios.get('/api/algorithms').then(r => r.data),
    staleTime: 60_000,
  });

  const { data: leaderboard = [], isLoading: lbLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => axios.get('/api/leaderboard').then(r => r.data),
    staleTime: 60_000,
  });

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center gap-3">
          <Shield className="text-brand-primary" size={28} />
          <h1 className="text-3xl font-extrabold text-white">Admin Panel</h1>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {[
            { label: 'Total Algorithms', value: algorithms.length, color: 'text-blue-400' },
            { label: 'Ranked Users', value: leaderboard.length, color: 'text-green-400' },
            { label: 'Questions in DB', value: '504', color: 'text-purple-400' },
          ].map((card, i) => (
            <div key={i} className="rounded-2xl border border-dark-800 bg-dark-950 p-6">
              <p className="text-sm text-gray-400">{card.label}</p>
              <p className={`mt-2 text-4xl font-extrabold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Algorithms Table */}
        <div className="rounded-2xl border border-dark-800 bg-dark-950 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-dark-800">
            <h2 className="text-lg font-bold text-white">Algorithms Registry</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-800 text-gray-400 text-xs uppercase">
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Avg Complexity</th>
                  <th className="px-6 py-3 text-left">Space</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {algoLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-6 py-4"><div className="h-4 animate-pulse rounded bg-dark-800" /></td></tr>
                  ))
                ) : (
                  algorithms.map((a: any) => (
                    <tr key={a.id} className="hover:bg-dark-900 transition">
                      <td className="px-6 py-3.5 text-gray-500 font-mono">{a.id}</td>
                      <td className="px-6 py-3.5 font-semibold text-gray-200">{a.name}</td>
                      <td className="px-6 py-3.5 text-gray-400">{a.category}</td>
                      <td className="px-6 py-3.5 font-mono text-yellow-400">{a.timeComplexityAvg}</td>
                      <td className="px-6 py-3.5 font-mono text-blue-400">{a.spaceComplexity}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="rounded-2xl border border-dark-800 bg-dark-950 overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-800">
            <h2 className="text-lg font-bold text-white">User Leaderboard</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-800 text-gray-400 text-xs uppercase">
                  <th className="px-6 py-3 text-left">Rank</th>
                  <th className="px-6 py-3 text-left">Username</th>
                  <th className="px-6 py-3 text-left">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {lbLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}><td colSpan={3} className="px-6 py-4"><div className="h-4 animate-pulse rounded bg-dark-800" /></td></tr>
                  ))
                ) : (
                  leaderboard.map((e: any, i: number) => (
                    <tr key={i} className="hover:bg-dark-900 transition">
                      <td className="px-6 py-3.5 font-bold text-gray-300">#{e.rankPosition}</td>
                      <td className="px-6 py-3.5 font-semibold text-gray-200">{e.username}</td>
                      <td className="px-6 py-3.5 text-brand-primary font-bold">{e.score}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
