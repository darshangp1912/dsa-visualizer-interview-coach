import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Play, Search, Filter } from 'lucide-react';

interface Algorithm {
  id: number;
  name: string;
  category: string;
  timeComplexityBest: string;
  timeComplexityAvg: string;
  timeComplexityWorst: string;
  spaceComplexity: string;
}

const categoryColors: Record<string, string> = {
  Sorting: 'bg-blue-900/40 text-blue-400 border-blue-800',
  Searching: 'bg-green-900/40 text-green-400 border-green-800',
  Trees: 'bg-emerald-900/40 text-emerald-400 border-emerald-800',
  Graphs: 'bg-purple-900/40 text-purple-400 border-purple-800',
  'Dynamic Programming': 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
  Backtracking: 'bg-red-900/40 text-red-400 border-red-800',
  'Linked List': 'bg-pink-900/40 text-pink-400 border-pink-800',
  Stacks: 'bg-orange-900/40 text-orange-400 border-orange-800',
  Queues: 'bg-cyan-900/40 text-cyan-400 border-cyan-800',
  Recursion: 'bg-indigo-900/40 text-indigo-400 border-indigo-800',
  Arrays: 'bg-teal-900/40 text-teal-400 border-teal-800',
};

const Algorithms: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: algorithms = [], isLoading } = useQuery<Algorithm[]>({
    queryKey: ['algorithms'],
    queryFn: () => axios.get('/api/algorithms').then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const categories = ['All', ...Array.from(new Set(algorithms.map(a => a.category)))];

  const filtered = algorithms.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">Algorithm Library</h1>
          <p className="mt-1 text-gray-400">Choose an algorithm to visualize, then tackle the interview coach.</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search algorithms…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-dark-700 bg-dark-950 py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:border-brand-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-gray-500" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'border-brand-primary bg-brand-primary text-white'
                    : 'border-dark-700 text-gray-400 hover:border-dark-600 hover:text-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Algorithm Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl border border-dark-800 bg-dark-950" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((algo, i) => (
              <motion.div
                key={algo.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group rounded-2xl border border-dark-800 bg-dark-950 p-6 transition hover:border-dark-600"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryColors[algo.category] ?? 'bg-dark-800 text-gray-400 border-dark-700'}`}>
                      {algo.category}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-white">{algo.name}</h3>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Best</span>
                    <code className="font-mono text-green-400">{algo.timeComplexityBest}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Average</span>
                    <code className="font-mono text-yellow-400">{algo.timeComplexityAvg}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Worst</span>
                    <code className="font-mono text-red-400">{algo.timeComplexityWorst}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Space</span>
                    <code className="font-mono text-blue-400">{algo.spaceComplexity}</code>
                  </div>
                </div>

                <Link
                  to={`/visualizer/${algo.id}`}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 shadow-glow-indigo"
                >
                  <Play size={14} />
                  Visualize + Practice
                </Link>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 py-16 text-center text-gray-500">
                No algorithms found matching "{search}".
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Algorithms;
