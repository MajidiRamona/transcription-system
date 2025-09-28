'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Topic {
  id: string
  outcomeAreaCode?: string
  outcomeAreaName?: string
  category?: string
  subcategory?: string
  type?: string
  subcategoryDefinition?: string
  description?: string
  assessment?: string
  citations?: string
  confidence?: number
}

interface Transcription {
  id: string
  filename: string
  content: string
  state: 'PENDING' | 'CHECK_BY_AI' | 'CHECK_BY_VALIDATOR' | 'COMPLETE'

  // Metadata fields
  assessmentId?: string
  country?: string
  dateOfDiscussion?: string
  location?: string
  purpose?: string
  method?: string
  language?: string

  facilitatorName?: string
  facilitatorOrg?: string
  facilitatorEmail?: string

  noteTakerName?: string
  noteTakerOrg?: string
  noteTakerEmail?: string

  participantsNumber?: number
  participantsNationalities?: string
  participantsProfile?: string
  participantsEnvironment?: string
  participantsSex?: string
  participantsAgeRange?: string
  participantsGroupType?: string

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
  topics: Topic[]
}

export default function TranscriptionDetail({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [transcription, setTranscription] = useState<Transcription | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'content' | 'metadata' | 'topics'>('content')

  useEffect(() => {
    fetchTranscription()
  }, [params.id])

  const fetchTranscription = async () => {
    try {
      const response = await fetch(`/api/transcriptions/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setTranscription(data)
      } else {
        setError('Failed to load transcription')
      }
    } catch (err) {
      setError('An error occurred while loading the transcription')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!transcription) return

    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/transcriptions/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transcription),
      })

      if (response.ok) {
        const updatedTranscription = await response.json()
        setTranscription(updatedTranscription)
        alert('Transcription saved successfully!')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to save transcription')
      }
    } catch (err) {
      setError('An error occurred while saving the transcription')
    } finally {
      setSaving(false)
    }
  }

  const handleFieldChange = (field: string, value: any) => {
    if (!transcription) return
    setTranscription({
      ...transcription,
      [field]: value,
    })
  }

  const handleMarkComplete = async () => {
    if (!transcription) return

    try {
      const response = await fetch(`/api/transcriptions/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...transcription,
          state: 'COMPLETE',
        }),
      })

      if (response.ok) {
        await fetchTranscription()
        alert('Transcription marked as complete!')
      }
    } catch (err) {
      setError('Failed to mark transcription as complete')
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!transcription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Transcription not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-900 mr-4">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {transcription.filename}
              </h1>
              <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(transcription.state)}`}>
                {transcription.state.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              {transcription.state === 'CHECK_BY_VALIDATOR' && session?.user.role !== 'ADMIN' && (
                <button
                  onClick={handleMarkComplete}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Mark Complete
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}

          {transcription.aiError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="text-sm text-red-600">
                <strong>AI Error:</strong> {transcription.aiError}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transcription Content
              </button>
              <button
                onClick={() => setActiveTab('metadata')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'metadata'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Metadata ({Object.values(transcription).filter(v => v !== null && v !== undefined && v !== '').length - 6} fields filled)
              </button>
              <button
                onClick={() => setActiveTab('topics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'topics'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                AI Extracted Topics ({transcription.topics.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'content' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Transcription Content</h3>
              <textarea
                value={transcription.content}
                onChange={(e) => handleFieldChange('content', e.target.value)}
                className="w-full h-96 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono"
                placeholder="Enter transcription content..."
              />
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Extracted Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Basic Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assessment ID</label>
                    <input
                      type="text"
                      value={transcription.assessmentId || ''}
                      onChange={(e) => handleFieldChange('assessmentId', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      value={transcription.country || ''}
                      onChange={(e) => handleFieldChange('country', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Discussion</label>
                    <input
                      type="text"
                      value={transcription.dateOfDiscussion || ''}
                      onChange={(e) => handleFieldChange('dateOfDiscussion', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={transcription.location || ''}
                      onChange={(e) => handleFieldChange('location', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purpose</label>
                    <textarea
                      value={transcription.purpose || ''}
                      onChange={(e) => handleFieldChange('purpose', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Method</label>
                    <select
                      value={transcription.method || ''}
                      onChange={(e) => handleFieldChange('method', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select method</option>
                      <option value="FGD">FGD</option>
                      <option value="KII">KII</option>
                      <option value="Observation">Observation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Staff Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Staff Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Facilitator Name</label>
                    <input
                      type="text"
                      value={transcription.facilitatorName || ''}
                      onChange={(e) => handleFieldChange('facilitatorName', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Facilitator Organization</label>
                    <input
                      type="text"
                      value={transcription.facilitatorOrg || ''}
                      onChange={(e) => handleFieldChange('facilitatorOrg', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Facilitator Email</label>
                    <input
                      type="email"
                      value={transcription.facilitatorEmail || ''}
                      onChange={(e) => handleFieldChange('facilitatorEmail', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Note Taker Name</label>
                    <input
                      type="text"
                      value={transcription.noteTakerName || ''}
                      onChange={(e) => handleFieldChange('noteTakerName', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Note Taker Organization</label>
                    <input
                      type="text"
                      value={transcription.noteTakerOrg || ''}
                      onChange={(e) => handleFieldChange('noteTakerOrg', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Note Taker Email</label>
                    <input
                      type="email"
                      value={transcription.noteTakerEmail || ''}
                      onChange={(e) => handleFieldChange('noteTakerEmail', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Participants Information */}
                <div className="space-y-4 md:col-span-2">
                  <h4 className="font-medium text-gray-900">Participants Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Number of Participants</label>
                      <input
                        type="number"
                        value={transcription.participantsNumber || ''}
                        onChange={(e) => handleFieldChange('participantsNumber', parseInt(e.target.value) || 0)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Age Range</label>
                      <input
                        type="text"
                        value={transcription.participantsAgeRange || ''}
                        onChange={(e) => handleFieldChange('participantsAgeRange', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Group Type</label>
                      <input
                        type="text"
                        value={transcription.participantsGroupType || ''}
                        onChange={(e) => handleFieldChange('participantsGroupType', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nationalities</label>
                      <input
                        type="text"
                        value={transcription.participantsNationalities || ''}
                        onChange={(e) => handleFieldChange('participantsNationalities', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Separate multiple values with semicolons"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sex</label>
                      <input
                        type="text"
                        value={transcription.participantsSex || ''}
                        onChange={(e) => handleFieldChange('participantsSex', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., Female; Male"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Profile</label>
                      <input
                        type="text"
                        value={transcription.participantsProfile || ''}
                        onChange={(e) => handleFieldChange('participantsProfile', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Separate multiple values with semicolons"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Environment</label>
                      <input
                        type="text"
                        value={transcription.participantsEnvironment || ''}
                        onChange={(e) => handleFieldChange('participantsEnvironment', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., Urban; Rural; Camp; Settlement"
                      />
                    </div>
                  </div>
                </div>

                {/* Other Information */}
                <div className="space-y-4 md:col-span-2">
                  <h4 className="font-medium text-gray-900">Other Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <input
                      type="text"
                      value={transcription.language || ''}
                      onChange={(e) => handleFieldChange('language', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'topics' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">AI Extracted Topics</h3>
              {transcription.topics.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No topics have been extracted yet. Run AI processing to extract topics from this transcription.
                </p>
              ) : (
                <div className="space-y-6">
                  {transcription.topics.map((topic, index) => (
                    <div key={topic.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Topic {index + 1}</h4>
                        {topic.confidence && (
                          <span className="text-sm text-gray-500">
                            Confidence: {(topic.confidence * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Outcome Area:</span>
                          <p className="text-sm text-gray-900">{topic.outcomeAreaName || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Category:</span>
                          <p className="text-sm text-gray-900">{topic.category || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Sub-category:</span>
                          <p className="text-sm text-gray-900">{topic.subcategory || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Type:</span>
                          <p className="text-sm text-gray-900">{topic.type || 'N/A'}</p>
                        </div>
                      </div>

                      {topic.description && (
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-500">Description:</span>
                          <p className="text-sm text-gray-900 mt-1">{topic.description}</p>
                        </div>
                      )}

                      {topic.assessment && (
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-500">Assessment:</span>
                          <p className="text-sm text-gray-900 mt-1">{topic.assessment}</p>
                        </div>
                      )}

                      {topic.citations && (
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-500">Citations:</span>
                          <div className="mt-1">
                            {JSON.parse(topic.citations).map((citation: string, citIndex: number) => (
                              <div key={citIndex} className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">
                                {citation}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {topic.subcategoryDefinition && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Sub-category Definition:</span>
                          <p className="text-sm text-gray-600 mt-1 italic">{topic.subcategoryDefinition}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}