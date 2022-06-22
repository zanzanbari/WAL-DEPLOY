import axios from "axios";
import logger from "../../../loaders/logger";
import { IApplePublicKeys } from "../../../dto/response/authResponse";

// apple public key 가져오는 함수
export async function getPublicKey(): Promise<IApplePublicKeys> {

  try {

    const apiUrl = "https://appleid.apple.com/auth/keys";
    const keys: IApplePublicKeys = await axios.get(apiUrl)
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