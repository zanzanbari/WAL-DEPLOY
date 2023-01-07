import * as jwt from "jsonwebtoken";
import { issueAccessToken, issueRefreshToken  } from "../../common/tokenHandler";
import { ReissueToken, TokenDto } from "../../dto/request/authRequest";
import { AuthResponse, UserInfo } from "../../dto/response/authResponse";

class ReissueTokenService {
  constructor(
    private readonly userRepository: any,
    private readonly logger: any
  ) {
  }

  public async reissueToken(
      request: ReissueToken
  ): Promise<AuthResponse | undefined | number> {
    try {

      var base64Payload = request.accesstoken.split('.')[1]; //value 0 -> header, 1 -> payload, 2 -> VERIFY SIGNATURE
      var payload = Buffer.from(base64Payload, 'base64'); 
      var accessTokenDecoded = JSON.parse(payload.toString())
            
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