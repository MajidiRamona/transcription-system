'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Transcription {
  id: string
  filename: string
  content: string
  state: 'PENDING' | 'CHECK_BY_AI' | 'CHECK_BY_VALIDATOR' | 'COMPLETE'
  assignedTo?: {
    username: string
    role: string
  }
  lastEditedBy?: {
    username: string
    role: string
  }
  createdAt: string
  updatedAt: string
  aiError?: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([])
  const [loading, setLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchTranscriptions()
    }
  }, [status, router])

  const fetchTranscriptions = async () => {
    try {
      const response = await fetch('/api/transcriptions')
      if (response.ok) {
        const data = await response.json()
        setTranscriptions(data)
      }
    } catch (error) {
      console.error('Error fetching transcriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProcessWithAI = async (id: string) => {
    setProcessingIds(prev => new Set(prev).add(id))

    try {
      const response = await fetch(`/api/transcriptions/${id}/ai-process`, {
        method: 'POST',
      })

      if (response.ok) {
        await fetchTranscriptions()
      } else {
        const error = await response.json()
        alert(`AI processing failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Error processing with AI:', error)
      alert('Error processing with AI')
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CHECK_BY_AI':
        return 'bg-blue-100 text-blue-800'
      case 'CHECK_BY_VALIDATOR':
        return 'bg-purple-100 text-purple-800'
      case 'COMPLETE':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStateText = (state: string) => {
    switch (state) {
      case 'PENDING':
        return 'Pending'
      case 'CHECK_BY_AI':
        return 'Check by AI'
      case 'CHECK_BY_VALIDATOR':
        return 'Check by Validator'
      case 'COMPLETE':
        return 'Complete'
      default:
        return state
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Ramona Transcription Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {session.user.name} ({session.user.role})
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Transcriptions</h2>
            <Link
              href="/dashboard/transcriptions/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Upload New Transcription
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {transcriptions.length === 0 ? (
                <li className="px-6 py-8 text-center text-gray-500">
                  No transcriptions found. Upload your first transcription to get started.
                </li>
              ) : (
                transcriptions.map((transcription) => (
                  <li key={transcription.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {transcription.filename}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(transcription.state)}`}>
                            {getStateText(transcription.state)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span>
                            Created: {new Date(transcription.createdAt).toLocaleDateString()}
                          </span>
                          {transcription.assignedTo && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Assigned to: {transcription.assignedTo.username}</span>
                            </>
                          )}
                          {transcription.lastEditedBy && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Last edited by: {transcription.lastEditedBy.username}</span>
                            </>
                          )}
                        </div>
                        {transcription.aiError && (
                          <div className="mt-2 text-sm text-red-600">
                            AI Error: {transcription.aiError}
                          </div>
                        )}
                      </div>
                      <div className="ml-6 flex items-center space-x-3">
                        {transcription.state === 'PENDING' && (
                          <button
                            onClick={() => handleProcessWithAI(transcription.id)}
                            disabled={processingIds.has(transcription.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium disabled:opacity-50"
                          >
                            {processingIds.has(transcription.id) ? 'Processing...' : 'Check & Extract Data by AI'}
                          </button>
                        )}
                        <Link
                          href={`/dashboard/transcriptions/${transcription.id}`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          View/Edit
                        </Link>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}