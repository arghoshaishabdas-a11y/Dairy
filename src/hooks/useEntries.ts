import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { DiaryEntry } from '../types';

export function useEntries(userId: string) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'users', userId, 'entries'),
      orderBy('date', 'desc'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DiaryEntry[];
      setEntries(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError(err as Error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { entries, loading, error };
}
