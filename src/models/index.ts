import dbConfig from '@/config/dbConfig';
import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
    host: dbConfig.development.host,
    database: dbConfig.development.database,
    username: dbConfig.development.username,
    password: dbConfig.development.password,
    dialect: "postgres",
    logging: false,
    timezone: "+09:00",
});

sequelize.addModels([]);

export default sequelize;