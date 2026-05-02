'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { UserPlus, ShieldCheck, Database, KeyRound } from 'lucide-react';

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
      setError('Password must include an uppercase letter and a number');
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
    <div className="min-h-screen bg-void flex items-center justify-center p-6 relative overflow-hidden mesh-bg">
      <div className="max-w-md w-full relative z-10">
        
        {/* Decorative Top Accents */}
        <div className="flex justify-between items-end mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent-cyan/10 border border-accent-cyan/30 rounded flex items-center justify-center">
              <UserPlus size={14} className="text-accent-cyan" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan">NEW_NODE_DETECTION</span>
          </div>
          <div className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">SEC_LVL_04</div>
        </div>

        <section className="bg-white/[0.02] backdrop-blur-3xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          {/* Animated background pulse */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[80px] -mr-16 -mt-16 animate-pulse" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">CITIZEN_REGISTRATION</h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">INITIALIZE_YOUR_VOID_IDENTITY</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-accent-magenta/10 border border-accent-magenta/20 rounded-md text-accent-magenta text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed"
                >
                  REGISTRATION_FAILURE: {error}
                </motion.div>
              )}
              
              <Input 
                label="LEGAL_NAME" 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="CITIZEN_NAME"
                required
                fullWidth
              />

              <Input 
                label="COMM_CHANNEL" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="USER@NETWORK.VOID"
                required
                fullWidth
              />
              
              <Input 
                label="ACCESS_KEY" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
                fullWidth
              />

              <Button type="submit" loading={loading} fullWidth className="mt-8">
                ENROLL_IN_NETWORK
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                EXISTING_IDENTITY? <Link href="/login" className="text-accent-cyan hover:text-white transition-colors">INITIATE_LOGIN</Link>
              </p>
            </div>
          </motion.div>
        </section>

        {/* HUD Bottom Decorator */}
        <div className="mt-6 flex justify-center gap-12 opacity-20">
          {[Database, ShieldCheck, KeyRound].map((Icon, i) => (
            <Icon key={i} size={16} className="text-slate-400" />
          ))}
        </div>
      </div>
    </div>
  );
}
