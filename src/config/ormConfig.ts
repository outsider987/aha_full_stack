import {DataSource} from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({path: path.join(__dirname, '../../', '.env')});
export const ormConfig = new DataSource({
  type: 'mysql',
  host: String(process.env.DB_HOST),
  port: parseInt(process.env.DB_PORT),
  username: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_NAME),
  migrations: ['dist/migrations/*.js'],
  entities: ['dist/**/entity/*.js'],
  synchronize: false,

});
