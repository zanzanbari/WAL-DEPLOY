import * as jwt from "jsonwebtoken";
import IAuthService from "./authService";
import { TokenDto } from "../../dto/request/authRequest";
import { AuthResponse, IAppleUserInfo } from "../../dto/response/authResponse";
import { issueAccessToken, issueRefreshToken } from "../../common/tokenHandler";

class AppleAuthService implements IAuthService {
  constructor(
    private readonly userRepository: any,
    private readonly resignUserRepository: any,
    private readonly logger: any
  ) {
  }
    
  /**
   *  @desc 애플_로그인
   *  @route POST /auth/apple/login
   *  @access public
   */

  public async login(request: TokenDto): Promise<AuthResponse | undefined> {
      
    try {
      // FIXME apple server 공개 키로 jwt 해독
      const payload = jwt.decode(request.socialtoken as string) as IAppleUserInfo;
      const userData = { email: payload.sub, nickname: null };
      
      const isResignedUser = await this.resignUserRepository.existsInaDayByEmail(payload.sub); //24시간 내 탈퇴한 유저
      if (isResignedUser) throw new Error("Forbidden");

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
   *  @desc 애플_로그아웃_탈퇴
   *  @route POST /auth/apple/resign
   *  @access public
   */
    
  public async resign(userId: number, reason: string[]) {
    
    try {

      const resignedUser = await this.userRepository.findAndDelete(userId);
      await this.resignUserRepository.save(userId, reason, resignedUser.email);

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }
  }

}
  
  export default AppleAuthService;