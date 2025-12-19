import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function promoteToAdmin() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.error('❌ Please provide an email address');
      console.log('Usage: npx ts-node scripts/promote-to-admin.ts your-email@gmail.com');
      process.exit(1);
    }

    console.log(`🔍 Looking for user: ${email}`);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      console.log('\n💡 Please sign in with Google first to create your account');
      process.exit(1);
    }

    if (user.role === UserRole.ADMIN) {
      console.log(`✅ User ${email} is already an ADMIN`);
      return;
    }

    // Promote to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: UserRole.ADMIN },
    });

    console.log('✅ User promoted to ADMIN successfully!');
    console.log(`   Name: ${updatedUser.name}`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Previous Role: ${user.role}`);
    console.log(`   New Role: ${updatedUser.role}`);
    console.log('\n🎉 You can now access the admin panel at /admin');
  } catch (error) {
    console.error('❌ Error promoting user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

promoteToAdmin();
