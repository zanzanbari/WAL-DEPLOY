import { 
    Model, 
    Table,
    PrimaryKey,
    Unique,
    Column,
    DataType,
    AutoIncrement,
    ForeignKey
 } from "sequelize-typescript";
import Subtitle from "./subtitle";

@Table({
    modelName: "TodaySubtitle",
    tableName: "todaySubtitle",
    freezeTableName: true,
    underscored: false,
    paranoid: false,
    timestamps: false,
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
})

export default class TodaySubtitle extends Model {

  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column(DataType.INTEGER)
  public readonly id!: number;

  @ForeignKey(() => Subtitle)
  @Column(DataType.INTEGER)
  public subtitleId!: number;


  static async getTodaySubtitle() //어차피 1로만 조회할 것
  : Promise<number> {
      const todaySubtitle =  await this.findOne({ where: { id : 1 } });
      const subtitleId: number = todaySubtitle?.getDataValue("subtitleId");
      return subtitleId;
  };

  static async updateTodaySubtitle(subtitleId: number) {
    await this.update({
        subtitleId
      },{
      where: {
        id: 1
      }
    });
  };
}