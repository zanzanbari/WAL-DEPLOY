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
  public userId!: number;


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

  public static async setTime(userId: number, timeInfo: ISetTime): Promise<void> {
    await this.create({
      userId,
      ...timeInfo
    });
  };

  public static async updateTime(userId: number, timeInfo: ISetTime): Promise<void> {
    await this.update({
      ...timeInfo
    }, {
      where: { userId }
    });
  };

  public static async findById(userId: number): Promise<Time> {
    const times = await this.findOne({ 
      where: { userId },
      attributes: ["morning", "afternoon", "night"]
    });
    if (!times) throw new Error(rm.NULL_VALUE);
    return times["dataValues"];
  };

  public static async getAllUserIds(): Promise<number[]> {
    const isInit = await this.findAll({ attributes: ["userId"] });
    const isInitUserIds = isInit.map(user => { return user.userId });
    return isInitUserIds;
  };
  
}