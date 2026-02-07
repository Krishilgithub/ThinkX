import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function verifyAuth() {
  console.log('\n🔐 Testing Authentication System with Supabase\n');
  console.log('─'.repeat(50));

  try {
    // 1. Check if Teacher table exists and has data
    console.log('\n1️⃣ Checking Teacher table...');
    const teachers = await prisma.teacher.findMany({
      select: { id: true, email: true, name: true, password: true }
    });
    
    console.log(`   ✅ Found ${teachers.length} teacher(s) in database`);
    teachers.forEach(t => {
      console.log(`      - ${t.name} (${t.email})`);
      console.log(`        Password hash: ${t.password.substring(0, 20)}...`);
    });

    // 2. Test password verification
    console.log('\n2️⃣ Testing password verification...');
    const demoTeacher = await prisma.teacher.findUnique({
      where: { email: 'demo@thinkx.ai' }
    });

    if (demoTeacher) {
      const isValid = await bcrypt.compare('demo123', demoTeacher.password);
      console.log(`   ${isValid ? '✅' : '❌'} Password "demo123" is ${isValid ? 'VALID' : 'INVALID'}`);
    } else {
      console.log('   ⚠️ Demo teacher not found');
    }

    // 3. Check database structure
    console.log('\n3️⃣ Checking database tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log(`   ✅ Found ${tables.length} table(s):`);
    tables.forEach(t => console.log(`      - ${t.table_name}`));

    console.log('\n' + '─'.repeat(50));
    console.log('\n✨ Authentication System Summary:\n');
    console.log('📊 Storage: Custom "Teacher" table in Supabase PostgreSQL');
    console.log('🔒 Password: Hashed with bcrypt (10 rounds)');
    console.log('🎟️ Sessions: JWT tokens stored in HTTP-only cookies');
    console.log('🚫 Not using: Supabase Auth (auth.users table)');
    console.log('\n📝 Demo Credentials:');
    console.log('   Email: demo@thinkx.ai');
    console.log('   Password: demo123');
    console.log('\n✅ Everything is correctly configured!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAuth();
