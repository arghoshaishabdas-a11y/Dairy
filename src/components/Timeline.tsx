import React, { useState, useMemo } from 'react';
import { useEntries } from '../hooks/useEntries';
import { motion } from 'motion/react';
import { Search, Bell, ChevronRight } from 'lucide-react';
import { getFullDisplayDate } from '../lib/utils';

export default function Timeline({ userId }: { userId: string }) {
  const { entries, loading } = useEntries(userId);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() =>
    entries.filter(e => e.content.toLowerCase().includes(searchQuery.toLowerCase())),
    [entries, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
          <input type="text" placeholder="Search stories..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-stone-200 outline-none focus:border-copper/50 transition-all" />
        </div>
        <button className="p-3 bg-white/5 rounded-2xl text-stone-500 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-night-950" />
        </button>
      </div>

      {loading ? (
        <div className="text-center text-stone-500 py-12">Loading stories...</div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center text-stone-500 py-12 font-serif italic">
          {searchQuery ? 'No stories match your search.' : 'No stories yet. Start writing!'}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEntries.map((entry, i) => (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 flex justify-between items-center hover:bg-white/8 transition-all cursor-pointer">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center font-serif italic text-stone-100 font-bold text-lg shrink-0">
                  {new Date(entry.date).getDate()}
                </div>
                <div>
                  <p className="text-stone-300 font-serif italic line-clamp-1">{entry.content}</p>
                  <p className="text-stone-600 text-xs mt-1">{getFullDisplayDate(entry.date)}</p>
                  {entry.mood && <span className="text-copper text-xs">{entry.mood}</span>}
                </div>
              </div>
              <ChevronRight className="text-stone-600 shrink-0" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
          }
