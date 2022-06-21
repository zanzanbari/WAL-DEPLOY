import { Service } from "typedi";
import IAuthService from "./authService";
import kakaoApiUtil from "./client/kakaoApi";
import { TokenDto } from "../../dto/request/authRequest";
import { AuthResponse } from "../../dto/response/authResponse";
import { issueAccessToken, issueRefreshToken } from "../../common/tokenHandler";

@Service()
class KakaoAuthService implements IAuthService {
  // TODO 주입해주고 싶다 
  constructor(
    private readonly userRepository: any,
    private readonly logger: any
  ) {
  }

  /**
   *  @desc 카카오_로그인
   *  @route POST /auth/kakao/login
   *  @access public
   */

  public async login(request: TokenDto): Promise<AuthResponse | undefined> {

    try {
            
      const userData = await kakaoApiUtil.auth(request.socialtoken as string);
      const refreshtoken = await issueRefreshToken();
      const socialUser = await this.userRepository.findByEmailOrCreateSocialUser("kakao", userData, request, refreshtoken);
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
   *  @desc 카카오_로그아웃_탈퇴
   *  @route POST /auth/kakao/resign
   *  @access public
   */

  public async resign(userId: number, request: TokenDto): Promise<AuthResponse> {
        
    try {

      const unlinkedUser = kakaoApiUtil.unlink(request.socialtoken);
      const resignedUser = this.userRepository.findAndDelete(userId);

      await unlinkedUser;
      return await resignedUser;

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }
  }

}

export default KakaoAuthService;