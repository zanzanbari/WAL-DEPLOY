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
    private readonly resignUserRepository: any,
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

      const isResignedUser = await this.resignUserRepository.existsInaDayByEmail(userData?.email); //24시간 내 탈퇴한 유저
      if (isResignedUser) throw new Error("Forbidden");

      let refreshtoken = "";
      do {
        refreshtoken =  await issueRefreshToken();
      } while (refreshtoken != null);
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

  public async resign(userId: number, reason: string[], token: TokenDto) {
        
    try {

      const unlinkedUser = kakaoApiUtil.unlink(token.socialtoken);
      const resignedUser = await this.userRepository.findAndDelete(userId);
      await this.resignUserRepository.save(userId, reason, resignedUser.email);

      await unlinkedUser;

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }
  }

}

export default KakaoAuthService;