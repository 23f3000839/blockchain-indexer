import { prisma } from "./db";
import { DataType } from "@prisma/client";

interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffFactor: 2,
};

export class ProcessingError extends Error {
  constructor(
    message: string,
    public readonly configId: string,
    public readonly dataType: DataType,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = "ProcessingError";
  }
}

export async function processWithRetry<T>(
  operation: () => Promise<T>,
  configId: string,
  dataType: DataType,
  retryConfig: Partial<RetryConfig> = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  let lastError: Error | undefined;
  let delay = config.initialDelay;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Log the error
      await logError(configId, dataType, lastError, attempt);

      if (attempt === config.maxRetries) {
        throw new ProcessingError(
          `Failed after ${config.maxRetries} attempts: ${lastError.message}`,
          configId,
          dataType,
          lastError
        );
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Increase delay for next attempt
      delay = Math.min(delay * config.backoffFactor, config.maxDelay);
    }
  }

  throw lastError;
}

async function logError(
  configId: string,
  dataType: DataType,
  error: Error,
  attempt: number
): Promise<void> {
  try {
    await prisma.syncStatus.create({
      data: {
        configId,
        status: "FAILED",
        recordsProcessed: 0,
        error: `Attempt ${attempt}: ${error.message}`,
        metadata: {
          dataType,
          attempt,
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (logError) {
    console.error("Failed to log error:", logError);
  }
}

export async function notifyError(
  configId: string,
  dataType: DataType,
  error: ProcessingError
): Promise<void> {
  try {
    // Get the configuration to find the user
    const config = await prisma.indexingConfiguration.findUnique({
      where: { id: configId },
      include: { user: true },
    });

    if (!config) {
      console.error(`Configuration ${configId} not found for error notification`);
      return;
    }

    // Here you would implement your notification logic
    // For example, sending an email, creating a notification in the UI, etc.
    console.error(
      `Processing error for user ${config.user.id}:`,
      `Config: ${configId}`,
      `Type: ${dataType}`,
      `Error: ${error.message}`
    );

    // You could also update the webhook status in the UI
    await prisma.webhookEndpoint.update({
      where: { id: configId },
      data: {
        isActive: false,
        lastError: error.message,
        lastErrorAt: new Date(),
      },
    });
  } catch (notifyError) {
    console.error("Failed to send error notification:", notifyError);
  }
} 