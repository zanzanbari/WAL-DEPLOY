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
exports.getRandCategoryCurrentItem = exports.updateTodayWal = exports.updateToday = exports.messageQueue = exports.nightQueue = exports.afternoonQueue = exports.morningQueue = void 0;
const models_1 = require("../../models");
const bull_1 = __importDefault(require("bull"));
const dayjs_1 = __importDefault(require("dayjs"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const sequelize_1 = require("sequelize");
exports.morningQueue = new bull_1.default('morning-queue', {
    redis: {
        host: process.env.REDIS_HOST,
        port: 16916,
        password: process.env.REDIS_PASSWORD
    }
});
exports.afternoonQueue = new bull_1.default('afternoon-queue', {
    redis: {
        host: "localhost",
        port: 6379
    }
});
exports.nightQueue = new bull_1.default('night-queue', {
    redis: {
        host: "localhost",
        port: 6379
    }
});
exports.messageQueue = new bull_1.default('message-queue', {
    redis: {
        host: "localhost",
        port: 6379
    }, defaultJobOptions: {
        removeOnComplete: true //job 완료 시 삭제
    }
});
function updateToday() {
    node_schedule_1.default.scheduleJob('0 0 0 * * *', () => __awaiter(this, void 0, void 0, function* () {
        yield models_1.TodayWal.destroy({
            where: {},
            truncate: true
        });
        yield updateTodayWal();
    }));
}
exports.updateToday = updateToday;
function updateTodayWal() {
    return __awaiter(this, void 0, void 0, function* () {
        const settingExists = yield models_1.Time.findAll({
            attributes: ["user_id"]
        }); //초기 설정을 한 유저만
        const existSet = settingExists.map((user) => {
            return user.user_id;
        });
        const users = yield models_1.User.findAll({
            where: { id: { [sequelize_1.Op.in]: existSet } },
            include: [
                { model: models_1.Time, attributes: ["morning", "afternoon", "night"] },
            ],
            attributes: ["id"]
        });
        for (const user of users) {
            const userId = user.getDataValue("id");
            const selectedTime = [];
            const times = user.getDataValue("time");
            const dateString = (0, dayjs_1.default)(new Date()).format("YYYY-MM-DD");
            if (times.getDataValue("morning")) { //8
                selectedTime.push(new Date(`${dateString} 08:00:00`));
            }
            if (times.getDataValue("afternoon")) { //2시
                selectedTime.push(new Date(`${dateString} 14:00:00`));
            }
            if (times.getDataValue("night")) { //20
                selectedTime.push(new Date(`${dateString} 20:00:00`));
            }
            for (const t of selectedTime) {
                const currentItemId = yield getRandCategoryCurrentItem(userId);
                yield models_1.TodayWal.create({
                    user_id: userId,
                    item_id: currentItemId,
                    time: t
                });
            }
        }
    });
}
exports.updateTodayWal = updateTodayWal;
function getRandCategoryCurrentItem(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // const userId = user.getDataValue("id") as number;
        //가진 카테고리 중 하나 선택
        const userCategories = yield models_1.UserCategory.findAll({
            where: { user_id: userId }
        });
        const randomIdx = Math.floor(Math.random() * (userCategories.length - 1));
        const currentItemId = userCategories[randomIdx].getDataValue("next_item_id");
        //해당 카테고리의 Table상 id
        const category_id = userCategories[randomIdx].getDataValue("category_id");
        const sameCategoryItems = yield models_1.Item.findAll({
            where: {
                category_id
            }
        });
        let itemIdx, nextItemIdx, nextItemId;
        for (const item of sameCategoryItems) {
            if (item.getDataValue("id") === currentItemId) {
                itemIdx = sameCategoryItems.indexOf(item); //배열상 인덱스
                nextItemIdx = (itemIdx + 1) % sameCategoryItems.length; //배열상 인덱스
                nextItemId = sameCategoryItems[nextItemIdx].getDataValue("id"); //테이블 상 id
            }
        }
        yield models_1.UserCategory.update({
            next_item_id: nextItemId
        }, {
            where: {
                user_id: userId,
                category_id
            }
        });
        return currentItemId;
    });
}
exports.getRandCategoryCurrentItem = getRandCategoryCurrentItem;
//# sourceMappingURL=index.js.map