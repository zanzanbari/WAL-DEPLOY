import { TokenDto } from "../../dto/request/authRequest";
import { AuthResponse } from "../../dto/response/authResponse";

interface IAuthService {
  login(token: TokenDto): Promise<AuthResponse | undefined>;
  resign(userId: number, token?: TokenDto): Promise<AuthResponse>;
};

export default IAuthService;