import jwt from "jsonwebtoken";
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

export const passwordValidator = (pwd: string) => {
    const password = /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,64}$/;
    if (!password.test(pwd)) return false;        
    else return true;
};


export const verifyToken = (token: string) => {
    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.message === "jwt expired") {
            console.log("토큰이 만료되었습니다");
            return TOKEN_EXPIRED;
        } else if (error.message === "jwt invalid") {
            console.log("토큰이 유효하지 않습니다");
            return TOKEN_INVALID;
        } else {
            console.log("토큰 검증 오류")
            return TOKEN_INVALID;
        }
    }
    return decoded;
}


export function isTokenExpired (decoded: any) {
    return decoded === TOKEN_EXPIRED || decoded === TOKEN_INVALID
}


// export function isNullValues(obj: object): boolean | undefined {
//     // TODO: [Symbol.iterator], generator 사용하기
//     for (let key in obj) {
//         console.log(obj[key]);
//         if (obj[key] === undefined) return false;
//         else return true;
//     }
// }