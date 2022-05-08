"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.messageQueue = void 0;
const models_1 = require("../models");
const bull_1 = __importDefault(require("bull"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dayjs_1 = __importDefault(require("dayjs"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const logger = require("../middlewares/logger");
/*
const redisClient=redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password:process.env.REDIS_PASSWORD
});
*/
node_schedule_1.default.scheduleJob('0 0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.TodayWal.destroy();
    yield updateTodayWal();
}));
function getRandCategoryNextItem(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = user.getDataValue("id");
        //가진 카테고리 중 하나 선택
        const randomIdx = Math.floor(Math.random() * (user.getDataValue("userCategories").length - 1));
        const currentItemId = user
            .getDataValue("userCategories")[randomIdx]
            .getDataValue("next_item_id");
        //해당 카테고리의 Table상 id
        const category_id = user
            .getDataValue("userCategories")[randomIdx]
            .getDataValue("category_id");
        const sameCategoryItems = yield models_1.Item.findAll({
            where: {
                category_id
            }
        });
        const itemValues = sameCategoryItems["dataValues"];
        const item = itemValues.filter((it) => it.id === currentItemId);
        const itemIdx = itemValues.indexOf(item);
        const nextItemId = (itemIdx + 1) % itemValues.length;
        yield models_1.UserCategory.update({
            next_item_id: nextItemId
        }, {
            where: {
                user_id: userId,
                category_id
            }
        });
        return nextItemId;
    });
}
function updateTodayWal() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield models_1.User.findAll({
            include: [
                { model: models_1.Time, attributes: ["morning", "afternoon", "night"] },
                { model: models_1.UserCategory, attributes: ["category_id", "next_item_id"] },
            ],
            attributes: ["id"]
        });
        for (const user of users) {
            const userId = user.getDataValue("id");
            const selectedTime = [];
            const times = yield models_1.Time.findOne({
                where: { user_id: userId }
            });
            const dateString = (0, dayjs_1.default)(new Date()).format("YYYY-MM-dd");
            if (times["dataValues"]["morning"]) { //8
                selectedTime.push(new Date(`${dateString} 08:00:00`));
                //const walTime = new Date(`${dateString} 08:00:00`)
            }
            if (times["dataValues"]["afternoon"]) { //12
                selectedTime.push(new Date(`${dateString} 12:00:00`));
            }
            if (times["dataValues"]["night"]) { //20
                selectedTime.push(new Date(`${dateString} 20:00:00`));
            }
            for (const t in selectedTime) {
                const nextItemId = yield getRandCategoryNextItem(user);
                yield models_1.TodayWal.create({
                    user_id: userId,
                    item_id: nextItemId,
                    time: t
                });
            }
        }
    });
}
//1. 8시마다 todayWal에서 8시의 것 뽑아오기
function getTokenMessage(time) {
    return __awaiter(this, void 0, void 0, function* () {
        const todayWals = yield models_1.TodayWal.findAll({
            where: { time },
            include: [
                { model: models_1.User, attributes: ["fcmtoken"] }
            ]
        });
        for (const wal of todayWals) {
            const fcmtoken = wal.getDataValue("users").getDataValue("fcmtoken");
            const userDefined = wal.getDataValue("userDefined");
            const content = userDefined ? wal.getDataValue("reservation_id") : wal.getDataValue("item_id");
            const data = {
                fcmtoken,
                content
            };
        }
        //자정마다 반복하는 queue
        //이 안에서 ? todayWal에서 뽑아와서,data,time,token
        //해당 시간 큐에 넣어
        //schedule을 통해서 8, 12, 8시 마다 해당 시간큐를,, 실행해
        //이러면 큐로 메시지 관리 편하게 할 수 있다..?
        //->어떻게 하고 싶냐,,,,,,,,
        //특정 시간마다 보낼 친구들이 많은데 완료가 잘 되나 안되나 이걸 보려고 하는 거 아녀??
        //선택해!
        //8시마다 반복하는 queue
        //process -> todayWal에서 뽑아서 보내는 작업을,,
    });
}
exports.messageQueue = new bull_1.default('message-queue1', {
    redis: {
        host: "localhost",
        port: 6379
    }
});
() => __awaiter(void 0, void 0, void 0, function* () {
    const dateString = (0, dayjs_1.default)(new Date()).format("YYYY-MM-dd");
    const data = yield getTokenMessage(new Date(`${dateString} 08:00:00`));
    sendMessage(data, new Date(`${dateString} 08:00:00`));
});
function messageProcess(job) {
    return __awaiter(this, void 0, void 0, function* () {
        // messageQueue.add 로 추가해준 작업
        // messageQueue.process 로 실행
        const deviceToken = job.data.fcmtoken;
        let message = {
            notification: {
                title: '테스트 발송💛',
                body: job.data.content, // 카테고리 아이디로 item 에서 content 뽑아서 여기다 ㅇㅇ
            },
            token: deviceToken,
        };
    });
}
exports.messageQueue.process(messageProcess);
const messageToUser = (req, res, message) => {
    firebase_admin_1.default
        .messaging()
        .send(message)
        .then(function (response) {
        console.log('Successfully sent message: : ', response);
        return res.status(200).json({ success: true });
    })
        .catch(function (err) {
        console.log('Error Sending message!!! : ', err);
        return res.status(400).json({ success: false });
    });
};
function sendMessage(data, time) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.messageQueue.add(data, {
                repeat: { cron: `* ${time} * * *` }
            });
        }
        catch (error) {
            logger.appLogger.log({
                level: "error",
                message: error.message
            });
        }
    });
}
exports.sendMessage = sendMessage;
const fcmToken = "fCRwgfoiSUyhtoZ0PrnJze:APA91bHDjRWuGxInIdyxWCIes75vIZjHKp9K8JuGmYmTPNFHQ9i_b_PGnlhZVhCP1VMb0PtiK9xmjA4GqFp8I3qqBN7zd5F8yxUDQzkFpf-R32kdC4r_jUoSIxoSBR1KsOJ4rrjlTSRa";
//# sourceMappingURL=pushAlarm.js.map