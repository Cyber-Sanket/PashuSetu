const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Attempt to load .env if available, but do not fail if not present
try {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
} catch (e) {}

const prismaDir = path.join(__dirname, '../prisma');
const schemaPath = path.join(prismaDir, 'schema.prisma');

// Fix for Prisma P1012 error ("Environment variable not found: DATABASE_URL"):
// During build time (e.g. Nixpacks / Railway build phase), Prisma generate only validates
// the schema datamodel and datasource protocol. It does not initiate a database connection.
// If DATABASE_URL is not yet set in the build container, provide a valid fallback PostgreSQL URI.
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
  // In-memory placeholder strictly for Prisma generate datamodel validation during headless build phase
  process.env.DATABASE_URL = 'postgresql://build_user:build_placeholder@127.0.0.1:5432/pashusetu_build';
}

// Guarantee schema.prisma is configured for Supabase PostgreSQL
if (fs.existsSync(schemaPath)) {
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
  if (schemaContent.includes('provider = "sqlite"')) {
    console.log('[PashuSetu DB] Ensuring schema.prisma datasource is set to postgresql for Supabase...');
    schemaContent = schemaContent.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
    fs.writeFileSync(schemaPath, schemaContent, 'utf8');
  }
}

console.log('[PashuSetu DB] Generating Prisma Client for Supabase PostgreSQL...');
try {
  execSync('npx prisma generate', {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env },
    stdio: 'inherit',
  });
  console.log('[PashuSetu DB] Prisma Client generated successfully.');
} catch (error) {
  console.error('[PashuSetu DB] Error generating Prisma Client:', error.message);
  process.exit(1);
}
