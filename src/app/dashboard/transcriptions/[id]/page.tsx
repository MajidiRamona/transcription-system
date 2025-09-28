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

  // Metadata fields with citations and confidence
  assessmentId?: string
  assessmentIdCitation?: string
  assessmentIdConfidence?: number
  country?: string
  countryCitation?: string
  countryConfidence?: number
  dateOfDiscussion?: string
  dateOfDiscussionCitation?: string
  dateOfDiscussionConfidence?: number
  location?: string
  locationCitation?: string
  locationConfidence?: number
  purpose?: string
  purposeCitation?: string
  purposeConfidence?: number
  method?: string
  methodCitation?: string
  methodConfidence?: number
  language?: string
  languageCitation?: string
  languageConfidence?: number

  facilitatorName?: string
  facilitatorNameCitation?: string
  facilitatorNameConfidence?: number
  facilitatorOrg?: string
  facilitatorOrgCitation?: string
  facilitatorOrgConfidence?: number
  facilitatorEmail?: string
  facilitatorEmailCitation?: string
  facilitatorEmailConfidence?: number

  noteTakerName?: string
  noteTakerNameCitation?: string
  noteTakerNameConfidence?: number
  noteTakerOrg?: string
  noteTakerOrgCitation?: string
  noteTakerOrgConfidence?: number
  noteTakerEmail?: string
  noteTakerEmailCitation?: string
  noteTakerEmailConfidence?: number

  participantsNumber?: number
  participantsNumberCitation?: string
  participantsNumberConfidence?: number
  participantsNationalities?: string
  participantsNationalitiesCitation?: string
  participantsNationalitiesConfidence?: number
  participantsProfile?: string
  participantsProfileCitation?: string
  participantsProfileConfidence?: number
  participantsEnvironment?: string
  participantsEnvironmentCitation?: string
  participantsEnvironmentConfidence?: number
  participantsSex?: string
  participantsSexCitation?: string
  participantsSexConfidence?: number
  participantsAgeRange?: string
  participantsAgeRangeCitation?: string
  participantsAgeRangeConfidence?: number
  participantsGroupType?: string
  participantsGroupTypeCitation?: string
  participantsGroupTypeConfidence?: number

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

export default function TranscriptionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [transcription, setTranscription] = useState<Transcription | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'content' | 'metadata' | 'topics'>('content')
  const [id, setId] = useState<string>('')

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (id) {
      fetchTranscription()
    }
  }, [id])

  const fetchTranscription = async () => {
    try {
      const response = await fetch(`/api/transcriptions/${id}`)
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
      const response = await fetch(`/api/transcriptions/${id}`, {
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
      const response = await fetch(`/api/transcriptions/${id}`, {
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

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-500'
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const MetadataField = ({
    label,
    value,
    citation,
    confidence,
    type = 'text',
    onChange,
    options,
    rows
  }: {
    label: string
    value?: string | number
    citation?: string
    confidence?: number
    type?: 'text' | 'email' | 'number' | 'select' | 'textarea'
    onChange: (value: string | number) => void
    options?: string[]
    rows?: number
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {confidence && (
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-medium ${getConfidenceColor(confidence)}`}>
              {(confidence * 100).toFixed(0)}%
            </span>
            <span className="text-xs text-gray-400">confidence</span>
          </div>
        )}
      </div>

      {type === 'select' ? (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options?.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={rows || 3}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      )}

      {citation && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
          <div className="text-xs text-blue-700 font-medium mb-1">Source Citation:</div>
          <div className="text-xs text-blue-800 italic">"{citation}"</div>
        </div>
      )}
    </div>
  )

  const handleApprove = async () => {
    if (!transcription) return

    try {
      const response = await fetch(`/api/transcriptions/${id}`, {
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
        alert('Transcription approved and marked as complete!')
      }
    } catch (err) {
      setError('Failed to approve transcription')
    }
  }

  const handleReject = async () => {
    if (!transcription) return

    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return

    try {
      const response = await fetch(`/api/transcriptions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...transcription,
          state: 'PENDING',
          aiError: `Rejected by validator: ${reason}`,
        }),
      })

      if (response.ok) {
        await fetchTranscription()
        alert('Transcription rejected and sent back for revision!')
      }
    } catch (err) {
      setError('Failed to reject transcription')
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
              {transcription.state === 'CHECK_BY_VALIDATOR' && (session?.user.role === 'VALIDATOR1' || session?.user.role === 'VALIDATOR2') && (
                <>
                  <button
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Reject
                  </button>
                </>
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
                  <MetadataField
                    label="Assessment ID"
                    value={transcription.assessmentId}
                    citation={transcription.assessmentIdCitation}
                    confidence={transcription.assessmentIdConfidence}
                    onChange={(value) => handleFieldChange('assessmentId', value)}
                  />
                  <MetadataField
                    label="Country"
                    value={transcription.country}
                    citation={transcription.countryCitation}
                    confidence={transcription.countryConfidence}
                    onChange={(value) => handleFieldChange('country', value)}
                  />
                  <MetadataField
                    label="Date of Discussion"
                    value={transcription.dateOfDiscussion}
                    citation={transcription.dateOfDiscussionCitation}
                    confidence={transcription.dateOfDiscussionConfidence}
                    onChange={(value) => handleFieldChange('dateOfDiscussion', value)}
                  />
                  <MetadataField
                    label="Location"
                    value={transcription.location}
                    citation={transcription.locationCitation}
                    confidence={transcription.locationConfidence}
                    onChange={(value) => handleFieldChange('location', value)}
                  />
                  <MetadataField
                    label="Purpose"
                    value={transcription.purpose}
                    citation={transcription.purposeCitation}
                    confidence={transcription.purposeConfidence}
                    type="textarea"
                    rows={3}
                    onChange={(value) => handleFieldChange('purpose', value)}
                  />
                  <MetadataField
                    label="Method"
                    value={transcription.method}
                    citation={transcription.methodCitation}
                    confidence={transcription.methodConfidence}
                    type="select"
                    options={['FGD', 'KII', 'Observation', 'Other']}
                    onChange={(value) => handleFieldChange('method', value)}
                  />
                  <MetadataField
                    label="Language"
                    value={transcription.language}
                    citation={transcription.languageCitation}
                    confidence={transcription.languageConfidence}
                    onChange={(value) => handleFieldChange('language', value)}
                  />
                </div>

                {/* Staff Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Staff Information</h4>
                  <MetadataField
                    label="Facilitator Name"
                    value={transcription.facilitatorName}
                    citation={transcription.facilitatorNameCitation}
                    confidence={transcription.facilitatorNameConfidence}
                    onChange={(value) => handleFieldChange('facilitatorName', value)}
                  />
                  <MetadataField
                    label="Facilitator Organization"
                    value={transcription.facilitatorOrg}
                    citation={transcription.facilitatorOrgCitation}
                    confidence={transcription.facilitatorOrgConfidence}
                    onChange={(value) => handleFieldChange('facilitatorOrg', value)}
                  />
                  <MetadataField
                    label="Facilitator Email"
                    value={transcription.facilitatorEmail}
                    citation={transcription.facilitatorEmailCitation}
                    confidence={transcription.facilitatorEmailConfidence}
                    type="email"
                    onChange={(value) => handleFieldChange('facilitatorEmail', value)}
                  />
                  <MetadataField
                    label="Note Taker Name"
                    value={transcription.noteTakerName}
                    citation={transcription.noteTakerNameCitation}
                    confidence={transcription.noteTakerNameConfidence}
                    onChange={(value) => handleFieldChange('noteTakerName', value)}
                  />
                  <MetadataField
                    label="Note Taker Organization"
                    value={transcription.noteTakerOrg}
                    citation={transcription.noteTakerOrgCitation}
                    confidence={transcription.noteTakerOrgConfidence}
                    onChange={(value) => handleFieldChange('noteTakerOrg', value)}
                  />
                  <MetadataField
                    label="Note Taker Email"
                    value={transcription.noteTakerEmail}
                    citation={transcription.noteTakerEmailCitation}
                    confidence={transcription.noteTakerEmailConfidence}
                    type="email"
                    onChange={(value) => handleFieldChange('noteTakerEmail', value)}
                  />
                </div>

                {/* Participants Information */}
                <div className="space-y-4 md:col-span-2">
                  <h4 className="font-medium text-gray-900">Participants Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetadataField
                      label="Number of Participants"
                      value={transcription.participantsNumber}
                      citation={transcription.participantsNumberCitation}
                      confidence={transcription.participantsNumberConfidence}
                      type="number"
                      onChange={(value) => handleFieldChange('participantsNumber', value)}
                    />
                    <MetadataField
                      label="Age Range"
                      value={transcription.participantsAgeRange}
                      citation={transcription.participantsAgeRangeCitation}
                      confidence={transcription.participantsAgeRangeConfidence}
                      onChange={(value) => handleFieldChange('participantsAgeRange', value)}
                    />
                    <MetadataField
                      label="Group Type"
                      value={transcription.participantsGroupType}
                      citation={transcription.participantsGroupTypeCitation}
                      confidence={transcription.participantsGroupTypeConfidence}
                      onChange={(value) => handleFieldChange('participantsGroupType', value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MetadataField
                      label="Nationalities"
                      value={transcription.participantsNationalities}
                      citation={transcription.participantsNationalitiesCitation}
                      confidence={transcription.participantsNationalitiesConfidence}
                      onChange={(value) => handleFieldChange('participantsNationalities', value)}
                    />
                    <MetadataField
                      label="Sex"
                      value={transcription.participantsSex}
                      citation={transcription.participantsSexCitation}
                      confidence={transcription.participantsSexConfidence}
                      onChange={(value) => handleFieldChange('participantsSex', value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MetadataField
                      label="Profile"
                      value={transcription.participantsProfile}
                      citation={transcription.participantsProfileCitation}
                      confidence={transcription.participantsProfileConfidence}
                      onChange={(value) => handleFieldChange('participantsProfile', value)}
                    />
                    <MetadataField
                      label="Environment"
                      value={transcription.participantsEnvironment}
                      citation={transcription.participantsEnvironmentCitation}
                      confidence={transcription.participantsEnvironmentConfidence}
                      onChange={(value) => handleFieldChange('participantsEnvironment', value)}
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