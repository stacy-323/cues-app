import { Link } from "react-router-dom";
import { Sparkles, Bookmark } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { useDecision } from "@/context/DecisionContext";
import { useEffect } from "react";
import heroDecider from "@/assets/hero-decider.png";

const Home = () => {
  const { resetDraft, history } = useDecision();
  const savedCount = history.filter((d) => d.saved).length;

  useEffect(() => { resetDraft(); }, [resetDraft]);

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col px-5 pt-20 pb-nav safe-top overflow-y-auto">
        {/* Brand row */}
        <div className="flex items-center justify-between animate-fade-in pt-[30px]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl glass-lavender flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-foreground" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">Cues</span>
          </div>

          <Link
            to="/history"
            aria-label={`Saved decisions${savedCount ? ` (${savedCount})` : ""}`}
            className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground/80 tap-shrink shadow-soft"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </Link>
        </div>

        {/* Hero */}
        <div className="mt-10 animate-fade-in-up">
          <img
            src={heroDecider}
            alt="Illustration of a person surrounded by colorful thought bubbles"
            className="w-full h-auto rounded-2xl"
          />
          <h1 className="font-display text-[2.4rem] leading-[1.05] font-semibold mt-4">
            What's on your<br />mind today?
          </h1>
        </div>

        {/* Hero card */}
        <div className="relative mt-8 rounded-3xl overflow-hidden shadow-soft animate-scale-in">
          <div className="glass-lavender p-6 relative">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-lavender-glow/60 blur-2xl animate-blob" />
            <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-lavender-deep/30 blur-2xl animate-blob" style={{ animationDelay: '2s' }} />

            <div className="relative">
              <p className="text-xs uppercase tracking-[0.18em] text-foreground/60 font-semibold">Stuck?</p>
              <h2 className="font-display text-2xl font-semibold mt-2 leading-tight">
                Let's untangle it together.
              </h2>
              <p className="text-sm text-foreground/70 mt-2">
                List your options, narrow them down, and let chance choose.
              </p>

              <Link
                to="/create"
                className="mt-5 inline-flex items-center justify-center w-full h-14 rounded-2xl bg-foreground text-background font-semibold tap-shrink shadow-pop"
              >
                Help Me Decide
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <p className="text-center text-xs text-muted-foreground mt-6">
          Tip: a fresh perspective is one tap away.
        </p>
      </div>
    </MobileFrame>
  );
};

export default Home;
