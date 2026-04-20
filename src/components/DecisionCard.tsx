import { Trash2, RotateCw, Bookmark, ThumbsUp, ThumbsDown } from "lucide-react";
import { Decision } from "@/context/DecisionContext";
import { cn } from "@/lib/utils";
import { useState } from "react";

const formatDate = (ts: number) => {
  const d = new Date(ts);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " · " +
    d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
  );
};

type Props = {
  decision: Decision;
  onReuse: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSaved: (id: string) => void;
  onSaveFeedback?: (id: string, feedback: Decision["feedback"]) => void;
};

export const DecisionCard = ({ decision: d, onReuse, onDelete, onToggleSaved, onSaveFeedback }: Props) => {
  const [showing, setShowing] = useState(false);

  const handleFeedback = (happy: boolean | null, committed: boolean | null) => {
    onSaveFeedback?.(d.id, { happy, committed });
  };

  const hasFeedback = d.feedback?.happy !== undefined || d.feedback?.committed !== undefined;

  return (
    <div className="rounded-2xl bg-card border border-border p-4 shadow-soft animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{formatDate(d.createdAt)}</p>
          <h3 className="font-display text-lg font-semibold mt-0.5 truncate">{d.title}</h3>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggleSaved(d.id)}
            aria-label={d.saved ? "Unsave" : "Save"}
            aria-pressed={!!d.saved}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center tap-shrink",
              d.saved
                ? "text-lavender-deep bg-secondary"
                : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <Bookmark className={cn("w-4 h-4", d.saved && "fill-current")} />
          </button>
          <button
            onClick={() => onDelete(d.id)}
            aria-label="Delete"
            className="w-9 h-9 rounded-full text-muted-foreground hover:bg-secondary flex items-center justify-center tap-shrink"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-xl glass-lavender px-4 py-3">
        <p className="text-[11px] uppercase tracking-wider text-foreground/60 font-semibold">
          Picked
        </p>
        <p className="font-display text-xl font-semibold mt-0.5">{d.result}</p>
      </div>

      {!showing && !hasFeedback && (
        <button
          onClick={() => setShowing(true)}
          className="mt-3 w-full text-left rounded-xl bg-secondary/40 border border-border px-4 py-3 text-sm hover:bg-secondary/60 transition-colors"
        >
          <p className="text-[11px] uppercase tracking-wider text-foreground/60 font-semibold">
            How'd it go?
          </p>
          <p className="text-foreground/70 mt-0.5">Tap to share your thoughts</p>
        </button>
      )}

      {showing && (
        <div className="mt-3 rounded-xl bg-secondary/50 border border-border p-4 space-y-4">
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Happy with the choice?</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleFeedback(true, d.feedback?.committed ?? null)}
                className={cn(
                  "flex-1 h-10 rounded-lg font-semibold tap-shrink flex items-center justify-center gap-2",
                  d.feedback?.happy === true
                    ? "bg-foreground text-background"
                    : "border border-foreground text-foreground hover:bg-foreground/10"
                )}
              >
                <ThumbsUp className="w-4 h-4" /> Yes
              </button>
              <button
                onClick={() => handleFeedback(false, d.feedback?.committed ?? null)}
                className={cn(
                  "flex-1 h-10 rounded-lg font-semibold tap-shrink flex items-center justify-center gap-2",
                  d.feedback?.happy === false
                    ? "bg-foreground text-background"
                    : "border border-foreground text-foreground hover:bg-foreground/10"
                )}
              >
                <ThumbsDown className="w-4 h-4" /> No
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Did you commit to it?</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleFeedback(d.feedback?.happy ?? null, true)}
                className={cn(
                  "flex-1 h-10 rounded-lg font-semibold tap-shrink",
                  d.feedback?.committed === true
                    ? "bg-foreground text-background"
                    : "border border-foreground text-foreground hover:bg-foreground/10"
                )}
              >
                Yes
              </button>
              <button
                onClick={() => handleFeedback(d.feedback?.happy ?? null, false)}
                className={cn(
                  "flex-1 h-10 rounded-lg font-semibold tap-shrink",
                  d.feedback?.committed === false
                    ? "bg-foreground text-background"
                    : "border border-foreground text-foreground hover:bg-foreground/10"
                )}
              >
                No
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowing(false)}
            className="w-full h-9 rounded-lg bg-foreground/10 text-foreground font-semibold tap-shrink text-sm"
          >
            Done
          </button>
        </div>
      )}

      {hasFeedback && !showing && (
        <button
          onClick={() => setShowing(true)}
          className="mt-3 w-full text-left rounded-xl bg-secondary/50 border border-border px-4 py-3 hover:bg-secondary/70 transition-colors"
        >
          <p className="text-[11px] uppercase tracking-wider text-foreground/60 font-semibold">
            Your feedback
          </p>
          <p className="text-sm text-foreground/70 mt-1">
            {d.feedback?.happy === true ? "✓ Happy" : d.feedback?.happy === false ? "✗ Not happy" : "—"}
            {" · "}
            {d.feedback?.committed === true ? "✓ Committed" : d.feedback?.committed === false ? "✗ Didn't commit" : "—"}
          </p>
        </button>
      )}

      <p className="text-xs text-muted-foreground mt-3">
        From {d.options.length} options:{" "}
        <span className="text-foreground/70">
          {d.options.slice(0, 3).join(", ")}
          {d.options.length > 3 ? "…" : ""}
        </span>
      </p>

      <button
        onClick={() => onReuse(d.id)}
        className="mt-3 w-full h-11 rounded-xl bg-secondary text-foreground font-semibold tap-shrink flex items-center justify-center gap-2 text-sm"
      >
        <RotateCw className="w-4 h-4" /> Use this list again
      </button>
    </div>
  );
};
