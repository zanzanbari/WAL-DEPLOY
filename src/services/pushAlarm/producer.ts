import { morningQueue, afternoonQueue, nightQueue } from './';
import {morningFunc, afterFunc, nightFunc} from './consumer';
import { Time } from "../../models";
import logger from "../../api/middlewares/logger";

async function addTimeQueue(userId: number, flag: number): Promise<void> { //flag - 0: morning, 1: afternoon, 2: night
    try {
        switch (flag) {
            case 0:
                await morningQueue.add(userId, {
                        jobId: userId,
                        repeat: { cron: `* 8 * * *` }
                    });
                
                await morningQueue.process(morningFunc)
                break;
            case 1:
                await afternoonQueue.add(userId, {
                        jobId: userId,
                        repeat: { cron: `* 14 * * *` }
                    });
                
                await afternoonQueue.process(afterFunc)
                break;
            case 2:
                await nightQueue.add(userId, { 
                        jobId: userId,
                        repeat: { cron: `* 20 * * *` }
                    });
            
                await nightQueue.process(nightFunc)
                break;
            }

    } catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
    }
}

export async function addUserTime(userId: number): Promise<void> {

    try {
        //user id를 data로 전달
        const times = await Time.findOne({
            where: { user_id : userId }
        }) as Time

        if (times.morning) {
            await addTimeQueue(userId, 0);
        } 
        if (times.afternoon) {
            await addTimeQueue(userId, 1);
        } 
        if (times.night) {
            await addTimeQueue(userId, 2);
        }

    }  catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
    }
    
}
//user 세팅 수정 시 특정 조건에 걸리면 이 함수 실행
export async function updateUserTime(userId: number, time: string, flag: string): Promise<void> {
//time: morning, afternoon, night
//flag: add, delete
    try {
        if (flag == "add") {
            if (time == "morning") {
                await addTimeQueue(userId, 0);
            } 
            else if (time == "afternoon")  {
                await addTimeQueue(userId, 1);
            } 
            else if (time == "night") {
                await addTimeQueue(userId, 2);
            }
        } else {
            if (time == "morning") {
                const job = await morningQueue.getJob(userId);
                await job?.remove();
            } 
            else if (time == "afternoon")  {
                const job = await afternoonQueue.getJob(userId);
                await job?.remove();
            } 
            else if (time == "night") {
                const job = await nightQueue.getJob(userId);
                await job?.remove();
            }
        }
        
    }  catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
    }
    
}
