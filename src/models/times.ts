import { 
  AllowNull, 
  AutoIncrement, 
  Column, 
  DataType, 
  Default,
  BelongsTo,
  Model, 
  PrimaryKey,
  ForeignKey, 
  Table, 
  Unique } from "sequelize-typescript"
import User from "./users";
import rm from "../constant/resultMessage";
import { ISetTime } from "../dto/request/userRequest";

@Table({
  modelName: "Time",
  tableName: "times",
  freezeTableName: true,
  underscored: false,
  paranoid: false,
  timestamps: false,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})

export default class Time extends Model {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column(DataType.INTEGER)
  public readonly id!: number;


  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  public user_id!: number;


  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  public morning!: boolean;


  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  public afternoon!: boolean;


  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  public night!: boolean;


  @BelongsTo(() => User)
  user!: User

  public static async setTime(id: number, timeInfo: ISetTime): Promise<void> {
    await this.create({
      user_id: id,
      ...timeInfo
    });
  };

  public static async updateTime(user_id: number, timeInfo: ISetTime): Promise<void> {
    await this.update({
      ...timeInfo
    }, {
      where: { user_id }
    });
  };

  public static async findById(user_id: number): Promise<Time> {
    const times = await this.findOne({ 
      where: { user_id },
      attributes: ["morning", "afternoon", "night"]
    });
    if (!times) throw new Error(rm.NULL_VALUE);
    return times["dataValues"];
  };

  public static async getAllUserIds(): Promise<number[]> {
    const isInit = await this.findAll({ attributes: ["user_id"] });
    const isInitUserIds = isInit.map(user => { return user.user_id });
    return isInitUserIds;
  };
  
}