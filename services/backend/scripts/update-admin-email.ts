import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAdminEmail() {
  try {
    console.log('🔄 Updating admin email...');

    // Find the old admin
    const oldAdmin = await prisma.user.findUnique({
      where: { email: 'sajadadmin@talaseen.com' },
    });

    if (!oldAdmin) {
      console.log('❌ Old admin not found');
      return;
    }

    // Update email
    const updatedAdmin = await prisma.user.update({
      where: { id: oldAdmin.id },
      data: { email: 's.zanjireh@gmail.com' },
    });

    console.log('✅ Admin email updated successfully!');
    console.log(`   Old Email: sajadadmin@talaseen.com`);
    console.log(`   New Email: ${updatedAdmin.email}`);
    console.log(`   Name: ${updatedAdmin.name}`);
    console.log(`   Role: ${updatedAdmin.role}`);
  } catch (error) {
    console.error('❌ Error updating admin email:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminEmail();
