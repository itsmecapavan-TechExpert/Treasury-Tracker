import { Shell } from "@/components/shell"
import prisma from "@/lib/prisma"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DebentureForm } from "@/components/debentures/debenture-form"
import { calculateAccruedInterest } from "@/lib/calculations/interestCalculator"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { DeleteAction } from "@/components/delete-action"
import { deleteDebenture } from "@/lib/actions/debentureActions"

export default async function DebenturesPage() {
  const debentures = await prisma.debenture.findMany({
    include: { transactions: true },
    orderBy: { purchaseDate: 'desc' }
  })

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Debentures</h1>
          <p className="text-muted-foreground">Manage and track your corporate and government bonds.</p>
        </div>
        <DebentureForm />
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
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debentures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No debentures found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                debentures.map((d) => {
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
    </Shell>
  )
}
