import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('🔄 Attempting to connect to Supabase database...\n');

try {
  const result = await prisma.$queryRaw`SELECT NOW() as time, version() as version`;
  console.log('✅ Database is ACTIVE!');
  console.log('📅 Server time:', result[0].time);
  console.log('🗄️ PostgreSQL version:', result[0].version.split(' ')[1]);
  console.log('\n✨ Your Supabase database is connected and ready!\n');
  console.log('👉 Now run: npx prisma db push');
} catch (error) {
  console.error('❌ Failed to connect:', error.message);
  console.log('\n💡 Database connection failed. Try these steps:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Check your project is active');
  console.log('3. Verify your DATABASE_URL in .env file');
  console.log('4. Make sure you replaced [YOUR-PASSWORD] with actual password');
  console.log('5. Run this script again: node wake-db.mjs');
} finally {
  await prisma.$disconnect();
}
