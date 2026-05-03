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
import { addDebenture } from "@/lib/actions/debentureActions"
import { toast } from "sonner"

export function DebentureForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const result = await addDebenture(data)

    setLoading(false)
    if (result.success) {
      toast.success("Debenture added successfully")
      setOpen(false)
    } else {
      toast.error(result.error || "Failed to add debenture")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Debenture
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Debenture</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="e.g. NHAI 8.75% 2029" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="faceValue">Face Value</Label>
              <Input id="faceValue" name="faceValue" type="number" step="0.01" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purchaseValue">Purchase Price (Dirty)</Label>
              <Input id="purchaseValue" name="purchaseValue" type="number" step="0.01" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input id="interestRate" name="interestRate" type="number" step="0.01" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input id="purchaseDate" name="purchaseDate" type="date" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maturityDate">Maturity Date</Label>
              <Input id="maturityDate" name="maturityDate" type="date" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="interestFrequency">Frequency</Label>
              <Select name="interestFrequency" defaultValue="YEARLY">
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="HALF_YEARLY">Half Yearly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                  <SelectItem value="AT_MATURITY">At Maturity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue="CUM_INTEREST">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUM_INTEREST">Cum-Interest</SelectItem>
                  <SelectItem value="EX_INTEREST">Ex-Interest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Debenture
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
