import { prisma } from '@/lib/prisma'
import { TranscriptionState } from '@/generated/prisma'

// Sample FGD data with variations
const fgdData = [
  {
    // Original Moldova FGD
    filename: "FGD_Sample_1.docx",
    filePath: "/uploads/FGD_Sample_1.docx",
    assessmentId: "FGD_Sample_1",
    country: "Moldova",
    dateOfDiscussion: "30 June 2025",
    location: "UNHCR Community Space, Chișinău",
    purpose: "Getting feedback on progress/ activities",
    method: "FGD",
    language: "Russian/Ukrainian",
    facilitatorName: "Maria",
    facilitatorOrg: "UNHCR",
    participantsNumber: 7,
    participantsNationalities: "Ukrainian",
    participantsProfile: "Refugees",
    participantsEnvironment: "Urban, Rural",
    participantsSex: "Female",
    participantsAgeRange: "25-59",
    participantsGroupType: "Individuals with diverse characteristics are not present",
    state: TranscriptionState.COMPLETE,
    content: `FOCUS GROUP DISCUSSION NUMBER 1 – beginning OF FILE, File Name: FGD_Sample_1
Country: Moldova
Date of the Discussion: 30 June 2025
Location: UNHCR Community Space, Chișinău
Purpose of Participatory Assessment: Getting feedback on progress/ activities
Method: FGD
Facilitator:  Maria, UNHCR
Participants:
    Number: 7
    Nationality (multiple choice): Ukrainian
    Profile (multiple choice): Refugees
    Environment where the population lives (multiple choice): Urban, Rural
    Sex: Female
    Age (multiple choice): 25-59
Type of group: Individuals with diverse characteristics are not present

Participant Names:
Anna (32), Olha (44), Iryna (41), Mariya (28), Tetiana (39), Larysa (37), Kateryna (48)

[Opening]
Facilitator (Maria):
Thank you so much for joining this group. We value your time and trust. Today, I want to talk about your experiences since arriving in northern Moldova, focusing on housing, finances, social support and, most importantly, your hopes and realities. Please feel free to share as much as needed, and know that everything is confidential and respected.

1. Could you tell us about how you searched for housing after leaving the placement centers? What was the process like for you and your families?
Anna:
To be honest, when we had to leave the placement (CPT) center, I didn't even know where to start. There were a few volunteers helping us at the beginning, but in the rural areas, everyone said, "Just ask around, maybe you will find a house." In the first days, I stayed with relatives of a friend—I slept on their sofa with my son while my mother was on the floor beside me. We called numbers from Facebook posts, and sometimes we went to look at a house only to find out the owner changed their mind when they saw we were from Ukraine. I tried asking in local shops too, hoping the community might know someone renting a room. It was exhausting. Eventually, my cousin's contact helped us get an old farmhouse. It isn't nice, but I was grateful for even this.
Olha:
I echo what Anna said. There's no "system" here in these villages. You need connections, and luck. We left our CPT when it got overcrowded and noisy. For housing, I had to split my family—we couldn't all fit in one room anywhere. My two sons are with friends now. When a place comes up, the landlords want proof you can pay, and sometimes they want a lot of advance. There's not much trust for renters in general, let alone refugees. I almost gave up twice before we found our current place through a neighbour's husband who works in a nearby town. I think every woman here shares this story—no one moved straight from a center to a secure home. It's all temporary and uncertain.
Larysa:
What's hard for me is explaining to my kids why we can't "just go home" or find a proper place. We moved three times in six months, carrying all we own in old bags. After the CPT, we slept in a barn at first for almost two weeks. I went knocking on doors, but some people told me bluntly, "We don't want refugees in our house." Some teenagers screamed "banderovtsy!" when they saw me with my suitcase. Finally, someone agreed to let us use the upper part of their house, but it's not independent—I share the hallway and toilet with their family. Privacy is a luxury here. I felt so hopeless sometimes, but you keep going for your children.

2. How have you been managing to pay increasing rent and winter heating bills? What strategies or sacrifices have you made?
Mariya:
Rent takes nearly half of what I get, and then heating… God, the heating costs in Moldova are a nightmare. We bought firewood together with two other families, and in the coldest months we all lived in one room—the only one we could keep above freezing. The kids missed having their own space, but at least they were warm. For food, I started making soup from anything: potatoes, a bone if I got lucky. We all gave up meat and cheese. The kids wear layers of old jackets indoors. I also did small jobs—cleaning, sometimes washing neighbours' clothes by hand for a few lei, just to pay the bills. I still owe the landlord some money.
Kateryna:
My son wanted to work to contribute, but even his part-time wage at the dairy wasn't enough. We sold things from home—jewelry, even my wedding ring. The gas price went up, so we used the woodstove, but then firewood became hard to find. Sometimes I went around picking up fallen branches in the forest with my daughter. I do a lot more with less. My sister in Ukraine sent me some money, strange as that is, since she's also struggling there. We try every way to save: share rooms, wear extra socks, cook as a group; we have become experts in surviving on little.
Iryna:
I felt so guilty applying for cash assistance again, but without it, we would have frozen last winter. I also stopped taking my blood pressure medicine to afford heating and food. My younger daughter works nights cleaning floors. Sometimes, the older kids baby-sit for local Moldovan families for a little bit of cash. Once, I burned old schoolbooks to keep the room warm—never thought I'd do that.

3. For those sharing houses or rooms with extended family or others, how is it coping with overcrowding? How has this affected relationships or daily life?
Olha:
We live—eight of us—in three rooms. Every argument, every cough, you hear it. Privacy is gone. My marriage suffered; my husband and I haven't had a calm conversation in months. Children are more irritable—they argue about phone chargers, about food portions, about nothing really. But sometimes, at night, we all laugh together telling stories, and I think we have become closer too. We survive by making rules (quiet at night, who uses the bathroom and when). Moldovan households are larger than in the city, but even here, it's a stretch. Sometimes I walk outside for an hour just to breathe alone.
Tetiana:
Same for us. I share a bedroom with my mother-in-law and two daughters. There's no space to work or think. My husband's brother lost his job and moved in with us—now 10 of us in an old house. But what can you do? You don't leave family outside. We have schedule charts on the fridge: who cooks, who cleans, who helps children with homework. There are tensions, but also deep support. We cry together; we keep each other strong. Sometimes, Moldovan neighbours look at us like we're "too many"—it feels humiliating.
Anna:
The kids don't have their own space to study. My teenage son is falling behind in Ukrainian school online because he can't focus. We try to make time for each other, but it's difficult. Everyone's nerves are thin. Still, it's better than being on the street.

4. Have you tried to seek social assistance or multipurpose cash support (UNHCR, IOM, or local NGOs)? What was your experience?
Larysa:
Yes, I applied twice for UNHCR cash assistance. The first time, it was great—they helped explain the process, I got the message on my phone, and the money really carried us through autumn. But the second time, the application process was more confusing, and I waited over a month for an answer. Friends got denied and they were so upset—they don't understand why the rules changed. Sometimes I go to the mayor's office, but mostly they just tell me, "Come later, we have no new information." IOM also helped with hygiene kits and some school supplies, which was amazing.
Kateryna:
For me, getting assistance was difficult—I don't speak much Romanian, and the forms are all in Romanian or in complicated Russian. Once I asked a neighbour to help, but I don't like asking so often. The Green Line is sometimes busy; I tried calling four times before someone answered. When I asked about disability support for my child, they said "We will call you back," but I am still waiting.
Olha:
I found UNHCR's support life-saving when we first arrived. But last summer, when they started prioritizing new groups, I felt left out. My neighbor's family was excluded while others continued to get help. There's a lot of rumor and resentment among refugees because of this.

5. Do you know about the Green Line or dopomogamd website? Do you trust these sources for information?
Anna:
I use the Green Line, but honestly, sometimes friends know more. The people on the phone are kind, but they don't always have detailed info for rural areas. I go on Telegram channels too, but then you hear ten different things. Dopomogamd is good for finding announcements, but many of the offers are for Chisinau, not the north.
Mariya:
I like the Green Line when I finally get through. But my trust is, well, not always full—sometimes, you get told "wait for a call back," and nobody calls. I check the dopomogamd site, but rarely do I find something local. My trust is really in other Ukrainians here. We share info on WhatsApp—maybe a teacher heard of a program, or someone saw a flyer at church.
Iryna:
Sometimes it seems like the information is always a few days late. It helps having one point of contact, but the rumor mill runs faster.

6. Tell us how you perceive acceptance or discrimination from the local Moldovan community in your village or nearby towns.
Larysa:
In the early days, people were amazing; they brought us blankets and food. But as the war drags on, I feel a chill. Some neighbors say nothing, just look the other way. At the shop, Moldovan women sometimes whisper that we get "special treatment." My son told me a Moldovan classmate said, "Go back to Ukraine, you use our money." It hurt him deeply.
Tetiana:
There are some who still invite us for tea, or check on us if someone's ill. But mostly, after the first months, we became "invisible." Jobs go to Moldovans first. My niece applied for a job in town and was told, "No, only for locals." The language barrier doesn't help either—sometimes, when I try to speak, people get impatient.
Anna:
But some people are wonderful. Our landlord has been a real friend, he helped fix the roof and brought us fresh eggs. I guess it depends on the person. There is kindness, but there is also fatigue and jealousy. I don't blame anyone, but I feel like a guest who has overstayed.

7. Could you share how your emotional well-being has changed since displacement? How do you and your family cope?
Olha:
I feel tired all the time. At first, after escaping the bombing, just being alive felt like a blessing. But after two years, the hopelessness creeps in. My back aches from stress, and I cry sometimes for no reason. My biggest worry is for my children—they have nightmares still. The community at church has been my strength; praying together brings relief. We tell stories of home to keep memories alive, but it hurts too.
Tetiana:
Anxiety is always with me. If I hear a car backfire, or a dog barking at night, my heart races. My husband was strong once, but he feels useless here—no job, no proper place to call home. It's depressing. I try to hide my tears from my daughters, but sometimes I shout for no reason, and then I feel so guilty.
Anna:
Hope is hard to hold onto, I'm not going to lie. There are days when it all feels impossible—finding work, paying bills, helping the kids adjust. I cope by writing letters to my sister back home and reading. I try to create small joys: baking bread, planting flowers, singing with children. It helps.

8. To what extent do language barriers impact your daily routine, social life, or job prospects?
Larysa:
Language is the wall I cannot climb. I studied Romanian a bit, but when I go to the doctor or post office, I panic. My daughter usually has to translate. For jobs, if you don't speak well, you don't work—it's that simple. Even the children struggle in school. My ten-year-old is already behind. The biggest problem is that language classes are few here; we need more.
Mariya:
It even impacts friendships. I'm friendly with other Ukrainians, but among Moldovan women, it's hard to join in. In town, when I look for a job, they ask, "Do you speak Romanian?"—most times, that's the end of the interview. I want to learn, I try Duolingo and watch TV in Romanian, but it's slow going.
Olha:
Yes, at the supermarket or pharmacy, I feel dumb. Sometimes the words don't come. I worry about sounding stupid. Moldovans often switch to Russian with me, but then I feel guilty I'm not making the effort to integrate. I wish there were intensive courses in every village.

9. If you could design a housing programme or give advice to UNHCR, what would you recommend?
Anna:
I would suggest more support for finding and paying for private rentals, but not just in the cities. We need help in villages too—even a list of trusted landlords who actually want refugees. Maybe some way to guarantee rent or help pay deposits. And please, help us with heating costs in winter! Even just firewood vouchers.
Kateryna:
It would help to have shared housing with proper privacy. Maybe split a big house with partitions, give families their own bathrooms. Also, more regular cash support for utilities. I'd also love to see "handyman" teams sponsored to help fix bad houses for both locals and refugees, so we can make rural houses liveable again. Sometimes we want to fix things but no tools or skills.
Tetiana:
Include language classes and community-building activities together with Moldovans. Maybe if we learned together, things would improve. Also, more psychological support—people think we only need cash, but really, we need hope and purpose.

10. Do you see yourselves integrating long-term into Moldova, or would you prefer to return to Ukraine? What would help you make that choice?
Anna:
If there was peace and security back home, of course I would want to return. My heart is in Ukraine. But I am grateful for the peace here, so if my children could have a future, if we could build a life—maybe get a job, a decent place to live, maybe even own our own house one day—then I would consider staying. For now, I live one month at a time.
Olha:
I can't imagine starting from nothing again in Ukraine. My house there was destroyed, and even if the war ends, I'll have nothing. Moldova feels both foreign and comforting now. The people, the food, the countryside—it grows on you. If my husband could get proper work, and our rights were protected, I'd stay.
Larysa:
I'm tired of moving. I want stability for my family. If I saw more long-term programs—not just emergency help, but real paths to settle, learn language, maybe buy a small plot of land—then yes, I might consider Moldova as my new home. I still hope to see Ukraine free, but I can't ask my children to wait forever.

Facilitator (Maria):
Thank you for your honesty and courage. Your words will guide us as we try to improve our programs. If there's anything else you want UNHCR to know, the floor is yours.
Iryna:
Don't forget us in the villages. We are still here, still hoping.
Mariya:
Some days, it's just nice to be heard. Thank you.

End of Discussion`,
    topics: [
      {
        outcomeAreaCode: "HA",
        outcomeAreaName: "Housing Assistance",
        category: "Access to Housing",
        subcategory: "Availability of affordable housing",
        type: "Gap",
        subcategoryDefinition: "Challenges in finding affordable housing options",
        description: "Refugees face significant challenges finding affordable housing after leaving placement centers",
        assessment: "Critical gap in housing availability and affordability",
        citations: "Anna: 'I didn't even know where to start...', Olha: 'There's no system here in these villages'",
        confidence: 0.9
      },
      {
        outcomeAreaCode: "FI",
        outcomeAreaName: "Financial Inclusion",
        category: "Economic Challenges",
        subcategory: "Cost of living pressures",
        type: "Challenge",
        subcategoryDefinition: "Difficulties managing basic living expenses",
        description: "High costs of rent and heating create severe financial strain",
        assessment: "Refugees struggle to afford basic necessities including heating and food",
        citations: "Mariya: 'Rent takes nearly half of what I get, and then heating... God, the heating costs in Moldova are a nightmare'",
        confidence: 0.85
      },
      {
        outcomeAreaCode: "SI",
        outcomeAreaName: "Social Integration",
        category: "Community Relations",
        subcategory: "Local community acceptance",
        type: "Mixed",
        subcategoryDefinition: "Varied experiences with local community acceptance",
        description: "Mixed experiences with local community - initial support followed by fatigue",
        assessment: "Community support has decreased over time, with instances of discrimination",
        citations: "Larysa: 'In the early days, people were amazing... But as the war drags on, I feel a chill'",
        confidence: 0.8
      }
    ]
  },
  {
    // Variation 2: Romania FGD - Male participants, different demographics
    filename: "FGD_Romania_Urban_2.docx",
    filePath: "/uploads/FGD_Romania_Urban_2.docx",
    assessmentId: "FGD_ROM_002",
    country: "Romania",
    dateOfDiscussion: "15 July 2025",
    location: "Community Center, Bucharest",
    purpose: "Assessment of integration challenges and employment access",
    method: "FGD",
    language: "Ukrainian/Romanian",
    facilitatorName: "Ion Popescu",
    facilitatorOrg: "Romanian Red Cross",
    participantsNumber: 6,
    participantsNationalities: "Ukrainian",
    participantsProfile: "Refugees",
    participantsEnvironment: "Urban",
    participantsSex: "Male",
    participantsAgeRange: "30-55",
    participantsGroupType: "Working-age men seeking employment",
    state: TranscriptionState.CHECK_BY_VALIDATOR,
    content: `FOCUS GROUP DISCUSSION NUMBER 2 - Romania Urban Male Employment
Country: Romania
Date: 15 July 2025
Location: Community Center, Bucharest
Participants: Dmytro (38), Vasyl (42), Andriy (35), Petro (47), Oleksandr (39), Viktor (52)

Focus: Employment challenges and integration experiences

1. What have been your main challenges in finding employment in Romania?

Dmytro: The biggest issue is credential recognition. I was an engineer in Ukraine, but here they want Romanian certifications for everything. I've been working as a delivery driver for 8 months now.

Vasyl: Language barrier is huge. Even basic Romanian isn't enough for professional jobs. I speak decent English, but most employers want fluency in Romanian.

Andriy: Age discrimination is real. At 35, some employers already consider me too old for entry-level positions, but my experience doesn't count because it's from Ukraine.

2. How has the displacement affected your role as providers for your families?

Petro: It's devastating. In Ukraine, I provided well for my family. Here, my wife works cleaning offices while I do construction. Our roles reversed completely.

Oleksandr: The children see me struggling, and they ask why we can't go home. It's hard to maintain authority and respect when you can barely pay rent.

Viktor: I feel useless sometimes. Back home, I was respected in my community. Here, I'm just another refugee looking for work.`,
    topics: [
      {
        outcomeAreaCode: "EM",
        outcomeAreaName: "Employment",
        category: "Access to Employment",
        subcategory: "Credential recognition",
        type: "Barrier",
        subcategoryDefinition: "Challenges in having professional qualifications recognized",
        description: "Professional credentials from Ukraine not recognized, forcing skilled workers into lower-skilled jobs",
        assessment: "Significant barrier to employment matching skills and experience",
        citations: "Dmytro: 'I was an engineer in Ukraine, but here they want Romanian certifications for everything'",
        confidence: 0.9
      }
    ]
  },
  {
    // Variation 3: Poland FGD - Mixed demographics, education focus
    filename: "FGD_Poland_Education_3.docx",
    filePath: "/uploads/FGD_Poland_Education_3.docx",
    assessmentId: "FGD_POL_003",
    country: "Poland",
    dateOfDiscussion: "20 August 2025",
    location: "School Building, Kraków",
    purpose: "Education access assessment for refugee children",
    method: "FGD",
    language: "Ukrainian/Polish",
    facilitatorName: "Anna Kowalski",
    facilitatorOrg: "UNICEF Poland",
    participantsNumber: 8,
    participantsNationalities: "Ukrainian",
    participantsProfile: "Refugees with school-age children",
    participantsEnvironment: "Urban",
    participantsSex: "Mixed",
    participantsAgeRange: "28-45",
    participantsGroupType: "Parents of school-age children",
    state: TranscriptionState.CHECK_BY_AI,
    content: `FOCUS GROUP DISCUSSION NUMBER 3 - Poland Education Access
Country: Poland
Date: 20 August 2025
Location: School Building, Kraków
Participants: Mothers and fathers of school-age children

Focus: Children's education integration and challenges

1. How have your children adapted to the Polish education system?

Mother Oksana: My 12-year-old is struggling with Polish language in mathematics. Numbers are universal, but word problems are impossible for her.

Father Pavel: The teachers are kind, but they don't understand Ukrainian culture. My son feels isolated during traditional Polish celebrations.

Mother Natalia: Online Ukrainian school plus Polish school is too much. My daughter is exhausted trying to keep up with both systems.

2. What support have you received for your children's education?

Father Roman: The school provided some Polish language tutoring, but it's only twice a week. Not enough for real integration.

Mother Svitlana: My youngest got psychological support after having nightmares about the war. The school counselor has been amazing.

[Content continues with detailed education-focused discussion...]`,
    topics: [
      {
        outcomeAreaCode: "ED",
        outcomeAreaName: "Education",
        category: "Access to Education",
        subcategory: "Language barriers in education",
        type: "Challenge",
        subcategoryDefinition: "Difficulties accessing education due to language differences",
        description: "Children struggle with Polish language requirements in academic subjects",
        assessment: "Language barriers significantly impact educational integration",
        citations: "Mother Oksana: 'My 12-year-old is struggling with Polish language in mathematics'",
        confidence: 0.85
      }
    ]
  },
  {
    // Variation 4: Czech Republic FGD - Healthcare focus
    filename: "FGD_Czech_Healthcare_4.docx",
    filePath: "/uploads/FGD_Czech_Healthcare_4.docx",
    assessmentId: "FGD_CZE_004",
    country: "Czech Republic",
    dateOfDiscussion: "5 September 2025",
    location: "Medical Clinic, Prague",
    purpose: "Healthcare access assessment for vulnerable populations",
    method: "FGD",
    language: "Ukrainian/Czech",
    facilitatorName: "Dr. Pavel Novák",
    facilitatorOrg: "Czech Medical Association",
    participantsNumber: 5,
    participantsNationalities: "Ukrainian",
    participantsProfile: "Refugees with chronic health conditions",
    participantsEnvironment: "Urban",
    participantsSex: "Mixed",
    participantsAgeRange: "45-70",
    participantsGroupType: "Individuals with specific health needs",
    state: TranscriptionState.PENDING,
    content: `FOCUS GROUP DISCUSSION NUMBER 4 - Czech Healthcare Access
Country: Czech Republic
Date: 5 September 2025
Location: Medical Clinic, Prague
Participants: Refugees with chronic health conditions

Focus: Healthcare access and quality

1. What challenges have you faced accessing healthcare in Czech Republic?

Participant A: Finding specialists who speak Ukrainian or Russian is very difficult. I need cardiology care but can't communicate my symptoms properly.

Participant B: The insurance system is confusing. Sometimes I'm covered, sometimes I'm not. I never know until I'm at the doctor's office.

[Content continues with healthcare-focused discussion...]`,
    topics: []
  },
  {
    // Variation 5: Germany FGD - Mental health focus
    filename: "FGD_Germany_Mental_Health_5.docx",
    filePath: "/uploads/FGD_Germany_Mental_Health_5.docx",
    assessmentId: "FGD_GER_005",
    country: "Germany",
    dateOfDiscussion: "12 October 2025",
    location: "Counseling Center, Berlin",
    purpose: "Mental health and psychosocial support assessment",
    method: "FGD",
    language: "Ukrainian/German",
    facilitatorName: "Dr. Elena Schmidt",
    facilitatorOrg: "German Psychological Society",
    noteTakerName: "Thomas Mueller",
    noteTakerOrg: "German Psychological Society",
    participantsNumber: 6,
    participantsNationalities: "Ukrainian",
    participantsProfile: "Refugees experiencing trauma",
    participantsEnvironment: "Urban",
    participantsSex: "Mixed",
    participantsAgeRange: "25-50",
    participantsGroupType: "Trauma survivors and families",
    state: TranscriptionState.COMPLETE,
    content: `FOCUS GROUP DISCUSSION NUMBER 5 - Germany Mental Health
Country: Germany
Date: 12 October 2025
Location: Counseling Center, Berlin
Participants: Trauma survivors and their families

Focus: Mental health support and coping mechanisms

1. How has displacement affected your mental health and that of your family?

Participant A: The constant uncertainty is the worst part. We don't know if we'll be here next month or next year. It's impossible to plan anything.

Participant B: My children have nightmares every night. They draw pictures of explosions and destroyed houses. I don't know how to help them.

[Content continues with mental health-focused discussion...]`,
    topics: [
      {
        outcomeAreaCode: "MH",
        outcomeAreaName: "Mental Health",
        category: "Psychological Support",
        subcategory: "Trauma-related stress",
        type: "Need",
        subcategoryDefinition: "Mental health challenges related to war trauma and displacement",
        description: "Ongoing trauma symptoms and uncertainty affecting mental health",
        assessment: "Significant mental health support needs identified",
        citations: "Participant A: 'The constant uncertainty is the worst part'",
        confidence: 0.95
      }
    ]
  }
]

async function main() {
  try {
    console.log('Starting FGD transcription seeding...')

    // Create transcriptions
    for (const data of fgdData) {
      const { topics, ...transcriptionData } = data

      console.log(`Creating transcription: ${transcriptionData.filename}`)

      const transcription = await prisma.transcription.create({
        data: transcriptionData
      })

      // Create associated topics
      if (topics && topics.length > 0) {
        console.log(`Creating ${topics.length} topics for ${transcriptionData.filename}`)

        for (const topicData of topics) {
          await prisma.topic.create({
            data: {
              ...topicData,
              transcriptionId: transcription.id
            }
          })
        }
      }
    }

    console.log('FGD seeding completed successfully!')
    console.log(`Created ${fgdData.length} transcriptions with various states and situations:`)
    fgdData.forEach(item => {
      console.log(`- ${item.filename} (${item.country}) - State: ${item.state}`)
    })

  } catch (error) {
    console.error('Error seeding FGD data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()