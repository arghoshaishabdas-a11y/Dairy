import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { usePinLock } from './PinLockProvider';

export default function PinLock({ children }: { children: React.ReactNode }) {
  const { isLocked, savedPin, isSettingPin, setIsSettingPin, setIsLocked, setSavedPin } = usePinLock();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePinInput = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin.length === 4) {
      if (isSettingPin) {
        localStorage.setItem('storydiary_pin', newPin);
        setSavedPin(newPin);
        setIsSettingPin(false);
        setIsLocked(false);
        setPin('');
      } else if (newPin === savedPin) {
        setIsLocked(false);
        setPin('');
      } else {
        setError(true);
        setTimeout(() => { setPin(''); setError(false); }, 1000);
      }
    }
  };

  const PinDots = () => (
    <div className="flex gap-4 mb-12">
      {[0,1,2,3].map(i => (
        <div key={i} className={`w-4 h-4 rounded-full border-2 border-copper transition-all ${pin.length > i ? 'bg-copper' : 'bg-transparent'}`} />
      ))}
    </div>
  );

  if (isSettingPin) return (
    <div className="fixed inset-0 z-[100] bg-night-950 flex flex-col items-center justify-center p-6 text-center">
      <Lock className="text-copper mb-6" size={48} />
      <h2 className="text-2xl font-serif italic text-stone-100 mb-2">Set Security PIN</h2>
      <p className="text-stone-500 mb-12">Choose a 4-digit PIN to protect your stories.</p>
      <PinDots />
      <div className="grid grid-cols-3 gap-6">
        {[1,2,3,4,5,6,7,8,9,'Cancel',0,'Clear'].map((val, i) => (
          <button key={i} onClick={() => {
            if (val === 'Cancel') setIsSettingPin(false);
            else if (val === 'Clear') setPin('');
            else handlePinInput(val.toString());
          }} className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-xl font-bold transition-all ${typeof val === 'number' ? 'bg-white/5 hover:bg-white/10 text-stone-100' : 'text-stone-500 text-sm'}`}>
            {val}
          </button>
        ))}
      </div>
    </div>
  );

  if (isLocked) return (
    <div className="fixed inset-0 z-[100] bg-night-950 flex flex-col items-center justify-center p-6 text-center">
      <Lock className={cn("text-copper mb-6", error && "animate-bounce")} size={48} />
      <h2 className="text-2xl font-serif italic text-stone-100 mb-2">Entry Locked</h2>
      <p className="text-stone-500 mb-12">Please enter your 4-digit PIN.</p>
      <PinDots />
      <div className="grid grid-cols-3 gap-6">
        {[1,2,3,4,5,6,7,8,9,'',0,'Clear'].map((val, i) => (
          <button key={i} onClick={() => {
            if (val === '') return;
            if (val === 'Clear') setPin('');
            else handlePinInput(val.toString());
          }} className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-xl font-bold transition-all ${typeof val === 'number' ? 'bg-white/5 hover:bg-white/10 text-stone-100' : 'text-stone-500 text-sm'}`}>
            {val}
          </button>
        ))}
      </div>
      <button onClick={() => { if (confirm("Reset PIN?")) { localStorage.removeItem('storydiary_pin'); location.reload(); }}} className="mt-12 text-stone-700 text-xs hover:text-stone-500 underline">
        Forgot PIN?
      </button>
    </div>
  );

  return <>{children}</>;
}
