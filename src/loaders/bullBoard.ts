import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter"
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { afternoonQueue, messageQueue, morningQueue, nightQueue, reserveQueue } from "@/services/pushAlarm";

const serverAdapter = new ExpressAdapter();
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [
    new BullAdapter(morningQueue),
    new BullAdapter(afternoonQueue),
    new BullAdapter(nightQueue),
    new BullAdapter(reserveQueue),
    new BullMQAdapter(messageQueue)
  ],
  serverAdapter
});

serverAdapter.setBasePath("/bull-board");

export default serverAdapter;