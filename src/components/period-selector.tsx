"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { format, startOfYear, endOfYear, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Period = "ALL" | "FY_CURRENT" | "FY_PREVIOUS" | "THIS_MONTH" | "LAST_3_MONTHS"

interface PeriodSelectorProps {
  onPeriodChange: (start: Date | null, end: Date | null) => void
}

export function PeriodSelector({ onPeriodChange }: PeriodSelectorProps) {
  const [selectedLabel, setSelectedLabel] = useState("All Time")

  const handleSelect = (period: Period, label: string) => {
    setSelectedLabel(label)
    let start: Date | null = null
    let end: Date | null = null

    const now = new Date()

    switch (period) {
      case "FY_CURRENT":
        // Financial Year in India: April 1 to March 31
        const currentYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1
        start = new Date(currentYear, 3, 1)
        end = new Date(currentYear + 1, 2, 31)
        break
      case "THIS_MONTH":
        start = startOfMonth(now)
        end = endOfMonth(now)
        break
      case "LAST_3_MONTHS":
        start = subMonths(startOfMonth(now), 2)
        end = endOfMonth(now)
        break
      case "ALL":
      default:
        start = null
        end = null
    }

    onPeriodChange(start, end)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>{selectedLabel}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      }>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem onClick={() => handleSelect("ALL", "All Time")}>
          All Time
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("FY_CURRENT", "Current FY")}>
          Current FY
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("THIS_MONTH", "This Month")}>
          This Month
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("LAST_3_MONTHS", "Last 3 Months")}>
          Last 3 Months
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
