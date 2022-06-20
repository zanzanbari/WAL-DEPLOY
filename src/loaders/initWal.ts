import logger from "./logger";
import GlobalService from "../services/globalService";
import { Item, Time, TodayWal, User, UserCategory } from "../models";

const globalServiceInstance = new GlobalService(
  UserCategory, 
  Item, 
  TodayWal, 
  User, 
  Time, 
  logger
);


export default globalServiceInstance

