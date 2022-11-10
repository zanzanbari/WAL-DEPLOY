import { Sequelize } from 'sequelize-typescript';
import User from './users';
import Category from './categories';
import Item from './items';
import Time from './times';
import Reservation from './reservations';
import UserCategory from './userCategories';
import TodayWal from './todayWals';
import config from '../config';
import ResignUser from './resignUsers';
import Subtitle from './subtitle';
import TodaySubtitle from './todaySubtitle';

const sequelize = new Sequelize({
  host: config.database.development.host,
  database: config.database.development.db,
  username: config.database.development.username,
  password: config.database.development.password,
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
  TodayWal,
  ResignUser,
  Subtitle,
  TodaySubtitle
]);

export {
  User,
  Category,
  UserCategory,
  Item,
  Time,
  Reservation,
  TodayWal,
  ResignUser,
  Subtitle,
  TodaySubtitle
};

export default sequelize;