import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

interface CustomCalendarProps {
  selectedMonthRaw: string;
  onMonthChange: (val: string) => void;
}

export function CustomCalendar({ selectedMonthRaw, onMonthChange }: CustomCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Parse YYYY-MM
  const [yearStr, monthStr] = selectedMonthRaw.split('-');
  const currentYear = parseInt(yearStr, 10);
  const currentMonthIndex = parseInt(monthStr, 10) - 1; // 0-based

  const currentDate = new Date(currentYear, currentMonthIndex, 1);
  const monthName = currentDate.toLocaleString('en-US', { month: 'long' });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    let y = currentYear;
    let m = currentMonthIndex - 1;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    const val = `${y}-${String(m + 1).padStart(2, '0')}`;
    onMonthChange(val);
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    let y = currentYear;
    let m = currentMonthIndex + 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
    const val = `${y}-${String(m + 1).padStart(2, '0')}`;
    onMonthChange(val);
  };

  const today = new Date();
  
  // Calculate days to display in the grid
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
  // We want to show from Sunday to Saturday 
  
  const daysArray = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null); // empty slots
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  const handleSelectDay = (day: number | null) => {
    if (day) {
      // Even if they click a day, it just keeps the same month for our tool
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all px-5 py-3 rounded-2xl backdrop-blur-md border border-white/30 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
      >
        <CalendarIcon className="w-5 h-5 text-white opacity-80" />
        <span 
          className="font-bold tracking-wide text-white capitalize"
          style={{ fontFamily: "'Setta', cursive", fontSize: '1.4rem' }}
        >
          {currentDate.toLocaleString('fr-FR', { month: 'short' })} {currentYear}
        </span>
      </div>

      {/* Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 bg-[#fdfcff] rounded-3xl p-6 shadow-[0_10px_40px_rgba(150,140,180,0.25)] z-50 w-[320px] text-[#554e70] border border-[#f3ebfa] animate-in fade-in slide-in-from-top-4 duration-300">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <Sparkles className="w-5 h-5 text-[#f4a1cc] opacity-70" fill="currentColor" />
            <div className="text-lg font-semibold tracking-wide" style={{ fontFamily: 'sans-serif' }}>
              {monthName} {currentYear}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-[#f2ebf9] rounded-full transition-colors text-gray-400 hover:text-gray-700">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleNextMonth} className="p-1 hover:bg-[#f2ebf9] rounded-full transition-colors text-gray-400 hover:text-gray-700">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 text-center mb-4">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className="text-xs font-medium text-gray-400 uppercase">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {daysArray.map((day, idx) => {
              const isToday = day === today.getDate() && currentMonthIndex === today.getMonth() && currentYear === today.getFullYear();
              // Just pseudo-select the 24th if it's the current month for the screenshot vibe, or highlight today.
              const isSelected = day === (today.getDate() || 24); 

              let btnClass = "w-9 h-9 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer ";
              if (!day) {
                return <div key={idx} className="w-9 h-9" />;
              }

              if (isToday) {
                btnClass += "bg-[#a9c0fc] text-white shadow-[0_2px_10px_rgba(169,192,252,0.4)]";
              } else {
                btnClass += "text-[#6b6287] hover:bg-[#f4f0fa] hover:text-[#554e70]";
              }

              return (
                <div 
                  key={idx} 
                  onClick={() => handleSelectDay(day)}
                  className={btnClass}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
