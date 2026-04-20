import { useNavigate } from "react-router-dom";
import { Shuffle, Lightbulb } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { useDecision } from "@/context/DecisionContext";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

const REFLECTIONS = [
  "Think about distance — how far are you willing to go?",
  "Consider your mood — what feels right, right now?",
  "Time matters — how much do you have?",
  "Budget check — what's it worth to you?",
  "Energy level — bold or cozy choice?",
  "Who else is involved — what would they enjoy?",
  "Future-you — which one will you thank yourself for?",
];

const Eliminate = () => {
  const navigate = useNavigate();
  const { draft, toggleEliminated, randomEliminate, decide } = useDecision();
  const [tipIdx, setTipIdx] = useState(0);
  const [nudgeOpen, setNudgeOpen] = useState(false);

  useEffect(() => {
    if (draft.options.length === 0) {
      navigate("/create", { replace: true });
    }
  }, [draft.options.length, navigate]);

  // Rotate reflection tips
  useEffect(() => {
    const id = setInterval(() => setTipIdx(i => (i + 1) % REFLECTIONS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const totalActive = useMemo(() => draft.options.filter(o => o.trim()).length, [draft.options]);
  const eliminatedCount = draft.eliminated.size;
  const remainingCount = totalActive - eliminatedCount;
  const eliminationGoal = Math.max(1, Math.floor(totalActive / 3));
  const reachedGoal = eliminatedCount >= eliminationGoal;

  const handleDecide = () => {
    if (remainingCount < 2) {
      // Already only one left → just decide
      decide();
      navigate("/result");
      return;
    }
    if (!reachedGoal) {
      setNudgeOpen(true);
      return;
    }
    decide();
    navigate("/result");
  };

  const proceedAnyway = () => {
    setNudgeOpen(false);
    decide();
    navigate("/result");
  };

  return (
    <MobileFrame>
      <TopBar back title={draft.title || "Narrow it down"} onBack={() => navigate("/create")} />

      {/* Reflection tip */}
      <div className="px-5 pt-1 pb-3">
        <div className="rounded-2xl glass-lavender p-4 flex gap-3 items-start animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-background/70 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-lavender-deep" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-foreground/60 font-semibold">Reflection</p>
            <p key={tipIdx} className="text-sm font-medium mt-1 min-h-[2.75rem] animate-fade-in">{REFLECTIONS[tipIdx]}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Tap to cross out the ones you don't want.</span>
          <span className="font-semibold text-foreground">{remainingCount} left</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-40">
        <div className="space-y-2">
          {draft.options.filter(o => o.trim()).map((opt, i) => {
            const struck = draft.eliminated.has(opt);
            return (
              <button
                key={opt + i}
                onClick={() => toggleEliminated(opt)}
                className={`w-full text-left rounded-2xl border px-5 py-3.5 tap-shrink transition-all duration-200 ${
                  struck
                    ? "bg-muted/60 border-border text-muted-foreground line-through"
                    : "bg-card border-border hover:border-foreground/30 shadow-soft"
                }`}
              >
                <span className="font-medium text-base">{opt}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => randomEliminate()}
          disabled={remainingCount <= 1}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 text-sm font-semibold text-muted-foreground hover:bg-secondary/50 tap-shrink disabled:opacity-40"
        >
          <Shuffle className="w-4 h-4" /> Randomly remove one
        </button>
      </div>

      <div className="absolute left-0 right-0 bottom-nav-offset px-5 pt-3 pb-3 z-10 bg-gradient-to-t from-background via-background to-background/0">
        <button
          onClick={handleDecide}
          disabled={remainingCount === 0}
          className="w-full h-14 rounded-2xl bg-foreground text-background font-semibold tap-shrink shadow-pop disabled:opacity-40"
        >
          Decide for Me
        </button>
      </div>

      <Dialog open={nudgeOpen} onOpenChange={setNudgeOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">One more breath?</DialogTitle>
            <DialogDescription className="text-base text-foreground/70 pt-2">
              You still have {remainingCount} options. Take a moment — what's your mood telling you?
              Cross out a few more, then let chance pick from what truly matters.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <button
              onClick={() => setNudgeOpen(false)}
              className="w-full h-12 rounded-2xl bg-foreground text-background font-semibold tap-shrink"
            >
              Keep narrowing
            </button>
            <button
              onClick={proceedAnyway}
              className="w-full h-12 rounded-2xl bg-secondary text-foreground font-semibold tap-shrink"
            >
              Decide anyway
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileFrame>
  );
};

export default Eliminate;
