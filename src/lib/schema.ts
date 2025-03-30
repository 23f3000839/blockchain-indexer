import { Client } from "pg";
import { DataType } from "@prisma/client";

// Schema definitions for each data type
const SCHEMA_DEFINITIONS = {
  [DataType.NFT_PRICES]: `
    CREATE TABLE IF NOT EXISTS {tableName} (
      id SERIAL PRIMARY KEY,
      nft_address TEXT NOT NULL,
      price_sol DECIMAL(20, 9) NOT NULL,
      buyer TEXT NOT NULL,
      seller TEXT NOT NULL,
      transaction_signature TEXT NOT NULL,
      timestamp TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_{tableName}_nft_address ON {tableName}(nft_address);
    CREATE INDEX IF NOT EXISTS idx_{tableName}_timestamp ON {tableName}(timestamp);
  `,
  [DataType.NFT_BIDS]: `
    CREATE TABLE IF NOT EXISTS {tableName} (
      id SERIAL PRIMARY KEY,
      nft_address TEXT NOT NULL,
      bid_amount_sol DECIMAL(20, 9) NOT NULL,
      bidder TEXT NOT NULL,
      transaction_signature TEXT NOT NULL,
      marketplace TEXT,
      timestamp TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_{tableName}_nft_address ON {tableName}(nft_address);
    CREATE INDEX IF NOT EXISTS idx_{tableName}_timestamp ON {tableName}(timestamp);
  `,
  [DataType.TOKEN_AVAILABILITY]: `
    CREATE TABLE IF NOT EXISTS {tableName} (
      id SERIAL PRIMARY KEY,
      token_mint TEXT NOT NULL,
      from_account TEXT,
      to_account TEXT,
      amount DECIMAL(20, 9) NOT NULL,
      transaction_type TEXT NOT NULL,
      transaction_signature TEXT NOT NULL,
      timestamp TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_{tableName}_token_mint ON {tableName}(token_mint);
    CREATE INDEX IF NOT EXISTS idx_{tableName}_timestamp ON {tableName}(timestamp);
  `,
  [DataType.TOKEN_PRICES]: `
    CREATE TABLE IF NOT EXISTS {tableName} (
      id SERIAL PRIMARY KEY,
      token_in_mint TEXT NOT NULL,
      token_out_mint TEXT NOT NULL,
      amount_in DECIMAL(20, 9) NOT NULL,
      amount_out DECIMAL(20, 9) NOT NULL,
      price_in_sol DECIMAL(20, 9),
      dex TEXT,
      transaction_signature TEXT NOT NULL,
      timestamp TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_{tableName}_token_in ON {tableName}(token_in_mint);
    CREATE INDEX IF NOT EXISTS idx_{tableName}_token_out ON {tableName}(token_out_mint);
    CREATE INDEX IF NOT EXISTS idx_{tableName}_timestamp ON {tableName}(timestamp);
  `
};

export async function validateAndCreateSchema(
  config: { targetTable: string; dataType: DataType },
  dbClient: Client
): Promise<void> {
  try {
    // Check if table exists
    const tableExists = await dbClient.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = $1
      )`,
      [config.targetTable]
    );

    if (!tableExists.rows[0].exists) {
      // Create table with proper schema
      const schema = SCHEMA_DEFINITIONS[config.dataType].replace(
        /{tableName}/g,
        config.targetTable
      );
      
      await dbClient.query(schema);
      console.log(`Created table ${config.targetTable} with schema for ${config.dataType}`);
    }

    // Validate table structure
    await validateTableStructure(config.targetTable, config.dataType, dbClient);
  } catch (error) {
    console.error(`Error validating/creating schema for ${config.targetTable}:`, error);
    throw new Error(`Schema validation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function validateTableStructure(
  tableName: string,
  dataType: DataType,
  dbClient: Client
): Promise<void> {
  try {
    // Get table columns
    const columns = await dbClient.query(
      `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = $1`,
      [tableName]
    );

    // Validate required columns exist
    const requiredColumns = getRequiredColumns(dataType);
    const missingColumns = requiredColumns.filter(
      col => !columns.rows.some(row => row.column_name === col)
    );

    if (missingColumns.length > 0) {
      throw new Error(
        `Missing required columns in table ${tableName}: ${missingColumns.join(", ")}`
      );
    }
  } catch (error) {
    console.error(`Error validating table structure for ${tableName}:`, error);
    throw new Error(
      `Table structure validation failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function getRequiredColumns(dataType: DataType): string[] {
  switch (dataType) {
    case DataType.NFT_PRICES:
      return ["nft_address", "price_sol", "buyer", "seller", "transaction_signature", "timestamp"];
    case DataType.NFT_BIDS:
      return ["nft_address", "bid_amount_sol", "bidder", "transaction_signature", "timestamp"];
    case DataType.TOKEN_AVAILABILITY:
      return ["token_mint", "amount", "transaction_type", "transaction_signature", "timestamp"];
    case DataType.TOKEN_PRICES:
      return ["token_in_mint", "token_out_mint", "amount_in", "amount_out", "transaction_signature", "timestamp"];
    default:
      throw new Error(`Unknown data type: ${dataType}`);
  }
} 