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
const users_1 = __importDefault(require("./users"));
const items_1 = __importDefault(require("./items"));
const reservations_1 = __importDefault(require("./reservations"));
const categories_1 = __importDefault(require("./categories"));
let TodayWal = class TodayWal extends sequelize_typescript_1.Model {
    static setTodayWal(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.create(Object.assign({}, data));
        });
    }
    ;
    static getTodayWalsByUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const todayWals = yield this.findAll({
                where: {
                    userId: id,
                },
                order: [
                    ["time", "ASC"]
                ]
            });
            return todayWals;
        });
    }
    ;
    static getTodayReservation(userId, reservationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({
                where: {
                    userId,
                    reservationId,
                    userDefined: true
                }
            });
        });
    }
    ;
    static deleteTodayWal(userId, time, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.destroy({ where: { userId, time, categoryId } });
        });
    }
    ;
    static deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.destroy({
                where: {},
                truncate: true
            });
        });
    }
    ;
    static getFcmByUserId(userId, time) {
        return __awaiter(this, void 0, void 0, function* () {
            if (time) {
                const wal = yield this.findOne({
                    where: { userId, time },
                    include: [
                        { model: users_1.default, attributes: ["fcmtoken"] }
                    ]
                });
                return {
                    fcmtoken: wal === null || wal === void 0 ? void 0 : wal.getDataValue("user").getDataValue("fcmtoken"),
                    itemId: wal === null || wal === void 0 ? void 0 : wal.getDataValue("itemId")
                };
            }
            else {
                const wal = yield this.findOne({
                    where: {
                        userId,
                        userDefined: true
                    },
                    include: [
                        { model: users_1.default, attributes: ["fcmtoken"] }
                    ]
                });
                return {
                    fcmtoken: wal === null || wal === void 0 ? void 0 : wal.getDataValue("user").getDataValue("fcmtoken"),
                    reservationId: wal === null || wal === void 0 ? void 0 : wal.getDataValue("reservationId")
                };
            }
        });
    }
    ;
    static updateShown(userId, mainId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update({
                isShown: true
            }, {
                where: {
                    id: mainId,
                    userId
                }
            });
            return yield this.getTodayWalsByUserId(userId);
        });
    }
    ;
    static findByTimeAndUserId(time, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({
                where: { userId, time }
            });
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Unique,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], TodayWal.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => users_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], TodayWal.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => categories_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], TodayWal.prototype, "categoryId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => items_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], TodayWal.prototype, "itemId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => reservations_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], TodayWal.prototype, "reservationId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], TodayWal.prototype, "userDefined", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], TodayWal.prototype, "isShown", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], TodayWal.prototype, "time", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => users_1.default),
    __metadata("design:type", users_1.default)
], TodayWal.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => items_1.default),
    __metadata("design:type", items_1.default)
], TodayWal.prototype, "item", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => categories_1.default),
    __metadata("design:type", categories_1.default)
], TodayWal.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => reservations_1.default),
    __metadata("design:type", reservations_1.default)
], TodayWal.prototype, "reservation", void 0);
TodayWal = __decorate([
    (0, sequelize_typescript_1.Table)({
        modelName: "TodayWal",
        tableName: "todayWals",
        freezeTableName: true,
        underscored: false,
        paranoid: false,
        timestamps: false,
        charset: "utf8",
        collate: "utf8_general_ci",
    })
], TodayWal);
exports.default = TodayWal;
//# sourceMappingURL=todayWals.js.map