"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicKey = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../../../loaders/logger"));
// apple public key 가져오는 함수
function getPublicKey() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const keys = yield axios_1.default.get("https://appleid.apple.com/auth/keys")
                .then(resolve => { return resolve.data["keys"]; })
                .catch(err => { return err; });
            return keys;
        }
        catch (error) {
            logger_1.default.appLogger.log({ level: "error", message: error.message });
            throw new Error(error.message);
        }
    });
}
exports.getPublicKey = getPublicKey;
const appleApiUtil = {
    getPublicKey
};
exports.default = appleApiUtil;
//# sourceMappingURL=appleApi.js.map