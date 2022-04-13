import { Service } from "typedi";
import AuthService from "./authService";
import { KakaoAuthApi } from "./client/kakaoApi";
import { TokenDto } from "@/interface/dto/request/authRequest";
import { AuthResponse } from "@/interface/dto/response/authResponse";

@Service()
class KakaoAuthService extends AuthService {
    // 주입해주고 싶다 
    constructor(
        private readonly userRepository: any,
        private readonly logger: any
    ) {
        super();
    }

    public async login(request: TokenDto): Promise<AuthResponse | undefined> {

        try {
            const userData = await KakaoAuthApi(request.socialtoken);
            const refreshtoken = await this.issueRefreshToken();
            const socialUser = await this.userRepository.findByEmailOrCreateSocialUser("kakao", userData, request, refreshtoken);
            const accesstoken = await this.issueAccessToken(socialUser);
            
            const user: AuthResponse = {
                nickname: socialUser.nickname,
                accesstoken,
                refreshtoken
            }
            return user;
        
        } catch (error) {
            this.logger.appLogger.log({
                level: "error",
                message: error.message
            });
            throw new Error(error);
        }
    }

    // public resign(): Promise<any> {
        
    // }
}

export default KakaoAuthService;