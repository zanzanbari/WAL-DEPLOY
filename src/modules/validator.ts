const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

export const passwordValidator = (pwd: string) => {
    const password = /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,64}$/;
    if (!password.test(pwd)) return false;        
    else return true;
};

export function isTokenExpired (decoded: any) {
    return decoded === TOKEN_EXPIRED || decoded === TOKEN_INVALID
}

