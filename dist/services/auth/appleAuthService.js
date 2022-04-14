// import AuthService from "./authService";
// import { TokenDto } from "@/interface/dto/request/authRequest";
// import { AuthResponse } from "@/interface/dto/response/authResponse";
// class AppleAuthService implement AuthService {
//     constructor(
//         private readonly userRepositroy,
// private readonly logger;
//     ) {
//     }
//     public async login(request: TokenDto): Promise<AuthResponse | undefined> {
//         try {
//             let socialUser = await KakaoAuthApi(request.socialtoken);
//             socialUser = await this.userRepository.findOneByEmail(socialUser?.email);
//             const accesstoken = await this.issueAccessToken(socialUser);
//             const refreshtoken = await this.issueRefreshToken();
//             socialUser = await this.userRepository.createSocialUser("kakao", socialUser, request, refreshtoken);
//             const user = {
//                 nickname: socialUser?.nickname,
//                 accesstoken,
//                 refreshtoken
//             }
//             return user;
//         } catch (error) {
//             console.error(error);
// this.logger.appLogger.log({
//     level: "error",
//     message: error.message
// });
//             throw new Error(error);
//         }
//     }
// }
// export default AppleAuthService;
//# sourceMappingURL=appleAuthService.js.map