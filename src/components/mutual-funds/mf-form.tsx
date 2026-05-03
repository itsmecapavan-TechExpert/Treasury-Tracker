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
import { PlusCircle, Loader2, Edit2 } from "lucide-react"
import { addMutualFund, updateMutualFund } from "@/lib/actions/mfActions"
import { toast } from "sonner"

interface MFFormProps {
  initialData?: {
    id: string
    name: string
    AMC: string
    type: string
  }
}

export function MFForm({ initialData }: MFFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const result = initialData 
      ? await updateMutualFund(initialData.id, data)
      : await addMutualFund(data)

    setLoading(false)
    if (result.success) {
      toast.success(initialData ? "Mutual Fund updated" : "Mutual Fund added")
      setOpen(false)
    } else {
      toast.error(result.error || "Operation failed")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        initialData ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" />Add Mutual Fund</Button>
        )
      }>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Mutual Fund" : "Add New Mutual Fund"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Fund Name</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={initialData?.name} 
              placeholder="e.g. Parag Parikh Flexi Cap" 
              required 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="AMC">AMC</Label>
            <Input 
              id="AMC" 
              name="AMC" 
              defaultValue={initialData?.AMC} 
              placeholder="e.g. PPFAS Mutual Fund" 
              required 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select name="type" defaultValue={initialData?.type || "SIP"}>
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
              {initialData ? "Update Fund" : "Save Fund"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
