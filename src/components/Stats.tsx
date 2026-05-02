import React from 'react';
import { UserProfile } from '../types';
import { useEntries } from '../hooks/useEntries';
import { Flame, BookOpen, TrendingUp } from 'lucide-react';

export default function Stats({ profile }: { profile: UserProfile | null }) {
  const { entries } = useEntries(profile?.userId || '');
  const totalWords = entries.reduce((acc, e) => acc + e.content.split(' ').length, 0);
  const avgWords = entries.length > 0 ? Math.round(totalWords / entries.length) : 0;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif italic text-stone-100">Your Writing Pulse</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: Flame, color: 'text-orange-500', label: 'Streak', value: `${profile?.streak || 0}`, sub: 'days' },
          { icon: BookOpen, color: 'text-indigo-400', label: 'Total Stories', value: `${entries.length}`, sub: 'entries' },
          { icon: TrendingUp, color: 'text-copper', label: 'Words Written', value: totalWords.toLocaleString(), sub: `avg ${avgWords} per entry` },
        ].map(({ icon: Icon, color, label, value, sub }) => (
          <div key={label} className="glass-card p-6 bg-white/5">
            <Icon className={`${color} mb-3`} size={28} />
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">{label}</h4>
            <p className="text-3xl font-serif text-stone-100">{value}</p>
            <p className="text-stone-500 text-sm">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
