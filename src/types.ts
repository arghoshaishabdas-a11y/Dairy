export interface UserProfile {
  userId: string;
  email: string;
  nickname?: string;
  photoURL?: string;
  streak: number;
  lastWroteAt: string | null;
  settings: {
    notificationTime: string;
    darkMode: boolean;
  };
  createdAt: any;
}

export interface Feedback {
  score: number;
  creativity: string;
  emotionalDepth: string;
  clarity: string;
  vocabulary: string;
  suggestions: string[];
}

export interface GrammarCorrection {
  error: string;
  suggestion: string;
  explanation: string;
  type: 'spelling' | 'grammar';
}

export interface DiaryEntry {
  id: string;
  userId: string;
  content: string;
  date: string;
  mood?: string;
  rating?: number;
  feedback?: Feedback;
  grammarCorrections?: GrammarCorrection[];
  createdAt: any;
  updatedAt: any;
}
