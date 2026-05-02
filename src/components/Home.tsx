import React from 'react';
import { motion } from 'motion/react';
import { PenLine, History, PieChart, ArrowRight } from 'lucide-react';

interface HomeProps {
  userName: string;
  onStart: () => void;
  onViewHistory: () => void;
  onViewStats: () => void;
}

export default function Home({ userName, onStart, onViewHistory, onViewStats }: HomeProps) {
  return (
    <div className="space-y-12 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <span className="text-copper font-medium tracking-[0.3em] uppercase text-xs">Welcome Back</span>
        <h1 className="text-5xl md:text-6xl font-serif italic text-stone-100">Hello, {userName}</h1>
        <p className="text-stone-400 text-lg max-w-xl mx-auto italic font-serif">
          "The historian will tell you what happened. The novelist will tell you how it felt."
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <motion.button whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }} onClick={onStart}
          className="group relative overflow-hidden glass-card p-10 text-left border-copper/30 bg-copper/5 hover:bg-copper/10 transition-all duration-500 flex flex-col justify-between min-h-[280px]">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <PenLine size={120} />
          </div>
          <div>
            <div className="w-14 h-14 bg-copper text-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <PenLine size={28} />
            </div>
            <h3 className="text-2xl font-serif text-stone-100 mb-2">New Chapter</h3>
            <p className="text-stone-400 text-sm leading-relaxed">Pour your thoughts onto the digital parchment. Capture today's feelings forever.</p>
          </div>
          <div className="flex items-center gap-2 text-copper font-bold text-sm uppercase tracking-widest mt-6">
            Start Writing <ArrowRight size={16} />
          </div>
        </motion.button>

        <div className="grid gap-6">
          {[
            { label: 'Memory Lane', sub: 'Relive your past entries', icon: History, action: onViewHistory },
            { label: 'Writing Pulse', sub: 'View your growth analytics', icon: PieChart, action: onViewStats },
          ].map(({ label, sub, icon: Icon, action }) => (
            <motion.button key={label} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }} onClick={action}
              className="glass-card p-6 flex items-center gap-6 text-left hover:bg-white/5 transition-all">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-stone-300">
                <Icon size={24} />
              </div>
              <div>
                <h4 className="text-stone-100 font-medium">{label}</h4>
                <p className="text-stone-500 text-xs mt-0.5">{sub}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
