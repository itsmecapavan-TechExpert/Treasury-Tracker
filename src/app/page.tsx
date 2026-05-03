import { Shell } from "@/components/shell"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { AllocationChart } from "@/components/dashboard/allocation-chart"
import { IncomeChart } from "@/components/dashboard/income-chart"
import { DashboardActions } from "@/components/dashboard/dashboard-actions"
import { getPortfolioStats } from "@/lib/services/portfolioService"

export default async function DashboardPage() {
  const stats = await getPortfolioStats();

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your investments.</p>
        </div>
        <DashboardActions />
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-3">
        <AllocationChart data={stats.allocation} />
        <IncomeChart />
      </div>

      {/* Recent Activity or Summary Table could go here */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Placeholder for more modules */}
      </div>
    </Shell>
  )
}
