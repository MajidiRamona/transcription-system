-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Transcription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT 'PENDING',
    "assessmentId" TEXT,
    "country" TEXT,
    "dateOfDiscussion" TEXT,
    "location" TEXT,
    "purpose" TEXT,
    "method" TEXT,
    "language" TEXT,
    "facilitatorName" TEXT,
    "facilitatorOrg" TEXT,
    "facilitatorEmail" TEXT,
    "noteTakerName" TEXT,
    "noteTakerOrg" TEXT,
    "noteTakerEmail" TEXT,
    "participantsNumber" INTEGER,
    "participantsNationalities" TEXT,
    "participantsProfile" TEXT,
    "participantsEnvironment" TEXT,
    "participantsSex" TEXT,
    "participantsAgeRange" TEXT,
    "participantsGroupType" TEXT,
    "aiProcessedAt" DATETIME,
    "aiError" TEXT,
    "assignedToId" TEXT,
    "lastEditedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transcription_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transcription_lastEditedById_fkey" FOREIGN KEY ("lastEditedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transcriptionId" TEXT NOT NULL,
    "outcomeAreaCode" TEXT,
    "outcomeAreaName" TEXT,
    "category" TEXT,
    "subcategory" TEXT,
    "type" TEXT,
    "subcategoryDefinition" TEXT,
    "description" TEXT,
    "assessment" TEXT,
    "citations" TEXT,
    "confidence" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Topic_transcriptionId_fkey" FOREIGN KEY ("transcriptionId") REFERENCES "Transcription" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
