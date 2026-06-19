import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Play, Sparkles, BookOpen, Terminal, ArrowRight } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-20 lg:py-32">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-primary/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 rounded-full bg-brand-accent/10 blur-3xl"></div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 rounded-full border border-brand-primary/30 bg-brand-primary/5 px-4 py-1.5 text-sm font-semibold text-brand-primary"
          >
            <Sparkles size={16} />
            <span>Next-Gen Algorithm Sandbox</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Master DSA Visually. <br />
            <span className="bg-gradient-to-r from-brand-primary via-indigo-400 to-brand-accent bg-clip-text text-transparent">
              Ace Your Technicals.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-400"
          >
            Visualize complex data structures and algorithms in real-time. Lock in your knowledge with instant AI mock interviews, practice coding in multiple languages, and gamify your prep.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/signup"
              className="group flex items-center space-x-2 rounded-xl bg-brand-primary px-6 py-3.5 text-base font-bold text-white transition hover:bg-indigo-700 shadow-glow-indigo"
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="flex items-center space-x-2 rounded-xl border border-dark-700 bg-dark-800 px-6 py-3.5 text-base font-bold text-gray-300 transition hover:bg-dark-700 hover:text-white"
            >
              <Play size={18} />
              <span>Explore Visualizer</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-dark-800 bg-dark-900/50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { val: '40+', label: 'Algorithms Visualized' },
              { val: '500+', label: 'Interview Questions' },
              { val: '8+', label: 'FAANG Companies Targets' },
              { val: '60 FPS', label: 'Smooth Micro-Animations' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-extrabold text-white md:text-4xl">{stat.val}</div>
                <div className="mt-2 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-dark-800 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Engineered for Competitive Programmers & Job Seekers
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Interactive animations paired with a simulated technical whiteboard environment to recreate high-stress developer interviews.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Play className="text-brand-primary" size={24} />,
                title: 'Step-by-Step Animations',
                desc: 'Watch nodes shift, edges highlight, and arrays sort. Pause, play, slow down, and inspect state step-by-step.',
              },
              {
                icon: <BookOpen className="text-brand-secondary" size={24} />,
                title: 'Pseudo-code Highlighting',
                desc: 'Track line-by-line code execution simultaneously alongside visual changes to build a deep structural intuition.',
              },
              {
                icon: <Terminal className="text-brand-accent" size={24} />,
                title: 'Multi-Language Editor',
                desc: 'Write and dry-run code in Java, Python, C++, or JavaScript. Complete auto-indentation and autocomplete standard.',
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="rounded-2xl border border-dark-800 bg-dark-900 p-8 transition hover:border-dark-700"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dark-800">
                  {feat.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{feat.title}</h3>
                <p className="mt-3 text-gray-400">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800 bg-dark-950 px-6 py-12 text-center text-sm text-gray-500">
        <p>© 2026 AlgoCoach. Designed for high performance. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
