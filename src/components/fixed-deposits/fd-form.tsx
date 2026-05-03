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
import { addFixedDeposit, updateFixedDeposit } from "@/lib/actions/fdActions"
import { toast } from "sonner"

interface FDFormProps {
  initialData?: {
    id: string
    bankName: string
    principal: number
    interestRate: number
    startDate: string
    maturityDate: string
    compoundingFrequency: string
    TDSRate: number
  }
}

export function FDForm({ initialData }: FDFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const result = initialData
      ? await updateFixedDeposit(initialData.id, data)
      : await addFixedDeposit(data)

    setLoading(false)
    if (result.success) {
      toast.success(initialData ? "Fixed Deposit updated" : "Fixed Deposit added")
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
          <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" />Add Fixed Deposit</Button>
        )
      }>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Fixed Deposit" : "Add New FD"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input id="bankName" name="bankName" defaultValue={initialData?.bankName} placeholder="e.g. HDFC Bank" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="principal">Principal (₹)</Label>
              <Input id="principal" name="principal" type="number" defaultValue={initialData?.principal} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input id="interestRate" name="interestRate" type="number" step="0.01" defaultValue={initialData?.interestRate} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue={initialData?.startDate} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maturityDate">Maturity Date</Label>
              <Input id="maturityDate" name="maturityDate" type="date" defaultValue={initialData?.maturityDate} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="compoundingFrequency">Compounding</Label>
              <Select name="compoundingFrequency" defaultValue={initialData?.compoundingFrequency || "QUARTERLY"}>
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
              <Input id="TDSRate" name="TDSRate" type="number" step="0.1" defaultValue={initialData?.TDSRate ?? "10"} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Fixed Deposit" : "Save Fixed Deposit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
