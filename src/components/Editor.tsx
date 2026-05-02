import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Save, Moon, Sun, Heart, Cloud, Zap, Flame, Ghost, Coffee } from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';

const MOODS = [
  { label: 'Peaceful', icon: Moon },
  { label: 'Happy', icon: Sun },
  { label: 'Loving', icon: Heart },
  { label: 'Dreamy', icon: Cloud },
  { label: 'Energetic', icon: Zap },
  { label: 'Passionate', icon: Flame },
  { label: 'Mysterious', icon: Ghost },
  { label: 'Cozy', icon: Coffee },
];

export default function Editor({ userId, profile }: { userId: string; profile: UserProfile | null }) {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Peaceful');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'users', userId, 'entries'), {
        userId, content, date: new Date().toISOString(), mood, createdAt: serverTimestamp(),
      });
      setSaved(true);
      setContent('');
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-4">
        <span className="text-7xl font-serif font-black text-stone-100 italic">{new Date().getDate()}</span>
        <div className="flex flex-col">
          <span className="text-copper font-bold uppercase tracking-widest text-xs">
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
          </span>
          <span className="text-stone-400 font-serif italic text-xl">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        {MOODS.map(({ label, icon: Icon }) => (
          <button key={label} onClick={() => setMood(label)}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              mood === label ? 'bg-copper text-white' : 'bg-white/5 text-stone-400 hover:bg-white/10')}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="glass-card p-8">
        <textarea value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your story..."
          className="w-full bg-transparent border-none text-xl font-serif leading-relaxed text-stone-200 outline-none h-64 resize-none placeholder:text-stone-600" />
        <div className="flex justify-between items-center mt-8">
          <span className="text-stone-600 text-sm">{content.length} characters</span>
          <button onClick={handleSave} disabled={saving || !content.trim()}
            className="px-8 py-3 bg-copper text-white rounded-2xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Save size={18} />
            {saving ? 'Saving...' : saved ? 'Saved! ✓' : 'Save Story'}
          </button>
        </div>
      </div>
    </div>
  );
}
