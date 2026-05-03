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
import { MFForm } from "@/components/mutual-funds/mf-form"
import { MFTransactionForm } from "@/components/mutual-funds/mf-transaction-form"
import { DeleteAction } from "@/components/delete-action"
import { deleteMutualFund } from "@/lib/actions/mfActions"
import { calculateXIRR } from "@/lib/calculations/xirrCalculator"
import { Badge } from "@/components/ui/badge"

export default async function MutualFundsPage() {
  const funds = await prisma.mutualFund.findMany({
    include: { transactions: true },
    orderBy: { name: 'asc' }
  })

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mutual Funds</h1>
          <p className="text-muted-foreground">Monitor your equity and debt fund performance.</p>
        </div>
        <MFForm />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund Name</TableHead>
                <TableHead>AMC</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Avg Cost</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No mutual funds found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                funds.map((f) => {
                  let totalUnits = 0;
                  let totalCost = 0;
                  const cashFlows = f.transactions.map(t => ({
                    amount: t.type === 'BUY' ? -(t.units * t.NAV) : (t.units * t.NAV),
                    date: t.date
                  }));
                  
                  f.transactions.forEach(t => {
                    if (t.type === 'BUY') {
                      totalUnits += t.units;
                      totalCost += t.units * t.NAV;
                    } else {
                      totalUnits -= t.units;
                    }
                  });

                  const avgCost = totalUnits > 0 ? totalCost / totalUnits : 0;
                  const mockCurrentNAV = avgCost * 1.15;
                  const mockCurrentValue = totalUnits * mockCurrentNAV;
                  
                  if (totalUnits > 0) {
                    cashFlows.push({ amount: mockCurrentValue, date: new Date() });
                  }
                  
                  const xirr = calculateXIRR(cashFlows);

                  return (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.name}</TableCell>
                      <TableCell className="text-muted-foreground">{f.AMC}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{f.type}</Badge>
                      </TableCell>
                      <TableCell>{totalUnits.toFixed(4)}</TableCell>
                      <TableCell>{formatCurrency(avgCost)}</TableCell>
                      <TableCell className="text-green-500 font-medium">
                        {formatCurrency(mockCurrentValue)}
                        <span className="text-xs ml-1 font-normal">
                          ({(xirr * 100).toFixed(2)}% XIRR)
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MFTransactionForm fundId={f.id} fundName={f.name} />
                          <MFForm initialData={{ id: f.id, name: f.name, AMC: f.AMC, type: f.type }} />
                          <DeleteAction id={f.id} onDelete={deleteMutualFund} itemName={f.name} />
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
