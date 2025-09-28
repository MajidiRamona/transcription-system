import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { TranscriptionState } from '@/generated/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transcription = await prisma.transcription.findUnique({
      where: { id: params.id },
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
    })

    if (!transcription) {
      return NextResponse.json(
        { error: 'Transcription not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(transcription)
  } catch (error) {
    console.error('Error fetching transcription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const updatedTranscription = await prisma.transcription.update({
      where: { id: params.id },
      data: {
        ...data,
        lastEditedById: session.user.id,
        updatedAt: new Date(),
      },
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
    })

    return NextResponse.json(updatedTranscription)
  } catch (error) {
    console.error('Error updating transcription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.transcription.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Transcription deleted successfully' })
  } catch (error) {
    console.error('Error deleting transcription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}