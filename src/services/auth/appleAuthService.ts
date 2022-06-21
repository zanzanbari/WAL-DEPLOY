import * as jwt from "jsonwebtoken";
import IAuthService from "./authService";
import { TokenDto } from "../../dto/request/authRequest";
import { AuthResponse, IAppleUserInfo } from "../../dto/response/authResponse";
import { issueAccessToken, issueRefreshToken } from "../../common/tokenHandler";

class AppleAuthService implements IAuthService {
  constructor(
    private readonly userRepository: any,
    private readonly logger: any
  ) {
  }
    
  /**
   *  @애플_로그인
   *  @route POST /auth/apple/login
   *  @access public
   */

  public async login(request: TokenDto): Promise<AuthResponse | undefined> {
      
    try {
      // FIXME apple server 공개 키로 jwt 해독
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
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }
      
  }

  /**
   *  @애플_로그아웃_탈퇴
   *  @route POST /auth/apple/resign
   *  @access public
   */
    
  public async resign(userId: number): Promise<AuthResponse> {
    
    try {

      const resignedUser = this.userRepository.findAndDelete(userId);
      return await resignedUser;

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }
  }

}
  
  export default AppleAuthService;