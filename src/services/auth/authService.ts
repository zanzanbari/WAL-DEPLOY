import { TokenDto } from "../../interface/dto/request/authRequest";

interface IAuthService {
    login(token: TokenDto): Promise<any>;
    resign(userId: number, token: TokenDto): Promise<any>;
};

export default IAuthService;