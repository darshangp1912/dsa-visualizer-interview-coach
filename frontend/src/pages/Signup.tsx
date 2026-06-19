import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

const Signup: React.FC = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/auth/signup', {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-dark-800 bg-dark-950 p-8 shadow-glow-indigo">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Already have one?{' '}
              <Link to="/login" className="font-medium text-brand-primary hover:text-indigo-400">
                Log in
              </Link>
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 rounded-xl bg-red-950/50 border border-red-900 px-4 py-3 text-sm text-red-400">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center space-x-2 rounded-xl bg-green-950/50 border border-green-900 px-4 py-3 text-sm text-green-400">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {[
              { label: 'Username', name: 'username', type: 'text', placeholder: 'Choose a username' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com' },
              { label: 'Password', name: 'password', type: 'password', placeholder: 'Min 6 characters' },
              { label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: 'Repeat password' },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-sm font-medium text-gray-300">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  required
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-xl border border-dark-700 bg-dark-900 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full justify-center rounded-xl bg-brand-primary px-4 py-3.5 text-base font-bold text-white transition hover:bg-indigo-700 shadow-glow-indigo disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-white border-transparent" />
              ) : (
                <span className="flex items-center space-x-2">
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
