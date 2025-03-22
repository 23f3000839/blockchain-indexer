import axios from "axios";
import { createHmac } from "crypto";

// Base Helius API URL
const HELIUS_API_BASE_URL = "https://api.helius.xyz";

// Validate webhook signature from Helius
export const validateWebhookSignature = (
  signature: string,
  payload: string,
  secret: string
): boolean => {
  const hmac = createHmac("sha256", secret);
  const expectedSignature = hmac.update(payload).digest("hex");
  return signature === expectedSignature;
};

// Create a webhook on Helius
export const createWebhook = async (
  webhookUrl: string,
  accountAddresses: string[],
  transactionTypes: string[] = [],
  webhookType: "enhanced" | "raw" = "enhanced"
): Promise<{ webhookId: string } | null> => {
  try {
    const apiKey = process.env.HELIUS_API_KEY;
    if (!apiKey) {
      throw new Error("HELIUS_API_KEY not set in environment variables");
    }

    const response = await axios.post(
      `${HELIUS_API_BASE_URL}/v0/webhooks`,
      {
        webhook: webhookUrl,
        accountAddresses,
        transactionTypes,
        webhookType,
        accountAddressOwners: [], // Optional
        accountAddressTokens: [], // Optional
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
      }
    );

    if (response.data && response.data.webhookID) {
      return { webhookId: response.data.webhookID };
    }
    return null;
  } catch (error) {
    console.error("Error creating Helius webhook:", error);
    return null;
  }
};

// Delete a webhook on Helius
export const deleteWebhook = async (webhookId: string): Promise<boolean> => {
  try {
    const apiKey = process.env.HELIUS_API_KEY;
    if (!apiKey) {
      throw new Error("HELIUS_API_KEY not set in environment variables");
    }

    await axios.delete(
      `${HELIUS_API_BASE_URL}/v0/webhooks/${webhookId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
      }
    );

    return true;
  } catch (error) {
    console.error("Error deleting Helius webhook:", error);
    return false;
  }
};

// Get all webhooks for the API key
export const getWebhooks = async (): Promise<any[]> => {
  try {
    const apiKey = process.env.HELIUS_API_KEY;
    if (!apiKey) {
      throw new Error("HELIUS_API_KEY not set in environment variables");
    }

    const response = await axios.get(
      `${HELIUS_API_BASE_URL}/v0/webhooks`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
      }
    );

    return response.data || [];
  } catch (error) {
    console.error("Error getting Helius webhooks:", error);
    return [];
  }
};

// Get NFT data (for NFT_PRICES, NFT_BIDS indexing)
export const getNFTData = async (
  mintAddress: string
): Promise<any | null> => {
  try {
    const apiKey = process.env.HELIUS_API_KEY;
    if (!apiKey) {
      throw new Error("HELIUS_API_KEY not set in environment variables");
    }

    const response = await axios.get(
      `${HELIUS_API_BASE_URL}/v0/token-metadata?api-key=${apiKey}`,
      {
        params: {
          mintAccounts: [mintAddress],
        },
      }
    );

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching NFT data:", error);
    return null;
  }
};

// Get token prices (for TOKEN_PRICES indexing)
export const getTokenPrices = async (
  mintAddresses: string[]
): Promise<any[]> => {
  try {
    const apiKey = process.env.HELIUS_API_KEY;
    if (!apiKey) {
      throw new Error("HELIUS_API_KEY not set in environment variables");
    }

    const response = await axios.get(
      `${HELIUS_API_BASE_URL}/v0/token-price?api-key=${apiKey}`,
      {
        params: {
          mintAccounts: mintAddresses.join(","),
        },
      }
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching token prices:", error);
    return [];
  }
}; 