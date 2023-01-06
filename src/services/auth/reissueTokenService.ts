import Error from "../../constant/responseError";
import { isTokenExpired } from "../../common/validator";
import { issueAccessToken, issueRefreshToken, verifyToken } from "../../common/tokenHandler";
import { TokenDto } from "../../dto/request/authRequest";
import { AuthResponse } from "../../dto/response/authResponse";

class ReissueTokenService {
  constructor(
    private readonly userRepository: any,
    private readonly logger: any
  ) {
  }

  public async reissueToken(
      request: TokenDto
  ): Promise<AuthResponse | undefined | number> {
    try {

      const accessTokenDecoded = await verifyToken(request.accesstoken);
      // if (isTokenExpired(refreshTokenDecoded)) return Error.TOKEN_EXPIRES; // 여기서 그냥 로그아웃을 시켜야 하나?
            
      const isUser = await this.userRepository.findById(accessTokenDecoded.id);
      const newAccessToken = await issueAccessToken(isUser);
      const newRefreshToken = await issueRefreshToken();
            
      const user: AuthResponse = {
        id: isUser.id,
        accesstoken: newAccessToken,
        refreshtoken: newRefreshToken
      };
      return user;

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }
  }

};

export default ReissueTokenService;