#!/bin/sh

echo "🚀 Starting application initialization..."

# Wait for any database file locks to be released
sleep 2

# Run Prisma migrations
echo "📊 Running Prisma migrations..."
npx prisma migrate deploy

# Check if database needs seeding (check if User table is empty)
echo "🌱 Checking if database needs seeding..."
USER_COUNT=$(node -e "
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
prisma.user.count().then(count => {
  console.log(count);
  prisma.\$disconnect();
}).catch(() => {
  console.log('0');
  process.exit(0);
});
")

if [ "$USER_COUNT" = "0" ]; then
  echo "🌱 Database is empty, running initial seeding..."
  npm run seed

  echo "📝 Running FGD transcription seeding..."
  npm run seed:fgd

  echo "✅ Seeding completed successfully!"
else
  echo "📊 Database already contains data, skipping seeding."
fi

echo "🎉 Initialization completed!"

# Start the application
echo "🚀 Starting the Next.js application..."
exec node server.js