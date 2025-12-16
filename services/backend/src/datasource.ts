import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true, // Set to false in production
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/models/*.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  subscribers: []
});
