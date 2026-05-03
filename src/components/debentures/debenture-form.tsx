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
import { addDebenture, updateDebenture } from "@/lib/actions/debentureActions"
import { toast } from "sonner"

interface DebentureFormProps {
  initialData?: {
    id: string
    name: string
    faceValue: number
    purchaseValue: number
    interestRate: number
    quantity: number
    purchaseDate: string
    maturityDate: string
    interestFrequency: string
    type: string
  }
}

export function DebentureForm({ initialData }: DebentureFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const result = initialData
      ? await updateDebenture(initialData.id, data)
      : await addDebenture(data)

    setLoading(false)
    if (result.success) {
      toast.success(initialData ? "Debenture updated" : "Debenture added")
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
          <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" />Add Debenture</Button>
        )
      }>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Debenture" : "Add New Debenture"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={initialData?.name} placeholder="e.g. NHAI 8.75% 2029" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="faceValue">Face Value</Label>
              <Input id="faceValue" name="faceValue" type="number" step="0.01" defaultValue={initialData?.faceValue} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purchaseValue">Purchase Price (Dirty)</Label>
              <Input id="purchaseValue" name="purchaseValue" type="number" step="0.01" defaultValue={initialData?.purchaseValue} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input id="interestRate" name="interestRate" type="number" step="0.01" defaultValue={initialData?.interestRate} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" defaultValue={initialData?.quantity} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input id="purchaseDate" name="purchaseDate" type="date" defaultValue={initialData?.purchaseDate} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maturityDate">Maturity Date</Label>
              <Input id="maturityDate" name="maturityDate" type="date" defaultValue={initialData?.maturityDate} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="interestFrequency">Frequency</Label>
              <Select name="interestFrequency" defaultValue={initialData?.interestFrequency || "YEARLY"}>
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
              <Select name="type" defaultValue={initialData?.type || "CUM_INTEREST"}>
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
              {initialData ? "Update Debenture" : "Save Debenture"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
