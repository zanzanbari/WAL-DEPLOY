"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const sequelize_typescript_1 = require("sequelize-typescript");
const times_1 = __importDefault(require("./times"));
const reservations_1 = __importDefault(require("./reservations"));
const resultMessage_1 = __importDefault(require("../constant/resultMessage"));
const userCategories_1 = __importDefault(require("./userCategories"));
let User = class User extends sequelize_typescript_1.Model {
    /*
     * custom method
     */
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findOne({ where: { email } });
            if (!user)
                throw new Error(resultMessage_1.default.NO_USER);
            return user;
        });
    }
    static findOneByRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findOne({ where: { refreshtoken: token } });
            if (!user)
                throw new Error(resultMessage_1.default.NO_USER);
            return user;
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findOne({ where: { id } });
            if (!user)
                throw new Error(resultMessage_1.default.NO_USER);
            return user;
        });
    }
    static findByIdAndResetNickname(id, nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update({
                nickname
            }, {
                where: { id }
            });
            const user = yield this.findOne({ where: { id } });
            if (!user)
                throw new Error(resultMessage_1.default.NO_USER);
            return user;
        });
    }
    static createSocialUser(social, userInfo, request, refreshtoken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.create({
                social,
                email: userInfo.email,
                nickname: userInfo.nickname,
                password: null,
                fcmtoken: request.fcmtoken,
                refreshtoken
            });
            return user;
        });
    }
    static findByEmailOrCreateSocialUser(social, userInfo, request, refreshtoken) {
        return __awaiter(this, void 0, void 0, function* () {
            // 새 객체가 생성되었을 경우 true, 그렇지 않을 경우 false 
            const user = yield this.findOrCreate({
                raw: true,
                where: { email: userInfo.email },
                defaults: {
                    social,
                    email: userInfo.email,
                    nickname: userInfo.nickname,
                    password: null,
                    // fcmtoken: request.fcmtoken,
                    refreshtoken
                }
            });
            if (user[1] === true) { // 회원가입
                user[0].nickname = null;
                return user[0];
            }
            return user[0]; // boolean 값 빼고 반환
        });
    }
    // 기본적으로 delete는 유저 정보 반환 안하므로 custom 해줌 (삭제된 유저 정보 얻기 위해)
    static findAndDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ where: { id } })
                .then((resolve) => __awaiter(this, void 0, void 0, function* () {
                yield this.destroy({ where: { id } });
                return resolve === null || resolve === void 0 ? void 0 : resolve.getDataValue("id");
            }));
        });
    }
    static setNickname(id, nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update({
                nickname,
            }, {
                where: { id }
            });
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(15)),
    __metadata("design:type", String)
], User.prototype, "social", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.IsEmail,
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(40)),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20)),
    __metadata("design:type", Object)
], User.prototype, "nickname", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], User.prototype, "refreshtoken", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], User.prototype, "fcmtoken", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => userCategories_1.default),
    __metadata("design:type", Array)
], User.prototype, "userCategories", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => times_1.default),
    __metadata("design:type", times_1.default)
], User.prototype, "time", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => reservations_1.default),
    __metadata("design:type", Array)
], User.prototype, "reservations", void 0);
User = __decorate([
    (0, sequelize_typescript_1.Table)({
        modelName: "User",
        tableName: "users",
        freezeTableName: true,
        underscored: false,
        paranoid: false,
        timestamps: true,
        charset: "utf8",
        collate: "utf8_general_ci", // 한국어 설정
    })
], User);
exports.default = User;
//# sourceMappingURL=users.js.map