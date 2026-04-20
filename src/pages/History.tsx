import { useNavigate } from "react-router-dom";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { DecisionCard } from "@/components/DecisionCard";
import { useDecision } from "@/context/DecisionContext";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useMemo } from "react";

const History = () => {
  const navigate = useNavigate();
  const { history, loadFromHistory, removeFromHistory, toggleSaved, saveFeedback } = useDecision();

  const saved = useMemo(
    () => history.filter((d) => d.saved).sort((a, b) => b.createdAt - a.createdAt),
    [history]
  );

  const handleReuse = (id: string) => {
    loadFromHistory(id);
    toast("List loaded — edit as needed ✨");
    navigate("/create");
  };

  return (
    <MobileFrame>
      <TopBar back title="Saved decisions" onBack={() => navigate("/")} />

      <div className="flex-1 overflow-y-auto px-5 pb-nav">
        {saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl glass-lavender flex items-center justify-center mb-4">
              <Bookmark className="w-6 h-6 text-lavender-deep" />
            </div>
            <h3 className="font-display text-xl font-semibold">Nothing saved yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[260px]">
              Tap the bookmark on any decision in your Log to keep it here for quick reuse.
            </p>
            <button
              onClick={() => navigate("/log")}
              className="mt-6 h-12 px-6 rounded-2xl bg-foreground text-background font-semibold tap-shrink shadow-pop"
            >
              Open your log
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground pt-1 pb-4">
              {saved.length} saved
            </p>
            <div className="space-y-3">
              {saved.map((d) => (
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
          </>
        )}
      </div>
    </MobileFrame>
  );
};

export default History;
