"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getCurrentTime = () => {
    const setTime = new Date();
    const current = new Date(Date.UTC(setTime.getFullYear(), setTime.getMonth(), setTime.getDate(), setTime.getHours() - 9, setTime.getMinutes(), setTime.getSeconds(), setTime.getMilliseconds()));
    return current;
};
const getMorning = () => {
    const setTime = new Date();
    const morning = new Date(Date.UTC(setTime.getFullYear(), setTime.getMonth(), setTime.getDate(), 8 - 9, 0, 0, 0));
    return morning;
};
const getAfternoon = () => {
    const setTime = new Date();
    const afternoon = new Date(Date.UTC(setTime.getFullYear(), setTime.getMonth(), setTime.getDate(), 14 - 9, 0, 0, 0));
    return afternoon;
};
const getNight = () => {
    const setTime = new Date();
    const night = new Date(Date.UTC(setTime.getFullYear(), setTime.getMonth(), setTime.getDate(), 20 - 9, 0, 0, 0));
    return night;
};
const setKoreaTime = (time) => {
    const kHours = time.getHours() + 9;
    const setTime = new Date();
    const KoreaTime = new Date(setTime.getFullYear(), setTime.getMonth(), setTime.getDate(), kHours, 0, 0, 0);
    return KoreaTime;
};
const timeHandler = {
    getCurrentTime,
    getMorning,
    getAfternoon,
    getNight,
    setKoreaTime
};
exports.default = timeHandler;
//# sourceMappingURL=timeHandler.js.map