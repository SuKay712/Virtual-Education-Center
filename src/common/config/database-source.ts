import { DataSource, DataSourceOptions } from 'typeorm';
import * as entities from '../../entities';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: Object.values(entities),
  migrations: ['dist/databases/migrations/*.js'],
  synchronize: false,
  extra: {
    connectionLimit: 3,
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
