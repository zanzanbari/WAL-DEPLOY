import { Item, Time, User, UserCategory, TodayWal } from "../../models";
import Queue from "bull";
import dayjs from "dayjs";
import schedule from 'node-schedule';
import { Op } from "sequelize";

export const morningQueue = new Queue(
  'morning-queue', {
    redis: { 
      host: process.env.REDIS_HOST,
      port: 16916,
      password: process.env.REDIS_PASSWORD
    }
  }
);

export const afternoonQueue = new Queue(
  'afternoon-queue', {
    redis: { 
      host: "localhost", 
      port: 6379
    }
  }
);

export const nightQueue = new Queue(
  'night-queue', {
    redis: { 
      host: "localhost", 
      port: 6379
    }
  }
);

export const messageQueue = new Queue(
    'message-queue', {
      redis: { 
        host: "localhost", 
        port: 6379
      }
    }
  );

export function updateToday() {
    schedule.scheduleJob('0 0 0 * * *', async () => {
        await TodayWal.destroy({
            where: {},
            truncate: true
        });
        await updateTodayWal();
  });
}

export async function updateTodayWal() {

    const settingExists = await Time.findAll({
      attributes: ["user_id"]
    }); //초기 설정을 한 유저만

    const existSet = settingExists.map((user)=>{
      return user.user_id
    })
    
    const users = await User.findAll({
    where: { id: { [Op.in]: existSet } },
    include: [
        { model: Time, attributes: ["morning", "afternoon", "night"] }, 
        { model: UserCategory, attributes: ["category_id", "next_item_id"] },
    ],
    attributes: ["id"]
    }) as User[];

    for (const user of users) {
        const userId = user.getDataValue("id") as number;

        const selectedTime: Date[] = []

        const times = user.getDataValue("time");
        const dateString = dayjs(new Date()).format("YYYY-MM-DD")
        if (times.getDataValue("morning")) { //8
            selectedTime.push(new Date(`${dateString} 08:00:00`))
        }
        if (times.getDataValue("afternoon")) { //2시
            selectedTime.push(new Date(`${dateString} 14:00:00`))
        }
        if (times.getDataValue("night")) { //20
            selectedTime.push(new Date(`${dateString} 20:00:00`))
        }

        for (const t of selectedTime) {
            const currentItemId = await getRandCategoryCurrentItem(user);

            await TodayWal.create({
                user_id: userId,
                item_id: currentItemId,
                time: t
            })
        }
    }
}
  
async function getRandCategoryCurrentItem(user: User) {

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
  

    let itemIdx: number, nextItemIdx: number, nextItemId;
    for(const item of sameCategoryItems) {
        if (item.getDataValue("id") === currentItemId) {
            itemIdx = sameCategoryItems.indexOf(item); //배열상 인덱스
            nextItemIdx = (itemIdx + 1) % sameCategoryItems.length; //배열상 인덱스
            nextItemId = sameCategoryItems[nextItemIdx].getDataValue("id"); //테이블 상 id
        }
    }
  
    await UserCategory.update({
      next_item_id: nextItemId
    }, {
      where: {
        user_id: userId,
        category_id
      }
    });
  
    return currentItemId;
  
  }