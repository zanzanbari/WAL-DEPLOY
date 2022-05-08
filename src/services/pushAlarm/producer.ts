import { morningQueue, afternoonQueue, nightQueue } from './';
import {morningFunc, afterFunc, nightFunc} from './consumer';
import { Time } from "../../models";
import logger from "../../api/middlewares/logger";

export async function addUserTime(userId: number): Promise<void> {

    try {
        //user id를 data로 전달
        const times = await Time.findOne({
            where: { user_id : userId }
        }) as Time

        if (times.morning) {
            await morningQueue.add(
                userId,
                {
                repeat: { cron: `* 8 * * *` }
                });
            
            await morningQueue.process(morningFunc)
        } 
        if (times.afternoon) {
            const addjob = await afternoonQueue.add(
                userId,
                {
                repeat: { cron: `* 14 * * *` }
                });
            console.log(addjob.finished());
            await afternoonQueue.process(afterFunc)
        } 
        if (times.night) {
            await nightQueue.add(
                userId,
                {
                repeat: { cron: `* 20 * * *` }
                });
            }
            await nightQueue.process(nightFunc)

    }  catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
    }
    
}
