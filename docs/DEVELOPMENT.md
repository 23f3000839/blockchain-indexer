# Development Guide

## Local Development Setup

### Prerequisites

1. Install Node.js 18+ or Bun
2. Install PostgreSQL
3. Install Git
4. Install VS Code (recommended)

### Initial Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blockchain-indexer.git
cd blockchain-indexer
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
# or
bun dev
```

## Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch
- Feature branches: `feature/feature-name`
- Bug fix branches: `fix/bug-name`
- Release branches: `release/v1.x.x`

### Commit Messages

Follow conventional commits:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Code Style

1. Use TypeScript for type safety
2. Follow ESLint rules
3. Format code with Prettier
4. Use meaningful variable names
5. Add JSDoc comments for functions

Example:
```typescript
/**
 * Processes NFT price data from webhook payload
 * @param data - Webhook payload data
 * @param config - Indexing configuration
 * @param dbClient - Database client
 * @returns Number of records processed
 */
async function processNFTPrices(
  data: WebhookPayload,
  config: IndexingConfig,
  dbClient: Client
): Promise<number> {
  // Implementation
}
```

## Testing

### Unit Tests

Run unit tests:
```bash
npm run test
# or
bun test
```

Test file structure:
```
src/
  __tests__/
    unit/
      schema.test.ts
      error-handling.test.ts
```

### Integration Tests

Run integration tests:
```bash
npm run test:integration
# or
bun test:integration
```

Test file structure:
```
src/
  __tests__/
    integration/
      webhook.test.ts
      database.test.ts
```

### E2E Tests

Run E2E tests:
```bash
npm run test:e2e
# or
bun test:e2e
```

Test file structure:
```
src/
  __tests__/
    e2e/
      flows/
        indexing.test.ts
        webhook.test.ts
```

## Database Management

### Migrations

Create a new migration:
```bash
npx prisma migrate dev --name migration_name
```

Apply migrations:
```bash
npx prisma migrate deploy
```

Reset database:
```bash
npx prisma migrate reset
```

### Schema Changes

1. Edit `prisma/schema.prisma`
2. Generate types:
```bash
npx prisma generate
```
3. Create migration:
```bash
npx prisma migrate dev --name describe_changes
```

## Debugging

### VS Code Configuration

`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Next.js",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

### Logging

Use structured logging:
```typescript
import { logger } from '@/lib/logger';

logger.info('Processing webhook', {
  webhookId,
  configId,
  dataType
});

logger.error('Failed to process webhook', {
  webhookId,
  error: error.message,
  stack: error.stack
});
```

## Performance Optimization

### Database

1. Use indexes for frequently queried columns
2. Implement connection pooling
3. Use prepared statements
4. Batch operations when possible

### API

1. Implement caching
2. Use pagination
3. Rate limiting
4. Request validation

## Security

### Best Practices

1. Input validation
2. SQL injection prevention
3. XSS protection
4. CSRF protection
5. Rate limiting
6. Secure headers

### Environment Variables

Never commit sensitive data:
```bash
# .env.example
DATABASE_URL="postgresql://user:password@host:5432/db"
HELIUS_API_KEY="your_api_key"
WEBHOOK_SECRET="your_secret"
```

## Deployment

### Production

1. Build the application:
```bash
npm run build
# or
bun run build
```

2. Start production server:
```bash
npm run start
# or
bun run start
```

### Docker

Build image:
```bash
docker build -t blockchain-indexer .
```

Run container:
```bash
docker run -p 3000:3000 blockchain-indexer
```

## Monitoring

### Health Checks

- `/api/health`: Application health
- `/api/health/db`: Database health
- `/api/health/webhook`: Webhook health

### Metrics

- Request count
- Error rate
- Processing time
- Database performance

## Troubleshooting

### Common Issues

1. Database Connection
   - Check credentials
   - Verify network access
   - Check SSL configuration

2. Webhook Processing
   - Verify signature
   - Check payload format
   - Monitor error logs

3. Performance
   - Check database indexes
   - Monitor connection pool
   - Review query performance

### Logs

Check logs:
```bash
# Application logs
npm run logs

# Database logs
npm run logs:db

# Webhook logs
npm run logs:webhook
``` 