
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { format, eachDayOfInterval } from 'date-fns';

type SubjectInfo = {
  subject: string;
  teacher?: string;
  originalTeacher?: string;
  room?: string;
};

type DaySchedule = {
  [day: string]: SubjectInfo;
};

export type Schedule = {
  [time: string]: DaySchedule;
};

export type BatchTimetables = {
  [batchName: string]: Schedule;
};


interface TimetableContextType {
  schedule: Schedule;
  setSchedule: (schedule: Schedule) => void;
  batches: string[];
  setBatches: (batches: string[]) => void;
  getTodaysSchedule: () => any[];
  absentClasses: string[];
  toggleAbsence: (subject: string) => void;
  assignProxy: (originalTeacher: string, proxyTeacher: string, startDate: Date, endDate: Date) => void;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

const initialSchedule: Schedule = {
  "9:00 AM": {
    Monday: { subject: "Advanced Calculus", teacher: "Dr. Smith", room: "Room 201" },
    Tuesday: { subject: "Quantum Physics", teacher: "Prof. Johnson", room: "Room 303" },
    Wednesday: { subject: "Data Structures", teacher: "Dr. Evelyn Reed", room: "Room 105" },
    Thursday: { subject: "Advanced Calculus", teacher: "Dr. Smith", room: "Room 201" },
    Friday: { subject: "Quantum Physics", teacher: "Prof. Johnson", room: "Room 303" },
  },
  "10:00 AM": {
    Monday: { subject: "Quantum Physics", teacher: "Prof. Johnson", room: "Room 303" },
    Tuesday: { subject: "Data Structures", teacher: "Dr. Evelyn Reed", room: "Room 105" },
    Wednesday: { subject: "Advanced Calculus", teacher: "Dr. Smith", room: "Room 201" },
    Thursday: { subject: "Quantum Physics", teacher: "Prof. Johnson", room: "Room 303" },
    Friday: { subject: "Data Structures", teacher: "Dr. Evelyn Reed", room: "Room 105" },
  },
    "11:00 AM": {
    Monday: { subject: "History", teacher: "Prof. Carter", room: "Room 112" },
    Tuesday: { subject: "English", teacher: "Dr. Maria Garcia", room: "Room 208" },
    Wednesday: { subject: "Biology", teacher: "Dr. Aisha Khan", room: "Lab 2" },
    Thursday: { subject: "History", teacher: "Prof. Carter", room: "Room 112" },
    Friday: { subject: "English", teacher: "Dr. Maria Garcia", room: "Room 208" },
  },
  "12:00 PM": {
    Monday: { subject: "Break" },
    Tuesday: { subject: "Break" },
    Wednesday: { subject: "Break" },
    Thursday: { subject: "Break" },
    Friday: { subject: "Break" },
  },
  "1:00 PM": {
    Monday: { subject: "Data Structures", teacher: "Dr. Evelyn Reed", room: "Room 105" },
    Tuesday: { subject: "Advanced Calculus", teacher: "Dr. Smith", room: "Room 201" },
    Wednesday: { subject: "Quantum Physics", teacher: "Prof. Johnson", room: "Room 303" },
    Thursday: { subject: "Data Structures", teacher: "Dr. Evelyn Reed", room: "Room 105" },
    Friday: { subject: "Advanced Calculus", teacher: "Dr. Smith", room: "Room 201" },
  },
   "2:00 PM": {
    Monday: { subject: "University Choir Practice", teacher: "Mr. Davis", room: "Music Hall" },
    Tuesday: { subject: "Debate Club", teacher: "Ms. Wallace", room: "Auditorium" },
    Wednesday: { subject: "Robotics Club", teacher: "Dr. Chen", room: "Engg. Lab" },
    Thursday: { subject: "Photography Club", teacher: "Ms. Anya", room: "Art Studio" },
    Friday: { subject: "Guest Lecture", teacher: "Dr. Kenji", room: "Hall 7" },
  },
  "3:00 PM": {
    Monday: { subject: "Biology", teacher: "Dr. Aisha Khan", room: "Lab 2" },
    Tuesday: { subject: "History", teacher: "Prof. Carter", room: "Room 112" },
    Wednesday: { subject: "English", teacher: "Dr. Maria Garcia", room: "Room 208" },
    Thursday: { subject: "Biology", teacher: "Dr. Aisha Khan", room: "Lab 2" },
    Friday: { subject: "History", teacher: "Prof. Carter", room: "Room 112" },
  },
  "4:00 PM": {
    Monday: { subject: "English", teacher: "Dr. Maria Garcia", room: "Room 208" },
    Tuesday: { subject: "Biology", teacher: "Dr. Aisha Khan", room: "Lab 2" },
    Wednesday: { subject: "History", teacher: "Prof. Carter", room: "Room 112" },
    Thursday: { subject: "English", teacher: "Dr. Maria Garcia", room: "Room 208" },
    Friday: { subject: "Break" },
  }
};


export const TimetableProvider = ({ children }: { children: ReactNode }) => {
  const [schedule, setSchedule] = useState<Schedule>(initialSchedule);
  const [absentClasses, setAbsentClasses] = useState<string[]>([]);
  const [batches, setBatches] = useState<string[]>(['Computer Science 2023']);

  const getTodaysSchedule = useCallback(() => {
    const today = format(new Date(), 'EEEE'); // e.g., "Monday"
    const now = new Date();

    if (!Object.keys(schedule).length) return [];

    const todaysClasses = Object.entries(schedule).map(([time, daySchedule]) => {
      const classInfo = daySchedule[today];
      if (!classInfo || classInfo.subject === "Break") return null;

      const [startTimeStr] = time.split(' - ');
      const dateWithTime = new Date();
      const timeParts = startTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/);

      if (timeParts) {
        let [_, hour, minute, ampm] = timeParts;
        let hourNum = parseInt(hour, 10);
        if (ampm === 'PM' && hourNum !== 12) hourNum += 12;
        if (ampm === 'AM' && hourNum === 12) hourNum = 0;
        dateWithTime.setHours(hourNum, parseInt(minute, 10), 0, 0);
      } else {
         const [hour, minute] = startTimeStr.split(':').map(Number);
         dateWithTime.setHours(hour, minute, 0, 0);
      }

      const status = now >= dateWithTime ? "Ongoing" : "Upcoming";

      return {
        time: time,
        subject: classInfo.subject,
        teacher: classInfo.teacher,
        isProxy: !!classInfo.originalTeacher,
        room: classInfo.room || `Room ${(Math.floor(Math.random() * 3) + 1)}0${Math.floor(Math.random() * 9) + 1}`,
        status: status
      };
    }).filter(Boolean);

    return todaysClasses as any[];
  }, [schedule]);

  const toggleAbsence = (subject: string) => {
    setAbsentClasses(prev => 
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };
  
  const assignProxy = (originalTeacher: string, proxyTeacher: string, startDate: Date, endDate: Date) => {
    const datesToUpdate = eachDayOfInterval({ start: startDate, end: endDate });

    setSchedule(currentSchedule => {
        const newSchedule = JSON.parse(JSON.stringify(currentSchedule));

        for (const date of datesToUpdate) {
            const dayOfWeek = format(date, 'EEEE'); // e.g., "Monday"
            
            for (const time in newSchedule) {
                if (newSchedule[time][dayOfWeek] && newSchedule[time][dayOfWeek].teacher === originalTeacher) {
                    newSchedule[time][dayOfWeek] = {
                        ...newSchedule[time][dayOfWeek],
                        teacher: proxyTeacher,
                        originalTeacher: originalTeacher,
                    };
                }
            }
        }
        return newSchedule;
    });
  }


  return (
    <TimetableContext.Provider value={{ schedule, setSchedule, batches, setBatches, getTodaysSchedule, absentClasses, toggleAbsence, assignProxy }}>
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
