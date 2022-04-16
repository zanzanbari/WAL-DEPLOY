import { TokenDto } from "@/interface/dto/request/authRequest";
import { UserInfo } from "@/interface/dto/response/authResponse";

interface AuthService {
    login(token: TokenDto): Promise<any>;
    resign(userId: number, token: TokenDto): Promise<any>;
};

export default AuthService;