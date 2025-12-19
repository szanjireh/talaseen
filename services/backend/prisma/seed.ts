import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminEmail = 's.zanjireh@gmail.com';
  const adminPassword = 'Sona.1391';
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Username: sajadadmin`);
    return;
  }

  // Create admin user (Note: This is for Google OAuth, so we don't store password)
  // For direct login with username/password, you'd need to add password auth
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Sajad Admin',
      role: UserRole.ADMIN,
      googleId: null, // No Google ID for manual admin
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log(`📧 Email: ${adminEmail}`);
  console.log(`👤 Name: ${admin.name}`);
  console.log(`🔑 Role: ${admin.role}`);
  console.log(`🆔 ID: ${admin.id}`);
  console.log('\n⚠️  Note: This project uses Google OAuth for authentication.');
  console.log('To access admin panel, you need to:');
  console.log('1. Sign in with Google');
  console.log('2. Manually update your user role to ADMIN in database');
  console.log(`   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-google-email@gmail.com';`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
