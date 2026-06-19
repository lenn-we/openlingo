"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobileKeyboardOpen } from "@/hooks/use-mobile-keyboard-open";

const navItems = [
  { href: "/chat", label: "Chat", icon: "💬" },
  { href: "/units", label: "Lektionen", icon: "📚" },
  { href: "/words", label: "Wörter", icon: "🔤" },
  { href: "/read", label: "Lesen", icon: "📖" },
  { href: "/settings", label: "Einstellungen", icon: "⚙️" },
];

export function MobileNav() {
  const pathname = usePathname();
  const isKeyboardOpen = useMobileKeyboardOpen();

  // Hide nav entirely when keyboard is open (resizes-content handles layout)
  if (isKeyboardOpen) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden border-t-2 border-lingo-border bg-white">
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-bold transition-colors ${
              active ? "text-lingo-blue" : "text-lingo-text-light"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
