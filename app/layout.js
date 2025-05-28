import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";

export const metadata = {
  title: "SpendWise AI",
  description: "AI-powered expense tracking and financial insights",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
