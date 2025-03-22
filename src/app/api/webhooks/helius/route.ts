import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateWebhookSignature } from "@/lib/helius";
import { Client } from "pg";

// Enum for data types that can be indexed (same as in Prisma schema)
enum DataType {
  NFT_BIDS = "NFT_BIDS",
  NFT_PRICES = "NFT_PRICES",
  TOKEN_AVAILABILITY = "TOKEN_AVAILABILITY",
  TOKEN_PRICES = "TOKEN_PRICES"
}

// Process NFT price data
async function processNFTPrices(data: any, config: any, dbClient: Client): Promise<number> {
  try {
    // Extract price data from the webhook payload
    const { transactions } = data;
    let recordsProcessed = 0;

    for (const tx of transactions) {
      // Simple example for NFT sales on marketplaces
      if (tx.type === "NFT_SALE") {
        const {
          nfts,
          amount,
          buyer,
          seller,
          signature,
          timestamp,
        } = tx;

        if (nfts && nfts.length > 0) {
          for (const nft of nfts) {
            // Query structure would depend on the user's target table schema
            const query = `
              INSERT INTO ${config.targetTable} 
              (nft_address, price_sol, buyer, seller, transaction_signature, timestamp)
              VALUES ($1, $2, $3, $4, $5, $6)
            `;

            await dbClient.query(query, [
              nft.mint,
              amount / 1e9, // Convert lamports to SOL
              buyer,
              seller,
              signature,
              new Date(timestamp * 1000),
            ]);

            recordsProcessed++;
          }
        }
      }
    }

    return recordsProcessed;
  } catch (error) {
    console.error("Error processing NFT prices:", error);
    throw error;
  }
}

// Process NFT bid data
async function processNFTBids(data: any, config: any, dbClient: Client): Promise<number> {
  try {
    const { transactions } = data;
    let recordsProcessed = 0;

    for (const tx of transactions) {
      // Only process bid events
      if (tx.type === "NFT_BID") {
        const {
          nft,
          amount,
          bidder,
          signature,
          timestamp,
          marketplace,
        } = tx;

        if (nft && nft.mint) {
          const query = `
            INSERT INTO ${config.targetTable} 
            (nft_address, bid_amount_sol, bidder, transaction_signature, marketplace, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6)
          `;

          await dbClient.query(query, [
            nft.mint,
            amount / 1e9, // Convert lamports to SOL
            bidder,
            signature,
            marketplace || 'unknown',
            new Date(timestamp * 1000),
          ]);

          recordsProcessed++;
        }
      }
    }

    return recordsProcessed;
  } catch (error) {
    console.error("Error processing NFT bids:", error);
    throw error;
  }
}

// Process token availability data
async function processTokenAvailability(data: any, config: any, dbClient: Client): Promise<number> {
  try {
    const { transactions } = data;
    let recordsProcessed = 0;

    for (const tx of transactions) {
      // Process token transfers, mints, and burns
      if (["TOKEN_TRANSFER", "TOKEN_MINT", "TOKEN_BURN"].includes(tx.type)) {
        const {
          tokenTransfers,
          signature,
          timestamp,
          type,
        } = tx;

        if (tokenTransfers && tokenTransfers.length > 0) {
          for (const transfer of tokenTransfers) {
            const {
              fromUserAccount,
              toUserAccount,
              tokenAmount,
              mint,
            } = transfer;

            const query = `
              INSERT INTO ${config.targetTable} 
              (token_mint, from_account, to_account, amount, transaction_type, transaction_signature, timestamp)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
            `;

            await dbClient.query(query, [
              mint,
              fromUserAccount || null,
              toUserAccount || null,
              tokenAmount.uiAmount,
              type,
              signature,
              new Date(timestamp * 1000),
            ]);

            recordsProcessed++;
          }
        }
      }
    }

    return recordsProcessed;
  } catch (error) {
    console.error("Error processing token availability:", error);
    throw error;
  }
}

// Process token price data
async function processTokenPrices(data: any, config: any, dbClient: Client): Promise<number> {
  try {
    const { transactions } = data;
    let recordsProcessed = 0;

    for (const tx of transactions) {
      // Focus on DEX swaps for price data
      if (tx.type === "SWAP") {
        const {
          tokenSwaps,
          signature,
          timestamp,
          dex,
        } = tx;

        if (tokenSwaps && tokenSwaps.length > 0) {
          for (const swap of tokenSwaps) {
            const {
              tokenIn,
              tokenOut,
              amountIn,
              amountOut,
            } = swap;

            // Calculate price (e.g., token price in SOL)
            let price = null;
            if (amountIn && amountOut && tokenIn && tokenOut) {
              // If one side is SOL/WSOL, we can calculate token price in SOL
              const solMints = [
                "So11111111111111111111111111111111111111112", // Wrapped SOL
                "11111111111111111111111111111111" // Native SOL
              ];
              
              if (solMints.includes(tokenIn.mint)) {
                price = amountIn.uiAmount / amountOut.uiAmount;
              } else if (solMints.includes(tokenOut.mint)) {
                price = amountOut.uiAmount / amountIn.uiAmount;
              }
            }

            const query = `
              INSERT INTO ${config.targetTable} 
              (token_in_mint, token_out_mint, amount_in, amount_out, price_in_sol, dex, transaction_signature, timestamp)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;

            await dbClient.query(query, [
              tokenIn?.mint,
              tokenOut?.mint,
              amountIn?.uiAmount,
              amountOut?.uiAmount,
              price,
              dex || 'unknown',
              signature,
              new Date(timestamp * 1000),
            ]);

            recordsProcessed++;
          }
        }
      }
    }

    return recordsProcessed;
  } catch (error) {
    console.error("Error processing token prices:", error);
    throw error;
  }
}

export async function POST(
  request: NextRequest,
) {
  let dbClient: Client | null = null;

  try {
    // Extract webhookId from the URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const webhookId = pathParts[pathParts.length - 1]; // Get the last part of the URL

    // Get the request body
    const body = await request.json();
    
    // Get the Helius-Signature header
    const signature = request.headers.get("Helius-Signature");
    
    if (!signature) {
      return NextResponse.json(
        { error: "Missing Helius-Signature header" },
        { status: 401 }
      );
    }

    // Get the webhook configuration and secret from the database
    const webhookConfig = await prisma.webhookEndpoint.findUnique({
      where: { webhookId },
      include: {
        configurations: {
          include: {
            indexingConfiguration: {
              include: {
                databaseConnection: true
              }
            }
          }
        }
      }
    });

    if (!webhookConfig) {
      return NextResponse.json(
        { error: "Webhook configuration not found" },
        { status: 404 }
      );
    }

    // Validate the webhook signature
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const isValid = validateWebhookSignature(
      signature,
      JSON.stringify(body),
      webhookSecret
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // Process each configuration linked to this webhook
    for (const configMapping of webhookConfig.configurations) {
      const config = configMapping.indexingConfiguration;
      
      // Update sync status to processing
      await prisma.syncStatus.create({
        data: {
          indexingConfigurationId: config.id,
          status: "PROCESSING",
          startedAt: new Date(),
        }
      });

      try {
        // Connect to the user's database
        const dbConfig = config.databaseConnection;
        
        dbClient = new Client({
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.username,
          password: dbConfig.password, // Assuming password is stored decrypted in the database
          database: dbConfig.databaseName,
        });

        await dbClient.connect();

        // Process data based on configuration type
        let recordsProcessed = 0;
        
        switch (config.dataType as DataType) {
          case DataType.NFT_PRICES:
            recordsProcessed = await processNFTPrices(body, config, dbClient);
            break;
          case DataType.NFT_BIDS:
            recordsProcessed = await processNFTBids(body, config, dbClient);
            break;
          case DataType.TOKEN_AVAILABILITY:
            recordsProcessed = await processTokenAvailability(body, config, dbClient);
            break;
          case DataType.TOKEN_PRICES:
            recordsProcessed = await processTokenPrices(body, config, dbClient);
            break;
        }

        // Update sync status to success
        await prisma.syncStatus.create({
          data: {
            indexingConfigurationId: config.id,
            status: "SUCCESS",
            completedAt: new Date(),
            recordsProcessed,
          }
        });
      } catch (error) {
        console.error(`Error processing webhook data for config ${config.id}:`, error);
        
        // Update sync status to error
        await prisma.syncStatus.create({
          data: {
            indexingConfigurationId: config.id,
            status: "ERROR",
            completedAt: new Date(),
            errorMessage: error instanceof Error ? error.message : String(error),
          }
        });
      } finally {
        if (dbClient) {
          // Use unknown as an intermediate type to safely cast
          const client = dbClient as unknown as { end: () => Promise<void> };
          await client.end();
          dbClient = null;
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  } finally {
    if (dbClient) {
      // Use unknown as an intermediate type to safely cast
      const client = dbClient as unknown as { end: () => Promise<void> };
      await client.end();
    }
  }
} 