"use client"

import { Home, PenTool, Library, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"

const leftNavItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: PenTool, label: "Write", href: "/write" },
]

const rightNavItems = [
  { icon: Library, label: "Library", href: "/library" },
  { icon: User, label: "Profile", href: "/profile" },
]

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-between px-2 py-3 mini-app-nav-spacing safe-area-bottom">
        <div className="flex items-center flex-1">
          {leftNavItems.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5",
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate">{label}</span>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center justify-center px-4">
          <img src="/chaptr-logo.png" alt="Chaptr" className="h-6 w-auto opacity-80" />
        </div>

        <div className="flex items-center flex-1">
          {rightNavItems.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5",
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
