"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function WelcomeBanner() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(format(new Date(), 'EEEE, MMMM do, yyyy'));
  }, []);

  return (
    <div className="p-6 rounded-lg bg-primary text-primary-foreground shadow">
      <h1 className="text-2xl md:text-3xl font-bold font-headline">
        Welcome back, Jane!
      </h1>
      <p className="text-sm md:text-base text-primary-foreground/80 mt-1">
        {currentDate ? currentDate : 'Loading date...'}
      </p>
    </div>
  );
}
