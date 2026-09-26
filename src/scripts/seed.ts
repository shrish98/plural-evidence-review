import { initDb, seedDatabase } from '../lib/db';

try {
  console.log('🌱 Initializing SQLite database and seeding synthetic Plural Evidence reports...');
  initDb();
  seedDatabase();
  console.log('✅ Database successfully seeded!');
} catch (err) {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
}
