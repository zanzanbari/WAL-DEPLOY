import EventEmitter from "events";
import { addUserTime, updateUserTime } from "../services/pushAlarm/producer";

const queueEvent = new EventEmitter();

queueEvent.on("addUserTime", (userId: number) => addUserTime(userId));

queueEvent.on("updateUserTime", (
  userId: number, 
  time: Date, 
  selectedFlag: string
) => {
  updateUserTime(userId, time, selectedFlag);
});

export default queueEvent;