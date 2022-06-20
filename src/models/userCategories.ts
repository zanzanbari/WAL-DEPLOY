import { 
  AutoIncrement, 
  BelongsTo, 
  Column, 
  DataType, 
  AllowNull,
  ForeignKey, 
  Model, 
  PrimaryKey, 
  Table, 
  Unique } from "sequelize-typescript"
import Category from "./categories";
import User from "./users";
import rm from "../constant/resultMessage";
import { ISetUserCategory } from "../dto/request/userRequest";

@Table({ // 테이블 설정
  modelName: "UserCategory",
  tableName: "userCategories",
  freezeTableName: true,
  underscored: false,
  paranoid: false,
  timestamps: false,
  charset: "utf8", 
  collate: "utf8_general_ci", 
})

export default class UserCategory extends Model { 
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id!: number;

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  category_id!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  next_item_id!: number;

  @BelongsTo(() => Category)
  comment!: Category;

  @BelongsTo(() => User)
  user!: User;

  
  static async setUserCategory(request: ISetUserCategory): Promise<void> {
    await this.create({ ...request });
  };


  static async deleteUserCategory(user_id: number, category_id: number) {
    await this.destroy({
      where: {
        user_id,
        category_id
      }
    });
  };


  static async findCategoryByUserId(user_id: number): Promise<string[]> {
    const isCategories =  await this.findAll({
      where: { user_id },
      attributes: ["category_id"],
      include: [{ model: Category, attributes: ["dtype"] }]
    });
    if (!isCategories) throw new Error(rm.DB_ERROR);

    const categories: string[] = [];
    isCategories.forEach(it => {

      const item = it
        .getDataValue("comment")
        .getDataValue("dtype") as string;

      categories.push(item);

    });

    return categories;

  };


  static async getUserCategoryByUserId(user_id: number): Promise<UserCategory[]> {
    const categories = await this.findAll({ 
      where: { user_id },
      attributes: ["category_id", "next_item_id"]
    });
    return categories;
  };


  static async updateNext(
    user_id: number, 
    category_id: number, 
    next_item_id: number
  ): Promise<void> {

    await this.update({
      next_item_id
    }, {
      where: {
        user_id,
        category_id
      }
    });

  };

}