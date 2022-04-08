import dbConfig from '../config/dbConfig';
import { Sequelize } from 'sequelize-typescript';
import User from './users';
import Category from './categories';
import Message from './messages';
import Time from './times';
import Reservation from './reservations';
import Drip from './drips';
import Fuss from './fusses';
import Blame from './blames';
import Comfort from './comforts';

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
    Message,
    Time,
    Reservation,
    Drip,
    Fuss,
    Blame,
    Comfort
]);

export {
    User,
    Category,
    Message,
    Time,
    Reservation,
    Drip,
    Fuss,
    Blame,
    Comfort
};

export default sequelize;