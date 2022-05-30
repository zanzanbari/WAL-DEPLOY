import Error from "../../constant/responseError";
import { isTokenExpired } from "../../common/validator";
import { issueAccessToken, verifyToken } from "../../common/tokenHandler";
import { TokenDto } from "../../interface/dto/request/authRequest";
import { AuthResponse } from "../../interface/dto/response/authResponse";

class ReissueTokenService {
    constructor(
        private readonly userRepository: any,
        private readonly logger: any
    ) {
    }

    public async reissueToken(request: TokenDto): Promise<AuthResponse | undefined | number> {
        try {

            const refreshTokenDecoded = await verifyToken(request.refreshtoken);
            if (isTokenExpired(refreshTokenDecoded)) return Error.TOKEN_EXPIRES; // 여기서 그냥 로그아웃을 시켜야 하나?
            
            const isUser = this.userRepository.findOneByRefreshToken(request.refreshtoken);
            const newAccessToken = await issueAccessToken(isUser);
            
            const user: AuthResponse = {
                id: isUser.id,
                accesstoken: newAccessToken,
                // exp: ???
            }
            return user;

        } catch (error) {
            this.logger.appLogger.log({
                level: "error",
                message: error.message
            });
            // throw new Error(error);
        }
    }
};

export default ReissueTokenService;