import { TokenDto } from "@/interface/dto/request/authRequest";

interface AuthService {
    login(token: TokenDto): Promise<any>;
    // protected async resign(): Promise<any> {};
};

export default AuthService;