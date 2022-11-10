import logger from "./logger";
import GlobalService from "../services/globalService";
import { Item, Time, TodayWal, User, UserCategory, Subtitle, TodaySubtitle } from "../models";

const globalServiceInstance = new GlobalService(
  UserCategory, 
  Item, 
  TodayWal, 
  User, 
  Time,
  Subtitle,
  TodaySubtitle,
  logger
);


export default globalServiceInstance

