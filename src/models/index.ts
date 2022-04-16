import dbConfig from '../config/dbConfig';
import { Sequelize } from 'sequelize-typescript';
import User from './users';
import Category from './categories';
import Item from './items';
import Time from './times';
import Reservation from './reservations';
import UserCategory from './userCategories';

const sequelize = new Sequelize({
    host: dbConfig.development.host,
    database: dbConfig.development.database,
    username: dbConfig.development.username,
    password: dbConfig.development.password,
    dialect: "postgres",
    logging: false,
    timezone: "+09:00",
});

sequelize.addModels([
    User,
    Category,
    UserCategory,
    Item,
    Time,
    Reservation
]);

export {
    User,
    Category,
    UserCategory,
    Item,
    Time,
    Reservation
};

export default sequelize;