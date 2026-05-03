"use client"

import { Button } from "@/components/ui/button"
import { FileDown, PlusCircle } from "lucide-react"

export function DashboardActions() {
  const handleExport = () => {
    window.location.href = '/api/export'
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" className="h-9" onClick={handleExport}>
        <FileDown className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
      <Button size="sm" className="h-9">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Investment
      </Button>
    </div>
  )
}
