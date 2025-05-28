import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import CreateAccountDrawer from "@/components/create-account-drawer";
import { Button } from "@/components/ui/button";

import { getUserAccounts } from "@/actions/dashboard";

function MissingEnv() {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-lg font-semibold">Missing database configuration</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Prisma needs <span className="font-mono">DATABASE_URL</span> (and optionally{" "}
        <span className="font-mono">DIRECT_URL</span>) to connect.
      </p>
      <pre className="mt-3 overflow-auto rounded-md bg-muted p-3 text-xs">
{`# .env.local
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"`}
      </pre>
      <p className="mt-3 text-sm text-muted-foreground">
        After setting it, run <span className="font-mono">npx prisma migrate dev</span> and restart the dev server.
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  if (!process.env.DATABASE_URL) {
    return (
      <main className="container mx-auto px-4 pt-28">
        <MissingEnv />
      </main>
    );
  }

  let accounts = [];
  try {
    accounts = await getUserAccounts();
  } catch (error) {
    return (
      <main className="container mx-auto px-4 pt-28">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Database not ready</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The app can’t query accounts yet. If this is a fresh DB, run{" "}
            <span className="font-mono">npx prisma migrate dev</span>.
          </p>
          <pre className="mt-3 overflow-auto rounded-md bg-muted p-3 text-xs">
            {String(error?.message || error)}
          </pre>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 pt-28">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <CreateAccountDrawer>
          <Button>Create account</Button>
        </CreateAccountDrawer>
      </div>

      <div className="mt-6 rounded-lg border">
        <div className="border-b p-4 text-sm text-muted-foreground">
          Accounts ({accounts.length})
        </div>
        <div className="divide-y">
          {accounts.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No accounts yet. Create your first account to get started.
            </div>
          ) : (
            accounts.map((account) => (
              <div key={account.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{account.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {account.type}
                      {account.isDefault ? " • Default" : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{account.balance}</div>
                    <div className="text-sm text-muted-foreground">
                      {account._count?.transactions ?? 0} transactions
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
