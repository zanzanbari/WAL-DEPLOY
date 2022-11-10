import { 
  AllowNull, 
  AutoIncrement, 
  Column, 
  DataType, 
  Model, 
  PrimaryKey, 
  Table, 
  Unique } from "sequelize-typescript"
import sequelize from "../models";

@Table({
  modelName: "ResignUser",
  tableName: "resignUsers",
  freezeTableName: true,
  underscored: false,
  paranoid: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})

export default class ResignUser extends Model {

  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column(DataType.INTEGER)
  public readonly id!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  public userId!: number; 

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.STRING))
  public reasonsForResign?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public email!: string;

  /*
   * custom method 
   */
  static async save(userId: number, reasonsForResign: string[], email: string) {
    await this.create({ userId, reasonsForResign, email });
  }

  static async existsInaDayByEmail(email: string): Promise<Boolean> {
    const now = new Date();
    const user = await this.findOne({ where: { 
      email,
      $and: sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), '>=', new Date(now.setDate(now.getDate() - 1)))
    } });
    if (user) return true;
    else return false;
  };

}