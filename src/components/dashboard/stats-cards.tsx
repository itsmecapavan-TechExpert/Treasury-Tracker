import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Landmark, IndianRupee } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  stats: {
    totalCost: number;
    currentValue: number;
    accruedIncome: number;
    realizedIncome: number;
    unrealizedGains: number;
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const items = [
    {
      title: "Total Investment",
      value: formatCurrency(stats.totalCost),
      icon: Wallet,
      description: "Original principal",
      color: "text-blue-500",
    },
    {
      title: "Current Value",
      value: formatCurrency(stats.currentValue),
      icon: TrendingUp,
      description: "Market value + Accrued",
      color: "text-green-500",
    },
    {
      title: "Accrued Income",
      value: formatCurrency(stats.accruedIncome),
      icon: Landmark,
      description: "Earned but not received",
      color: "text-yellow-500",
    },
    {
      title: "Realized Income",
      value: formatCurrency(stats.realizedIncome),
      icon: IndianRupee,
      description: "Interest received in bank",
      color: "text-emerald-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={cn("h-4 w-4", item.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}
      <Card className="md:col-span-2 lg:col-span-4 bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unrealized Gains / Losses</p>
              <div className={cn(
                "text-3xl font-bold mt-1",
                stats.unrealizedGains >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {formatCurrency(stats.unrealizedGains)}
                <span className="text-sm ml-2 font-normal">
                  ({((stats.unrealizedGains / stats.totalCost) * 100 || 0).toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className={cn(
              "p-3 rounded-full",
              stats.unrealizedGains >= 0 ? "bg-green-500/10" : "bg-red-500/10"
            )}>
              {stats.unrealizedGains >= 0 ? (
                <ArrowUpRight className={cn("h-8 w-8", "text-green-500")} />
              ) : (
                <ArrowDownRight className={cn("h-8 w-8", "text-red-500")} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
