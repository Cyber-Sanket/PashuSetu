const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const prismaDir = path.join(__dirname, '../prisma');
const schemaPath = path.join(prismaDir, 'schema.prisma');
const dbUrl = process.env.DATABASE_URL || '';

// If argument passed, use it ('postgres' or 'sqlite')
const arg = process.argv[2];
let targetProvider;

if (arg === 'postgres' || arg === 'postgresql') {
  targetProvider = 'postgresql';
} else if (arg === 'sqlite') {
  targetProvider = 'sqlite';
} else {
  // Auto-detect from DATABASE_URL
  const isPostgres = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');
  targetProvider = isPostgres ? 'postgresql' : 'sqlite';
}

console.log(`[PashuSetu DB Config] Target database provider: ${targetProvider}`);

let schemaContent = fs.readFileSync(schemaPath, 'utf8');
const currentProviderMatch = schemaContent.match(/provider\s*=\s*"([^"]+)"/);
const currentProvider = currentProviderMatch ? currentProviderMatch[1] : '';

if (currentProvider !== targetProvider) {
  console.log(`[PashuSetu DB Config] Switching schema.prisma datasource from '${currentProvider}' to '${targetProvider}'...`);
  schemaContent = schemaContent.replace(/provider\s*=\s*"[^"]+"/, `provider = "${targetProvider}"`);
  fs.writeFileSync(schemaPath, schemaContent, 'utf8');
  console.log(`[PashuSetu DB Config] Generating Prisma Client for ${targetProvider}...`);
  execSync('npx prisma generate', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
  console.log(`[PashuSetu DB Config] Prisma Client successfully updated for ${targetProvider}.`);
} else {
  console.log(`[PashuSetu DB Config] schema.prisma is already configured for ${targetProvider}.`);
}
