"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { PlusCircle, Loader2 } from "lucide-react"
import { addMutualFund } from "@/lib/actions/mfActions"
import { toast } from "sonner"

export function MFForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const result = await addMutualFund(data)

    setLoading(false)
    if (result.success) {
      toast.success("Mutual Fund added successfully")
      setOpen(false)
    } else {
      toast.error(result.error || "Failed to add fund")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Mutual Fund
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Mutual Fund</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Fund Name</Label>
            <Input id="name" name="name" placeholder="e.g. Parag Parikh Flexi Cap" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="AMC">AMC</Label>
            <Input id="AMC" name="AMC" placeholder="e.g. PPFAS Mutual Fund" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select name="type" defaultValue="SIP">
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SIP">SIP</SelectItem>
                <SelectItem value="LUMP_SUM">Lump Sum</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Fund
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
