import React, { createContext, useContext, useState, useEffect } from 'react';

interface PinLockContextType {
  isLocked: boolean;
  savedPin: string | null;
  isSettingPin: boolean;
  setIsSettingPin: (val: boolean) => void;
  setIsLocked: (val: boolean) => void;
  clearPin: () => void;
  setSavedPin: (val: string | null) => void;
}

const PinLockContext = createContext<PinLockContextType | undefined>(undefined);

export function PinLockProvider({ children }: { children: React.ReactNode }) {
  const [savedPin, setSavedPin] = useState<string | null>(localStorage.getItem('storydiary_pin'));
  const [isLocked, setIsLocked] = useState(!!savedPin);
  const [isSettingPin, setIsSettingPin] = useState(false);

  useEffect(() => {
    if (savedPin) setIsLocked(true);
  }, []);

  const clearPin = () => {
    localStorage.removeItem('storydiary_pin');
    setSavedPin(null);
    setIsLocked(false);
  };

  return (
    <PinLockContext.Provider value={{
      isLocked, savedPin, isSettingPin, setIsSettingPin, setIsLocked, clearPin, setSavedPin
    }}>
      {children}
    </PinLockContext.Provider>
  );
}

export const usePinLock = () => useContext(PinLockContext)!;
