import timeHandler from "../../modules/timeHandler";
import { Service } from "typedi";
import { 
    ResetCategoryDto,
    ISetUserCategory, 
    UserSettingDto, 
    ISetCategory,
    ISetTime,
    ResetTimeDto } from "../../interface/dto/request/userRequest";
import { UserSettingResponse } from "../../interface/dto/response/userResponse";
import { addUserTime, updateUserTime } from "../pushAlarm/producer";
import { getRandCategoryCurrentItem } from "../pushAlarm";


@Service()
class UserService {

    private infoToUserCategoryDB!: ISetUserCategory;
    private categorySelection: ISetCategory = {
        joke: false,
        compliment: false,
        condolence: false,
        scolding: false
    };

    constructor(
        private readonly userRepository: any,
        private readonly timeRepository: any,
        private readonly itemRepository: any,
        private readonly userCategoryRepository: any,
        private readonly todayWalRepository: any,
        private readonly logger: any
    ) {
    }

        
    public async initSetInfo(
        userId: number, 
        request: UserSettingDto
    ): Promise<UserSettingResponse> {

        try {

            await this.timeRepository.setTime(userId, request.time);
            await this.userRepository.setNickname(userId, request.nickname);
            // 유형 선택
            // 각각 T/F 뽑아서 => T면 새로운 배열에 그 인덱스 번호 넣어, F면 넣지마
            const dtypeBoolInfo = this.extractBooleanInfo(request.dtype as ISetCategory);

            const dtypeIdx: number[] = [];

            for (let i = 0; i < dtypeBoolInfo.length; i++) {
                if (dtypeBoolInfo[i] === true) {
                    dtypeIdx.push(i);
                }
            }

            // dtypeIdx = [0, 1, 2] 일때~~
            dtypeIdx.forEach(async categoryId => {

                const firstItemId = await this.itemRepository.getFirstIdEachOfCategory(categoryId) as number;

                this.infoToUserCategoryDB = {
                    user_id: userId,
                    category_id: categoryId,
                    next_item_id: firstItemId,
                };
                await this.userCategoryRepository.setUserCategory(this.infoToUserCategoryDB); 
                
            });

            // todayWals에 들어갈 놈   
            // FIXME randomIdx 뽑는거 다시 생각 ㄲ
            if (request.time?.morning === true) {
                // 카테고리 아이디를 랜덤으로 뽑자 
                const randIdx = Math.floor(Math.random() * (dtypeIdx.length));
                const randCategoryId = dtypeIdx[randIdx];
                const data = {
                    user_id: userId,
                    category_id: randCategoryId, // 이새끼..는 선택한 애중에 랜뽑
                    item_id: await this.itemRepository.getFirstIdEachOfCategory(randCategoryId) as number, // db에서 가져와야 함 => 이새끼가 문젠데... 랜뽑한 카테고리 아이디로 가져오면 겹칠텐데 ㅅㅂㅅㅂㅅㅂ
                    time: timeHandler.getMorning() // morning이면 8시, afternoon이면 12시, night면 20시.......
                };
                await this.todayWalRepository.setTodayWal(data);

            } 
            if (request.time?.afternoon === true) {
                const randIdx = Math.floor(Math.random() * (dtypeIdx.length));
                const randCategoryId = dtypeIdx[randIdx];
                const data = {
                    user_id: userId,
                    category_id: randCategoryId, 
                    item_id: await this.itemRepository.getFirstIdEachOfCategory(randCategoryId) as number, 
                    time: timeHandler.getAfternoon()
                };
                await this.todayWalRepository.setTodayWal(data);
            }
            if (request.time?.night === true) {
                const randIdx = Math.floor(Math.random() * (dtypeIdx.length));
                const randCategoryId = dtypeIdx[randIdx];
                const data = {
                    user_id: userId,
                    category_id: randCategoryId, 
                    item_id: await this.itemRepository.getFirstIdEachOfCategory(randCategoryId) as number, 
                    time: timeHandler.getNight()
                };
                await this.todayWalRepository.setTodayWal(data);
            }

            addUserTime(userId);

            return { nickname: request.nickname };

        } catch (error) {
            this.logger.appLogger.log({ level: "error", message: error.message });
            throw error;
        }
        
    }



    public async getCategoryInfo(userId: number): Promise<ISetCategory> {

        try {

            const dtypeInfo = this.userCategoryRepository.findCategoryByUserId(userId) as Promise<string[]>;
            this.setCategoryInfo(await dtypeInfo);

            return this.categorySelection;

        } catch (error) {
            this.logger.appLogger.log({ level: "error", message: error.message });
            throw error;
        }
    }



    public async resetTimeInfo(
        userId: number,
        request: ResetTimeDto
    ): Promise<ISetTime> {
        
        try {

            const beforeSetTime = request[0]; // 이전 설정값
            const afterSetTime = request[1]; // 새로운 설정값

            this.compareMorningSetAndControlQueueByUserId(beforeSetTime.morning, afterSetTime.morning, userId);
            this.compareAfternoonSetAndControlQueueByUserId(beforeSetTime.afternoon, afterSetTime.afternoon, userId);
            this.compareNightSetAndControlQueueByUserId(beforeSetTime.night, afterSetTime.night, userId);


            await this.timeRepository.updateTime(userId, afterSetTime);
            await this.todayWalRepository.deleteTodayWal(userId);

            const timeSelection: Date[] = [];
            if (afterSetTime.morning == true) timeSelection.push(timeHandler.getMorning());
            if (afterSetTime.afternoon == true) timeSelection.push(timeHandler.getAfternoon());
            if (afterSetTime.night == true) timeSelection.push(timeHandler.getNight());
            // FIXME getRandCategoryCurrentItem 에서 중복 발생 이슈
            timeSelection.forEach(async time => {
                const currentItemId = await getRandCategoryCurrentItem(userId);
                const data = {
                    user_id: userId,
                    item_id: currentItemId,
                    time
                };
                await this.todayWalRepository.setTodayWal(data);
            });

            return await this.timeRepository.findById(userId) as ISetTime;
            
        } catch (error) {
            this.logger.appLogger.log({ level: "error", message: error.message });
            throw error;
        }
    }



    public async resetUserCategoryInfo(
        userId: number,
        request: ResetCategoryDto
    ): Promise<ISetCategory> {

        try { 

            const beforeCategoryInfo = request[0]; // 이전 설정값
            const afterCategoryInfo = request[1]; // 새로운 설정값

            const before = this.extractBooleanInfo(beforeCategoryInfo);
            const after = this.extractBooleanInfo(afterCategoryInfo);

            for (let categoryId = 0 ; categoryId < 4; categoryId ++) {

                if (before[categoryId] === true && after[categoryId] === false) { // 삭제

                    await this.userCategoryRepository.deleteUserCategory(userId, categoryId);

                } else if (before[categoryId] === false && after[categoryId] === true) { // 생성

                    const firstItemId = await this.itemRepository.getFirstIdEachOfCategory(categoryId) as number;
                    this.infoToUserCategoryDB = {
                        user_id: userId,
                        category_id: categoryId,
                        next_item_id: firstItemId,
                    };
                    await this.userCategoryRepository.setUserCategory(this.infoToUserCategoryDB); 

                }

            }

            const dtypeInfo = this.userCategoryRepository.findCategoryByUserId(userId) as Promise<string[]>;
            this.setCategoryInfo(await dtypeInfo);
            
            return this.categorySelection;

        } catch (error) {
            this.logger.appLogger.log({ level: "error", message: error.message });
            throw error;
        }

    }


    private extractBooleanInfo(property: ISetCategory): boolean[] {
        const extractedInfo: boolean[] = [];
        for (const key in property) { // 객체 탐색 for...in
            extractedInfo.push(property[key]);
        }
        return extractedInfo;
    }

    private setCategoryInfo(data: string[]): void {
        data.forEach(it => {
            if (it === "joke") this.categorySelection.joke = true;
            if (it === "compliment") this.categorySelection.compliment = true;
            if (it === "condolence") this.categorySelection.condolence = true;
            if (it === "scolding") this.categorySelection.scolding = true;
        });
    }
    
    // TODO: 비동기 처리 
    // FIXME: 함수 일 줄이기 (단일책임), true 설정 시간대가 현재 시간 기준 이전인지 이후인지 
    // 이전 => queue에 추가할 필요 없음
    // 이후 => queue에 추가 필수
    private compareNightSetAndControlQueueByUserId(beforeNight: boolean, afterNight: boolean, _userId: number) {
        if (beforeNight === true && afterNight === false)
            updateUserTime(_userId, "night", "remove");
        else if (beforeNight === false && afterNight === true)
            updateUserTime(_userId, "night", "add");
    }

    private compareAfternoonSetAndControlQueueByUserId(beforeAfternoon: boolean, afterAfternoon: boolean, _userId: number) {
        if (beforeAfternoon === true && afterAfternoon === false)
            updateUserTime(_userId, "afternoon", "remove");
        else if (beforeAfternoon === false && afterAfternoon === true)
            updateUserTime(_userId, "afternoon", "add");
    }

    private compareMorningSetAndControlQueueByUserId(beforeMorning: boolean, afterMorning: boolean, _userId: number) {
        if (beforeMorning === true && afterMorning === false)
            updateUserTime(_userId, "morning", "remove");
        else if (beforeMorning === false && afterMorning === true)
            updateUserTime(_userId, "morning", "add");
    }


}



export default UserService;