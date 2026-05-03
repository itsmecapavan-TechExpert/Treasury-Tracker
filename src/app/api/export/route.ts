import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const [debentures, mutualFunds, fixedDeposits] = await Promise.all([
    prisma.debenture.findMany(),
    prisma.mutualFund.findMany(),
    prisma.fixedDeposit.findMany(),
  ])

  let csvContent = "Type,Name/Bank,Principal/FaceValue,Rate/NAV,Date,Maturity\n"

  debentures.forEach(d => {
    csvContent += `Debenture,${d.name},${d.faceValue},${d.interestRate}%,${d.purchaseDate.toISOString().split('T')[0]},${d.maturityDate.toISOString().split('T')[0]}\n`
  })

  mutualFunds.forEach(f => {
    csvContent += `Mutual Fund,${f.name},0,0,${f.createdAt.toISOString().split('T')[0]},-\n`
  })

  fixedDeposits.forEach(fd => {
    csvContent += `FD,${fd.bankName},${fd.principal},${fd.interestRate}%,${fd.startDate.toISOString().split('T')[0]},${fd.maturityDate.toISOString().split('T')[0]}\n`
  })

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=portfolio_export.csv",
    },
  })
}
