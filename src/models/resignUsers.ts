import { 
  AllowNull, 
  AutoIncrement, 
  Column, 
  DataType, 
  Model, 
  PrimaryKey, 
  Table, 
  Unique } from "sequelize-typescript"

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

  /*
   * custom method 
   */
  static async save(userId: number, reasonsForResign: string[]) {
    await this.create({ userId, reasonsForResign });
  }


}