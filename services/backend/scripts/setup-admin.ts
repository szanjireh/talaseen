import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function createOrPromoteAdmin(email: string, name?: string) {
  try {
    console.log(`🔍 Looking for user: ${email}`);

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`⚠️  User not found. Creating new user...`);
      
      // Create new user with ADMIN role
      user = await prisma.user.create({
        data: {
          email: email,
          name: name || email.split('@')[0],
          role: UserRole.ADMIN,
        },
      });

      console.log('✅ New ADMIN user created successfully!');
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log('\n🎉 Admin account is ready!');
      console.log('💡 Please sign in with Google using this email to complete the setup');
      return;
    }

    if (user.role === UserRole.ADMIN) {
      console.log(`✅ User ${email} is already an ADMIN`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      return;
    }

    // Promote existing user to admin
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
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get email and name from command line arguments
const email = process.argv[2];
const name = process.argv[3];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: npm run setup-admin email@example.com "Name (optional)"');
  process.exit(1);
}

createOrPromoteAdmin(email, name);
