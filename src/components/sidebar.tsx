"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  TrendingUp, 
  Building2, 
  Wallet, 
  Settings,
  ArrowUpRight,
  PieChart
} from "lucide-react"

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Debentures', href: '/debentures', icon: TrendingUp },
  { name: 'Mutual Funds', href: '/mutual-funds', icon: PieChart },
  { name: 'Fixed Deposits', href: '/fixed-deposits', icon: Building2 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-primary text-primary-foreground p-1 rounded-md">
            <Wallet className="h-6 w-6" />
          </div>
          <span>FinanceFlow</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-secondary text-secondary-foreground" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="rounded-lg bg-primary/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Quick Actions</span>
            <ArrowUpRight className="h-3 w-3 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground mb-3">Add new investments to track your growth.</p>
          <button className="w-full bg-primary text-primary-foreground text-xs font-medium py-2 rounded-md hover:opacity-90 transition-opacity">
            Add Investment
          </button>
        </div>
      </div>
    </div>
  )
}
