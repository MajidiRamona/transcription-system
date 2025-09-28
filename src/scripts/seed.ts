import { prisma } from '@/lib/prisma'
import { createUser } from '@/lib/auth'
import { UserRole } from '@/generated/prisma'

async function main() {
  try {
    // Create default users
    const users: any = {}

    try {
      users.admin = await createUser('admin', 'admin123', UserRole.ADMIN)
      console.log('Created admin user:', users.admin.username)
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log('Admin user already exists, skipping...')
        users.admin = await prisma.user.findUnique({ where: { username: 'admin' } })
      } else {
        throw error
      }
    }

    try {
      users.validator1 = await createUser('validator1', 'validator1123', UserRole.VALIDATOR1)
      console.log('Created validator1 user:', users.validator1.username)
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log('Validator1 user already exists, skipping...')
        users.validator1 = await prisma.user.findUnique({ where: { username: 'validator1' } })
      } else {
        throw error
      }
    }

    try {
      users.validator2 = await createUser('validator2', 'validator2123', UserRole.VALIDATOR2)
      console.log('Created validator2 user:', users.validator2.username)
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log('Validator2 user already exists, skipping...')
        users.validator2 = await prisma.user.findUnique({ where: { username: 'validator2' } })
      } else {
        throw error
      }
    }

    // Create sample transcription with mock metadata, citations, and confidence levels
    try {
      const sampleTranscription = await prisma.transcription.create({
        data: {
          filename: 'sample_fgd_transcript.txt',
          filePath: '/uploads/sample_fgd_transcript.txt',
          content: `Country: Jordan
Date of the Discussion: March 15, 2024
Location: Zaatari Refugee Camp, Community Center
Purpose of Participatory Assessment: To understand community needs and access to services
Method: FGD
Language: Arabic

Facilitator: Sarah Ahmed, UNHCR Jordan
Note Taker: Mohammad Hassan, Local Community Organization

Participants:
Number: 8
Nationality: Syrian
Profile: Heads of households; Small business owners
Environment: Camp
Sex: Female
Age: 25-45
Type of group: Mixed community members

Moderator: Good morning everyone, thank you for coming today. We're here to discuss your experiences and needs in the camp.

Participant 1: We appreciate this opportunity to share our concerns.

Moderator: Can you tell us about your biggest challenges here?

Participant 2: The main issue is access to clean water. We only get water for 2 hours in the morning.

Participant 3: Healthcare is also difficult. The clinic is far and we wait for hours.

Participant 4: Our children need better education. The school is overcrowded.

Moderator: What about income opportunities?

Participant 5: We need work permits to find proper jobs. Many of us have skills but can't use them.

Participant 6: Some of us started small businesses in the camp, but we need more support.

Moderator: How do you feel about safety and security?

Participant 7: At night it's not safe, especially for women and children.

Participant 8: We need better lighting in the camp areas.`,
          state: 'CHECK_BY_VALIDATOR',

          // Basic metadata with citations and confidence
          assessmentId: 'JOR-ZRC-2024-003',
          assessmentIdCitation: 'File Name: JOR-ZRC-2024-003',
          assessmentIdConfidence: 0.95,

          country: 'Jordan',
          countryCitation: 'Country: Jordan',
          countryConfidence: 1.0,

          dateOfDiscussion: 'March 15, 2024',
          dateOfDiscussionCitation: 'Date of the Discussion: March 15, 2024',
          dateOfDiscussionConfidence: 1.0,

          location: 'Zaatari Refugee Camp, Community Center',
          locationCitation: 'Location: Zaatari Refugee Camp, Community Center',
          locationConfidence: 1.0,

          purpose: 'To understand community needs and access to services',
          purposeCitation: 'Purpose of Participatory Assessment: To understand community needs and access to services',
          purposeConfidence: 1.0,

          method: 'FGD',
          methodCitation: 'Method: FGD',
          methodConfidence: 1.0,

          language: 'Arabic',
          languageCitation: 'Language: Arabic',
          languageConfidence: 1.0,

          // Staff information
          facilitatorName: 'Sarah Ahmed',
          facilitatorNameCitation: 'Facilitator: Sarah Ahmed, UNHCR Jordan',
          facilitatorNameConfidence: 1.0,

          facilitatorOrg: 'UNHCR Jordan',
          facilitatorOrgCitation: 'Facilitator: Sarah Ahmed, UNHCR Jordan',
          facilitatorOrgConfidence: 1.0,

          noteTakerName: 'Mohammad Hassan',
          noteTakerNameCitation: 'Note Taker: Mohammad Hassan, Local Community Organization',
          noteTakerNameConfidence: 1.0,

          noteTakerOrg: 'Local Community Organization',
          noteTakerOrgCitation: 'Note Taker: Mohammad Hassan, Local Community Organization',
          noteTakerOrgConfidence: 1.0,

          // Participants information
          participantsNumber: 8,
          participantsNumberCitation: 'Number: 8',
          participantsNumberConfidence: 1.0,

          participantsNationalities: 'Syrian',
          participantsNationalitiesCitation: 'Nationality: Syrian',
          participantsNationalitiesConfidence: 1.0,

          participantsProfile: 'Heads of households; Small business owners',
          participantsProfileCitation: 'Profile: Heads of households; Small business owners',
          participantsProfileConfidence: 1.0,

          participantsEnvironment: 'Camp',
          participantsEnvironmentCitation: 'Environment: Camp',
          participantsEnvironmentConfidence: 1.0,

          participantsSex: 'Female',
          participantsSexCitation: 'Sex: Female',
          participantsSexConfidence: 1.0,

          participantsAgeRange: '25-45',
          participantsAgeRangeCitation: 'Age: 25-45',
          participantsAgeRangeConfidence: 1.0,

          participantsGroupType: 'Mixed community members',
          participantsGroupTypeCitation: 'Type of group: Mixed community members',
          participantsGroupTypeConfidence: 1.0,

          assignedToId: users.validator1?.id,
        },
        include: {
          topics: true,
        },
      })

      // Create sample topics with citations and confidence
      await prisma.topic.createMany({
        data: [
          {
            transcriptionId: sampleTranscription.id,
            outcomeAreaCode: 'WS',
            outcomeAreaName: 'Water and Sanitation',
            category: 'Access',
            subcategory: 'Water Access',
            type: 'Challenge',
            subcategoryDefinition: 'Availability and accessibility of clean drinking water for daily consumption',
            description: 'Community members face significant challenges in accessing clean water with limited availability of only 2 hours daily in the morning, creating hardships for basic needs.',
            assessment: 'Water scarcity represents a critical structural constraint affecting daily life and health outcomes for camp residents.',
            citations: '["Participant 2: \\"The main issue is access to clean water. We only get water for 2 hours in the morning.\\""]',
            confidence: 0.95,
          },
          {
            transcriptionId: sampleTranscription.id,
            outcomeAreaCode: 'HL',
            outcomeAreaName: 'Health',
            category: 'Access',
            subcategory: 'Healthcare Services',
            type: 'Challenge',
            subcategoryDefinition: 'Availability and accessibility of medical services and healthcare facilities',
            description: 'Healthcare access is severely limited with distant clinic locations and extensive waiting times preventing timely medical care for community members.',
            assessment: 'Geographic and systemic barriers create significant healthcare access challenges impacting community health outcomes.',
            citations: '["Participant 3: \\"Healthcare is also difficult. The clinic is far and we wait for hours.\\""]',
            confidence: 0.92,
          },
          {
            transcriptionId: sampleTranscription.id,
            outcomeAreaCode: 'ED',
            outcomeAreaName: 'Education',
            category: 'Quality',
            subcategory: 'School Infrastructure',
            type: 'Challenge',
            subcategoryDefinition: 'Physical facilities and resources available for educational activities',
            description: 'Educational facilities face overcrowding issues affecting the quality of education delivery and learning environment for children in the community.',
            assessment: 'Infrastructure limitations compromise educational quality and access for school-age children in the camp setting.',
            citations: '["Participant 4: \\"Our children need better education. The school is overcrowded.\\""]',
            confidence: 0.88,
          },
          {
            transcriptionId: sampleTranscription.id,
            outcomeAreaCode: 'LV',
            outcomeAreaName: 'Livelihoods',
            category: 'Employment',
            subcategory: 'Work Authorization',
            type: 'Challenge',
            subcategoryDefinition: 'Legal authorization and permits required for formal employment opportunities',
            description: 'Community members possess valuable skills but face legal barriers requiring work permits to access formal employment opportunities, limiting their economic potential.',
            assessment: 'Regulatory constraints prevent utilization of existing skills and limit economic self-reliance opportunities for displaced populations.',
            citations: '["Participant 5: \\"We need work permits to find proper jobs. Many of us have skills but can\'t use them.\\""]',
            confidence: 0.94,
          },
        ],
      })

      console.log('Created sample transcription with metadata citations and topics')
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log('Sample transcription already exists, skipping...')
      } else {
        throw error
      }
    }

    console.log('Seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()