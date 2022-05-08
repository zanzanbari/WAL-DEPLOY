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
const models_1 = __importDefault(require("../models"));
let Reservation = class Reservation extends sequelize_typescript_1.Model {
    static getSendingItems(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservations = yield this.findAll({
                where: {
                    user_id: id,
                    completed: false
                },
                order: [
                    ["reservedAt", "DESC"],
                    ["sendingDate", "DESC"]
                ] //보낸 날짜 desc정렬
            });
            return reservations;
        });
    }
    static getCompletedItems(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservations = yield this.findAll({
                where: {
                    user_id: id,
                    completed: true
                },
                order: [["sendingDate", "DESC"]] //받은 날짜 desc정렬
            });
            return reservations;
        });
    }
    static getReservationByDate(id, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservation = yield this.findOne({
                where: {
                    user_id: id,
                    $and: models_1.default.where(models_1.default.fn('date', models_1.default.col('sendingDate')), '=', new Date(date))
                }
            });
            return reservation;
        });
    }
    static postReservation(id, date, time, hide, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservation = yield this.create({
                user_id: id,
                sendingDate: new Date(`${date} ${time}`),
                hide,
                content
            });
            return reservation.id;
        });
    }
    static getReservationsFromTomorrow(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservations = yield this.findAll({
                where: {
                    user_id: id,
                    $and: models_1.default.where(models_1.default.fn('date', models_1.default.col('sendingDate')), '>', new Date())
                },
                attributes: ["sendingDate"]
            });
            return reservations;
        });
    }
    static getReservationByPostId(postId, id, completed) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservation = yield this.findOne({
                where: {
                    id: postId,
                    user_id: id,
                    completed
                }
            });
            return reservation;
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Reservation.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => users_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Reservation.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Reservation.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(Date.now()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Reservation.prototype, "reservedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Reservation.prototype, "hide", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Reservation.prototype, "completed", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Reservation.prototype, "sendingDate", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => users_1.default),
    __metadata("design:type", users_1.default)
], Reservation.prototype, "user", void 0);
Reservation = __decorate([
    (0, sequelize_typescript_1.Table)({
        modelName: "Reservation",
        tableName: "reservations",
        freezeTableName: true,
        underscored: false,
        paranoid: false,
        timestamps: false,
        charset: "utf8",
        collate: "utf8_general_ci", // 한국어 설정
    })
], Reservation);
exports.default = Reservation;
//# sourceMappingURL=reservations.js.map