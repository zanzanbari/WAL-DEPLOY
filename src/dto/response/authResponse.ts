export type Token = string;

export interface UserInfo {
    readonly id?: number,
    readonly email?: string,
    readonly nickname?: string | null
    readonly social?: string
}

export interface AuthResponse extends UserInfo {
    readonly accesstoken?: Token
    readonly refreshtoken?: Token
}

export interface IAppleUserInfo extends UserInfo {
    iss?: string,
    aud?: string, // audience - client id
    exp?: number, // identity token 만료 시간
    iat?: number, // apple이 identity token 을 발급한 시간
    sub?: string, // user identifier (사용자 고유 식별자)
    c_hash?: string,
    email_verified?: boolean,
    is_private_email?: boolean,
    auth_time?: number,
    nonce_supported?: boolean
}



export type IApplePublicKeys = IApplePublicKey[];
interface IApplePublicKey {
    kty: string,
    kid: string,
    use: string,
    alg: string,
    n: string,
    e: string
};