
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { format } from 'date-fns';

type SubjectInfo = {
  subject: string;
  teacher: string;
};

type DaySchedule = {
  [day: string]: SubjectInfo;
};

export type Schedule = {
  [time: string]: DaySchedule;
};

interface TimetableContextType {
  schedule: Schedule;
  setSchedule: (schedule: Schedule) => void;
  getTodaysSchedule: () => any[];
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

const initialSchedule: Schedule = {
  "09:00 - 10:30": {
    Monday: { subject: "Advanced Calculus", teacher: "Dr. Smith" },
    Tuesday: { subject: "Quantum Physics", teacher: "Prof. Johnson" },
    Wednesday: { subject: "Data Structures", teacher: "Dr. Evelyn Reed" },
    Thursday: { subject: "Advanced Calculus", teacher: "Dr. Smith" },
    Friday: { subject: "Quantum Physics", teacher: "Prof. Johnson" },
  },
  "11:00 - 12:30": {
    Monday: { subject: "Quantum Physics", teacher: "Prof. Johnson" },
    Tuesday: { subject: "Data Structures", teacher: "Dr. Evelyn Reed" },
    Wednesday: { subject: "Advanced Calculus", teacher: "Dr. Smith" },
    Thursday: { subject: "Quantum Physics", teacher: "Prof. Johnson" },
    Friday: { subject: "Data Structures", teacher: "Dr. Evelyn Reed" },
  },
  "12:30 - 14:00": {
    Monday: { subject: "Break", teacher: "" },
    Tuesday: { subject: "Break", teacher: "" },
    Wednesday: { subject: "Break", teacher: "" },
    Thursday: { subject: "Break", teacher: "" },
    Friday: { subject: "Break", teacher: "" },
  },
  "14:00 - 15:30": {
    Monday: { subject: "Data Structures", teacher: "Dr. Evelyn Reed" },
    Tuesday: { subject: "Advanced Calculus", teacher: "Dr. Smith" },
    Wednesday: { subject: "Quantum Physics", teacher: "Prof. Johnson" },
    Thursday: { subject: "Data Structures", teacher: "Dr. Evelyn Reed" },
    Friday: { subject: "Advanced Calculus", teacher: "Dr. Smith" },
  },
   "16:00 - 17:00": {
    Monday: { subject: "University Choir Practice", teacher: "Mr. Davis" },
    Tuesday: { subject: "Debate Club", teacher: "Ms. Wallace" },
    Wednesday: { subject: "Robotics Club", teacher: "Dr. Chen" },
    Thursday: { subject: "Photography Club", teacher: "Ms. Anya" },
    Friday: { subject: "Guest Lecture", teacher: "Dr. Kenji" },
  },
};


export const TimetableProvider = ({ children }: { children: ReactNode }) => {
  const [schedule, setSchedule] = useState<Schedule>(initialSchedule);

  const getTodaysSchedule = useCallback(() => {
    const today = format(new Date(), 'EEEE'); // e.g., "Monday"
    const now = new Date();

    if (!Object.values(schedule).length) return [];

    const todaysClasses = Object.entries(schedule).map(([time, daySchedule]) => {
      const classInfo = daySchedule[today];
      if (!classInfo || classInfo.subject === "Break") return null;

      const [startTimeStr] = time.split(' - ');
      const [startHour, startMinute] = startTimeStr.split(':').map(Number);
      
      const classStartTime = new Date();
      classStartTime.setHours(startHour, startMinute, 0, 0);

      const status = now >= classStartTime ? "Ongoing" : "Upcoming";

      return {
        time: time,
        subject: classInfo.subject,
        room: `Room ${(Math.floor(Math.random() * 3) + 1)}0${Math.floor(Math.random() * 9) + 1}`,
        status: status
      };
    }).filter(Boolean);

    return todaysClasses as any[];
  }, [schedule]);


  return (
    <TimetableContext.Provider value={{ schedule, setSchedule, getTodaysSchedule }}>
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};
