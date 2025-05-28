import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["CURRENT", "SAVINGS"], {
    required_error: "Account type is required",
  }),
  balance: z
    .union([z.string(), z.number()])
    .transform((value) => (typeof value === "string" ? value.trim() : value))
    .refine((value) => {
      const numeric = typeof value === "number" ? value : Number(value);
      return Number.isFinite(numeric);
    }, "Balance must be a number"),
  isDefault: z.boolean().default(false),
});

export const transactionSchema = z.object({
  accountId: z.string().min(1, "Account is required"),
  type: z.enum(["INCOME", "EXPENSE"], {
    required_error: "Transaction type is required",
  }),
  category: z.string().min(1, "Category is required"),
  amount: z
    .union([z.string(), z.number()])
    .transform((value) => (typeof value === "string" ? value.trim() : value))
    .refine((value) => {
      const numeric = typeof value === "number" ? value : Number(value);
      return Number.isFinite(numeric) && numeric > 0;
    }, "Amount must be greater than 0"),
  date: z
    .union([z.string(), z.date()])
    .transform((value) => (value instanceof Date ? value : new Date(value)))
    .refine((value) => Number.isFinite(value.getTime()), "Date is required"),
  description: z
    .string()
    .optional()
    .transform((value) => (value ? value.trim() : undefined)),
});
