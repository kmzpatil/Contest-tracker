'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { Zap } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Include an uppercase letter and a number');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      login(data.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Brand Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-10"
      >
        <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center">
          <Zap size={22} fill="currentColor" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">VoidTrack</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[440px] luxury-card bg-zinc-950 p-10 shadow-2xl"
      >
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-zinc-500 text-sm font-medium">Join the next generation of competition tracking.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-semibold"
            >
              Registration failed: {error}
            </motion.div>
          )}
          
          <Input 
            label="Full Name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="John Doe"
            required
            fullWidth
          />

          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="name@example.com"
            required
            fullWidth
          />
          
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            required
            fullWidth
          />

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-4">
            Create Account
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-zinc-500 text-sm font-medium">
            Already have an account? <Link href="/login" className="text-white hover:underline underline-offset-4 transition-colors">Sign in instead</Link>
          </p>
        </div>
      </motion.div>

      <p className="mt-8 text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
        Secure Enrollment v2.4.0
      </p>
    </div>
  );
}
