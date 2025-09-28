# Ramona Transcription - Deployment Guide

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Domain name (for production)
- SSL certificates (for production HTTPS)

### Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```env
# Required: Swiss AI Platform API Key
SWISS_AI_PLATFORM_API_KEY="your-actual-api-key"

# Required: Strong secret for NextAuth
NEXTAUTH_SECRET="your-super-secret-key-32-chars-min"

# Production URL
NEXTAUTH_URL="https://your-domain.com"

# Database password
POSTGRES_PASSWORD="your-secure-database-password"
```

### Development Deployment

```bash
# Start the application with PostgreSQL
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

The application will be available at `http://localhost:3000`

### Production Deployment

1. **With Nginx reverse proxy:**
```bash
# Start with Nginx (includes SSL configuration)
docker-compose --profile production up -d

# For HTTPS, place your SSL certificates in:
# - ./nginx/ssl/cert.pem
# - ./nginx/ssl/key.pem
```

2. **Direct deployment (no Nginx):**
```bash
# Start only app and database
docker-compose up -d app postgres
```

### Database Setup

The database will be automatically initialized on first run. To seed with default users:

```bash
# Access the app container
docker-compose exec app sh

# Run the seed script
npm run seed
```

**Default Users:**
- admin / admin123 (ADMIN role)
- validator1 / validator123 (VALIDATOR1 role)
- validator2 / validator123 (VALIDATOR2 role)

### Health Checks

- Application health: `http://your-domain/api/health`
- Database connectivity is checked automatically

### Troubleshooting

**Check container status:**
```bash
docker-compose ps
```

**View application logs:**
```bash
docker-compose logs app
```

**Database connection issues:**
```bash
docker-compose logs postgres
```

**Restart services:**
```bash
docker-compose restart
```

### Production Considerations

1. **Environment Variables:**
   - Use strong, unique passwords
   - Set `NODE_ENV=production`
   - Configure proper `NEXTAUTH_URL`

2. **SSL/TLS:**
   - Obtain SSL certificates from Let's Encrypt or your provider
   - Update Nginx configuration for your domain
   - Uncomment HTTPS server block in nginx.conf

3. **Database:**
   - Regular backups of PostgreSQL data
   - Consider external managed database for high availability

4. **Monitoring:**
   - Application logs via `docker-compose logs`
   - Set up external monitoring for production

### Configuration Files

- `docker-compose.yml` - Main orchestration
- `Dockerfile` - Application container build
- `.dockerignore` - Files excluded from build
- `nginx/nginx.conf` - Reverse proxy configuration
- `.env` - Environment variables (create from .env.example)