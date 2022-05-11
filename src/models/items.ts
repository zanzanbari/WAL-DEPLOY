import { 
    AllowNull, 
    AutoIncrement, 
    Column, 
    DataType, 
    Model, 
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    Table, 
    Unique } from "sequelize-typescript"
import Category from "./categories";

@Table({
    modelName: "Item",
    tableName: "items",
    freezeTableName: true,
    underscored: false,
    paranoid: false,
    timestamps: false,
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
})

export default class Item extends Model {
    @PrimaryKey
    @AutoIncrement
    @Unique
    @Column(DataType.INTEGER)
    public readonly id!: number;


    @ForeignKey(() => Category)
    @Column(DataType.INTEGER)
    public category_id!: number;


    @AllowNull(false)
    @Column(DataType.TEXT)
    public content!: string;

    @BelongsTo(() => Category)
    category!: Category

    static async getFirstIdEachOfCategory(category_id: number): Promise<number> {
        const item =  await this.findOne({ where: { category_id } });
        return item?.getDataValue("id");
    }

    static async getItemById(id: number): Promise<Item|null> {
        const item =  await this.findOne({ where: { id } });
        return item;
    }
}