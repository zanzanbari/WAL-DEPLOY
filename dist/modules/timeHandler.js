"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const getCurrentTime = () => {
    const today = new Date();
    const currentTime = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    const formatTime = (0, dayjs_1.default)(currentTime).format("HH:mm:ss");
    return formatTime;
};
const getMorning = () => {
    const setTime = new Date();
    const morning = new Date(Date.UTC(setTime.getFullYear(), setTime.getMonth(), setTime.getDate(), 8, 0, 0, 0));
    return morning;
};
const getAfternoon = () => {
    const setTime = new Date();
    const afternoon = new Date(Date.UTC(setTime.getFullYear(), setTime.getMonth(), setTime.getDate(), 14, 0, 0, 0));
    return afternoon;
};
const getNight = () => {
    const setTime = new Date();
    const night = new Date(Date.UTC(setTime.getFullYear(), setTime.getMonth(), setTime.getDate(), 20, 0, 0, 0));
    return night;
};
const timeHandler = {
    getCurrentTime,
    getMorning,
    getAfternoon,
    getNight
};
exports.default = timeHandler;
//# sourceMappingURL=timeHandler.js.map