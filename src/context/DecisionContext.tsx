import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

export type Decision = {
  id: string;
  title: string;
  options: string[];
  eliminated: string[];
  result: string | null;
  createdAt: number;
  saved?: boolean;
  feedback?: {
    happy?: boolean | null;
    committed?: boolean | null;
  };
};

type DraftDecision = {
  title: string;
  options: string[];
  eliminated: Set<string>;
  result: string | null;
  rerollsUsed: number;
};

type DecisionContextValue = {
  draft: DraftDecision;
  history: Decision[];
  setTitle: (t: string) => void;
  setOptions: (o: string[]) => void;
  toggleEliminated: (opt: string) => void;
  randomEliminate: () => string | null;
  decide: () => string | null;
  reroll: () => string | null;
  resetDraft: () => void;
  saveCurrent: () => void;
  loadFromHistory: (id: string) => void;
  removeFromHistory: (id: string) => void;
  toggleSaved: (id: string) => void;
  saveFeedback: (id: string, feedback: Decision["feedback"]) => void;
  maxRerolls: number;
};

const STORAGE_KEY = "cues.history.v1";

const DecisionContext = createContext<DecisionContextValue | null>(null);

const emptyDraft = (): DraftDecision => ({
  title: "",
  options: ["", ""],
  eliminated: new Set(),
  result: null,
  rerollsUsed: 0,
});

const pickRandom = <T,>(arr: T[]): T | null =>
  arr.length === 0 ? null : arr[Math.floor(Math.random() * arr.length)];

export const DecisionProvider = ({ children }: { children: ReactNode }) => {
  const [draft, setDraft] = useState<DraftDecision>(emptyDraft);
  const [history, setHistory] = useState<Decision[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Decision[]) : [];
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch {}
  }, [history]);

  const remaining = draft.options.filter(o => o.trim() && !draft.eliminated.has(o));
  const maxRerolls = draft.options.length < 3 ? 1 : 3;

  const setTitle = useCallback((t: string) => setDraft(d => ({ ...d, title: t })), []);
  const setOptions = useCallback((o: string[]) => setDraft(d => ({ ...d, options: o, eliminated: new Set([...d.eliminated].filter(x => o.includes(x))) })), []);

  const toggleEliminated = useCallback((opt: string) => {
    setDraft(d => {
      const next = new Set(d.eliminated);
      if (next.has(opt)) next.delete(opt); else next.add(opt);
      return { ...d, eliminated: next };
    });
  }, []);

  const randomEliminate = useCallback(() => {
    let picked: string | null = null;
    setDraft(d => {
      const candidates = d.options.filter(o => o.trim() && !d.eliminated.has(o));
      if (candidates.length <= 1) return d;
      picked = pickRandom(candidates);
      if (!picked) return d;
      const next = new Set(d.eliminated); next.add(picked);
      return { ...d, eliminated: next };
    });
    return picked;
  }, []);

  const decide = useCallback(() => {
    const pick = pickRandom(remaining);
    setDraft(d => ({ ...d, result: pick, rerollsUsed: 0 }));
    return pick;
  }, [remaining]);

  const reroll = useCallback(() => {
    let pick: string | null = null;
    setDraft(d => {
      if (d.rerollsUsed >= maxRerolls) return d;
      const pool = d.options.filter(o => o.trim() && !d.eliminated.has(o));
      pick = pickRandom(pool);
      return { ...d, result: pick, rerollsUsed: d.rerollsUsed + 1 };
    });
    return pick;
  }, [maxRerolls]);

  const resetDraft = useCallback(() => setDraft(emptyDraft()), []);

  const saveCurrent = useCallback(() => {
    setDraft(d => {
      if (!d.result) return d;
      const entry: Decision = {
        id: crypto.randomUUID(),
        title: d.title.trim() || "Untitled decision",
        options: d.options.filter(o => o.trim()),
        eliminated: [...d.eliminated],
        result: d.result,
        createdAt: Date.now(),
      };
      setHistory(h => [entry, ...h].slice(0, 100));
      return d;
    });
  }, []);

  const loadFromHistory = useCallback((id: string) => {
    setHistory(h => {
      const found = h.find(x => x.id === id);
      if (found) {
        setDraft({
          title: found.title,
          options: [...found.options],
          eliminated: new Set(),
          result: null,
          rerollsUsed: 0,
        });
      }
      return h;
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(h => h.filter(x => x.id !== id));
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setHistory(h => h.map(x => x.id === id ? { ...x, saved: !x.saved } : x));
  }, []);

  const saveFeedback = useCallback((id: string, feedback: Decision["feedback"]) => {
    setHistory(h => h.map(x => x.id === id ? { ...x, feedback } : x));
  }, []);

  return (
    <DecisionContext.Provider value={{
      draft, history, setTitle, setOptions, toggleEliminated, randomEliminate,
      decide, reroll, resetDraft, saveCurrent, loadFromHistory, removeFromHistory,
      toggleSaved, saveFeedback, maxRerolls,
    }}>
      {children}
    </DecisionContext.Provider>
  );
};

export const useDecision = () => {
  const ctx = useContext(DecisionContext);
  if (!ctx) throw new Error("useDecision must be used within DecisionProvider");
  return ctx;
};
