// 소셜 토큰과 fcm 토큰
export interface TokenDto {
    readonly accesstoken?: string,
    readonly refreshtoken?: string,
    readonly socialtoken?: string,
    readonly fcmtoken?: string
}
