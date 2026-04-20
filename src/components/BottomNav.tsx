import { NavLink, useLocation } from "react-router-dom";
import { Home as HomeIcon, PlusCircle, NotebookPen, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  matches: (pathname: string) => boolean;
};

const items: NavItem[] = [
  {
    to: "/",
    label: "Home",
    icon: HomeIcon,
    matches: (p) => p === "/",
  },
  {
    to: "/create",
    label: "Create List",
    icon: PlusCircle,
    matches: (p) => p === "/create" || p === "/eliminate" || p === "/result",
  },
  {
    to: "/log",
    label: "Log",
    icon: NotebookPen,
    matches: (p) => p === "/log",
  },
];

export const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav
      className="absolute bottom-3 left-3 right-3 z-20 rounded-[2rem] glass-lavender shadow-pop"
      aria-label="Primary"
    >
      <ul className="flex items-center justify-around px-2 py-2.5 safe-bottom">
        {items.map(({ to, label, icon: Icon, matches }) => {
          const active = matches(pathname);
          return (
            <li key={label} className="flex-1">
              <NavLink
                to={to}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-1 py-1 tap-shrink rounded-2xl text-lavender-deep"
              >
                <Icon
                  className={cn(
                    "w-6 h-6 transition-transform",
                    active && "scale-110"
                  )}
                  strokeWidth={1.75}
                />
                <span
                  className={cn(
                    "text-[11px] leading-tight",
                    active ? "font-semibold" : "font-medium opacity-80"
                  )}
                >
                  {label}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
