import axios from "axios";
import { Token, UserInfo } from "../../../interface/dto/response/authResponse";
import logger from "../../../api/middlewares/logger";


export async function KakaoAuthApi(
    kakaoAccessToken: Token
): Promise<UserInfo | undefined> { // 제발 오류처리 어케 할거야
    try {

        const apiUrl = "https://kapi.kakao.com/v2/user/me";
        const reqConfig = {
            headers: {
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                "Authorization": `Bearer ${kakaoAccessToken}`
            }
        };

        const userData = await axios.post(apiUrl, {},reqConfig)
            .then((resolve) => {
                const nickname: string = resolve.data.properties["nickname"];
                const email: string = resolve.data.kakao_account["email"];
                return { nickname, email };
            });

        return userData;

    } catch (error) {
        logger.appLogger.log({
            level: 'error',
            message: error.message
        }); // FIXME 이놈은 서버에러인가?? 클라가 잘못된 토큰 보내준거 아닌가 ㅇㅅㅇ
        throw new Error(`❌ AXIOS_ERROR : ${error.message} ❌`);
    }
};



export async function KakaoUnlinkApi(
    kakaoAccessToken?: Token
): Promise<void> {
    try {

        const apiUrl = "https://kapi.kakao.com/v1/user/unlink";
        const reqConfig = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${kakaoAccessToken}`
            }
        };

        const userData = await axios.post(apiUrl, {}, reqConfig);
        logger.httpLogStream.write({
            level: "info",
            message: userData
        });

    } catch (error) {
        logger.appLogger.log({
            level: 'error',
            message: error.message
        })
        throw new Error("❌ AXIOS_ERROR ❌");
    }
};

const kakaoApiUtil = {
    KakaoAuthApi,
    KakaoUnlinkApi,
};

export default kakaoApiUtil;