# BookMello

BookMello is an independent online bookstore for readers across Nepal. It
offers a curated book catalog, customer accounts, wishlist and cart features,
reviews, and Cash on Delivery checkout.

The application is built with Next.js and uses Supabase for authentication,
PostgreSQL data, Storage, and row-level security. Administrators can manage
books, categories, users, and orders from the admin console.

## Features

- Browse featured, new, and categorized books
- Search and filter the full catalog
- Book details with ratings and reviews
- Customer signup, login, profile, and password recovery
- Persistent cart and wishlist for signed-in customers
- Cash on Delivery checkout with delivery details
- Order history and order confirmation through WhatsApp
- Admin dashboard for books, categories, users, and orders
- Responsive light and dark themes
- SEO metadata, sitemap, robots rules, and Open Graph images

## Tech stack

- [Next.js 16](https://nextjs.org/) App Router and Route Handlers
- React 19 and TypeScript
- Tailwind CSS 4 and shadcn/ui components
- Supabase Auth, PostgreSQL, Storage, and Row Level Security
- Zod request and form validation
- Framer Motion, GSAP, and Embla Carousel for interaction and animation

## Requirements

- Node.js 20 or newer
- pnpm (the repository includes `pnpm-lock.yaml`)
- A Supabase project

## Getting started

Install dependencies:

```bash
pnpm install
```

Create `.env.local` manually using the variables below.

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_BOOKS_BUCKET=books

# Required by trusted server-side admin operations.
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_SERVICE_ROLE_KEY` must never be exposed to browser code or committed
to source control. The `.env*` files are ignored by Git.

`NEXT_PUBLIC_SITE_URL` defaults to `https://bookmello.com` when omitted.
`NEXT_PUBLIC_SUPABASE_BOOKS_BUCKET` is only needed when book cover URLs are
stored as paths in a Supabase Storage bucket.

## Database setup

The migrations in [`supabase/migrations`](./supabase/migrations) create the
supporting tables and functions used by the application, including profiles,
categories, reviews, carts, wishlists, orders, and order events.

The existing `public.books` table is intentionally not created or altered by
these migrations. Before applying them:

1. Confirm that `public.books.id` is a UUID.
2. Inspect the existing `books` publication/status column and RLS policies.
3. Apply the migrations in timestamp order.
4. Add `books` RLS policies appropriate to the existing schema, such as public
   read access for published books and admin management access.

See [`BACKEND.md`](./BACKEND.md) for the required read-only inspection queries
and backend authorization details.

## Available scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |

## Main routes

### Storefront

- `/` - Homepage with featured books and new arrivals
- `/all` - Full catalog with search and filters
- `/all/[id]` - Book details, reviews, cart, and wishlist actions
- `/genres` - Browse genres
- `/checkout` - Cash on Delivery checkout
- `/wishlist` - Saved books
- `/profile` - Customer profile, orders, and wishlist

### Account and policies

- `/login`
- `/signup`
- `/forgot-password`
- `/onboarding`
- `/privacy`
- `/terms`

### Admin

- `/admin/login`
- `/admin`
- `/admin/books`
- `/admin/books/new`
- `/admin/categories`
- `/admin/orders`
- `/admin/users`
- `/admin/settings`

Admin pages require an authenticated Supabase user with an active `ADMIN`
profile.

## API

The application exposes its backend-for-frontend under `/api/v1`:

- Authentication: `/auth/register`, `/auth/login`, `/auth/logout`,
  `/auth/callback`
- Catalog: `/home`, `/books`, `/books/[id]`, `/categories`
- Customer data: `/cart`, `/wishlist`, `/profile`
- Commerce: `/checkout`, `/orders`, `/orders/[id]`
- Reviews: `/books/[id]/reviews`
- Administration: `/users`

Mutation bodies are validated with Zod, and Supabase RLS remains the final
authorization boundary.

## Deployment

Build and run the production server with:

```bash
pnpm build
pnpm start
```

Configure the same Supabase and site URL variables in the deployment
environment. The application can be deployed to any platform that supports
Next.js server rendering and route handlers, including Vercel.
