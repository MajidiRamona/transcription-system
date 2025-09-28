import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { TranscriptionState } from '@/generated/prisma'
import { processTranscriptionWithAI } from '@/lib/ai-service'

export async function POST(
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
    })

    if (!transcription) {
      return NextResponse.json(
        { error: 'Transcription not found' },
        { status: 404 }
      )
    }

    // Update state to indicate AI processing has started
    await prisma.transcription.update({
      where: { id: params.id },
      data: {
        state: TranscriptionState.CHECK_BY_AI,
        aiProcessedAt: new Date(),
        aiError: null,
      },
    })

    try {
      // Process with AI service
      const aiResult = await processTranscriptionWithAI(transcription.content)

      // Update transcription with AI extracted metadata
      const updatedTranscription = await prisma.transcription.update({
        where: { id: params.id },
        data: {
          ...aiResult.metadata,
          state: TranscriptionState.CHECK_BY_VALIDATOR,
          aiProcessedAt: new Date(),
          aiError: null,
        },
      })

      // Create topics from AI result
      if (aiResult.topics && aiResult.topics.length > 0) {
        await prisma.topic.createMany({
          data: aiResult.topics.map((topic: any) => ({
            transcriptionId: params.id,
            ...topic,
          })),
        })
      }

      // Return updated transcription with topics
      const result = await prisma.transcription.findUnique({
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

      return NextResponse.json(result)
    } catch (aiError) {
      // Update transcription with AI error
      await prisma.transcription.update({
        where: { id: params.id },
        data: {
          aiError: aiError instanceof Error ? aiError.message : 'AI processing failed',
          state: TranscriptionState.PENDING,
        },
      })

      return NextResponse.json(
        { error: 'AI processing failed', details: aiError instanceof Error ? aiError.message : 'Unknown error' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error processing transcription with AI:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}