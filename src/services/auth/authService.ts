import jwt from "jsonwebtoken";
import { TokenDto } from "@/interface/dto/request/authRequest";
import { Token, UserInfo } from "@/interface/dto/response/authResponse";

abstract class AuthService {

    protected async login(token: TokenDto): Promise<any> {};
    protected async resign(): Promise<any> {};

    protected async issueAccessToken(user: UserInfo | undefined): Promise<Token> {
        const payload = {
            id: user?.id,
            nickname: user?.nickname,
            email: user?.email,
            social: user?.social
        };
        const accesstoken = jwt.sign(payload, process.env.JWT_SECRET, {
            issuer: process.env.JWT_ISSUER,
            expiresIn: process.env.JWT_AC_EXPIRES,
        });

        return accesstoken;
    };

    protected async issueRefreshToken(): Promise<Token> {
        const refreshtoken = jwt.sign({}, process.env.JWT_SECRET, {
            issuer: process.env.JWT_ISSUER,
            expiresIn: process.env.JWT_RF_EXPIRES,
        });

        return refreshtoken;
    };
};

export default AuthService;