import { prisma } from '@/lib/prisma'
import { createUser } from '@/lib/auth'
import { UserRole } from '@/generated/prisma'

async function main() {
  try {
    // Create default users
    const admin = await createUser('admin', 'admin123', UserRole.ADMIN)
    console.log('Created admin user:', admin.username)

    const validator1 = await createUser('validator1', 'validator1123', UserRole.VALIDATOR1)
    console.log('Created validator1 user:', validator1.username)

    const validator2 = await createUser('validator2', 'validator2123', UserRole.VALIDATOR2)
    console.log('Created validator2 user:', validator2.username)

    console.log('Seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()