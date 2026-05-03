import { Shell } from "@/components/shell"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateAccruedInterest } from "@/lib/calculations/interestCalculator"
import { format, differenceInDays } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"

import { DebentureDetailsChart } from "@/components/debentures/debenture-details-chart"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DebentureDetailsPage({ params }: { params: { id: string } }) {
  const debenture = await prisma.debenture.findUnique({
    where: { id: params.id },
    include: { transactions: true }
  })

  if (!debenture) notFound()

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const accrued = calculateAccruedInterest(
    debenture.faceValue,
    debenture.interestRate,
    debenture.lastInterestDate || debenture.purchaseDate
  )

  const daysHeld = differenceInDays(new Date(), new Date(debenture.purchaseDate))
  const dailyInterest = (debenture.faceValue * (debenture.interestRate / 100)) / 365

  // Mock data for growth chart
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      date: format(date, 'dd MMM'),
      interest: Math.max(0, parseFloat((accrued - (29 - i) * dailyInterest).toFixed(2)))
    }
  })

  return (
    <Shell>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/debentures">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{debenture.name}</h1>
            <Badge variant="secondary">{debenture.type}</Badge>
          </div>
          <p className="text-muted-foreground">Investment Dashboard & Accrued Interest Tracking</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Face Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(debenture.faceValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Interest Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{debenture.interestRate}%</div>
            <p className="text-xs text-muted-foreground">{debenture.interestFrequency}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accrued Interest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(accrued)}</div>
            <p className="text-xs text-muted-foreground">+{formatCurrency(dailyInterest)} / day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Days Held</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysHeld} Days</div>
            <p className="text-xs text-muted-foreground">Since {format(new Date(debenture.purchaseDate), 'dd MMM yyyy')}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Interest Accrual (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] pt-4">
          <DebentureDetailsChart data={chartData} />
        </CardContent>
      </Card>
    </Shell>
  )
}
