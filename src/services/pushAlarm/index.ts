import Queue from "bull";
import dayjs from "dayjs";
import schedule from 'node-schedule';
import { Op } from "sequelize";
import config from "../../config";
import { Item, Time, User, UserCategory, TodayWal } from "../../models";

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
    ], //{ model: UserCategory, attributes: ["category_id", "next_item_id"] } 가져오면 update후의 usercategory가 반복문 안에서 반영 안됨-> 똑같은 카테고리 선택 시 같은 NEXT_ITEM_ID 가져와버림
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
            const currentItemId = await getRandCategoryCurrentItem(userId);

            await TodayWal.create({
                user_id: userId,
                item_id: currentItemId,
                time: t
            })
        }
    }
}
  
export async function getRandCategoryCurrentItem(userId: number) {
    //가진 카테고리 중 하나 선택
    const userCategories = await UserCategory.findAll({
      where: { user_id: userId }
    })
    const randomIdx = Math.floor(
      Math.random() * (userCategories.length - 1)
    ); 

    const currentItemId: number = userCategories[randomIdx].getDataValue("next_item_id");
    //해당 카테고리의 Table상 id
    const category_id: number = userCategories[randomIdx].getDataValue("category_id");
  
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
