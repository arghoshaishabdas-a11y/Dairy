import React, { useState } from 'react';
import { UserProfile } from '../types';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Save, ShieldOff, ShieldCheck, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { usePinLock } from './PinLockProvider';

interface SettingsProps {
  profile: UserProfile | null;
  onUpdate: (profile: UserProfile) => void;
}

export default function Settings({ profile, onUpdate }: SettingsProps) {
  const { savedPin, clearPin, setIsSettingPin } = usePinLock();
  const [nickname, setNickname] = useState(profile?.nickname || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width, height = img.height;
        const maxDim = 200;
        if (width > height) { if (width > maxDim) { height *= maxDim / width; width = maxDim; } }
        else { if (height > maxDim) { width *= maxDim / height; height = maxDim; } }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
        setPhotoURL(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', profile.userId), { nickname, photoURL });
      onUpdate({ ...profile, nickname, photoURL });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-3xl font-serif italic text-stone-100">Settings</h2>

      <div className="glass-card p-8 space-y-6">
        <div className="flex items-center gap-3">
          <UserIcon className="text-copper" size={20} />
          <h3 className="text-stone-100 font-medium">Profile</h3>
        </div>

        <div className="flex items-center gap-6">
          <div onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-2xl bg-white/10 overflow-hidden cursor-pointer hover:ring-2 ring-copper transition-all flex items-center justify-center">
            {photoURL
              ? <img src={photoURL} alt="avatar" className="w-full h-full object-cover" />
              : <UserIcon className="text-stone-500" size={32} />}
          </div>
          <div>
            <p className="text-stone-300 text-sm font-medium">Profile Photo</p>
            <p className="text-stone-600 text-xs">Click to upload</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>

        <div>
          <label className="text-stone-400 text-sm block mb-2">Display Name</label>
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-stone-200 outline-none focus:border-copper/50 transition-all"
            placeholder="Your name" />
        </div>

        <motion.button whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
          className="px-6 py-3 bg-copper text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>

      <div className="glass-card p-8 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-copper" size={20} />
          <h3 className="text-stone-100 font-medium">Security</h3>
        </div>
        {savedPin ? (
          <div className="flex flex-col gap-3">
            <p className="text-stone-400 text-sm">PIN lock is enabled.</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => setIsSettingPin(true)}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-stone-300 rounded-xl text-sm font-medium transition-all">
                Change PIN
              </button>
              <button onClick={() => { if (confirm('Remove PIN lock?')) clearPin(); }}
                className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center gap-2 transition-all">
                <ShieldOff size={14} /> Remove PIN
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-stone-400 text-sm mb-3">Protect your diary with a 4-digit PIN.</p>
            <button onClick={() => setIsSettingPin(true)}
              className="px-5 py-2.5 bg-copper/10 hover:bg-copper/20 text-copper rounded-xl text-sm font-medium flex items-center gap-2 transition-all">
              <ShieldCheck size={14} /> Enable PIN Lock
            </button>
          </div>
        )}
      </div>
    </div>
  );
      }
