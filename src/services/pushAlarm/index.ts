import Queue from "bull";
import config from "../../config";

export const morningQueue = new Queue(
  'morning-queue', {
    redis: config.redis.dev
  }
);

export const afternoonQueue = new Queue(
  'afternoon-queue', {
    redis: config.redis.dev
  }
);

export const nightQueue = new Queue(
  'night-queue', {
    redis: config.redis.dev
  }
);

export const messageQueue = new Queue(
  'message-queue', {
    redis: config.redis.dev,
    defaultJobOptions: {
      removeOnComplete: true //job 완료 시 삭제
    }
  }
);

export const reserveQueue = new Queue(
  "reserve-queue", {
    redis: config.redis.dev,
    defaultJobOptions: {
      removeOnComplete: true
    }
  }
);
