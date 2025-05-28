"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createTransaction } from "@/actions/transaction";
import { defaultCategories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateTransactionForm({ accounts }) {
  const router = useRouter();

  const defaultAccountId =
    accounts?.find((a) => a.isDefault)?.id || accounts?.[0]?.id || "";

  const [accountId, setAccountId] = useState(defaultAccountId);
  const [type, setType] = useState("EXPENSE");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(() => {
    const first = defaultCategories.find((c) => c.type === "EXPENSE");
    return first?.id || "";
  });
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categoryOptions = useMemo(() => {
    return defaultCategories.filter((c) => c.type === type);
  }, [type]);

  const onTypeChange = (nextType) => {
    setType(nextType);
    const first = defaultCategories.find((c) => c.type === nextType);
    setCategory(first?.id || "");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!accountId) {
      toast.error("Select an account");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createTransaction({
        accountId,
        type,
        category,
        amount,
        date,
        description,
      });

      if (!result?.success) {
        toast.error(result?.error || "Failed to create transaction");
        return;
      }

      toast.success("Transaction created");
      router.push("/transaction");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Transaction</CardTitle>
        <CardDescription>Add an income or expense to an account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Account</label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {(accounts || []).map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={type} onValueChange={onTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Description (optional)</label>
            <Input
              type="text"
              placeholder="e.g., Grocery shopping"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
