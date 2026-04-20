import { useNavigate } from "react-router-dom";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { DecisionCard } from "@/components/DecisionCard";
import { useDecision } from "@/context/DecisionContext";
import { NotebookPen, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const startOfWeek = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
};

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const MonthYearPicker = ({
  label,
  year,
  month,
  onPick,
}: {
  label: string;
  year: number;
  month: number;
  onPick: (y: number, m: number) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(year);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="text-lg font-display font-semibold hover:text-lavender-deep transition-colors tap-shrink">
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setViewYear((y) => y - 1)}
            aria-label="Previous year"
            className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground tap-shrink"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold">{viewYear}</span>
          <button
            onClick={() => setViewYear((y) => y + 1)}
            aria-label="Next year"
            className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground tap-shrink"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {MONTH_NAMES.map((name, i) => {
            const isCurrent = viewYear === year && i === month;
            return (
              <button
                key={name}
                onClick={() => {
                  onPick(viewYear, i);
                  setOpen(false);
                }}
                className={cn(
                  "h-10 rounded-xl text-sm font-semibold tap-shrink transition-colors",
                  isCurrent
                    ? "bg-lavender-deep text-white"
                    : "bg-secondary/60 hover:bg-secondary text-foreground"
                )}
              >
                {name.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const Log = () => {
  const navigate = useNavigate();
  const { history, loadFromHistory, removeFromHistory, toggleSaved, saveFeedback } = useDecision();

  const today = useMemo(() => startOfDay(new Date()), []);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const weekEnd = useMemo(() => new Date(weekStart.getTime() + 7 * DAY_MS), [weekStart]);

  const activeDayKeys = useMemo(() => {
    const s = new Set<string>();
    history.forEach((h) => {
      const d = new Date(h.createdAt);
      s.add(dayKey(d));
    });
    return s;
  }, [history]);

  const filtered = useMemo(() => {
    let from: number;
    let to: number;
    if (selectedDay) {
      from = selectedDay.getTime();
      to = from + DAY_MS;
    } else {
      from = weekStart.getTime();
      to = weekEnd.getTime();
    }
    return history
      .filter((h) => h.createdAt >= from && h.createdAt < to)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [history, weekStart, weekEnd, selectedDay]);

  const handleReuse = (id: string) => {
    loadFromHistory(id);
    toast("List loaded — edit as needed ✨");
    navigate("/create");
  };

  const groups = useMemo(() => {
    const byDay = new Map<string, typeof filtered>();
    filtered.forEach((d) => {
      const key = new Date(d.createdAt).toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
      const arr = byDay.get(key) ?? [];
      arr.push(d);
      byDay.set(key, arr);
    });
    return Array.from(byDay.entries());
  }, [filtered]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const monthLabel = useMemo(() => {
    const startMonth = weekStart.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
    const endMonth = new Date(weekEnd.getTime() - DAY_MS).toLocaleDateString(
      undefined,
      {
        month: "long",
        year: "numeric",
      }
    );
    return startMonth === endMonth
      ? startMonth
      : `${weekStart.toLocaleDateString(undefined, { month: "short" })} – ${new Date(
          weekEnd.getTime() - DAY_MS
        ).toLocaleDateString(undefined, { month: "short", year: "numeric" })}`;
  }, [weekStart, weekEnd]);

  const shiftWeek = (delta: number) => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + delta * 7);
    setWeekStart(next);
    setSelectedDay(null);
  };

  const isThisWeek = sameDay(weekStart, startOfWeek(today));

  const headerLabel = selectedDay
    ? selectedDay.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    : isThisWeek
      ? "This week"
      : `${weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${new Date(
          weekEnd.getTime() - DAY_MS
        ).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;

  const dayLetters = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <MobileFrame>
      <TopBar title="Decision log" />

      <div className="flex-1 overflow-y-auto px-5 pb-nav">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl glass-lavender flex items-center justify-center mb-4">
              <NotebookPen className="w-6 h-6 text-lavender-deep" />
            </div>
            <h3 className="font-display text-xl font-semibold">No entries yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[260px]">
              Every decision you make lands here — a little journal of your picks.
            </p>
            <button
              onClick={() => navigate("/create")}
              className="mt-6 h-12 px-6 rounded-2xl bg-foreground text-background font-semibold tap-shrink shadow-pop"
            >
              Make a decision
            </button>
          </div>
        ) : (
          <>
            {/* Calendar Control */}
            <div className="mt-1 mb-6">
              {/* Week Strip */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => shiftWeek(-1)}
                    aria-label="Previous week"
                    className="w-8 h-8 shrink-0 rounded-full hover:bg-secondary flex items-center justify-center tap-shrink text-muted-foreground"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <MonthYearPicker
                    label={monthLabel}
                    year={weekStart.getFullYear()}
                    month={weekStart.getMonth()}
                    onPick={(y, m) => {
                      const next = new Date(weekStart);
                      next.setFullYear(y);
                      next.setMonth(m);
                      setWeekStart(startOfWeek(next));
                      setSelectedDay(null);
                    }}
                  />

                  <button
                    onClick={() => shiftWeek(1)}
                    aria-label="Next week"
                    className="w-8 h-8 shrink-0 rounded-full hover:bg-secondary flex items-center justify-center tap-shrink text-muted-foreground"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-2 justify-center h-24">
                {weekDays.map((d, i) => {
                  const isActive = activeDayKeys.has(dayKey(d));
                  const isSelected = selectedDay && sameDay(d, selectedDay);
                  return (
                    <button
                      key={dayKey(d)}
                      onClick={() =>
                        setSelectedDay((cur) =>
                          cur && sameDay(cur, d) ? null : d
                        )
                      }
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 py-2 px-2.5 rounded-xl tap-shrink transition-colors",
                        isSelected
                          ? "bg-lavender-deep text-white"
                          : isActive
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/60"
                      )}
                      aria-label={d.toDateString()}
                      aria-pressed={!!isSelected}
                    >
                      <span className="text-xs font-semibold">{dayLetters[i]}</span>
                      <span className="text-sm font-semibold">{d.getDate()}</span>
                      {isActive && (
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isSelected ? "bg-white" : "bg-lavender-deep"
                          )}
                        />
                      )}
                    </button>
                  );
                })}
                </div>
              </div>

              {(!isThisWeek || selectedDay) && (
                <button
                  onClick={() => {
                    setWeekStart(startOfWeek(new Date()));
                    setSelectedDay(null);
                  }}
                  className="mt-3 w-full text-xs font-semibold text-lavender-deep hover:underline tap-shrink"
                >
                  Jump to this week
                </button>
              )}
            </div>

            {/* Decisions List */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-3">
                {headerLabel} • {filtered.length}{" "}
                {filtered.length === 1 ? "decision" : "decisions"}
              </p>

              {filtered.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">
                    No decisions {selectedDay ? "on this day" : "this week"}.
                  </p>
                  <p className="text-xs mt-1">
                    {selectedDay
                      ? "Try another day"
                      : "Tap a purple-dotted day to view it."}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {groups.map(([day, items]) => (
                    <section key={day}>
                      <h2 className="text-[11px] uppercase tracking-[0.18em] text-foreground/50 font-semibold mb-2 px-1">
                        {day}
                      </h2>
                      <div className="space-y-3">
                        {items.map((d) => (
                          <DecisionCard
                            key={d.id}
                            decision={d}
                            onReuse={handleReuse}
                            onDelete={removeFromHistory}
                            onToggleSaved={toggleSaved}
                            onSaveFeedback={saveFeedback}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MobileFrame>
  );
};

export default Log;
