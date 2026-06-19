import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { LogIn, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/signin', { username, password });
      const { token, id, email, roles } = response.data;
      login(token, { id, username: response.data.username, email, roles });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-dark-800 bg-dark-950 p-8 shadow-glow-indigo">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
              Log in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Or{' '}
              <Link to="/signup" className="font-medium text-brand-primary hover:text-indigo-400">
                create a new account
              </Link>
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 rounded-xl bg-red-950/50 border border-red-900 px-4 py-3 text-sm text-red-400">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label className="text-sm font-medium text-gray-300">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-dark-700 bg-dark-900 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-dark-700 bg-dark-900 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-xl bg-brand-primary px-4 py-3.5 text-base font-bold text-white transition hover:bg-indigo-700 focus:outline-none shadow-glow-indigo disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-white border-transparent"></div>
                ) : (
                  <span className="flex items-center space-x-2">
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
