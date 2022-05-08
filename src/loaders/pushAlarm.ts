import { Item, Time, User, UserCategory, TodayWal } from "../models";
import Queue, { Job } from "bull";
import { Request, Response } from "express";
import admin from "firebase-admin";
import dayjs from "dayjs";
import schedule from 'node-schedule';

const logger = require("../middlewares/logger");


/*
const redisClient=redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password:process.env.REDIS_PASSWORD
});
*/

schedule.scheduleJob('0 0 0 * * *', async () => {
  await TodayWal.destroy();
  await updateTodayWal();
});



async function getRandCategoryNextItem(user: User) {

  const userId = user.getDataValue("id") as number;
  //가진 카테고리 중 하나 선택
  const randomIdx = Math.floor(
    Math.random() * (user.getDataValue("userCategories").length - 1)
  ); 
  const currentItemId = user
    .getDataValue("userCategories")[randomIdx]
    .getDataValue("next_item_id");

  //해당 카테고리의 Table상 id
  const category_id = user
  .getDataValue("userCategories")[randomIdx]
  .getDataValue("category_id");

  const sameCategoryItems = await Item.findAll({
    where: {
      category_id
    }
  }) as Item[];

  const itemValues = sameCategoryItems["dataValues"];
  const item = itemValues.filter((it: Item) => it.id === currentItemId);
  const itemIdx = itemValues.indexOf(item);
  const nextItemId = (itemIdx + 1) % itemValues.length;

  await UserCategory.update({
    next_item_id: nextItemId
  }, {
    where: {
      user_id: userId,
      category_id
    }
  });

  return nextItemId;

}

async function updateTodayWal() {
  const users = await User.findAll({
    include: [
      { model: Time, attributes: ["morning", "afternoon", "night"] }, 
      { model: UserCategory, attributes: ["category_id", "next_item_id"] },
    ],
    attributes: ["id"]
  }) as User[];

  for (const user of users) {

    const userId = user.getDataValue("id") as number;

    const selectedTime: Date[] = []
    const times = await Time.findOne({
        where: { user_id : userId }
    }) as Time
    
    const dateString = dayjs(new Date()).format("YYYY-MM-dd")
    if (times["dataValues"]["morning"]) { //8
        selectedTime.push(new Date(`${dateString} 08:00:00`))
        //const walTime = new Date(`${dateString} 08:00:00`)
    }
    if (times["dataValues"]["afternoon"]) { //12
      selectedTime.push(new Date(`${dateString} 12:00:00`))
    }
    if (times["dataValues"]["night"]) { //20
      selectedTime.push(new Date(`${dateString} 20:00:00`))
    }

    for (const t in selectedTime) {
      const nextItemId = await getRandCategoryNextItem(user);

      await TodayWal.create({
        user_id: userId,
        item_id: nextItemId,
        time: t
      })
    }
  }
}


//1. 8시마다 todayWal에서 8시의 것 뽑아오기
async function getTokenMessage(time: Date) {
    const todayWals = await TodayWal.findAll({
      where: { time },
      include: [
        { model: User, attributes: ["fcmtoken"] }
      ]
    });

    for (const wal of todayWals) {
      const fcmtoken = wal.getDataValue("users").getDataValue("fcmtoken");
      const userDefined = wal.getDataValue("userDefined");
      const content = userDefined? wal.getDataValue("reservation_id") : wal.getDataValue("item_id");
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
}


export const messageQueue = new Queue(
  'message-queue1', {
    redis: { 
      host: "localhost", 
      port: 6379
    }
  }
);

async()=> {
  const dateString = dayjs(new Date()).format("YYYY-MM-dd")
  const data = await getTokenMessage(new Date(`${dateString} 08:00:00`));
  sendMessage(data, new Date(`${dateString} 08:00:00`));
}

async function messageProcess (job: Job) { // fcm, contents 꺼내서 메세지 보내주기
    // messageQueue.add 로 추가해준 작업
    // messageQueue.process 로 실행
    const deviceToken = job.data.fcmtoken;
    let message = { 
        notification: { 
            title: '테스트 발송💛', 
            body: job.data.content, // 카테고리 아이디로 item 에서 content 뽑아서 여기다 ㅇㅇ
        }, 
        token: deviceToken, 
    }

}

messageQueue.process(messageProcess);  

const messageToUser = (req: Request, res: Response, message) => {
  admin 
      .messaging() 
      .send(message) 
      .then(function (response) { 
          console.log('Successfully sent message: : ', response) 
          return res.status(200).json({success : true}) 
      }) 
      .catch(function (err) { 
          console.log('Error Sending message!!! : ', err) 
          return res.status(400).json({success : false}) 
      });
}



export async function sendMessage(data, time): Promise<void> {

  try {

    await messageQueue.add(
      data,
      {
        repeat: { cron: `* ${time} * * *` }
      });

  } catch(error) {
    logger.appLogger.log({
      level: "error",
      message: error.message
    })
  }

}


const fcmToken = "fCRwgfoiSUyhtoZ0PrnJze:APA91bHDjRWuGxInIdyxWCIes75vIZjHKp9K8JuGmYmTPNFHQ9i_b_PGnlhZVhCP1VMb0PtiK9xmjA4GqFp8I3qqBN7zd5F8yxUDQzkFpf-R32kdC4r_jUoSIxoSBR1KsOJ4rrjlTSRa";