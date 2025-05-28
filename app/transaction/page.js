import Link from "next/link";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getUserTransactions } from "@/actions/transaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

const formatDate = (dateValue) => {
  const date = new Date(dateValue);
  if (!Number.isFinite(date.getTime())) return "-";
  return date.toLocaleDateString();
};

export default async function TransactionsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  if (!process.env.DATABASE_URL) {
    return (
      <main className="container mx-auto px-4 pt-28">
        <Card>
          <CardHeader>
            <CardTitle>Database not configured</CardTitle>
            <CardDescription>
              Set `DATABASE_URL` in `.env.local` to use transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const transactions = await getUserTransactions({ limit: 100 });

  return (
    <main className="container mx-auto px-4 pt-28">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Recent income and expenses.</p>
        </div>
        <Button asChild>
          <Link href="/transaction/create">Create</Link>
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent</CardTitle>
          <CardDescription>Showing your latest transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          {!transactions?.length ? (
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{formatDate(t.date)}</TableCell>
                    <TableCell>{t.account?.name || "-"}</TableCell>
                    <TableCell>{t.type}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell className="text-right">
                      {t.type === "EXPENSE" ? "-" : "+"}
                      {Number(t.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="max-w-[320px] truncate">{t.description || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
