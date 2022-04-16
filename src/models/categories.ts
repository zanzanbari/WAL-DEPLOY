import { 
    AllowNull, 
    AutoIncrement, 
    Column, 
    DataType, 
    HasMany,
    Model, 
    PrimaryKey, 
    Table, 
    Unique } from "sequelize-typescript"
import Item from "./items";
import UserCategory from "./userCategories";


@Table({
    modelName: "Category",
    tableName: "categories",
    freezeTableName: true,
    underscored: false,
    paranoid: false,
    timestamps: false,
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
})

export default class Category extends Model {
    @PrimaryKey
    @AutoIncrement
    @Unique
    @Column(DataType.INTEGER)
    public readonly id!: number;


    @AllowNull(false)
    @Column(DataType.STRING(15))
    public dtype!: string;


    @HasMany(() => UserCategory)
    userCategories!: UserCategory[];

    @HasMany(() => Item)
    items!: Item[];


}