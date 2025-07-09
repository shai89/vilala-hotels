import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function getUsers() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      throw new Error('Unauthorized')
    }

    // Check if current user is admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })

    if (currentUser?.role !== 'admin') {
      throw new Error('Forbidden - Admin access required')
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        role: true,
      },
      orderBy: {
        id: 'desc'
      }
    })

    // Create user objects with proper data
    const usersWithRoles = users.map(user => ({
      ...user,
      status: 'פעיל', // Default status for display
      joinDate: new Date(parseInt(user.id.substring(0, 8), 16) * 1000).toLocaleDateString('he-IL') // Extract date from CUID
    }))

    return usersWithRoles
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}