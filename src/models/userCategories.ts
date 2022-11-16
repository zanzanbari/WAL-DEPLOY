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
  public readonly id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  public userId!: number;

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  public categoryId!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  public nextItemId!: number;

  @BelongsTo(() => Category)
  comment!: Category;

  @BelongsTo(() => User)
  user!: User;

  
  static async setUserCategory(request: ISetUserCategory): Promise<void> {
    await this.create({ ...request });
  };


  static async deleteUserCategory(userId: number, categoryId: number) {
    await this.destroy({
      where: {
        userId,
        categoryId
      }
    });
  };


  static async findNextItemId(userId: number, categoryId: number) {
    return await this.findOne({
      where: { userId, categoryId },
      attributes: ["nextItemId"]
    });
  };


  static async findCategoryByUserId(userId: number): Promise<string[]> {
    const isCategories =  await this.findAll({
      where: { userId },
      attributes: ["categoryId"],
      include: [{ model: Category, attributes: ["dtype"] }],
      order: [[Category, 'id', 'ASC']] //DTYPE(STR)만 JOIN했기 때문에 순서 잘못된 걸로 추정
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


  static async getUserCategoryByUserId(userId: number): Promise<UserCategory[]> {
    const categories = await this.findAll({ 
      where: { userId },
      attributes: ["categoryId", "nextItemId"]
    });
    return categories;
  };


  static async updateNext(
    userId: number, 
    categoryId: number, 
    nextItemId: number
  ): Promise<void> {

    await this.update({
      nextItemId
    }, {
      where: {
        userId,
        categoryId
      }
    });

  };

}