"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { InterestFrequency, DebentureType } from "@prisma/client"

export async function addDebenture(formData: any) {
  try {
    const debenture = await prisma.debenture.create({
      data: {
        name: formData.name,
        faceValue: parseFloat(formData.faceValue),
        purchaseValue: parseFloat(formData.purchaseValue),
        cleanPrice: formData.cleanPrice ? parseFloat(formData.cleanPrice) : null,
        interestRate: parseFloat(formData.interestRate),
        quantity: parseInt(formData.quantity),
        purchaseDate: new Date(formData.purchaseDate),
        maturityDate: new Date(formData.maturityDate),
        interestFrequency: formData.interestFrequency as InterestFrequency,
        type: formData.type as DebentureType,
        lastInterestDate: formData.lastInterestDate ? new Date(formData.lastInterestDate) : null,
      },
    })

    revalidatePath("/")
    revalidatePath("/debentures")
    return { success: true, data: debenture }
  } catch (error) {
    console.error("Failed to add debenture:", error)
    return { success: false, error: "Failed to add debenture" }
  }
}

export async function deleteDebenture(id: string) {
  try {
    await prisma.debenture.delete({
      where: { id },
    })
    revalidatePath("/")
    revalidatePath("/debentures")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete debenture:", error)
    return { success: false, error: "Failed to delete debenture" }
  }
}

export async function addDebentureTransaction(debentureId: string, type: 'INTEREST' | 'REDEMPTION', amount: number, date: Date) {
  try {
    const transaction = await prisma.debentureTransaction.create({
      data: {
        debentureId,
        type,
        amount,
        date,
      },
    })
    
    // If it's an interest transaction, update lastInterestDate
    if (type === 'INTEREST') {
      await prisma.debenture.update({
        where: { id: debentureId },
        data: { lastInterestDate: date }
      })
    }

    revalidatePath("/")
    revalidatePath("/debentures")
    return { success: true, data: transaction }
  } catch (error) {
    console.error("Failed to add transaction:", error)
    return { success: false, error: "Failed to add transaction" }
  }
}

export async function updateDebenture(id: string, formData: any) {
  try {
    const debenture = await prisma.debenture.update({
      where: { id },
      data: {
        name: formData.name,
        faceValue: parseFloat(formData.faceValue),
        purchaseValue: parseFloat(formData.purchaseValue),
        cleanPrice: formData.cleanPrice ? parseFloat(formData.cleanPrice) : null,
        interestRate: parseFloat(formData.interestRate),
        quantity: parseInt(formData.quantity),
        purchaseDate: new Date(formData.purchaseDate),
        maturityDate: new Date(formData.maturityDate),
        interestFrequency: formData.interestFrequency as InterestFrequency,
        type: formData.type as DebentureType,
        lastInterestDate: formData.lastInterestDate ? new Date(formData.lastInterestDate) : null,
      },
    })

    revalidatePath("/")
    revalidatePath("/debentures")
    return { success: true, data: debenture }
  } catch (error) {
    console.error("Failed to update debenture:", error)
    return { success: false, error: "Failed to update debenture" }
  }
}
