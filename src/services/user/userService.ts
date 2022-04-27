import { Service } from "typedi";
import { 
    UserSetCategory, 
    UserSetTime, 
    UserSettingDto } from "@/interface/dto/request/userRequest";
import { UserSettingResponse } from "@/interface/dto/response/userResponse";


@Service()
class UserService {
    constructor(
        private readonly userRepository: any,
        private readonly timeRepository: any,
        private readonly itemRepository: any,
        private readonly userCategoryRepository: any,
        private readonly logger: any
    ) {}

    public async initSetInfo(
        userId: number | undefined, 
        request: UserSettingDto
    ): Promise<UserSettingResponse> {

        try {
            // 시간 선택
            const timeSelection = {
                morning: false,
                afternoon: false,
                night: false
            } as UserSetTime;
            request.time?.forEach(it => {

                if (it === "morning") timeSelection.morning = true;
                if (it === "afternoon") timeSelection.afternoon = true;
                if (it === "night") timeSelection.night = true;

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
            
            await this.timeRepository.setTime(userId, timeSelection);
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
}



export default UserService;