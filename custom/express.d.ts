import { UserInfo } from '../src/interface/dto/response/authResponse';
import { Axios } from 'axios';

declare global {
	namespace Express {
		interface Request {
			user?: UserInfo;

            // file?: Multer.File;

            // files?: {
            //     [fieldname: string]: MulterS3.File[];
            // } | Multer.File[];
		}

        interface Response {}
        interface Application {}
	}
}