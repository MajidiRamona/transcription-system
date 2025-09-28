import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transcriptions = await prisma.transcription.findMany({
      include: {
        assignedTo: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
        lastEditedBy: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
        topics: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(transcriptions)
  } catch (error) {
    console.error('Error fetching transcriptions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { filename, filePath, content } = data

    if (!filename || !filePath) {
      return NextResponse.json(
        { error: 'Filename and file path are required' },
        { status: 400 }
      )
    }

    const transcription = await prisma.transcription.create({
      data: {
        filename,
        filePath,
        content: content || '',
        assignedToId: session.user.id,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(transcription, { status: 201 })
  } catch (error) {
    console.error('Error creating transcription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}