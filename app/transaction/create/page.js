import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CreateTransactionPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <main className="container mx-auto px-4 pt-28">
      <h1 className="text-2xl font-semibold">Create Transaction</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This route exists so navigation works. Transaction creation UI isn’t implemented in this repo snapshot yet.
      </p>
    </main>
  );
}
