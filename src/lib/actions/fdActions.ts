"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { CompoundingFrequency } from "@prisma/client"

export async function addFixedDeposit(formData: any) {
  try {
    const fd = await prisma.fixedDeposit.create({
      data: {
        bankName: formData.bankName,
        principal: parseFloat(formData.principal),
        interestRate: parseFloat(formData.interestRate),
        startDate: new Date(formData.startDate),
        maturityDate: new Date(formData.maturityDate),
        compoundingFrequency: formData.compoundingFrequency as CompoundingFrequency,
        TDSRate: parseFloat(formData.TDSRate || "0"),
      },
    })

    revalidatePath("/")
    revalidatePath("/fixed-deposits")
    return { success: true, data: fd }
  } catch (error) {
    console.error("Failed to add FD:", error)
    return { success: false, error: "Failed to add Fixed Deposit" }
  }
}

export async function updateFixedDeposit(id: string, formData: any) {
  try {
    const fd = await prisma.fixedDeposit.update({
      where: { id },
      data: {
        bankName: formData.bankName,
        principal: parseFloat(formData.principal),
        interestRate: parseFloat(formData.interestRate),
        startDate: new Date(formData.startDate),
        maturityDate: new Date(formData.maturityDate),
        compoundingFrequency: formData.compoundingFrequency as CompoundingFrequency,
        TDSRate: parseFloat(formData.TDSRate || "0"),
      },
    })

    revalidatePath("/")
    revalidatePath("/fixed-deposits")
    return { success: true, data: fd }
  } catch (error) {
    console.error("Failed to update FD:", error)
    return { success: false, error: "Failed to update Fixed Deposit" }
  }
}

export async function deleteFixedDeposit(id: string) {
  try {
    await prisma.fixedDeposit.delete({
      where: { id },
    })
    revalidatePath("/")
    revalidatePath("/fixed-deposits")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete FD:", error)
    return { success: false, error: "Failed to delete Fixed Deposit" }
  }
}
