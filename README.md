# PashuSetu (पशुसेतू)

## Smart Livestock Health Surveillance & Early Warning Decision-Support Platform

[![Deployment Ready](https://img.shields.io/badge/Deployment-Production%20Ready-brightgreen.svg)](#deployment-architecture)
[![SIH Problem Statement](https://img.shields.io/badge/SIH-Problem%20SIH26128-blue.svg)](#problem-statement)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb.svg)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20%2B%20TypeScript-3178c6.svg)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2F%20Prisma%20ORM-336791.svg)](https://www.prisma.io/)

> **SIH Problem Statement**: SIH26128  
> **Organization**: Government of Maharashtra  
> **Department**: Maharashtra State Innovation Society, Department of Skills, Employment, Entrepreneurship and Innovation  
> **Implementing Department**: Department of Animal Husbandry, Government of Maharashtra  
> **Theme**: MedTech / BioTech / HealthTech  
> **Tagline**: *Connecting Livestock Owners, Field Veterinarians & State Epidemiological Surveillance*

---

## Table of Contents
1. [Problem Statement](#1-problem-statement)
2. [Solution Overview](#2-solution-overview)
3. [Key Features by Role](#3-key-features-by-role)
4. [System Architecture](#4-system-architecture)
5. [Technology Stack](#5-technology-stack)
6. [Demo & Testing Credentials](#6-demo--testing-credentials)
7. [Environment Variables](#7-environment-variables)
8. [Local Development Setup](#8-local-development-setup)
9. [Database Setup & Prisma Migrations](#9-database-setup--prisma-migrations)
10. [Production Deployment Guide](#10-production-deployment-guide)
    - [Backend Deployment (Render / Railway)](#a-backend-deployment-render--railway)
    - [Database Deployment (Neon / Supabase / Render PostgreSQL)](#b-database-deployment-neon--supabase--render-postgresql)
    - [Frontend Deployment (Netlify)](#c-frontend-deployment-netlify)
11. [API Specification & Health Check](#11-api-specification--health-check)
12. [Security Best Practices](#12-security-best-practices)

---

## 1. Problem Statement

Livestock rearing constitutes a crucial livelihood foundation across Maharashtra's agrarian landscape. However, early detection of contagious and high-consequence epizootic diseases (such as Foot-and-Mouth Disease, Lumpy Skin Disease, Black Quarter, and Haemorrhagic Septicaemia) faces formidable hurdles:

- **Delayed Reporting**: Rural livestock owners lack immediate access to veterinary specialists.
- **Data Fragmentation**: Paper-based reporting delays alert transmission to state epidemiology cells.
- **Lack of Decision Support**: Absence of structured triaging leads to delayed interventions.
- **Geographic Blindspots**: Inability to visualize spatial clustering and contagion vectors in real time.

**PashuSetu** bridges this critical gap with a digital-first, bilingual surveillance and decision-support infrastructure.

---

## 2. Solution Overview

PashuSetu unites the three critical stakeholders of livestock healthcare:

```text
       👨‍🌾 Farmers
           ↓ (Report Symptoms & Photos)
   Rule-Based Risk Engine (0-100 Score & Triaging)
           ↓ (Prioritized Alert)
     🩺 Field Veterinarians
           ↓ (Clinical Diagnosis & E-Prescriptions)
  🏛️ State Government Epidemiologists
     (Real-Time GIS Heatmap & Outbreak Containment)
```

1. **Farmer Ingestion**: Simple species-first dropdowns, dynamic breed lists, photo upload with camera support, and symptom checklists with custom entries.
2. **Triaging & Automated Risk Engine**: Algorithmic scoring that assesses syndromic clusters and flags critical cases.
3. **Veterinary Clinical Review**: Case triage board with photo review, diagnosis submission, e-prescription generation, and laboratory sample dispatching.
4. **Outbreak Intelligence**: Real-time Leaflet GIS mapping with 15km cluster detection, radius visualization, and district-level containment status.
5. **Resilient Architecture**: Hybrid data layer with multi-tier fallback ensuring the application remains interactive during transient network interruptions.

---

## 3. Key Features by Role

### 👨‍🌾 Farmer Portal
- **Livestock Registry**: Individual digital animal profiles with Ear Tag identification, age, breed, and health badges.
- **Species & Dynamic Breed Selection**: Strict sequential selection (Cow, Buffalo, Goat, Sheep, Poultry) with dynamic indigenous and exotic breed catalogs plus "Other / Unknown" custom input.
- **Symptom & Photo Reporting**: Checklist of common and critical symptoms with custom text support for unlisted conditions, temperature, milk yield drop, and image evidence.
- **Booster & Vaccination Reminders**: Proactive vaccination tracking with due date indicators.
- **Veterinary Aid Locator**: Directory and contact list of nearby taluka polyclinics and dispensaries.

### 🩺 Veterinarian Portal
- **Caseload Triage**: Prioritized caseload queue organized by severity (Critical, High, Medium, Low).
- **Clinical Examination & Image Verification**: Full inspection of submitted animal photos and farmer notes.
- **Diagnosis & Treatment**: Submission of confirmed clinical diagnosis, prescription of medicines with dosages and administration routes, and follow-up scheduling.
- **Diagnostic Sample Tracking**: Creation and tracking of biological samples (Blood, Nasal Swab, Tissue, Milk) sent to regional disease investigation laboratories.

### 🏛️ Government & Surveillance Command
- **Epidemiological GIS Map**: Interactive Leaflet map displaying live disease cases, outbreak radii, and veterinary polyclinics.
- **Cluster & Outbreak Detection**: Automated alert generation when spatial density thresholds are exceeded in a 15km radius within 7 days.
- **Analytics & Trends**: Real-time incidence distribution, species vulnerability breakdowns, and vaccination coverage percentages.
- **Public Health Advisories**: State-wide or district-targeted multilingual advisory dissemination.

---

## 4. System Architecture

```text
                               ┌────────────────────────────────┐
                               │       GitHub Repository        │
                               │           (pashusetu)          │
                               └───────────────┬────────────────┘
                                               │
                      ┌────────────────────────┴────────────────────────┐
                      ▼                                                 ▼
        ┌───────────────────────────┐                     ┌───────────────────────────┐
        │     Netlify Frontend      │                     │     Backend Service       │
        │   (React 18 + Vite SPA)   │                     │ (Render / Railway / Node) │
        │                           │                     │                           │
        │ - public/_redirects (SPA) │                     │ - Express REST API        │
        │ - Responsive Tailwind CSS │  API Calls (CORS)   │ - Rule-Based Risk Engine  │
        │ - Leaflet GIS & Recharts  ├────────────────────►│ - JWT Auth & RBAC         │
        │ - Multi-tier Fallback     │                     │ - Multer / Cloud Storage  │
        └───────────────────────────┘                     └─────────────┬─────────────┘
                                                                        │
                                                                        ▼
                                                          ┌───────────────────────────┐
                                                          │   Cloud PostgreSQL DB     │
                                                          │ (Neon / Supabase / Render)│
                                                          │                           │
                                                          │ - 17 Relational Models    │
                                                          │ - Prisma Migrate Deploy   │
                                                          │ - Seeded Maharashtra Data │
                                                          └───────────────────────────┘
```

---

## 5. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 (TypeScript) | Declarative component UI |
| **Bundler & Build** | Vite 5 | High-speed production bundling |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive, modern utility design |
| **Geospatial Mapping** | Leaflet + React-Leaflet | Interactive disease surveillance & GIS maps |
| **Data Visualization** | Recharts | Epidemiological trend charts |
| **Routing** | React Router DOM v6 | Single Page Application client routing |
| **Backend Runtime** | Node.js + Express (TypeScript) | RESTful API engine |
| **Database ORM** | Prisma ORM 6 | Type-safe migrations & queries |
| **Database Engines** | PostgreSQL (Production) / SQLite (Dev) | Relational persistence |
| **Authentication** | JSON Web Tokens (JWT) + Bcrypt.js | Stateless RBAC authentication |
| **File Storage** | Cloudinary / Persistent Host Storage | Livestock & symptom photo evidence |

---

## 6. Demo & Testing Credentials

For evaluators and demonstration purposes, use these pre-configured accounts:

| Role | Username / Identifier | Password | Name & Location |
|---|---|---|---|
| 👨‍🌾 **Farmer** | `farmer@pashusetu.gov.in` | `Farmer@123` | Ramesh Tukaram Patil, Uruli Kanchan, Pune |
| 🩺 **Veterinarian** | `vet@pashusetu.gov.in` (or `VET-MH-2024-042`) | `Vet@123` | Dr. Aniket Kulkarni, Dist. Polyclinic, Pune |
| 🏛️ **Government Official** | `admin@pashusetu.gov.in` (or `MAH-AHD-001`) | `Admin@123` | Dr. Sunita Deshmukh, Joint Director, AHD |

> **Note**: A 1-click **Quick Demo Bar** is available across all screens for rapid testing without retyping credentials.

---

## 7. Environment Variables

### Root / Deployment Configuration (`.env.example`)
```env
# Backend Database (Cloud PostgreSQL: Neon, Supabase, Railway, Render)
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/pashusetu?sslmode=require

# Backend Configuration
PORT=5000
NODE_ENV=production
JWT_SECRET=your_strong_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS & Frontend Origins
FRONTEND_URL=https://your-pashusetu.netlify.app
CORS_ORIGIN=https://your-pashusetu.netlify.app

# Frontend Build (Vite)
VITE_API_URL=https://your-pashusetu-api.onrender.com/api

# Optional: Cloudinary for Persistent Photo Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 8. Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/pashusetu.git
cd pashusetu
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
npm install
```

### 3. Initialize Database & Seed Demo Data
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema or apply migrations
npm run prisma:push

# Seed with authentic Maharashtra demo records
npm run prisma:seed
```

### 4. Run Backend Server
```bash
npm run dev
# Server starts at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### 5. Configure & Run Frontend
```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
# Application starts at http://localhost:5173
```

---

## 9. Database Setup & Prisma Migrations

PashuSetu utilizes **Prisma ORM** with 17 relational models covering users, animals, symptom reports, risk assessments, veterinary cases, prescriptions, vaccinations, lab samples, and disease outbreaks.

### Production Migration Command
```bash
# Run non-destructive production migrations
npx prisma migrate deploy

# Seed baseline demo records
npm run prisma:seed
```

> **Warning**: Never execute `prisma migrate reset` on a production database.

---

## 10. Production Deployment Guide (Bhumi-Satya Architecture)

```text
GitHub
   │
   ├── Frontend → Netlify
   │
   └── Backend → Railway
                    │
                    ↓
              Supabase PostgreSQL & Storage
```

### A. Database & Storage Deployment (Supabase)
1. Sign in to [Supabase](https://supabase.com) and click **New Project**.
2. Set the Project Name: `pashusetu`, choose your region (e.g. `ap-south-1 (Mumbai)`), and set a strong database password.
3. Retrieve your **PostgreSQL Connection String**:
   - Go to **Project Settings → Database → Connection String → URI**.
   - Use the URI format:
     ```text
     postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
     ```
     *(Or the direct port 5432 connection URI)*
4. Create the **Supabase Storage Bucket** for livestock photos:
   - Go to **Storage → Buckets → New Bucket**.
   - Name: `pashusetu-photos`.
   - Set **Public Bucket** to `ON` (enables public read access for animal & clinical evidence photos).
5. Retrieve your **API Keys**:
   - Go to **Project Settings → API**.
   - Copy `Project URL` (e.g. `https://[PROJECT-REF].supabase.co`).
   - Copy `service_role` secret key (for backend server storage uploads).

### B. Backend Deployment (Railway)
1. Sign in to [Railway](https://railway.com/) and click **New Project → Deploy from GitHub repo**.
2. Select your `pashusetu` repository.
3. In Railway service **Settings**:
   - **Root Directory**: Set to `/backend` (or use the included root `railway.json`).
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run prisma:migrate:deploy && npm start`
4. In Railway service **Variables**, add:
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
   JWT_SECRET=pashusetu_sih_secure_jwt_token_secret_key_2026
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://[YOUR-NETLIFY-SITE].netlify.app
   CORS_ORIGIN=https://[YOUR-NETLIFY-SITE].netlify.app
   SUPABASE_URL=https://[PROJECT-REF].supabase.co
   SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-SECRET]
   SUPABASE_STORAGE_BUCKET=pashusetu-photos
   ```
   *(Note: Railway automatically provides and binds the `PORT` variable).*
5. Deploy the service. Once deployed, click **Generate Domain** in the Networking section:
   Example: `https://pashusetu-backend-production.up.railway.app`
6. Run the database seed script to populate demo records:
   - In Railway, open the service **Deployments → View Logs** or open the **CLI / Terminal** tab:
     ```bash
     npm run prisma:seed
     ```
7. Verify health check:
   ```bash
   curl https://<your-railway-domain>.up.railway.app/api/health
   # Response: {"status":"ok","service":"PashuSetu API",...}
   ```

### C. Frontend Deployment (Netlify)
1. Sign in to [Netlify](https://app.netlify.com/) and select **Add new site → Import an existing project**.
2. Select your `pashusetu` GitHub repository.
3. Configure Build Settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Add Environment Variable in Netlify **Site configuration → Environment variables**:
   ```env
   VITE_API_URL=https://[YOUR-RAILWAY-DOMAIN].up.railway.app/api
   ```
5. Click **Deploy Site**.
6. SPA routing is managed automatically via `frontend/public/_redirects` and `frontend/netlify.toml` (`/*  /index.html  200`), preventing 404s on deep links like `/farmer/dashboard`, `/veterinarian/cases`, or `/government/dashboard`.

---

## 11. API Specification & Health Check

### Health Check Endpoint
```http
GET /api/health
```
**Response (200 OK):**
```json
{
  "status": "ok",
  "service": "PashuSetu Backend API",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2026-09-07T15:00:00.000Z",
  "sihProblemStatement": "SIH26128",
  "department": "Department of Animal Husbandry, Government of Maharashtra"
}
```

### Core API Endpoints
| Method | Route | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated profile | Bearer JWT |
| `GET` | `/api/animals` | List farmer livestock roster | Bearer JWT |
| `POST` | `/api/animals` | Register new animal | Bearer JWT (Farmer) |
| `POST` | `/api/reports` | Submit symptom report & execute risk engine | Bearer JWT (Farmer) |
| `GET` | `/api/cases` | Fetch prioritized veterinary caseload | Bearer JWT (Vet/Govt) |
| `POST` | `/api/cases/:id/diagnose`| Submit clinical diagnosis | Bearer JWT (Vet) |
| `POST` | `/api/treatments` | Issue veterinary e-prescription | Bearer JWT (Vet) |
| `POST` | `/api/samples` | Order & track diagnostic lab sample | Bearer JWT (Vet) |
| `GET` | `/api/government/stats` | State-wide surveillance KPI counters | Bearer JWT (Govt) |
| `GET` | `/api/government/gis-data` | Geospatial points for outbreak mapping | Bearer JWT (Govt) |
| `POST` | `/api/upload` | Upload animal or health evidence photo | Bearer JWT / Form |

---

## 12. Security Best Practices

- **Zero Hardcoded Secrets**: All keys, secrets, and database credentials are read strictly via environment variables.
- **Cryptographic Hashing**: Passwords stored using industry-standard Bcrypt with 10 salt rounds.
- **Stateless Authorization**: Cryptographically signed JWT tokens with expiry enforcement.
- **Restricted CORS**: Origin validation dynamically restricts cross-site requests to authorized frontend domains.
- **Defensive Triaging**: All rule-based risk calculations are tagged with explicit clinical decision-support disclaimers to ensure qualified veterinary diagnosis.
- **Fail-Safe Client Architecture**: If network communication is temporarily disrupted, the client utilizes cached and fallback demo records without breaking the user experience.

---

*Developed for the Smart India Hackathon | Problem Statement SIH26128 | Government of Maharashtra*
