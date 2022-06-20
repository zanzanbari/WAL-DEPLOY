import EventEmitter from "events";
import { afternoonQueue, morningQueue, nightQueue, reserveQueue } from ".";
import { afterProcess, morningProcess, nightProcess, reserveProcess } from "./consumer";
import Producer from "./producer";
import logger from "../../loaders/logger";
import { ISetTime } from "../../dto/request/userRequest";

const queueEvent = new EventEmitter();
const processEvent = new EventEmitter();

/**
 *  @Producer
 *  @desc 큐 추가 or 삭제 이벤트
 *  @access user 초기 설정, 시간대 변경 설정 에서 실행
 */


queueEvent.on("addTimeQueue", (
  userId: number, 
  time: ISetTime
) => {
  const producerInstance = new Producer(morningQueue, afternoonQueue, nightQueue, reserveQueue, processEvent, logger);
  producerInstance.addTimeQueue(userId, time);
});

queueEvent.on("updateAddTimeQueue", (
  userId: number, 
  time: Date
) => {
  const producerInstance = new Producer(morningQueue, afternoonQueue, nightQueue, reserveQueue, processEvent, logger);
  producerInstance.updateAddTimeQueue(userId, time);
});

queueEvent.on("updateCancelTimeQueue", (
  userId: number, 
  time: Date
) => {
  const producerInstance = new Producer(morningQueue, afternoonQueue, nightQueue, reserveQueue, processEvent, logger);
  producerInstance.updateCancelTimeQueue(userId, time);
});

queueEvent.on("addReservationQueue", (
  userId: number,
  date: string,
  time: string
) => {
  const producerInstance = new Producer(morningQueue, afternoonQueue, nightQueue, reserveQueue, processEvent, logger);
  producerInstance.addReservationQueue(userId, date, time);
});

queueEvent.on("cancelReservationQueue", (
  userId: number,
  date: Date
) => {
  const producerInstance = new Producer(morningQueue, afternoonQueue, nightQueue, reserveQueue, processEvent, logger);
  producerInstance.cancelReservationQueue(userId, date);
});


/**
 *  @Consumer
 *  @desc 큐 process 이벤트
 *  @access producer 에서 실행
 */


processEvent.on("morningProcess", () => {
  morningQueue.process("morning", morningProcess); 
});

processEvent.on("afternoonProcess", () => {
  afternoonQueue.process("afternoon", afterProcess); 
});

processEvent.on("nightProcess", () => {
  nightQueue.process("night", nightProcess); 
});

processEvent.on("reserveProcess", () => {
  reserveQueue.process("reserve", reserveProcess); 
});


export default queueEvent;