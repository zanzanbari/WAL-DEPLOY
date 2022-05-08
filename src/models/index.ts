import dbConfig from '../config/dbConfig';
import { Sequelize } from 'sequelize-typescript';
import User from './users';
import Category from './categories';
import Item from './items';
import Time from './times';
import Reservation from './reservations';
import UserCategory from './userCategories';
import TodayWal from './todayWals';

const sequelize = new Sequelize({
    host: dbConfig.development.host,
    database: dbConfig.development.database,
    username: dbConfig.development.username,
    password: dbConfig.development.password,
    dialect: "postgres",
    logging: false,
    timezone: "+09:00",
    dialectOptions: {
        charset: 'utf8mb4',
        dateStrings: true,
        typeCast: true
    }
});

sequelize.addModels([
    User,
    Category,
    UserCategory,
    Item,
    Time,
    Reservation,
    TodayWal
]);

export {
    User,
    Category,
    UserCategory,
    Item,
    Time,
    Reservation,
    TodayWal
};

export default sequelize;