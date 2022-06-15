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
const models_1 = __importDefault(require("../models"));
// 시퀄라이즈 연결
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    models_1.default.authenticate()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("✅ Connect PostgreSQL");
    }))
        .catch((err) => {
        console.log("TT : ", err);
    });
    // 시퀄라이즈 모델 DB에 싱크
    models_1.default.sync({ force: false })
        .then(() => {
        console.log('✅ Sync Models to DB');
    })
        .catch((err) => {
        console.log('❌ DB CONNECT ERROR:', err);
    });
});
//# sourceMappingURL=dbSequelize.js.map