import { Service } from "typedi";
import { 
    UserSetCategory, 
    UserSetTime, 
    UserSettingDto } from "@/interface/dto/request/userRequest";
import { UserInfoResponse, UserSettingResponse } from "@/interface/dto/response/userResponse";
import { User } from "@/models";


@Service()
class UserService {
    
    constructor(
        private readonly userRepository: any,
        private readonly timeRepository: any,
        private readonly itemRepository: any,
        private readonly userCategoryRepository: any,
        private readonly logger: any
    ) {
    }

    private timeSelection: UserSetTime = {
        morning: false,
        afternoon: false,
        night: false
    };
        
    public async initSetInfo(
        userId: number | undefined, 
        request: UserSettingDto
    ): Promise<UserSettingResponse> {

        try {
            // 시간 선택
            request.time?.forEach(it => {

                if (it === "morning") this.timeSelection.morning = true;
                if (it === "afternoon") this.timeSelection.afternoon = true;
                if (it === "night") this.timeSelection.night = true;

            });

            // 유형 선택
            let categorySelection: UserSetCategory;
            request.dtype?.forEach(async it => {

                const firstItemId = await this.itemRepository.getFirstIdEachOfCategory(it) as number;
                categorySelection = {
                    user_id: userId,
                    category_id: it,
                    next_item_id: firstItemId,
                };
                await this.userCategoryRepository.setUserCategory(categorySelection); 

            });
            
            await this.timeRepository.setTime(userId, this.timeSelection);
            await this.userRepository.setNickname(userId, request.nickname);

            return { nickname: request.nickname };

        } catch (error) {
            this.logger.appLogger.log({
                level: "error",
                message: error.message
            });
            throw new Error(error);
        }
        
    }


    public async getInfo(
        userId: number | undefined,
    ): Promise<UserInfoResponse> {

        try {
            // 각각 select 날려서 찾아오기..
            const user = await this.userRepository.findById(userId) as User;
            const times = await this.timeRepository.findById(userId) as UserSetTime;
            const categories = await this.userCategoryRepository.findCategoryByUserId(userId) as number[];

            // const userInfo = await this.userRepository.getUserInfo(userId); // 한번에 join 해서 가져오기,,, 뭐가 더 낫지??? => 가공하기 귀찮을것 같은데 ㅇㅅㅇ

            return {
                nickname: user.getDataValue("nickname"),
                email: user.getDataValue("email"),
                times,
                categories
            } as UserInfoResponse;

        } catch (error) {
            this.logger.appLogger.log({
                level: "error",
                message: error.message
            });
            throw new Error(error);
        }

    }
}



export default UserService;