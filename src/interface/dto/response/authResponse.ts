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
