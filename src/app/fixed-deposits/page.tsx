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
import { FDForm } from "@/components/fixed-deposits/fd-form"
import { calculateAccruedInterest, calculateMaturityValue } from "@/lib/calculations/interestCalculator"
import { format } from "date-fns"
import { DeleteAction } from "@/components/delete-action"
import { deleteFixedDeposit } from "@/lib/actions/fdActions"

export default async function FixedDepositsPage() {
  const fds = await prisma.fixedDeposit.findMany({
    orderBy: { startDate: 'desc' }
  })

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fixed Deposits</h1>
          <p className="text-muted-foreground">Secure savings with guaranteed returns from various banks.</p>
        </div>
        <FDForm />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Deposits</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bank</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Accrued Interest</TableHead>
                <TableHead>Maturity Value</TableHead>
                <TableHead>Maturity Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No fixed deposits found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                fds.map((fd) => {
                  const accrued = calculateAccruedInterest(
                    fd.principal,
                    fd.interestRate,
                    fd.startDate
                  )
                  const maturityValue = calculateMaturityValue(
                    fd.principal,
                    fd.interestRate,
                    fd.startDate,
                    fd.maturityDate,
                    fd.compoundingFrequency
                  )
                  return (
                    <TableRow key={fd.id}>
                      <TableCell className="font-medium">{fd.bankName}</TableCell>
                      <TableCell>{formatCurrency(fd.principal)}</TableCell>
                      <TableCell>{fd.interestRate}%</TableCell>
                      <TableCell className="text-green-500 font-medium">
                        {formatCurrency(accrued)}
                      </TableCell>
                      <TableCell>{formatCurrency(maturityValue)}</TableCell>
                      <TableCell>{format(new Date(fd.maturityDate), 'dd MMM yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FDForm initialData={{
                            id: fd.id,
                            bankName: fd.bankName,
                            principal: fd.principal,
                            interestRate: fd.interestRate,
                            startDate: format(new Date(fd.startDate), 'yyyy-MM-dd'),
                            maturityDate: format(new Date(fd.maturityDate), 'yyyy-MM-dd'),
                            compoundingFrequency: fd.compoundingFrequency,
                            TDSRate: fd.TDSRate
                          }} />
                          <DeleteAction id={fd.id} onDelete={deleteFixedDeposit} itemName={fd.bankName} />
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
