import { Service } from "typedi";
import { 
    ResetCategory,
    ResetCategoryDto,
    UserSetCategory, 
    UserSetTime, 
    UserSettingDto } from "@/interface/dto/request/userRequest";
import { UserSettingResponse } from "@/interface/dto/response/userResponse";
import { User } from "@/models";


@Service()
class UserService {

    private timeSelection: UserSetTime = {
        morning: false,
        afternoon: false,
        night: false
    }
    private categorySelection!: UserSetCategory;

    constructor(
        private readonly userRepository: any,
        private readonly timeRepository: any,
        private readonly itemRepository: any,
        private readonly userCategoryRepository: any,
        private readonly logger: any
    ) {
    }

        
    public async initSetInfo(
        userId: number, 
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
            request.dtype?.forEach(async it => {

                const firstItemId = await this.itemRepository.getFirstIdEachOfCategory(it) as number;
                this.categorySelection = {
                    user_id: userId,
                    category_id: it,
                    next_item_id: firstItemId,
                };
                await this.userCategoryRepository.setUserCategory(this.categorySelection); 

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


    public async resetUserCategoryInfo(
        userId: number,
        request: ResetCategoryDto
    ): Promise<number[]> {

        try { 

            const beforeCategoryInfo = request[0]; // 이전 설정값
            const afterCategoryInfo = request[1]; // 새로운 설정값

            const before = this.extractBooleanInfo(beforeCategoryInfo);
            const after = this.extractBooleanInfo(afterCategoryInfo);
            // FIXME: category pk의 인덱스 번호 차이
            for (let categoryId = 0 ; categoryId < 4; categoryId ++) {

                if (before[categoryId] === true && after[categoryId] === false) { // 삭제

                    await this.userCategoryRepository.deleteUserCategory(userId, categoryId);

                } else if (before[categoryId] === false && after[categoryId] === true) { // 생성
                    // FIXME: item 당연히 있겠지마는~~ ㄹㅇ 없을땐 어캄? -> 고민 ㄱ
                    const firstItemId = await this.itemRepository.getFirstIdEachOfCategory(categoryId) as number;
                    this.categorySelection = {
                        user_id: userId,
                        category_id: categoryId,
                        next_item_id: firstItemId,
                    };
                    await this.userCategoryRepository.setUserCategory(this.categorySelection); 

                }

            }

            const resultInfo = this.userCategoryRepository.findCategoryByUserId(userId) as Promise<number[]>;
            return await resultInfo;

        } catch (error) {
            this.logger.appLogger.log({
                level: "error",
                message: error.message
            });
            throw new Error(error);
        }

    }


    private extractBooleanInfo(property: ResetCategory): boolean[] {
        const extractedInfo: boolean[] = [];
        for (const key in property) { // 객체 탐색 for...in
            extractedInfo.push(property[key]);
        }
        return extractedInfo;
    }


}



export default UserService;