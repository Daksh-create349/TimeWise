
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface AttendanceSession {
  subject: string;
  question: string;
  answer: string;
}

interface AttendanceContextType {
  activeSession: AttendanceSession | null;
  presentStudents: string[];
  startAttendance: (session: AttendanceSession) => void;
  submitAnswer: (subject: string, answer: string) => boolean;
  closeAttendance: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  const [presentStudents, setPresentStudents] = useState<string[]>([]);

  const startAttendance = (session: AttendanceSession) => {
    setActiveSession(session);
    // When a new session starts, we can clear the present list for that subject
    setPresentStudents(prev => prev.filter(s => s !== session.subject));
  };

  const submitAnswer = (subject: string, answer: string): boolean => {
    if (activeSession && activeSession.subject === subject && activeSession.answer.toLowerCase() === answer.toLowerCase()) {
      if (!presentStudents.includes(subject)) {
        setPresentStudents(prev => [...prev, subject]);
      }
      return true;
    }
    return false;
  };
  
  const closeAttendance = () => {
      setActiveSession(null);
  }

  return (
    <AttendanceContext.Provider value={{ activeSession, presentStudents, startAttendance, submitAnswer, closeAttendance }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
