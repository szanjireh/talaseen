import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = process.argv[2];
    const name = process.argv[3] || email.split('@')[0];

    if (!email) {
      console.error('❌ Please provide an email address');
      console.log('Usage: npx ts-node scripts/create-admin-with-email.ts user@example.com "Full Name"');
      process.exit(1);
    }

    console.log(`🔍 Ensuring admin user exists for: ${email}`);

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      if (existing.role === UserRole.ADMIN) {
        console.log(`✅ User ${email} is already ADMIN`);
        return;
      }

      const updated = await prisma.user.update({ where: { email }, data: { role: UserRole.ADMIN, name } });
      console.log('✅ Existing user promoted to ADMIN:');
      console.log(`   Name: ${updated.name}`);
      console.log(`   Email: ${updated.email}`);
      console.log(`   Role: ${updated.role}`);
      return;
    }

    // Create new admin user
    const created = await prisma.user.create({ data: { email, name, role: UserRole.ADMIN } });
    console.log('✅ New admin user created:');
    console.log(`   Name: ${created.name}`);
    console.log(`   Email: ${created.email}`);
    console.log(`   Role: ${created.role}`);
  } catch (error) {
    console.error('❌ Error creating/promoting admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
