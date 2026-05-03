"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format, isWithinInterval } from "date-fns"
import { calculateAccruedInterest } from "@/lib/calculations/interestCalculator"
import { DebentureForm } from "@/components/debentures/debenture-form"
import { DeleteAction } from "@/components/delete-action"
import { deleteDebenture } from "@/lib/actions/debentureActions"
import { PeriodSelector } from "@/components/period-selector"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

import Link from "next/link"

interface DebentureTableProps {
  initialData: any[]
}

export function DebentureTable({ initialData }: DebentureTableProps) {
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null })
  
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const filteredData = initialData.filter(d => {
    if (!dateRange.start || !dateRange.end) return true
    const pDate = new Date(d.purchaseDate)
    return isWithinInterval(pDate, { start: dateRange.start, end: dateRange.end })
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <PeriodSelector onPeriodChange={(start, end) => setDateRange({ start, end })} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Face Value</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Accrued Interest</TableHead>
                <TableHead>Maturity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No debentures found for this period.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((d) => {
                  const accrued = calculateAccruedInterest(
                    d.faceValue,
                    d.interestRate,
                    d.lastInterestDate || d.purchaseDate
                  )
                  return (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>{formatCurrency(d.faceValue)}</TableCell>
                      <TableCell>{formatCurrency(d.purchaseValue)}</TableCell>
                      <TableCell>{d.interestRate}%</TableCell>
                      <TableCell className="text-green-500 font-medium">
                        {formatCurrency(accrued)}
                      </TableCell>
                      <TableCell>{format(new Date(d.maturityDate), 'dd MMM yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{d.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Link href={`/debentures/${d.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DebentureForm initialData={{
                            id: d.id,
                            name: d.name,
                            faceValue: d.faceValue,
                            purchaseValue: d.purchaseValue,
                            interestRate: d.interestRate,
                            quantity: d.quantity,
                            purchaseDate: format(new Date(d.purchaseDate), 'yyyy-MM-dd'),
                            maturityDate: format(new Date(d.maturityDate), 'yyyy-MM-dd'),
                            interestFrequency: d.interestFrequency,
                            type: d.type
                          }} />
                          <DeleteAction id={d.id} onDelete={deleteDebenture} itemName={d.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
