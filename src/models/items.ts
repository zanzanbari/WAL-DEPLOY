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
  public categoryId!: number;


  @AllowNull(false)
  @Column(DataType.TEXT)
  public content!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  public voice?: string;

  @BelongsTo(() => Category)
  category!: Category

  static async getFirstIdEachOfCategory(categoryId: number): Promise<number> {
    const item =  await this.findOne({ where: { categoryId } });
    return item?.getDataValue("id");
  };

  static async getItemById(id: number): Promise<Item|null> {
    return await this.findOne({ where: { id } });
  };

  static async getContentById(id: number)
  : Promise<{ 
      content: string; 
      categoryId: number; 
      voice: string | null;
  }> {
      const item =  await this.findOne({ where: { id } });
      const content: string = item?.getDataValue("content");
      const categoryId: number = item?.getDataValue("categoryId");
      const voice: string = item?.getDataValue("voice");
      return { content, categoryId, voice };
  };

  static async getAllItemsByCategoryId(categoryId: number) {
    return await this.findAll({ where: { categoryId } });
  };
}