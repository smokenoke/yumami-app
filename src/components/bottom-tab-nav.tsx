"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/tasks", label: "To-dos" },
  { href: "/calendar", label: "Calendar" },
  { href: "/finance", label: "Finance" },
  { href: "/files", label: "Files" },
] as const;

interface AppNavProps {
  variant?: "mobile" | "desktop";
}

export function AppNav({ variant = "mobile" }: AppNavProps) {
  const pathname = usePathname();

  if (variant === "desktop") {
    return (
      <nav className="hidden flex-1 justify-center md:flex">
        <ul className="grid min-w-[620px] grid-cols-5 gap-3">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium transition ${
                    isActive
                      ? "bg-[var(--accent-deep)] text-white shadow-sm"
                      : "border border-[var(--border-soft)] bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/80 bg-white/92 px-3 pb-[calc(env(safe-area-inset-bottom)+0.8rem)] pt-3 shadow-[0_-22px_48px_-30px_rgba(15,23,42,0.26)] backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-2xl grid-cols-5 gap-2">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2.5 text-[11px] font-medium transition sm:text-xs ${
                  isActive
                    ? "bg-[var(--accent-quiet)] text-[var(--accent-deep)] shadow-sm"
                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
