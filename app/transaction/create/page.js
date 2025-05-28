import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Link from "next/link";

import { getUserAccounts } from "@/actions/dashboard";
import CreateTransactionForm from "@/components/create-transaction-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function CreateTransactionPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  if (!process.env.DATABASE_URL) {
    return (
      <main className="container mx-auto px-4 pt-28">
        <Card>
          <CardHeader>
            <CardTitle>Database not configured</CardTitle>
            <CardDescription>
              Set `DATABASE_URL` in `.env.local` to create transactions.
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

  const accounts = await getUserAccounts();

  if (!accounts?.length) {
    return (
      <main className="container mx-auto px-4 pt-28">
        <Card>
          <CardHeader>
            <CardTitle>No accounts yet</CardTitle>
            <CardDescription>Create an account first to add transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 pt-28">
      <CreateTransactionForm accounts={accounts} />
    </main>
  );
}
