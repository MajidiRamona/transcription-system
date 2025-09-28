# Ramona Transcription System

A full-stack Next.js application for processing and validating transcriptions with AI-powered metadata extraction, built to replicate the functionality described in the Python pipeline.

## Features

- **User Authentication**: Support for Admin, Validator1, and Validator2 roles
- **Transcription Management**: Upload, edit, and manage transcriptions
- **AI Processing**: Automatic metadata extraction using Swiss AI (Apertus) platform
- **Workflow States**: PENDING → CHECK_BY_AI → CHECK_BY_VALIDATOR → COMPLETE
- **Real-time UI**: Dashboard for viewing and editing transcriptions
- **Role-based Access**: Different permissions for different user types

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **AI Service**: Swiss AI Platform (Apertus-70B model)

## Quick Start

### 1. Installation

```bash
# Install dependencies
npm install

# Generate Prisma client and create database
npx prisma generate
npx prisma db push

# Seed the database with default users
npx tsx scripts/seed.ts
```

### 2. Environment Configuration

Update the `.env` file:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth (change secret in production)
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Swiss AI Platform API Key (required for AI processing)
SWISS_AI_PLATFORM_API_KEY="your-actual-api-key-here"

# Apertus Configuration
APERTUS_BASE_URL="https://api.swisscom.com/layer/swiss-ai-weeks/apertus-70b/v1"
APERTUS_MODEL_ID="swiss-ai/Apertus-70B"
```

### 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to access the application.

## Default Users

The system comes with three pre-configured users:

| Username   | Password     | Role       |
|------------|--------------|------------|
| admin      | admin123     | ADMIN      |
| validator1 | validator1123| VALIDATOR1 |
| validator2 | validator2123| VALIDATOR2 |

## Usage

### 1. Sign In
- Navigate to http://localhost:3000
- Use one of the default credentials above

### 2. Upload Transcription
- Click "Upload New Transcription" from the dashboard
- Enter filename and paste transcription content
- The system supports full text transcriptions with embedded metadata

### 3. AI Processing
- From the dashboard, click "Check & Extract Data by AI" for pending transcriptions
- The system will extract metadata fields like:
  - Assessment ID, Country, Date of Discussion
  - Facilitator and Note Taker information
  - Participant demographics and details
  - Topics and classifications (when taxonomy data is available)

### 4. Validation
- Validators can edit extracted metadata in the detailed view
- Use the tabs to navigate between Content, Metadata, and Topics
- Save changes and mark transcriptions as complete

## AI Integration

The system replicates the Python pipeline functionality:

- **Metadata Extraction**: Uses Apertus-70B to extract structured metadata from transcription text
- **Topic Classification**: Prepared for taxonomy-based topic extraction (topics generation requires taxonomy data)
- **Citation Verification**: Validates that AI-generated citations are verbatim quotes from the source text
- **Fallback Processing**: Includes heuristic fallbacks for missing AI extractions

## API Endpoints

- `GET /api/transcriptions` - List all transcriptions
- `POST /api/transcriptions` - Create new transcription
- `GET /api/transcriptions/[id]` - Get transcription details
- `PUT /api/transcriptions/[id]` - Update transcription
- `POST /api/transcriptions/[id]/ai-process` - Process with AI

## Database Schema

The application uses a relational database with the following main entities:

- **Users**: Authentication and role management
- **Transcriptions**: Main transcription data and metadata fields
- **Topics**: AI-extracted topics and classifications
- **Enums**: UserRole and TranscriptionState

## Development

### Database Operations

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (removes all data)
npx prisma db push --force-reset

# Re-seed with default users
npx tsx scripts/seed.ts
```

### Adding New Features

The application is designed to be easily extensible:

- Add new metadata fields in the Prisma schema
- Extend AI processing in `lib/ai-service.ts`
- Add new UI components in the dashboard
- Implement new API endpoints following existing patterns

## Production Deployment

1. Update environment variables (especially `NEXTAUTH_SECRET`)
2. Configure production database (PostgreSQL recommended)
3. Set up proper SSL certificates
4. Configure rate limiting and security headers
5. Set up monitoring and logging

## Troubleshooting

### Common Issues

1. **AI Processing Fails**: Verify `SWISS_AI_PLATFORM_API_KEY` is set correctly
2. **Database Errors**: Run `npx prisma db push` to sync schema
3. **Authentication Issues**: Check `NEXTAUTH_SECRET` and `NEXTAUTH_URL` settings

### Logs

Check the browser console and terminal output for detailed error messages. The application includes comprehensive error handling and logging.

## License

This project is part of the Ramona transcription processing system.
