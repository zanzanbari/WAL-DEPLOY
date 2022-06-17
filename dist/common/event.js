"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const producer_1 = require("../services/pushAlarm/producer");
const queueEvent = new events_1.default();
queueEvent.on("addUserTime", (userId) => (0, producer_1.addUserTime)(userId));
queueEvent.on("updateUserTime", (userId, time, selectedFlag) => {
    (0, producer_1.updateUserTime)(userId, time, selectedFlag);
});
exports.default = queueEvent;
//# sourceMappingURL=event.js.map