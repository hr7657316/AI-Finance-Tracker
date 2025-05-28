"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { transactionSchema } from "@/app/lib/schema";
import { db } from "@/lib/prisma";

const serialize = (obj) => {
  const serialized = { ...obj };

  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }

  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }

  return serialized;
};

export async function createTransaction(data) {
  try {
    const parsed = transactionSchema.parse(data);

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const account = await db.account.findFirst({
      where: {
        id: parsed.accountId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!account) throw new Error("Account not found");

    const amountNumber =
      typeof parsed.amount === "number" ? parsed.amount : Number(parsed.amount);

    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      throw new Error("Invalid amount");
    }

    const balanceChange = parsed.type === "EXPENSE" ? -amountNumber : amountNumber;

    const transaction = await db.$transaction(async (tx) => {
      const created = await tx.transaction.create({
        data: {
          type: parsed.type,
          amount: amountNumber,
          description: parsed.description,
          date: parsed.date,
          category: parsed.category,
          userId: user.id,
          accountId: parsed.accountId,
          isRecurring: false,
        },
      });

      await tx.account.update({
        where: { id: parsed.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      });

      return created;
    });

    revalidatePath("/dashboard");
    revalidatePath("/transaction");
    revalidatePath(`/account/${parsed.accountId}`);

    return { success: true, data: serialize(transaction) };
  } catch (error) {
    return { success: false, error: error?.message || "Failed to create transaction" };
  }
}

export async function getUserTransactions({ limit = 50 } = {}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: limit,
    include: {
      account: {
        select: { id: true, name: true },
      },
    },
  });

  return transactions.map(serialize);
}
