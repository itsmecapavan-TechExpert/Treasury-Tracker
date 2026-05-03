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
import { addFixedDeposit } from "@/lib/actions/fdActions"
import { toast } from "sonner"

export function FDForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const result = await addFixedDeposit(data)

    setLoading(false)
    if (result.success) {
      toast.success("Fixed Deposit added successfully")
      setOpen(false)
    } else {
      toast.error(result.error || "Failed to add FD")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Fixed Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New FD</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input id="bankName" name="bankName" placeholder="e.g. HDFC Bank" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="principal">Principal (₹)</Label>
              <Input id="principal" name="principal" type="number" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input id="interestRate" name="interestRate" type="number" step="0.01" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maturityDate">Maturity Date</Label>
              <Input id="maturityDate" name="maturityDate" type="date" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="compoundingFrequency">Compounding</Label>
              <Select name="compoundingFrequency" defaultValue="QUARTERLY">
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="HALF_YEARLY">Half Yearly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                  <SelectItem value="NONE">Simple Interest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="TDSRate">TDS Rate (%)</Label>
              <Input id="TDSRate" name="TDSRate" type="number" step="0.1" defaultValue="10" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Fixed Deposit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
