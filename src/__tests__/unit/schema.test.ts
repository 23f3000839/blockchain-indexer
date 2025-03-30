import { validateAndCreateSchema } from '@/lib/schema';
import { Client } from 'pg';
import { DataType } from '@prisma/client';

// Mock pg Client
jest.mock('pg');

// Create more specific types for PostgreSQL query results
interface ExistsResult {
  exists: boolean;
}

interface ColumnResult {
  column_name: string;
}

describe('Schema Validation', () => {
  let mockClient: Client;

  beforeEach(() => {
    // Create a fresh mock client for each test
    mockClient = new Client() as jest.Mocked<Client>;
    // Explicitly type the query method as a jest function
    (mockClient.query as jest.Mock) = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateAndCreateSchema', () => {
    it('should create table if it does not exist', async () => {
      // Use proper mock implementation
      (mockClient.query as jest.Mock).mockImplementation((text, params) => {
        if (text.includes('SELECT EXISTS')) {
          return Promise.resolve({ rows: [{ exists: false }] });
        } else if (text.includes('SELECT column_name')) {
          return Promise.resolve({
            rows: [
              { column_name: 'nft_address' },
              { column_name: 'price_sol' },
              { column_name: 'buyer' },
              { column_name: 'seller' },
              { column_name: 'transaction_signature' },
              { column_name: 'timestamp' }
            ]
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const config = {
        targetTable: 'test_table',
        dataType: DataType.NFT_PRICES,
      };

      await validateAndCreateSchema(config, mockClient);

      // Check that the query was called with the correct SQL
      const createTableCall = (mockClient.query as jest.Mock).mock.calls.find(
        call => call[0].includes('CREATE TABLE IF NOT EXISTS test_table')
      );
      expect(createTableCall).toBeDefined();
      expect(createTableCall[0]).toContain('CREATE TABLE IF NOT EXISTS test_table');
      expect(createTableCall[0]).toContain('CREATE INDEX IF NOT EXISTS idx_test_table_nft_address');
      expect(createTableCall[0]).toContain('CREATE INDEX IF NOT EXISTS idx_test_table_timestamp');
    });

    it('should not create table if it exists', async () => {
      (mockClient.query as jest.Mock).mockImplementation((text, params) => {
        if (text.includes('SELECT EXISTS')) {
          return Promise.resolve({ rows: [{ exists: true }] });
        } else if (text.includes('SELECT column_name')) {
          return Promise.resolve({
            rows: [
              { column_name: 'nft_address' },
              { column_name: 'price_sol' },
              { column_name: 'buyer' },
              { column_name: 'seller' },
              { column_name: 'transaction_signature' },
              { column_name: 'timestamp' }
            ]
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const config = {
        targetTable: 'test_table',
        dataType: DataType.NFT_PRICES,
      };

      await validateAndCreateSchema(config, mockClient);

      const createTableCall = (mockClient.query as jest.Mock).mock.calls.find(
        call => call[0].includes('CREATE TABLE')
      );
      expect(createTableCall).toBeUndefined();
    });

    it('should validate required columns for NFT_PRICES', async () => {
      (mockClient.query as jest.Mock).mockImplementation((text, params) => {
        if (text.includes('SELECT EXISTS')) {
          return Promise.resolve({ rows: [{ exists: true }] });
        } else if (text.includes('SELECT column_name')) {
          return Promise.resolve({
            rows: [
              { column_name: 'nft_address' },
              { column_name: 'price_sol' },
              { column_name: 'buyer' },
              { column_name: 'seller' },
              { column_name: 'transaction_signature' },
              { column_name: 'timestamp' }
            ]
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const config = {
        targetTable: 'test_table',
        dataType: DataType.NFT_PRICES,
      };

      await validateAndCreateSchema(config, mockClient);

      expect(mockClient.query).toHaveBeenCalledTimes(2);
    });

    it('should throw error if required columns are missing', async () => {
      (mockClient.query as jest.Mock).mockImplementation((text, params) => {
        if (text.includes('SELECT EXISTS')) {
          return Promise.resolve({ rows: [{ exists: true }] });
        } else if (text.includes('SELECT column_name')) {
          return Promise.resolve({
            rows: [
              { column_name: 'nft_address' },
              { column_name: 'price_sol' }
            ]
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const config = {
        targetTable: 'test_table',
        dataType: DataType.NFT_PRICES,
      };

      await expect(validateAndCreateSchema(config, mockClient)).rejects.toThrow(
        'Missing required columns'
      );
    });

    it('should handle database errors gracefully', async () => {
      (mockClient.query as jest.Mock).mockImplementation(() => {
        return Promise.reject(new Error('Database error'));
      });

      const config = {
        targetTable: 'test_table',
        dataType: DataType.NFT_PRICES,
      };

      await expect(validateAndCreateSchema(config, mockClient)).rejects.toThrow(
        'Schema validation failed'
      );
    });
  });
});