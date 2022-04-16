import axios from "axios";
import { Token, UserInfo } from "@/interface/dto/response/authResponse";
const logger = require("../../../api/middlewares/logger");


export async function KakaoAuthApi(
    kakoAccessToken?: Token
): Promise<UserInfo | undefined> { // 제발 오류처리 어케 할거야
    try {

        const apiUrl = "https://kapi.kakao.com/v2/user/me";
        const reqConfig = {
            headers: {
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                "Authorization": `Bearer ${kakoAccessToken}`
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
        })
        throw new Error("❌ AXIOS_ERROR ❌");
    }
};



export async function KakaoUnlinkApi(
    kakoAccessToken?: Token
): Promise<void> {
    try {

        const apiUrl = "https://kapi.kakao.com/v1/user/unlink";
        const reqConfig = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${kakoAccessToken}`
            }
        };

        const userData = axios.post(apiUrl, {}, reqConfig);
        logger.httpLogStream.write({
            level: "info",
            message: await userData
        });

    } catch (error) {
        logger.appLogger.log({
            level: 'error',
            message: error.message
        })
        throw new Error("❌ AXIOS_ERROR ❌");
    }
}