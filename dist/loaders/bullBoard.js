"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("@bull-board/express");
const api_1 = require("@bull-board/api");
const bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
const bullAdapter_1 = require("@bull-board/api/bullAdapter");
const pushAlarm_1 = require("@/services/pushAlarm");
const serverAdapter = new express_1.ExpressAdapter();
const { addQueue, removeQueue, setQueues, replaceQueues } = (0, api_1.createBullBoard)({
    queues: [
        new bullAdapter_1.BullAdapter(pushAlarm_1.morningQueue),
        new bullAdapter_1.BullAdapter(pushAlarm_1.afternoonQueue),
        new bullAdapter_1.BullAdapter(pushAlarm_1.nightQueue),
        new bullMQAdapter_1.BullMQAdapter(pushAlarm_1.messageQueue)
    ],
    serverAdapter
});
serverAdapter.setBasePath("/bull-board");
exports.default = serverAdapter;
//# sourceMappingURL=bullBoard.js.map