import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../loaders/logger";
import { Token, UserInfo } from "../dto/response/authResponse";
import config from "../config";
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

dotenv.config();

export const issueAccessToken = async (user?: UserInfo): Promise<Token> => {
    const payload = {
        id: user?.id,
        nickname: user?.nickname,
        email: user?.email,
        social: user?.social
    };
    const accesstoken = jwt.sign(payload, config.jwtSecret, config.jwtAcOption);

    return accesstoken;
};



export const issueRefreshToken = async (): Promise<Token> => {
    const refreshtoken = jwt.sign({}, config.jwtSecret, config.jwtRfOption);

    return refreshtoken;
};




export const verifyToken = async (token?: string) => {

    let decoded: any;
    try {            
        decoded = jwt.verify(token as string, config.jwtSecret);
    } catch (error) {
        if (error.message === "jwt expired") {
            logger.appLogger.log({ level: "error", message: "토큰이 만료되었습니다"});
            return TOKEN_EXPIRED;
        } else if (error.message === "jwt invalid") {
            logger.appLogger.log({ level: "error", message: "토큰이 유효하지 않습니다"});
            return TOKEN_INVALID;
        } else {
            logger.appLogger.log({ level: "error", message: "토큰 검증 오류"});
            return TOKEN_INVALID;
        }
    }
    return decoded;

}


// public key로 검증하는 함수
// 검증 성공하면 안에 정보 뽑아서 반환
// export const verifyAppleIdToken = async (id_token: string) => {
    
//     try {

//         const keys = await appleApiUtil.getPublicKey();
//         for (const key of keys) {

//         }

//         jwt.verify(id_token, keys,{
//             algorithms: process.env.APPLE_ALGORITHM,
//             issuer: process.env.APPLE_ISSUER,
//             audience: process.env.APPLE_CLIENT_ID
//         })

//     } catch (error) {

//     }
// }
