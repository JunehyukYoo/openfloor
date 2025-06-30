# 📦 Backend - OpenFloor

## 📝 Overview

The backend is built using **Express** with **Passport.js (Local Strategy)** for authentication and **Prisma ORM** for database querying.
The database is a **PostgreSQL** instance. Static image hosting is handled via **AWS S3 buckets** and distributed through **AWS CloudFront CDN**.

## ⚙️ Key Notes & Considerations

- **Authentication:**
  Local authentication using `passport-local` with session-based login.

- **Database:**
  PostgreSQL. You must have PostgreSQL installed and configured locally to run the server in development.

- **File Hosting:**
  Static files (profile pictures, uploads) are stored in **AWS S3** and served via **CloudFront CDN.**
  You must create these services in AWS and provide the appropriate environment variables.
  Alternatively, you can modify the code to store files locally.

## 📂 Environment Setup

### Create a `.env.development` file:

```dotenv
NODE_ENV=development
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:PORTNUM/DBNAME
FRONTEND_URL=http://localhost:5173

S3_BUCKET_NAME=YOUR_S3_BUCKET_NAME
S3_BUCKET_BASE_URL=https://YOUR_S3_BUCKET_NAME.s3.YOUR_REGION.amazonaws.com
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY

CDN_DOMAIN_NAME=https://YOUR_CLOUD_FRONT_DOMAIN.cloudfront.net

SESSION_SECRET=YOUR_SESSION_SECRET
```

### 🔑 Environment Variable Notes:

- `FRONTEND_URL` should exactly match your frontend origin. No trailing slash.
- Use HTTPS for all production URLs.
- The `SESSION_SECRET` should be a long, secure random string.

## 🚀 Running the Backend Locally

```bash
npm install
npm run dev
```

✅ Starts the development server using `ts-node-dev` with live reloading.

## 🚀 Prisma Migration Instructions

### 1. **Create a new migration:**

```bash
npx prisma migrate dev --name your_migration_name
```

✅ This updates your local database schema and generates the migration files.

### 2. **Push the schema to production:**

```bash
npx prisma migrate deploy
```

✅ This applies all pending migrations to your Railway production database.

### 3. **Regenerate Prisma Client:**

```bash
npx prisma generate
```

✅ This updates the Prisma Client based on your current schema.

### 4. **Seeding (Optional):**

```bash
npx prisma db seed
```

✅ Seeds the database with initial data.

## 🚀 Production Deployment Notes

- **Backend Hosting:** Railway
- **Frontend Hosting:** Vercel

For production, create a `.env.production` file:

```dotenv
NODE_ENV=production
DATABASE_URL=YOUR_RAILWAY_DB_URL
FRONTEND_URL=https://YOUR_FRONTEND_VERCEL_URL

# AWS + CDN values remain the same
S3_BUCKET_NAME=...
S3_BUCKET_BASE_URL=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

CDN_DOMAIN_NAME=...

SESSION_SECRET=YOUR_PROD_SESSION_SECRET
```

### Railway Configuration:

- Set all production environment variables in Railway’s dashboard.
- Enable **Public Networking** to access the backend via HTTPS.

### Vercel Configuration:

- Set `VITE_BACKEND_URL=https://your-backend-production.up.railway.app/api` in Vercel environment variables.

## ✅ Key Deployment Checklist:

- PostgreSQL provisioned on Railway.
- Static files bucket created on AWS S3.
- CDN (CloudFront) distribution configured.
- Backend URL properly configured on Vercel.
- CORS origins match exactly (`FRONTEND_URL` without trailing slash).

## 🛠️ Tech Stack

- **Express.js** (API server)
- **Passport.js** (local authentication)
- **Prisma ORM** (database layer)
- **PostgreSQL** (database)
- **bcrypt.js** (password hashing)
- **AWS S3 + CloudFront** (file hosting & CDN)
- **Railway** (backend hosting)
- **Vercel** (frontend hosting)
