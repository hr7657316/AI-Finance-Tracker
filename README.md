# AI-Finance Tracker

A full-stack expense tracker built with Next.js (App Router), Clerk authentication, and Prisma + PostgreSQL.

## Features

- Authentication with Clerk (sign-in/sign-up routes + middleware protected pages)
- Accounts (create accounts, mark default)
- Transactions
	- Create income/expense transactions
	- Transactions list (recent transactions)
	- Account balance updates automatically on create/delete
- Modern UI using Tailwind + shadcn/ui components

## Tech Stack

- Next.js 15 (App Router)
- React 18
- Clerk (Auth)
- Prisma ORM
- PostgreSQL (tested with Neon)
- Tailwind CSS + shadcn/ui

## Local Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Set environment variables

This repo uses:

- `.env.local` for Next.js runtime
- `.env` for Prisma CLI (migrate/introspect)

Start from `.env.example`:

```bash
cp .env.example .env.local
cp .env.example .env
```

Fill in these values:

- `DATABASE_URL` (Postgres connection string)
	- On Neon: use the pooled/pgbouncer URL here
- `DIRECT_URL` (optional but recommended)
	- On Neon: use the non-pooled “Direct” connection string here for migrations
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### 3) Run Prisma migrations

```bash
npx prisma migrate dev
```

### 4) Start the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Routes

- `/` home
- `/sign-in` / `/sign-up` Clerk auth
- `/dashboard` (protected)
- `/account` (protected)
- `/transaction` (protected)
- `/transaction/create` (protected)

## Architecture (How it works)

### App Router

- `app/` contains pages/layouts.
- Pages are mostly Server Components; interactive forms are Client Components.

### Authentication

- Clerk provides the user session.
- `middleware.js` protects private routes.
- `lib/checkUser.js` syncs the signed-in Clerk user into the local `User` table.

### Database

- Prisma models live in `prisma/schema.prisma`.
- Main entities:
	- `User`
	- `Account` (with `balance`, `isDefault`)
	- `Transaction` (income/expense, category, date, optional description)
	- `Budget` (basic budget tracking)

### Server Actions

- `actions/*` contains server actions that run on the server and talk to Prisma.
- After mutations, pages are refreshed using `revalidatePath`.

## Common Issues

- Prisma can read `.env` by default for CLI commands; keep `.env` in sync with `.env.local`.
- If you update env vars, restart the dev server (and if needed remove `.next`).

## Deployment Notes

- Make sure env vars are configured in your hosting provider.
- If deploying to Vercel, configure Clerk + Postgres env vars in the Vercel project settings.
