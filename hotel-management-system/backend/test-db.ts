import { sequelize, testConnection } from './src/config/database';
import { logger } from './src/utils/logger';

async function test() {
  logger.info('Testing database connection...');
  const isConnected = await testConnection();
  
  if (isConnected) {
    try {
      // Test query to check if tables exist
      const [results] = await sequelize.query("SHOW TABLES;");
      logger.info('Database tables:', JSON.stringify(results, null, 2));
      
      // Test query to count records in each table
      const tables = ['users', 'roles', 'guests', 'room_types', 'rooms', 'reservations', 'payments'];
      for (const table of tables) {
        try {
          const [count] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
          logger.info(`${table}: ${JSON.stringify(count)} records`);
        } catch (e) {
          logger.warn(`Could not query ${table}: ${e.message}`);
        }
      }
    } catch (e) {
      logger.error('Error querying database:', e);
    }
  }
  
  await sequelize.close();
}

test().catch(console.error);
