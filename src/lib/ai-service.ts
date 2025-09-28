import OpenAI from 'openai'

const APERTUS_BASE_URL = process.env.APERTUS_BASE_URL || "https://api.swisscom.com/layer/swiss-ai-weeks/apertus-70b/v1"
const APERTUS_MODEL_ID = process.env.APERTUS_MODEL_ID || "swiss-ai/Apertus-70B"
const MAX_RETRIES = parseInt(process.env.APERTUS_MAX_RETRIES || "5")
const BASE_DELAY = parseFloat(process.env.APERTUS_BASE_DELAY || "1.0")
const MAX_DELAY = parseFloat(process.env.APERTUS_MAX_DELAY || "16")

// System prompt for metadata extraction
const METADATA_SYSTEM_PROMPT = `You extract structured metadata from humanitarian assessment transcripts.
Return STRICT JSON matching this schema (no extra keys, no commentary):

{
  "assessmentId": "string (optional)",
  "country": "string",
  "dateOfDiscussion": "string",
  "location": "string",
  "purpose": "string",
  "method": "FGD | KII | Observation | Other",
  "facilitatorName": "string",
  "facilitatorOrg": "string",
  "facilitatorEmail": "string",
  "noteTakerName": "string",
  "noteTakerOrg": "string",
  "noteTakerEmail": "string",
  "participantsNumber": "integer",
  "participantsNationalities": "string",
  "participantsProfile": "string",
  "participantsEnvironment": "string",
  "participantsSex": "string",
  "participantsAgeRange": "string",
  "participantsGroupType": "string",
  "language": "string"
}

Rules:
- If a field is missing, use an empty value: "", 0, or null.
- For participant fields, provide comma-separated strings where applicable.
- Output JSON only, no explanations.`

// System prompt for topic classification
const TOPICS_SYSTEM_PROMPT = `You are an information extraction assistant.
OUTPUT FORMAT: Return ONLY a single valid JSON object, no extra text, no markdown, no code fences.
HARD RULES (DO):
- Copy/paste the exact subcategory definition string into subcategoryDefinition.
- For citations, copy/paste EXACT substrings from the transcript.
- Output citations as strings in the format: 'Speaker: "exact quote"' (no indices, no extra fields).
HARD RULES (DON'T):
- Do NOT paraphrase, summarize, reword, expand, abbreviate, or 'fix' grammar for citations.
- Do NOT invent content, speakers, punctuation, or brackets not present in the transcript.
- Do NOT include any quotation that is not an exact substring of the transcript.
- Do NOT add any extra keys or commentary outside the JSON object.
QUALITY:
- description MUST be a concise narrative (60–90 words), neutral, and grounded in transcript content relevant to the Sub-category & Type.
- assessment MUST be a brief analytic synthesis (40–70 words) in an evaluative style (e.g., structural constraints, impacts), no policy recommendations.
- All citations MUST be relevant to the subcategory AND support the description.`

function createApertusClient(): OpenAI {
  const apiKey = process.env.SWISS_AI_PLATFORM_API_KEY
  if (!apiKey) {
    throw new Error('SWISS_AI_PLATFORM_API_KEY environment variable is required')
  }

  return new OpenAI({
    apiKey,
    baseURL: APERTUS_BASE_URL,
  })
}

async function backoffCall<T>(fn: () => Promise<T>): Promise<T> {
  let attempt = 0

  while (true) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300))
      return await fn()
    } catch (error: any) {
      attempt++
      if (attempt > MAX_RETRIES) {
        throw error
      }

      const delay = Math.min(MAX_DELAY, BASE_DELAY * Math.pow(2, attempt - 1))
      const jitterDelay = delay * (0.7 + 0.6 * Math.random())

      console.log(`Retry ${attempt}/${MAX_RETRIES} in ${jitterDelay.toFixed(1)}s`)
      await new Promise(resolve => setTimeout(resolve, jitterDelay * 1000))
    }
  }
}

export async function extractMetadata(transcriptText: string): Promise<any> {
  const client = createApertusClient()

  const completion = await backoffCall(() =>
    client.chat.completions.create({
      model: APERTUS_MODEL_ID,
      messages: [
        { role: 'system', content: METADATA_SYSTEM_PROMPT },
        { role: 'user', content: transcriptText },
      ],
      temperature: 0.0,
      max_tokens: 1000,
    })
  )

  const content = completion.choices[0].message.content?.trim()
  if (!content) {
    throw new Error('No response from AI model')
  }

  // Extract JSON from response
  const jsonMatch = content.match(/\{.*\}/s)
  const jsonStr = jsonMatch ? jsonMatch[0] : content

  try {
    const data = JSON.parse(jsonStr)
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON response')
    }
    return data
  } catch (error) {
    throw new Error(`Failed to parse AI response as JSON: ${content}`)
  }
}

export async function extractTopics(
  transcriptText: string,
  outcomeArea: string,
  category: string,
  subcategory: string,
  type: string,
  subcategoryDefinition: string
): Promise<any> {
  const client = createApertusClient()

  const userPrompt = `TASK
You will read:
1) Transcript (UTF-8 plain text):
${transcriptText}

2) Official Sub-category definition text (exact string to copy; from taxonomy 'Definitions' sheet):
${subcategoryDefinition}

3) Target classification tuple:
- Outcome Area: ${outcomeArea}
- Category: ${category}
- Sub-category: ${subcategory}
- Type (info_type): ${type}

GOAL
Return exactly one JSON object with fields:
  - outcomeAreaName: string (copy the provided Outcome Area name)
  - category: string (copy the provided Category)
  - subcategory: string (copy the provided Sub-category)
  - type: string (copy the provided Type)
  - subcategoryDefinition: string (MUST be the exact same string you were given above; no edits)
  - description: string (60–90 words), narrative, concise, neutral, strictly grounded in transcript content relevant to the Sub-category & Type; do NOT repeat the definition verbatim
  - assessment: string (40–70 words), brief analytic synthesis grounded in the transcript (e.g., structural gaps, constraints, impacts); no policy recommendations
  - citations: array of 2–4 strings; each string MUST be in the form: 'Speaker: "exact quote"'

OUTPUT SCHEMA (exact keys only):
{
  "outcomeAreaName": "string",
  "category": "string",
  "subcategory": "string",
  "type": "string",
  "subcategoryDefinition": "string",
  "description": "string",
  "assessment": "string",
  "citations": ["Speaker: \"exact quote\""]
}

REMINDERS
- Output ONLY the JSON object, no extra text.
- Citations MUST be exact substrings with correct wording; otherwise leave them out.
- Citations must clearly justify the description for the given subcategory.`

  const completion = await backoffCall(() =>
    client.chat.completions.create({
      model: APERTUS_MODEL_ID,
      messages: [
        { role: 'system', content: TOPICS_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.0,
      max_tokens: 1300,
    })
  )

  const content = completion.choices[0].message.content?.trim()
  if (!content) {
    throw new Error('No response from AI model')
  }

  // Extract JSON from response
  const jsonMatch = content.match(/\{.*\}/s)
  const jsonStr = jsonMatch ? jsonMatch[0] : content

  try {
    const data = JSON.parse(jsonStr)
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON response')
    }
    return data
  } catch (error) {
    throw new Error(`Failed to parse AI response as JSON: ${content}`)
  }
}

// Utility functions to mimic Python code behavior
function findAfterLabel(text: string, label: string): string | null {
  const pattern = new RegExp(`${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*(.+)`, 'i')
  const match = text.match(pattern)
  if (match) {
    return match[1].trim().split('\n')[0].trim()
  }
  return null
}

function normalizeListField(val: string | null): string[] {
  if (!val) return []
  const tmp = val.replace(/\band\b/gi, ',')
  const items = tmp.split(/[;,]/).map(x => x.trim()).filter(x => x)
  return [...new Set(items)] // Remove duplicates
}

function clampMethod(val: string | null): string {
  if (!val) return 'Other'
  const v = val.trim().toUpperCase()
  if (['FGD', 'KII', 'OBSERVATION'].includes(v)) {
    return v === 'FGD' ? 'FGD' : v === 'KII' ? 'KII' : 'Observation'
  }
  return 'Other'
}

function parseIntSafe(val: string | null): number {
  if (!val) return 0
  const match = val.match(/\d+/)
  return match ? parseInt(match[0]) : 0
}

export async function processTranscriptionWithAI(transcriptText: string): Promise<{
  metadata: any,
  topics: any[]
}> {
  try {
    // Extract metadata
    const aiMetadata = await extractMetadata(transcriptText)

    // Normalize and validate metadata with fallbacks
    const metadata = {
      assessmentId: aiMetadata.assessmentId || findAfterLabel(transcriptText, 'File Name') || '',
      country: aiMetadata.country || findAfterLabel(transcriptText, 'Country') || '',
      dateOfDiscussion: aiMetadata.dateOfDiscussion || findAfterLabel(transcriptText, 'Date of the Discussion') || '',
      location: aiMetadata.location || findAfterLabel(transcriptText, 'Location') || '',
      purpose: aiMetadata.purpose || findAfterLabel(transcriptText, 'Purpose of Participatory Assessment') || '',
      method: clampMethod(aiMetadata.method || findAfterLabel(transcriptText, 'Method')),
      facilitatorName: aiMetadata.facilitatorName || '',
      facilitatorOrg: aiMetadata.facilitatorOrg || '',
      facilitatorEmail: aiMetadata.facilitatorEmail || '',
      noteTakerName: aiMetadata.noteTakerName || '',
      noteTakerOrg: aiMetadata.noteTakerOrg || '',
      noteTakerEmail: aiMetadata.noteTakerEmail || '',
      participantsNumber: aiMetadata.participantsNumber || parseIntSafe(findAfterLabel(transcriptText, 'Number')),
      participantsNationalities: aiMetadata.participantsNationalities || normalizeListField(findAfterLabel(transcriptText, 'Nationality')).join('; '),
      participantsProfile: aiMetadata.participantsProfile || normalizeListField(findAfterLabel(transcriptText, 'Profile')).join('; '),
      participantsEnvironment: aiMetadata.participantsEnvironment || normalizeListField(findAfterLabel(transcriptText, 'Environment')).join('; '),
      participantsSex: aiMetadata.participantsSex || normalizeListField(findAfterLabel(transcriptText, 'Sex')).join('; '),
      participantsAgeRange: aiMetadata.participantsAgeRange || findAfterLabel(transcriptText, 'Age') || '',
      participantsGroupType: aiMetadata.participantsGroupType || findAfterLabel(transcriptText, 'Type of group') || '',
      language: aiMetadata.language || findAfterLabel(transcriptText, 'Language') || '',
    }

    // For now, we'll return empty topics array. In a full implementation,
    // you would load taxonomy data and extract topics for each category/subcategory
    const topics: any[] = []

    // Example of how topics would be extracted (you'd need taxonomy data):
    // const exampleTopics = [
    //   {
    //     outcomeAreaCode: 'OA1',
    //     outcomeAreaName: 'Example Outcome Area',
    //     category: 'Example Category',
    //     subcategory: 'Example Subcategory',
    //     type: 'Example Type',
    //     subcategoryDefinition: 'Example definition from taxonomy',
    //     description: await extractTopics(...),
    //     assessment: '...',
    //     citations: ['Speaker: "example quote"'],
    //     confidence: 0.85,
    //   }
    // ]

    return {
      metadata,
      topics,
    }
  } catch (error) {
    console.error('Error processing transcription with AI:', error)
    throw error
  }
}