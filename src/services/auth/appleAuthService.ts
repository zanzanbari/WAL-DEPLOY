import * as jwt from "jsonwebtoken";
import IAuthService from "./authService";
import { TokenDto } from "../../interface/dto/request/authRequest";
import { AuthResponse, IAppleUserInfo } from "../../interface/dto/response/authResponse";
import { issueAccessToken, issueRefreshToken } from "../../modules/tokenHandler";

class AppleAuthService implements IAuthService {
    constructor(
        private readonly userRepository: any,
        private readonly logger: any
    ) {
    }
    
    public async login(request: TokenDto): Promise<AuthResponse | undefined> {
      
      try {
        // 결국 해야되는건 -> id_token 받아서 
        // apple server 공개 키로 jwt 해독 (해야하는데 실패) -> 나중에 다시 시도
        const payload = jwt.decode(request.socialtoken as string) as IAppleUserInfo;
        const userData = { email: payload.sub, nickname: null };
      
        const refreshtoken = await issueRefreshToken();
        const socialUser = await this.userRepository.findByEmailOrCreateSocialUser("apple", userData, request, refreshtoken);
        const accesstoken = await issueAccessToken(socialUser);

        const user: AuthResponse = {
          nickname: socialUser.nickname,
          accesstoken,
          refreshtoken
        }
        return user;
        
      } catch (error) {
        console.error(error);
        this.logger.appLogger.log({ level: "error", message: error.message });
        throw new Error(error);
      }
      
    }
    
    resign(userId: number, token: TokenDto): Promise<any> {
      throw new Error("Method not implemented.");
    }


  }
  
  export default AppleAuthService;