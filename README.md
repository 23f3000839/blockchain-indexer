# Solana Blockchain Indexing Platform

A full-stack application that enables developers to easily integrate and index Solana blockchain data into their PostgreSQL database using Helius webhooks.

## Overview

This platform eliminates the complexity of running your own RPC, Geyser, Validator, or webhook infrastructure by leveraging Helius webhooks for seamless data indexing. It provides a user-friendly interface to configure, monitor, and manage the indexing process.

## Features

- **User Authentication** via Clerk
- **PostgreSQL Database Integration**
  - Securely store and manage database connection credentials
  - Test connections before saving
- **Customizable Data Indexing**
  - NFT bid tracking
  - NFT price tracking
  - Token availability monitoring
  - Token price tracking across platforms
- **Helius Webhook Integration**
  - Automated webhook setup and management
  - Webhook signature verification
  - Real-time data processing
- **Schema Generation**
  - Generate appropriate database schemas for different data types
- **Dashboard & Monitoring**
  - Real-time status of indexing jobs
  - Error reporting and troubleshooting
  - Data synchronization statistics

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Shadcn/UI
- **Authentication**: Clerk
- **Database**: PostgreSQL, Prisma ORM
- **State Management**: TanStack Query
- **Data Tables**: TanStack Table
- **Form Handling**: React Hook Form, Zod
- **Icons**: Lucide React
- **Blockchain**: Helius API, Solana web3.js

## Getting Started

### Prerequisites

- Node.js (v18 or higher) or Bun
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blockchain-indexer.git
   cd blockchain-indexer
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up your environment variables by creating a `.env` file:
   ```
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/blockchain_indexer"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

   # Helius API
   HELIUS_API_KEY="your_helius_api_key"

   # Encryption (32 bytes for AES-256)
   ENCRYPTION_KEY="32_character_secret_for_encryption"

   # Webhook Secret
   WEBHOOK_SECRET="secret_for_webhook_signature_verification"

   # Solana RPC URL (devnet for testing)
   SOLANA_RPC_URL="https://api.devnet.solana.com"
   ```

4. Initialize the database:
   ```bash
   bun run prisma:migrate
   ```

5. Start the development server:
   ```bash
   bun run dev
   ```

## Usage

1. **Create an Account**: Sign up using email or your preferred OAuth method.

2. **Connect Your Database**: Add your PostgreSQL database credentials to establish a connection.

3. **Configure Data Indexing**: Select what Solana blockchain data you want to index and specify the target table.

4. **Set Up Webhooks**: The platform will automatically set up Helius webhooks to capture the data you've chosen.

5. **Monitor Your Data**: Use the dashboard to monitor the status of your indexing jobs and view statistics.

## Database Schema Overview

### User Management
- `User`: Stores user information from Clerk
- `DatabaseConnection`: Stores encrypted database credentials for users

### Indexing Configuration
- `IndexingConfiguration`: Defines what data to index and how
- `WebhookEndpoint`: Manages webhook endpoints for receiving data
- `WebhookConfigMapping`: Connects webhooks to indexing configurations
- `SyncStatus`: Tracks synchronization status and errors

### Data Types
- `NFT_BIDS`: Track NFT bid activity
- `NFT_PRICES`: Monitor NFT price movements
- `TOKEN_AVAILABILITY`: Track token availability
- `TOKEN_PRICES`: Monitor token prices across platforms

## API Reference

### Webhook Endpoint

```
POST /api/webhooks/helius/:webhookId
```

This endpoint receives webhook data from Helius and processes it according to the configured indexing rules.

### Other API Endpoints

The platform provides several API endpoints for managing database connections, indexing configurations, and webhooks. See the API documentation for details.

## Setting Up Webhooks Manually

While the platform automates webhook setup, you can also create webhooks manually:

1. Obtain your Helius API key
2. Create a webhook endpoint on Helius pointing to `https://yourdomain.com/api/webhooks/helius/:webhookId`
3. Configure your indexing settings in the platform

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Helius](https://helius.xyz) - Providing the webhook infrastructure
- [Solana](https://solana.com) - The blockchain platform
- [Shadcn/UI](https://ui.shadcn.com/) - For the beautiful UI components
