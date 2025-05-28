import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function TransactionsPage() {
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

  return (
    <main className="container mx-auto px-4 pt-28">
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            This route exists so navigation doesn't 404.
          </CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}
