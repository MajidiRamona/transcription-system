# Database Seeding Guide

This document explains how to seed the database with sample FGD (Focus Group Discussion) transcription data.

## What's Included

The seeding creates 5 sample FGD transcriptions with different:

- **Countries**: Moldova, Romania, Poland, Czech Republic, Germany
- **Demographics**: Various age groups, genders, and participant profiles
- **Focus Areas**: Housing, employment, education, healthcare, mental health
- **Transcription States**: PENDING, CHECK_BY_AI, CHECK_BY_VALIDATOR, COMPLETE
- **Associated Topics**: Extracted themes with outcome areas and assessments

### Sample Data Overview

1. **FGD_Sample_1 (Moldova)** - Complete
   - 7 Female Ukrainian refugees (25-59)
   - Focus: Housing, finances, social support
   - 3 associated topics (Housing, Financial, Social Integration)

2. **FGD_Romania_Urban_2 (Romania)** - Check by Validator
   - 6 Male Ukrainian refugees (30-55)
   - Focus: Employment challenges
   - 1 associated topic (Employment barriers)

3. **FGD_Poland_Education_3 (Poland)** - Check by AI
   - 8 Mixed gender parents (28-45)
   - Focus: Children's education integration
   - 1 associated topic (Education language barriers)

4. **FGD_Czech_Healthcare_4 (Czech Republic)** - Pending
   - 5 Mixed gender with health conditions (45-70)
   - Focus: Healthcare access
   - No topics yet (pending processing)

5. **FGD_Germany_Mental_Health_5 (Germany)** - Complete
   - 6 Mixed gender trauma survivors (25-50)
   - Focus: Mental health support
   - 1 associated topic (Mental health needs)

## How to Seed

### Automatic Seeding (Production)

When the Docker container starts, it automatically:
1. Runs Prisma migrations
2. Checks if database is empty
3. If empty, runs basic user seeding
4. Then runs FGD transcription seeding

### Manual Seeding (Development)

```bash
# Seed basic users (admin, validators)
npm run seed

# Seed FGD transcriptions
npm run seed:fgd
```

### Manual Seeding (Docker Production)

```bash
# Run the seeding service manually
docker-compose --profile tools up seed

# Or run seeding in the running app container
docker-compose exec app npm run seed:fgd
```

## Database Structure

The seeder populates these tables:

- **Transcription**: Main FGD records with metadata
- **Topic**: Associated themes and outcome areas extracted from discussions
- **User**: System users (admin, validator1, validator2)

## Verification

After seeding, you should have:
- 3 users (1 admin, 2 validators)
- 5 transcriptions in various states
- 6+ topics across the transcriptions

Check the application UI or database directly to verify the data was created successfully.

## Customization

To add your own FGD data:
1. Edit `src/scripts/seed-fgd.ts`
2. Add new objects to the `fgdData` array
3. Run the seeder again

The seeder is idempotent - it will create new records but won't duplicate existing ones.