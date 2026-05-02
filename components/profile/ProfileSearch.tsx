'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, User, Trophy, BarChart, Hash, ExternalLink, ShieldAlert } from 'lucide-react';

export function ProfileSearch() {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/profile/${encodeURIComponent(handle)}`);
      if (!res.ok) {
        throw new Error('NODE_NOT_FOUND: Failed to resolve handle.');
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end glass-card p-6 rounded-3xl border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-focus-within:opacity-30 transition-opacity">
          <Search size={120} className="text-accent-cyan" />
        </div>
        
        <div className="flex-1 w-full relative z-10">
          <Input 
            label="TARGET_HANDLE" 
            type="text" 
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="E.g., tourist, benq, neal..."
            required
            fullWidth
            className="bg-black/40 border-white/10 focus:border-accent-cyan/50 transition-all font-mono"
          />
        </div>
        <Button 
          type="submit" 
          loading={loading} 
          className="h-14 px-10 rounded-2xl bg-accent-cyan text-black font-black uppercase tracking-[0.2em] hover:shadow-[0_0_25px_rgba(0,245,255,0.4)] relative z-10"
        >
          EXECUTE_QUERY
        </Button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-2xl bg-accent-magenta/10 border border-accent-magenta/30 flex items-center gap-4 text-accent-magenta font-black uppercase tracking-widest text-xs font-mono"
          >
            <ShieldAlert size={20} />
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div 
            className="grid grid-cols-1 xl:grid-cols-2 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
          >
            {/* Codeforces Node */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
              className="group relative"
            >
              <div className="glass-card hud-corners p-8 rounded-3xl border-white/5 h-full relative overflow-hidden transition-all duration-500 hover:border-accent-cyan/30 hover:shadow-[0_0_40px_rgba(26,140,255,0.15)]">
                {result.codeforces ? (
                  <>
                    <div className="absolute -top-10 -right-10 text-[100px] font-black text-white/[0.02] pointer-events-none group-hover:text-accent-cyan/[0.05] transition-colors">CF</div>
                    
                    <div className="flex items-center gap-6 mb-10 relative z-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-accent-cyan blur-[15px] opacity-20 animate-pulse" />
                        <img 
                          src={result.codeforces.avatar || 'https://placeholder.com/100'} 
                          alt="CF Avatar" 
                          className="w-20 h-20 rounded-2xl border-2 border-accent-cyan/40 relative z-10 object-cover shadow-2xl" 
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,245,255,1)]" />
                          <span className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.3em] font-mono">CODEFORCES_PROTOCOL</span>
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">{result.codeforces.handle}</h3>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{result.codeforces.rank || 'UNRANKED'}</span>
                      </div>
                      <a href={`https://codeforces.com/profile/${result.codeforces.handle}`} target="_blank" className="ml-auto p-3 rounded-xl bg-white/5 hover:bg-accent-cyan hover:text-black transition-all">
                        <ExternalLink size={18} />
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                      <StatBlock label="CURRENT_RATING" value={result.codeforces.rating} color="text-accent-cyan" icon={Trophy} />
                      <StatBlock label="PEAK_PERFORMANCE" value={result.codeforces.maxRating} color="text-white" icon={BarChart} />
                      <StatBlock label="CONTEST_COUNT" value={result.codeforces.contests} color="text-white" icon={Hash} />
                      <StatBlock label="SYSTEM_RANK" value={result.codeforces.rank} color="text-slate-400" icon={User} />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 py-12 italic uppercase font-mono text-xs tracking-widest">
                    Codeforces Node Offline
                  </div>
                )}
              </div>
            </motion.div>

            {/* LeetCode Node */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0 }
              }}
              className="group relative"
            >
              <div className="glass-card hud-corners p-8 rounded-3xl border-white/5 h-full relative overflow-hidden transition-all duration-500 hover:border-accent-orange/30 hover:shadow-[0_0_40px_rgba(255,161,22,0.15)]">
                {result.leetcode ? (
                  <>
                    <div className="absolute -top-10 -right-10 text-[100px] font-black text-white/[0.02] pointer-events-none group-hover:text-accent-orange/[0.05] transition-colors">LC</div>
                    
                    <div className="flex items-center gap-6 mb-10 relative z-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-accent-orange blur-[15px] opacity-20 animate-pulse" />
                        <img 
                          src={result.leetcode.avatar || 'https://placeholder.com/100'} 
                          alt="LC Avatar" 
                          className="w-20 h-20 rounded-2xl border-2 border-accent-orange/40 relative z-10 object-cover shadow-2xl" 
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-orange shadow-[0_0_8px_rgba(255,161,22,1)]" />
                          <span className="text-[10px] font-black text-accent-orange uppercase tracking-[0.3em] font-mono">LEETCODE_PROTOCOL</span>
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">{result.leetcode.handle}</h3>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">MASTER_SOLVER</span>
                      </div>
                      <a href={`https://leetcode.com/${result.leetcode.handle}`} target="_blank" className="ml-auto p-3 rounded-xl bg-white/5 hover:bg-accent-orange hover:text-black transition-all">
                        <ExternalLink size={18} />
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                      <StatBlock label="CONTEST_RATING" value={result.leetcode.rating} color="text-accent-orange" icon={Trophy} />
                      <StatBlock label="GLOBAL_RANK" value={result.leetcode.rank || 'N/A'} color="text-white" icon={Hash} />
                      <StatBlock label="SOLVED_NODES" value={result.leetcode.solved} color="text-white" icon={BarChart} />
                      <StatBlock label="STATUS" value="ACTIVE" color="text-accent-green" icon={Activity} />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 py-12 italic uppercase font-mono text-xs tracking-widest">
                    LeetCode Node Offline
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBlock({ label, value, color, icon: Icon }: any) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 group/stat hover:bg-white/[0.04] transition-all">
      <div className="flex items-center gap-3 mb-3">
        <Icon size={12} className="text-slate-600 group-hover/stat:text-white transition-colors" />
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono">{label}</span>
      </div>
      <div className={`text-xl font-black uppercase tracking-tight ${color}`}>{value || '0'}</div>
    </div>
  );
}

function Activity({ size, className }: any) {
  return <BarChart size={size} className={className} />;
}
