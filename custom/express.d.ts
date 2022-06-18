import { Axios } from 'axios';
import { UserInfo } from '../src/dto/response/authResponse';

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