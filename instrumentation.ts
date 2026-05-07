export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.DATABASE_URL) {
    try {
      const { initializeDatabase } = await import('./lib/db');
      const { seedIfEmpty } = await import('./lib/seed');
      await initializeDatabase();
      await seedIfEmpty();
    } catch (err) {
      console.error('[instrumentation] DB initialization failed:', err);
    }
  }
}
