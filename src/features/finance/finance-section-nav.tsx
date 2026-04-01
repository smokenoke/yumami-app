"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/finance", label: "Overview" },
  { href: "/finance/imports", label: "Imports" },
  { href: "/finance/categories", label: "Categories" },
  { href: "/finance/review", label: "Review" },
] as const;

export function FinanceSectionNav() {
  const pathname = usePathname();

  return (
    <nav className="rounded-[1.8rem] border border-[var(--border-soft)] bg-white px-3 py-3 shadow-[var(--shadow-soft)]">
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive = item.href === "/finance" ? pathname === "/finance" : pathname?.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[var(--accent-deep)] text-white"
                    : "border border-[var(--border-soft)] bg-[var(--surface-muted)] text-slate-700 hover:bg-white"
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

