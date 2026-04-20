import { ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav";

/**
 * iPhone-style mobile frame.
 * - Full-screen on mobile (iPhone 15: 393×852), framed card on desktop.
 * - Children are placed in a flex column; pages decide their own scroll behavior.
 * - The bottom nav floats above content; pages should add bottom padding
 *   (use the `pb-nav` utility / `pb-28`) so content is not hidden behind it.
 */
export const MobileFrame = ({
  children,
  showNav = true,
}: {
  children: ReactNode;
  showNav?: boolean;
}) => (
  <div className="h-[100dvh] md:min-h-screen w-full bg-background flex items-center justify-center md:p-6">
    <div className="relative w-full h-[100dvh] md:h-[852px] md:max-w-[393px] md:rounded-[3rem] md:shadow-pop md:border md:border-border bg-background overflow-hidden flex flex-col">
      {children}
      {showNav && <BottomNav />}
    </div>
  </div>
);
