import { useNavigate } from "react-router-dom";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { useDecision } from "@/context/DecisionContext";
import { useEffect, useRef, useState } from "react";
import { RotateCw, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Result = () => {
  const navigate = useNavigate();
  const { draft, reroll, saveCurrent, resetDraft, maxRerolls } = useDecision();

  const remaining = draft.options.filter(o => o.trim() && !draft.eliminated.has(o));
  const [shuffling, setShuffling] = useState(true);
  const [displayed, setDisplayed] = useState<string>(remaining[0] ?? "");
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const startShuffle = (finalResult: string | null) => {
    if (remaining.length === 0) return;

    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    setShuffling(true);
    let i = 0;
    intervalRef.current = window.setInterval(() => {
      i = (i + 1) % remaining.length;
      setDisplayed(remaining[i]);
    }, 90);
    timeoutRef.current = window.setTimeout(() => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      setDisplayed(finalResult ?? remaining[0]);
      setShuffling(false);
    }, 1400);
  };

  useEffect(() => {
    if (!draft.result) {
      navigate("/eliminate", { replace: true });
      return;
    }
    startShuffle(draft.result);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.result]);

  const handleReroll = () => {
    if (draft.rerollsUsed >= maxRerolls) {
      toast("No more rerolls — trust the cue ✨");
      return;
    }
    const newResult = reroll();
    startShuffle(newResult);
  };

  const handleAccept = () => {
    saveCurrent();
    toast("Saved to your decisions ✨");
    resetDraft();
    navigate("/");
  };

  const handleStartOver = () => {
    resetDraft();
    navigate("/create");
  };

  const rerollsLeft = maxRerolls - draft.rerollsUsed;

  return (
    <MobileFrame>
      <TopBar back title="Your cue" onBack={() => navigate("/eliminate")} />

      <div className="flex-1 flex flex-col px-5 pb-nav overflow-y-auto">
        <p className="text-center text-sm text-muted-foreground mt-1">
          {shuffling ? "Letting chance choose…" : "Here's what to go with"}
        </p>

        {/* Big result card */}
        <div className="flex-1 flex items-center justify-center py-4">
          <div className="relative w-full">
            <div className="absolute inset-0 -m-6 rounded-[2.5rem] glass-lavender blur-md opacity-80 animate-blob" />
            <div
              className={`relative rounded-[2.5rem] bg-card border border-border shadow-pop p-7 min-h-[260px] flex flex-col items-center justify-center text-center ${
                shuffling ? "" : "animate-celebrate"
              }`}
            >
              <Sparkles className={`w-6 h-6 mb-3 text-lavender-deep ${shuffling ? "animate-float" : ""}`} />
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                {shuffling ? "Choosing" : "Go with"}
              </p>
              <p
                key={displayed}
                className={`font-display text-4xl font-semibold mt-3 leading-tight break-words ${
                  shuffling ? "animate-shuffle-pop" : "animate-scale-in"
                }`}
              >
                {displayed || "—"}
              </p>
              {!shuffling && draft.title && (
                <p className="text-sm text-muted-foreground mt-3">for "{draft.title}"</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleAccept}
            disabled={shuffling}
            className="w-full h-14 rounded-2xl bg-foreground text-background font-semibold tap-shrink shadow-pop disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Accept &amp; save
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleReroll}
              disabled={shuffling || rerollsLeft <= 0 || remaining.length < 2}
              className="h-12 rounded-2xl bg-secondary text-foreground font-semibold tap-shrink disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <RotateCw className="w-4 h-4" /> Reroll{rerollsLeft > 0 ? ` (${rerollsLeft})` : ""}
            </button>
            <button
              onClick={handleStartOver}
              disabled={shuffling}
              className="h-12 rounded-2xl border border-border text-foreground font-semibold tap-shrink disabled:opacity-40"
            >
              Start over
            </button>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default Result;
