// 소셜 토큰과 fcm 토큰
export interface TokenDto {
    readonly accesstoken?: string,
    readonly refreshtoken?: string,
    readonly socialtoken?: string,
    readonly fcmtoken?: string
};

// FIXME 리터럴 타입 적용 제대로 안된듯
type Social = "apple" | "kakao" 
export interface SocialType {
    readonly social?: Social
};

export interface ReissueToken {
    readonly accesstoken: string
    readonly refreshtoken: string
};