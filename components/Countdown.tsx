
import React, { useState, useEffect } from 'react';
import { EVENT_DATE } from '../constants';

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +EVENT_DATE - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        // Event has started or passed
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft(); // Initial call
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="text-4xl md:text-6xl font-display text-[#5C2A11] tracking-tighter tabular-nums">
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-[10px] uppercase tracking-widest text-[#5C2A11]/50 font-bold">{label}</span>
    </div>
  );

  // Check if event has started/passed
  const eventHasPassed = +EVENT_DATE - +new Date() <= 0;

  if (eventHasPassed) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-3 bg-[#CC5500]/10 px-6 py-3 rounded-full border border-[#CC5500]/20">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-display text-xl text-[#5C2A11] uppercase tracking-wider">Event In Progress</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-4 md:gap-12 py-6">
      <TimeUnit value={timeLeft.days} label="Days" />
      <div className="text-2xl text-[#5C2A11]/20 mt-[-1rem]">:</div>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className="text-2xl text-[#5C2A11]/20 mt-[-1rem]">:</div>
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <div className="text-2xl text-[#5C2A11]/20 mt-[-1rem]">:</div>
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

export default Countdown;
