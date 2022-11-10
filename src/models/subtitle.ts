import { 
    Model, 
    Table,
    PrimaryKey,
    Unique,
    Column,
    DataType,
    AutoIncrement,
    AllowNull
 } from "sequelize-typescript";

@Table({
    modelName: "Subtitle",
    tableName: "subtitle",
    freezeTableName: true,
    underscored: false,
    paranoid: false,
    timestamps: false,
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
})

export default class Subtitle extends Model {

  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column(DataType.INTEGER)
  public readonly id!: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  public content!: string;

  static async getAllLength() : Promise<number> {
    return (await this.findAll()).length;
  };


  static async getContentById(id: number)
  : Promise<string> {
      const subtitle =  await this.findOne({ where: { id } });
      const content: string = subtitle?.getDataValue("content");
      return content;
  };

}