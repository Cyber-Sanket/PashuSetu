const { execSync } = require('child_process');

console.log('[PashuSetu Migration] Starting Prisma migration deployment...');

try {
  // Attempt standard migration deployment
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('[PashuSetu Migration] Migrations applied successfully.');
} catch (error) {
  console.warn('[PashuSetu Migration] prisma migrate deploy failed, checking for failed migration state (P3009)...');
  try {
    // Automatically resolve previously failed 20260907000000_init migration record as rolled back
    console.log('[PashuSetu Migration] Resolving failed migration 20260907000000_init as rolled back...');
    execSync('npx prisma migrate resolve --rolled-back "20260907000000_init"', { stdio: 'inherit' });
    
    // Retry applying the corrected migration
    console.log('[PashuSetu Migration] Retrying prisma migrate deploy with corrected migration...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('[PashuSetu Migration] Migrations applied successfully on retry.');
  } catch (resolveError) {
    console.error('[PashuSetu Migration] Migration deployment failed:', resolveError.message);
    process.exit(1);
  }
}
