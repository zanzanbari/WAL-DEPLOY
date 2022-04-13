import jwt from "jsonwebtoken";
import { Token } from "@/interface/dto/response/authResponse";

export async function appleAuthApi(appleAccessToken: Token) {
    try {
        const userData = jwt.decode(appleAccessToken);
        
        return 
    } catch (error) {

    }
}