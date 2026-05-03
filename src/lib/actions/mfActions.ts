"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { MFType, MFTransactionType } from "@prisma/client"

export async function addMutualFund(formData: any) {
  try {
    const mf = await prisma.mutualFund.create({
      data: {
        name: formData.name,
        AMC: formData.AMC,
        type: formData.type as MFType,
      },
    })

    revalidatePath("/")
    revalidatePath("/mutual-funds")
    return { success: true, data: mf }
  } catch (error) {
    console.error("Failed to add mutual fund:", error)
    return { success: false, error: "Failed to add mutual fund" }
  }
}

export async function addMFTransaction(fundId: string, formData: any) {
  try {
    const transaction = await prisma.mFTransaction.create({
      data: {
        fundId,
        type: formData.type as MFTransactionType,
        units: parseFloat(formData.units),
        NAV: parseFloat(formData.NAV),
        date: new Date(formData.date),
      },
    })

    revalidatePath("/")
    revalidatePath("/mutual-funds")
    return { success: true, data: transaction }
  } catch (error) {
    console.error("Failed to add MF transaction:", error)
    return { success: false, error: "Failed to add MF transaction" }
  }
}

export async function updateMutualFund(id: string, formData: any) {
  try {
    const mf = await prisma.mutualFund.update({
      where: { id },
      data: {
        name: formData.name,
        AMC: formData.AMC,
        type: formData.type as MFType,
      },
    })

    revalidatePath("/")
    revalidatePath("/mutual-funds")
    return { success: true, data: mf }
  } catch (error) {
    console.error("Failed to update mutual fund:", error)
    return { success: false, error: "Failed to update mutual fund" }
  }
}

export async function deleteMutualFund(id: string) {
  try {
    await prisma.mutualFund.delete({
      where: { id },
    })
    revalidatePath("/")
    revalidatePath("/mutual-funds")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete mutual fund:", error)
    return { success: false, error: "Failed to delete mutual fund" }
  }
}
