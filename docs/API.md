# API Documentation

## Authentication

All API endpoints require authentication using Clerk. Include the session token in the Authorization header:

```http
Authorization: Bearer <session_token>
```

## Database Connections

### Create Connection

```http
POST /api/connections
Content-Type: application/json

{
  "name": "My Database",
  "host": "db.example.com",
  "port": 5432,
  "username": "user",
  "password": "password",
  "database": "mydb",
  "schema": "public",
  "useSSL": true
}
```

**Response:**
```json
{
  "id": "conn_123",
  "name": "My Database",
  "host": "db.example.com",
  "port": 5432,
  "username": "user",
  "database": "mydb",
  "schema": "public",
  "useSSL": true,
  "isActive": true
}
```

### List Connections

```http
GET /api/connections
```

**Response:**
```json
{
  "connections": [
    {
      "id": "conn_123",
      "name": "My Database",
      "host": "db.example.com",
      "port": 5432,
      "username": "user",
      "database": "mydb",
      "schema": "public",
      "useSSL": true,
      "isActive": true
    }
  ]
}
```

### Delete Connection

```http
DELETE /api/connections/:id
```

**Response:**
```json
{
  "success": true
}
```

## Indexing Configurations

### Create Configuration

```http
POST /api/indexing
Content-Type: application/json

{
  "name": "NFT Prices",
  "connectionId": "conn_123",
  "dataType": "NFT_PRICES",
  "targetTable": "nft_prices",
  "filters": {
    "collections": ["collection1", "collection2"]
  }
}
```

**Response:**
```json
{
  "id": "config_123",
  "name": "NFT Prices",
  "connectionId": "conn_123",
  "dataType": "NFT_PRICES",
  "targetTable": "nft_prices",
  "filters": {
    "collections": ["collection1", "collection2"]
  },
  "isActive": true,
  "webhookId": "webhook_123"
}
```

### List Configurations

```http
GET /api/indexing
```

**Response:**
```json
{
  "configurations": [
    {
      "id": "config_123",
      "name": "NFT Prices",
      "connectionId": "conn_123",
      "dataType": "NFT_PRICES",
      "targetTable": "nft_prices",
      "filters": {
        "collections": ["collection1", "collection2"]
      },
      "isActive": true,
      "webhookId": "webhook_123",
      "syncStatus": {
        "status": "COMPLETED",
        "recordsProcessed": 100,
        "lastSyncedAt": "2024-03-24T12:00:00Z"
      }
    }
  ]
}
```

### Delete Configuration

```http
DELETE /api/indexing/:id
```

**Response:**
```json
{
  "success": true
}
```

## Webhooks

### Helius Webhook Endpoint

```http
POST /api/webhooks/helius/:id
Content-Type: application/json
Helius-Signature: <signature>

{
  "type": "NFT_SALE",
  "transactions": [
    {
      "nfts": [
        {
          "mint": "nft_mint_address"
        }
      ],
      "amount": 100000000,
      "buyer": "buyer_address",
      "seller": "seller_address",
      "signature": "tx_signature",
      "timestamp": 1679012345
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "recordsProcessed": 1
}
```

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "error": "Missing or invalid authentication token"
}
```

### 403 Forbidden
```json
{
  "error": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "An unexpected error occurred"
}
```

## Rate Limiting

- API requests are limited to 100 requests per minute per user
- Webhook endpoints are limited to 1000 requests per minute
- Rate limit headers are included in responses:
  ```http
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1679012345
  ```

## Data Types

### NFT_PRICES
```typescript
interface NFTPricesData {
  nft_address: string;
  price_sol: number;
  buyer: string;
  seller: string;
  transaction_signature: string;
  timestamp: Date;
}
```

### NFT_BIDS
```typescript
interface NFTBidsData {
  nft_address: string;
  bid_amount_sol: number;
  bidder: string;
  transaction_signature: string;
  marketplace?: string;
  timestamp: Date;
}
```

### TOKEN_AVAILABILITY
```typescript
interface TokenAvailabilityData {
  token_mint: string;
  from_account?: string;
  to_account?: string;
  amount: number;
  transaction_type: string;
  transaction_signature: string;
  timestamp: Date;
}
```

### TOKEN_PRICES
```typescript
interface TokenPricesData {
  token_in_mint: string;
  token_out_mint: string;
  amount_in: number;
  amount_out: number;
  price_in_sol?: number;
  dex?: string;
  transaction_signature: string;
  timestamp: Date;
}
``` 