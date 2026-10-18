"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDates(baseDate: Date): Date[] {
  const day = baseDate.getDay();
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

interface SlotCard {
  id: string;
  code: string;
  name: string;
  time: string;
  venue: string;
  status: "scheduled" | "completed" | "in-progress" | "leave";
}

const DEMO_SLOTS: SlotCard[] = [
  {
    id: "1",
    code: "2627CSE001",
    name: "Data Structures",
    time: "09:00 AM - 10:00 AM",
    venue: "Room 301",
    status: "completed",
  },
  {
    id: "2",
    code: "2627CSE002",
    name: "Computer Networks",
    time: "10:00 AM - 11:00 AM",
    venue: "Room 205",
    status: "completed",
  },
  {
    id: "3",
    code: "2627CSE003",
    name: "Operating Systems Lab",
    time: "11:30 AM - 01:00 PM",
    venue: "Lab 4",
    status: "in-progress",
  },
  {
    id: "4",
    code: "2627HOS008",
    name: "Hostel Attendance",
    time: "09:00 PM - 05:59 AM",
    venue: "BoysHostel",
    status: "scheduled",
  },
];

const statusColors: Record<string, string> = {
  scheduled: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  completed: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  "in-progress": "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  leave: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

export function ScheduleView() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  if (!currentDate) return null;

  const weekDates = getWeekDates(currentDate);
  const today = currentDate;

  function navigateWeek(delta: number) {
    setCurrentDate((prev) => {
      if (!prev) return prev;
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7 * delta);
      return next;
    });
  }

  const monthYear = currentDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigateWeek(-1)}
          className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Previous week"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold uppercase tracking-wide">
          {monthYear}
        </h2>
        <button
          onClick={() => navigateWeek(1)}
          className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Next week"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mb-6 grid grid-cols-7 gap-2">
        {weekDates.map((date, i) => {
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = date.toDateString() === currentDate.toDateString();
          return (
            <button
              key={i}
              onClick={() => setCurrentDate(new Date(date))}
              className={`flex flex-col items-center rounded-lg px-2 py-3 text-sm transition-colors ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : isToday
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="text-xs font-medium uppercase">{DAYS[i]}</span>
              <span className="mt-1 text-lg font-semibold">
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {DEMO_SLOTS.map((slot) => (
          <div
            key={slot.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">{slot.code}</p>
                <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {slot.name}
                </h3>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[slot.status]}`}
              >
                {slot.status.replace("-", " ")}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {slot.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {slot.venue}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
