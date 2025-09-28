import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { UserRole } from '@/generated/prisma'

export async function createUser(username: string, password: string, role: UserRole) {
  const hashedPassword = await bcrypt.hash(password, 12)

  return prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role,
    },
  })
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}

export async function authenticateUser(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  }
}