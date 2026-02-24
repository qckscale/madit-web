---
name: Sanity Local Dev Dataset Setup
overview: ""
todos:
  - id: 1bd3efe1-50d2-4005-99c7-d5edf157d116
    content: Create development dataset and copy production data
    status: pending
  - id: 5969eb79-ca4c-43c8-b437-57a44acb8e2c
    content: Update CMS configuration files to use development dataset
    status: pending
  - id: 2aaf5aca-242f-4475-ac8b-812990fe600c
    content: Create .env.local file with development dataset configuration
    status: pending
  - id: 1425f6af-ffe3-4e20-be83-db494d3dfd31
    content: Test both CMS and frontend with development dataset
    status: pending
---

# Sanity Local Dev Dataset Setup

## Overview

Set up a local development environment using a new Sanity dataset (`development`) with copied production content, ensuring both the CMS and frontend can work independently from production.

## Implementation Steps

### 1. Install Dependencies

**Install packages for both projects:**

CMS:

```bash
cd madit-cms-main
npm install
```

Frontend:

```bash
cd madit-front-main
npm install
```

### 2. Authenticate with Sanity

**Location:** `madit-cms-main/` directory

Login to Sanity to manage datasets:

```bash
cd madit-cms-main
npx sanity login
```

This will open a browser window for authentication.

### 3. Check and Create Dev Dataset

**Location:** `madit-cms-main/` directory

Run Sanity CLI commands to check existing datasets and create new one:

```bash
npx sanity dataset list  # Check if 'development' exists
npx sanity dataset create dev  # Create if needed
```

### 4. Copy Production Data to Dev Dataset

**Location:** `madit-cms-main/` directory

Export production data and import to development:

```bash
npx sanity dataset export production production-backup.tar.gz
npx sanity dataset import production-backup.tar.gz dev
```

### 3. Update CMS Configuration

**Files to modify:**

- `madit-cms-main/sanity.config.ts` - Change line 12: `dataset: 'dev'`
- `madit-cms-main/sanity.cli.ts` - Change line 6: `dataset: 'dev'`

### 4. Configure Frontend Environment

**Create:** `madit-front-main/.env.local`

Add environment variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=fy9oz1h7
NEXT_PUBLIC_SANITY_DATASET=dev
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=<your-token-here>
```

Note: You'll need to get a Sanity API token from the Sanity dashboard (Settings → API → Tokens)

### 5. Verify Setup

- Start CMS: `cd madit-cms-main && npm run dev`
- Start frontend: `cd madit-front-main && npm run dev`
- Verify both connect to the development dataset

## Key Files

- `madit-cms-main/sanity.config.ts` (line 12)
- `madit-cms-main/sanity.cli.ts` (line 6)
- `madit-front-main/.env.local` (new file)
- `madit-front-main/sanity/client.tsx` (already configured to read from env vars)

## Notes

- The `.env.local` file will be gitignored automatically
- Production dataset remains untouched
- You can switch back to production by reverting CMS files and changing .env.local