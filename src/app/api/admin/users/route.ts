import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized', debug: 'No session found' }, { status: 401 })
    }

    // TODO: Add admin role check when roles are implemented
    console.log('Admin users request from:', session.user.email)
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Add mock role and status for now
    const usersWithRoles = users.map(user => ({
      ...user,
      role: user.email === session.user?.email ? 'מנהל' : 'משתמש',
      status: 'פעיל',
      joinDate: user.createdAt.toLocaleDateString('he-IL')
    }))

    return NextResponse.json({ users: usersWithRoles })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}