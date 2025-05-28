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
