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
const categories_1 = __importDefault(require("./categories"));
let Item = class Item extends sequelize_typescript_1.Model {
    static getFirstIdEachOfCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.findOne({ where: { categoryId } });
            return item === null || item === void 0 ? void 0 : item.getDataValue("id");
        });
    }
    ;
    static getItemById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ where: { id } });
        });
    }
    ;
    static getContentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.findOne({ where: { id } });
            const content = item === null || item === void 0 ? void 0 : item.getDataValue("content");
            const categoryId = item === null || item === void 0 ? void 0 : item.getDataValue("categoryId");
            return { content, categoryId };
        });
    }
    ;
    static getAllItemsByCategoryId(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findAll({ where: { categoryId } });
        });
    }
    ;
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Item.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => categories_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Item.prototype, "categoryId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Item.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => categories_1.default),
    __metadata("design:type", categories_1.default)
], Item.prototype, "category", void 0);
Item = __decorate([
    (0, sequelize_typescript_1.Table)({
        modelName: "Item",
        tableName: "items",
        freezeTableName: true,
        underscored: false,
        paranoid: false,
        timestamps: false,
        charset: "utf8",
        collate: "utf8_general_ci", // 한국어 설정
    })
], Item);
exports.default = Item;
//# sourceMappingURL=items.js.map