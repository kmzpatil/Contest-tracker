'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { ShieldCheck, Cpu, Activity, RefreshCcw } from 'lucide-react';

export default function LoginPage() {
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

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      login(data.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-6 relative overflow-hidden mesh-bg">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative z-10">
        
        {/* Left Panel: Value Proposition */}
        <section className="bg-black/40 backdrop-blur-3xl p-12 flex flex-col justify-center border-r border-white/5 relative">
          <div className="absolute top-8 left-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.3em] text-white">VOID_TRACK</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-cyan mb-4 block tech-bracket">INTELLIGENCE_STREAM</span>
            <h1 className="text-4xl font-black text-white leading-tight mb-6 tracking-tighter">
              YOUR_DASHBOARD <br />
              <span className="text-transparent bg-clip-text bg-accent-gradient">SYNCS_ON_EACH_VISIT.</span>
            </h1>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
              Track multi-platform contests, monitor ratings, and analyze topic-wise performance from a single technical HUD.
            </p>

            <div className="grid grid-cols-1 gap-6">
              {[
                { icon: Activity, text: "LIVE_CONTEST_FEED + ONE_TAP_ALARMS" },
                { icon: Cpu, text: "SYNCED_CORE_PERFORMANCE" },
                { icon: RefreshCcw, text: "MANUAL_RELOAD_PROTOCOL" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent-cyan/50 transition-colors">
                    <item.icon size={18} className="text-accent-cyan opacity-70" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-white transition-colors">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Right Panel: Login Form */}
        <section className="bg-white/[0.02] backdrop-blur-2xl p-12 flex flex-col justify-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">ACCESS_TERMINAL</h2>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">ENTER_CREDENTIALS_FOR_DECRYPTION</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-accent-magenta/10 border border-accent-magenta/20 rounded-md text-accent-magenta text-[10px] font-black uppercase tracking-[0.2em]"
                >
                  ERROR_AUTH_FAILED: {error}
                </motion.div>
              )}
              
              <Input 
                label="ENCRYPTED_EMAIL" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="USER@NETWORK.VOID"
                required
                fullWidth
              />
              
              <Input 
                label="SECURITY_KEY" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
                fullWidth
              />

              <Button type="submit" loading={loading} fullWidth className="mt-8">
                INITIATE_SESSION
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center lg:text-left">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                NO_ACCOUNT? <Link href="/register" className="text-accent-cyan hover:text-white transition-colors">REGISTER_CITIZEN</Link>
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
