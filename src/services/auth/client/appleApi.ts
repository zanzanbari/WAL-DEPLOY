import { IApplePublicKeys } from "../../../interface/dto/response/authResponse";
import axios from "axios";
import logger from "../../../api/middlewares/logger";

// apple public key 가져오는 함수
export async function getPublicKey(): Promise<IApplePublicKeys> {

    try {

        const keys: IApplePublicKeys = await axios.get("https://appleid.apple.com/auth/keys")
            .then(resolve => { return resolve.data["keys"] })
            .catch(err => { return err });

        return keys;
        
    } catch (error) {
        logger.appLogger.log({ level: "error", message: error.message });
        throw new Error(error.message);
    }

}


const appleApiUtil = {
    getPublicKey
};

export default appleApiUtil;