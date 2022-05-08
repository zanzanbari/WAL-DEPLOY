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
exports.updateTodayWal = exports.updateToday = exports.messageQueue = exports.nightQueue = exports.afternoonQueue = exports.morningQueue = void 0;
const models_1 = require("../../models");
const bull_1 = __importDefault(require("bull"));
const dayjs_1 = __importDefault(require("dayjs"));
const node_schedule_1 = __importDefault(require("node-schedule"));
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
                const currentItemId = yield getRandCategoryCurrentItem(user);
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
function getRandCategoryCurrentItem(user) {
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
//# sourceMappingURL=index.js.map