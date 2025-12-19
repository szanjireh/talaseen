import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function createFirstAdmin() {
  try {
    console.log('🔧 Creating first admin user...');

    const adminData = {
      email: 's.zanjireh@gmail.com',
      name: 'Sajad Admin',
      role: UserRole.ADMIN,
    };

    // Check if any admin exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: UserRole.ADMIN },
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists:');
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   ID: ${existingAdmin.id}`);
      return;
    }

    // Create admin user
    const admin = await prisma.user.create({
      data: adminData,
    });

    console.log('✅ First admin user created successfully!');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}`);
    console.log('\n📝 Instructions:');
    console.log('   1. Use Google OAuth to sign in');
    console.log('   2. Your account will be created as USER');
    console.log('   3. Then run this command to promote yourself to ADMIN:');
    console.log(`      npx ts-node services/backend/scripts/promote-to-admin.ts your-email@gmail.com`);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createFirstAdmin();
