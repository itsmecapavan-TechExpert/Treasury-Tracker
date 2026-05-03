import { Shell } from "@/components/shell"
import prisma from "@/lib/prisma"
import { DebentureForm } from "@/components/debentures/debenture-form"
import { DebentureTable } from "@/components/debentures/debenture-table"

export default async function DebenturesPage() {
  const debentures = await prisma.debenture.findMany({
    include: { transactions: true },
    orderBy: { purchaseDate: 'desc' }
  })

  return (
    <Shell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Debentures</h1>
          <p className="text-muted-foreground">Manage and track your corporate and government bonds.</p>
        </div>
        <DebentureForm />
      </div>

      <DebentureTable initialData={debentures} />
    </Shell>
  )
}
