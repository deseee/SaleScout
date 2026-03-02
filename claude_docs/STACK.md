# STACK LOCK

This document defines locked technical decisions.
Stack changes require explicit user approval.
No silent library substitutions.

---

## Frontend

- Framework: Next.js 14 (Pages Router)
- Styling: Tailwind CSS
- Server State: @tanstack/react-query
- Forms: React Hook Form + Zod
- PWA: next-pwa
- SEO: next-sitemap

---

## Backend

- Runtime: Node.js
- Framework: Express
- ORM: Prisma
- Validation: Zod
- Auth: JWT + bcrypt
- File Upload: Multer
- Payments: Stripe (Connect + application_fee_amount)
- Email: Resend
- SMS: Twilio
- Background Jobs: node-cron
- Realtime: Socket.io (for auctions)
- Security Headers: Helmet
- Rate Limiting: express-rate-limit

---

## Database

- Engine: PostgreSQL
- Schema Source of Truth: Prisma

---

## Maps & Geocoding

- Map: Leaflet + react-leaflet
- Tiles: OpenStreetMap
- Geocoding: Nominatim (backend cache layer)

---

## Image Storage

- Primary: Cloudinary OR Vercel Blob
- Direct browser upload (signed URL)
- CDN-delivered

---

## Infrastructure

- Monorepo: pnpm workspaces
- Containerization: Docker
- Version Control: GitHub
- Deployment: TBD (Vercel or self-hosted)

---

## Architecture Principles

- Monorepo separation: frontend / backend / database / shared
- Prisma = schema authority
- Stateless auth (JWT)
- Stripe handles compliance
- PWA over native app

---

Change Control:
Any stack modification must update this file.