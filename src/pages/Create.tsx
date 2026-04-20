import { useNavigate } from "react-router-dom";
import { Plus, X, GripVertical } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { useDecision } from "@/context/DecisionContext";
import { useState } from "react";
import { toast } from "sonner";

const Create = () => {
  const navigate = useNavigate();
  const { draft, setTitle, setOptions } = useDecision();
  const [error, setError] = useState<string | null>(null);

  const updateOption = (i: number, val: string) => {
    const next = [...draft.options];
    next[i] = val;
    setOptions(next);
  };

  const addOption = () => {
    if (draft.options.length >= 20) return;
    setOptions([...draft.options, ""]);
  };

  const removeOption = (i: number) => {
    if (draft.options.length <= 2) {
      toast("You need at least 2 options to decide.");
      return;
    }
    const next = draft.options.filter((_, idx) => idx !== i);
    setOptions(next);
  };

  const handleContinue = () => {
    const cleaned = draft.options.map(o => o.trim()).filter(Boolean);
    if (cleaned.length < 2) {
      setError("Add at least 2 options to continue.");
      return;
    }
    if (new Set(cleaned).size !== cleaned.length) {
      setError("Looks like there are duplicates. Make each option unique.");
      return;
    }
    setOptions(cleaned);
    setError(null);
    navigate("/eliminate");
  };

  return (
    <MobileFrame>
      <TopBar back title="New decision" onBack={() => navigate("/")} />

      <div className="flex-1 overflow-y-auto px-5 pb-40">
        <div className="mt-1 animate-fade-in">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What are you deciding?
          </label>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => setTitle(e.target.value.slice(0, 80))}
            placeholder="e.g. Where to eat tonight"
            className="mt-2 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2.5 font-display text-2xl placeholder:text-muted-foreground/60 transition-colors"
            autoFocus
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your options
            </label>
            <span className="text-xs text-muted-foreground">{draft.options.length}/20</span>
          </div>

          <div className="space-y-2">
            {draft.options.map((opt, i) => (
              <div
                key={i}
                className="group flex items-center gap-2 rounded-2xl bg-card border border-border px-3 py-1.5 animate-fade-in"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value.slice(0, 60))}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 bg-transparent outline-none py-2 text-base placeholder:text-muted-foreground/60"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (i === draft.options.length - 1) addOption();
                    }
                  }}
                />
                <button
                  onClick={() => removeOption(i)}
                  aria-label="Remove option"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary tap-shrink"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addOption}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 text-sm font-semibold text-muted-foreground hover:bg-secondary/50 tap-shrink"
          >
            <Plus className="w-4 h-4" /> Add option
          </button>

          {error && (
            <p className="mt-4 text-sm text-destructive font-medium animate-fade-in">{error}</p>
          )}
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-nav-offset px-5 pt-3 pb-3 z-10 bg-gradient-to-t from-background via-background to-background/0">
        <button
          onClick={handleContinue}
          className="w-full h-14 rounded-2xl bg-foreground text-background font-semibold tap-shrink shadow-pop"
        >
          Continue
        </button>
      </div>
    </MobileFrame>
  );
};

export default Create;
