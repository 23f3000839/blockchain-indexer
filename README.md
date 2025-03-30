# Blockchain Indexer

A powerful platform for indexing blockchain data into PostgreSQL databases using Helius webhooks.

## Features

- 🔐 Secure user authentication with Clerk
- 📊 PostgreSQL database integration with SSL support
- 🔄 Real-time blockchain data indexing
- 🎯 Customizable data types:
  - NFT prices
  - NFT bids
  - Token availability
  - Token prices
- 🔍 Schema validation and management
- 🔄 Automatic retry mechanism
- 📝 Error tracking and notifications
- 🎨 Modern dark mode UI

## Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Helius API key
- Clerk account for authentication

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

# Helius
HELIUS_API_KEY="your_helius_api_key"
WEBHOOK_SECRET="your_webhook_secret"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Installation

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

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
# or
bun dev
```

## Project Structure

```
blockchain-indexer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── connections/    # Database connection management
│   │   │   │   └── index.ts    # API routes for connections
│   │   │   ├── indexing/       # Indexing configuration management
│   │   │   └── webhooks/       # Webhook handling
│   │   │       └── index.ts    # API routes for webhooks
│   │   ├── dashboard/         # Dashboard pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # UI components
│   │   ├── api-components/    # Components for API requests
│   │   ├── dashboard-components/ # Components for dashboard pages
│   │   └── layout.tsx         # Root layout
│   ├── lib/
│   │   ├── db.ts             # Database utilities
│   │   ├── helius.ts         # Helius API utilities
│   │   ├── schema.ts         # Schema management
│   │   └── error-handling.ts # Error handling utilities
│   └── types/                # TypeScript types
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static assets
```

## Database Schema

### Tables

1. **User**
   - User information and authentication
   - One-to-many relationship with database connections

2. **DatabaseConnection**
   - PostgreSQL connection details
   - Encrypted credentials
   - SSL support

3. **IndexingConfiguration**
   - Data type selection
   - Target table specification
   - Active/inactive status

4. **WebhookEndpoint**
   - Helius webhook configuration
   - Secret for signature verification
   - Error tracking

5. **SyncStatus**
   - Processing status
   - Record counts
   - Error logging
   - Metadata storage

## API Endpoints

### Database Connections

- `POST /api/connections`
  - Create a new database connection
  - Validates connection before saving
  - Encrypts sensitive data

- `GET /api/connections`
  - List all connections for the current user
  - Decrypts connection details

- `DELETE /api/connections/:id`
  - Delete a database connection
  - Cascades to related configurations

### Indexing Configurations

- `POST /api/indexing`
  - Create a new indexing configuration
  - Validates target table schema
  - Sets up webhook endpoint

- `GET /api/indexing`
  - List all configurations for the current user
  - Includes sync status

- `DELETE /api/indexing/:id`
  - Delete an indexing configuration
  - Removes associated webhook endpoint

### Webhooks

- `POST /api/webhooks/helius/:id`
  - Handles incoming Helius webhooks
  - Validates webhook signature
  - Processes data based on configuration
  - Implements retry mechanism
  - Tracks processing status

## Error Handling

The application implements a robust error handling system:

1. **Retry Mechanism**
   - Exponential backoff
   - Configurable retry attempts
   - Maximum delay limits

2. **Error Tracking**
   - Detailed error logging
   - Processing status updates
   - User notifications

3. **Schema Validation**
   - Automatic table creation
   - Column validation
   - Index management

## Development

### Running Tests

```bash
npm run test
# or
bun test
```

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

### Type Generation

```bash
npx prisma generate
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details
