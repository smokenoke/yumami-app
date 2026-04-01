"use client";

import { useMemo, useState } from "react";

import type { CalendarEvent } from "@/types/domain";

interface CalendarViewProps {
  events: CalendarEvent[];
}

type CalendarGranularity = "month" | "week" | "agenda";

function startOfDay(value: Date) {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatMonthLabel(value: Date) {
  return new Intl.DateTimeFormat("en-BE", {
    month: "long",
    year: "numeric",
  }).format(value);
}

function formatDayLabel(value: Date) {
  return new Intl.DateTimeFormat("en-BE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(value);
}

function formatTimeLabel(value: string) {
  return new Intl.DateTimeFormat("en-BE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildMonthGrid(anchor: Date) {
  const firstOfMonth = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const offset = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - offset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

export function CalendarView({ events }: CalendarViewProps) {
  const initialAnchor = events[0]?.starts_at ? new Date(events[0].starts_at) : new Date();
  const [granularity, setGranularity] = useState<CalendarGranularity>("month");
  const [anchorDate, setAnchorDate] = useState(startOfDay(initialAnchor));

  const monthGrid = useMemo(() => buildMonthGrid(anchorDate), [anchorDate]);
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => {
      const base = new Date(anchorDate);
      const mondayOffset = (base.getDay() + 6) % 7;
      base.setDate(base.getDate() - mondayOffset + index);
      return startOfDay(base);
    }),
    [anchorDate],
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();

    for (const event of events) {
      const key = startOfDay(new Date(event.starts_at)).toISOString();
      const existing = map.get(key) ?? [];
      existing.push(event);
      existing.sort((left, right) => left.starts_at.localeCompare(right.starts_at));
      map.set(key, existing);
    }

    return map;
  }, [events]);

  function shift(direction: "back" | "forward") {
    const next = new Date(anchorDate);

    if (granularity === "week") {
      next.setDate(anchorDate.getDate() + (direction === "forward" ? 7 : -7));
    } else {
      next.setMonth(anchorDate.getMonth() + (direction === "forward" ? 1 : -1));
    }

    setAnchorDate(startOfDay(next));
  }

  return (
    <div className="rounded-[1.9rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-5 py-5 shadow-[var(--shadow-soft)] sm:px-6 sm:py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Calendar</p>
          <p className="mt-1 text-sm text-[var(--muted-ink)]">
            Month for overview, week for planning, agenda for detail.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(["month", "week", "agenda"] as CalendarGranularity[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setGranularity(option)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                granularity === option
                  ? "bg-[var(--accent-deep)] text-white"
                  : "border border-[var(--border-soft)] bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {option === "agenda" ? "Agenda" : option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">
            {granularity === "week"
              ? `${formatDayLabel(weekDays[0])} - ${formatDayLabel(weekDays[6])}`
              : formatMonthLabel(anchorDate)}
          </p>
          <p className="mt-1 text-sm text-[var(--muted-ink)]">
            {events.length} upcoming event{events.length === 1 ? "" : "s"}
          </p>
        </div>
        {granularity !== "agenda" ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => shift("back")}
              className="rounded-full border border-[var(--border-soft)] bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setAnchorDate(startOfDay(new Date()))}
              className="rounded-full border border-[var(--border-soft)] bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => shift("forward")}
              className="rounded-full border border-[var(--border-soft)] bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>

      {granularity === "month" ? (
        <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-[var(--border-strong)] bg-[var(--surface-muted)]">
          <div className="grid grid-cols-7 border-b border-[var(--border-strong)] bg-white/85">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthGrid.map((day) => {
              const dayEvents = eventsByDay.get(day.toISOString()) ?? [];
              const isCurrentMonth = day.getMonth() === anchorDate.getMonth();
              const isToday = sameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-32 border-b border-r border-[var(--border-strong)] px-2.5 py-2.5 ${
                    isCurrentMonth ? 'bg-white/78' : 'bg-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                        isToday
                          ? 'bg-[var(--accent-deep)] text-white'
                          : isCurrentMonth
                            ? 'text-slate-900'
                            : 'text-slate-400'
                      }`}
                    >
                      {day.getDate()}
                    </span>
                    {dayEvents.length > 0 ? (
                      <span className="rounded-full bg-[var(--accent-quiet)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-deep)]">
                        {dayEvents.length}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2.5 space-y-1.5">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div key={event.id} className="rounded-xl border border-white/80 bg-white px-2.5 py-2 text-xs text-slate-700 shadow-sm">
                        <p className="line-clamp-2 font-medium text-slate-900">{event.title}</p>
                        <p className="mt-1 text-[11px] text-slate-500">{formatTimeLabel(event.starts_at)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {granularity === "week" ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {weekDays.map((day) => {
            const dayEvents = eventsByDay.get(day.toISOString()) ?? [];

            return (
              <div key={day.toISOString()} className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">{formatDayLabel(day)}</p>
                <div className="mt-3 space-y-2">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => (
                      <div key={event.id} className="rounded-[1rem] border border-white/80 bg-white px-3 py-3 text-sm text-slate-700 shadow-sm">
                        <p className="font-medium text-slate-900">{event.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{formatTimeLabel(event.starts_at)}</p>
                        {event.location ? <p className="mt-1 text-xs text-slate-500">{event.location}</p> : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-[var(--muted-ink)]">No events scheduled.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {granularity === "agenda" ? (
        <div className="mt-5 space-y-3">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{event.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted-ink)]">{formatDayLabel(new Date(event.starts_at))} at {formatTimeLabel(event.starts_at)}</p>
                    {event.location ? <p className="mt-2 text-sm text-[var(--muted-ink)]">{event.location}</p> : null}
                    {event.notes ? <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">{event.notes}</p> : null}
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    {event.source_kind}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.4rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-5 text-sm leading-6 text-[var(--muted-ink)]">
              No upcoming events yet.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
