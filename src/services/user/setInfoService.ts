import { Service } from "typedi";
import { UserSettingDto } from "../../interface/dto/request/userRequest";
import { User, UserCategory, Time, Item } from "../../models";
import Error from "../../constant/responseError";

const setInfoService = async (userId, UserSettingDto) => {
    if (!userId || !UserSettingDto) {
        return Error.NULL_VALUE;
    }
    try {
        const user = await User.findOne({where: {id: userId}})
        user?.update({
            nickname: UserSettingDto.nickname
        })
        
        const timeSelection = [false, false, false]
        UserSettingDto.time?.map(t => {
            timeSelection[t] = true
        })
        await Time.create({
            user_id: userId,
            morning: timeSelection[0],
            afternoon: timeSelection[1],
            night: timeSelection[2]
        })

        for (const c of UserSettingDto.dtype) {
            const firstItem = await Item.findOne({where: {category_id: c}})
            if (firstItem) {
                UserCategory.create({
                    user_id: userId,
                    category_id: c,
                    next_item_id: firstItem
                })
            }
        }  

    } catch (error) {
        console.log(error);
        throw error;
    }
}
    
    
   

export default setInfoService;