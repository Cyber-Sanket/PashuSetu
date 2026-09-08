const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Attempt to load .env if available, but do not fail if not present
try {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
} catch (e) {}

const prismaDir = path.join(__dirname, '../prisma');
const schemaPath = path.join(prismaDir, 'schema.prisma');

// Determine database target provider
const rawDbUrl = (process.env.DATABASE_URL || '').trim();
const isSqlite = rawDbUrl.startsWith('file:') || (!rawDbUrl && fs.existsSync(path.join(prismaDir, 'data/pashusetu.db')));
const targetProvider = isSqlite ? 'sqlite' : 'postgresql';

// Fix for Prisma P1012 error ("Environment variable not found: DATABASE_URL"):
// During build time (e.g. Nixpacks / Railway build phase), Prisma generate only validates
// the schema datamodel and datasource protocol. It does not initiate a database connection.
// If DATABASE_URL is not yet set in the build container, provide a valid fallback PostgreSQL URI.
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
  process.env.DATABASE_URL = isSqlite
    ? 'file:./data/pashusetu.db'
    : 'postgresql://build_user:build_placeholder@127.0.0.1:5432/pashusetu_build';
}

// Align schema.prisma datasource provider dynamically with configured DATABASE_URL
if (fs.existsSync(schemaPath)) {
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const providerMatch = schemaContent.match(/provider\s*=\s*"(sqlite|postgresql)"/);
  if (providerMatch && providerMatch[1] !== targetProvider) {
    console.log(`[PashuSetu DB] Aligning schema.prisma datasource provider to ${targetProvider}...`);
    schemaContent = schemaContent.replace(/provider\s*=\s*"(sqlite|postgresql)"/, `provider = "${targetProvider}"`);
    fs.writeFileSync(schemaPath, schemaContent, 'utf8');
  }
}

console.log(`[PashuSetu DB] Generating Prisma Client for ${targetProvider}...`);
try {
  const prismaBin = path.join(__dirname, '../node_modules/prisma/build/index.js');
  if (fs.existsSync(prismaBin)) {
    execSync(`node "${prismaBin}" generate`, {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env },
      stdio: 'inherit',
    });
  } else {
    execSync('npx prisma generate', {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env },
      stdio: 'inherit',
    });
  }
  console.log('[PashuSetu DB] Prisma Client generated successfully.');
} catch (error) {
  console.error('[PashuSetu DB] Error generating Prisma Client:', error.message);
  process.exit(1);
}
