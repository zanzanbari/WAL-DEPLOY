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
  Unique, 
  Default } from "sequelize-typescript"
import User from "./users";
import Item from "./items";
import Reservation from "./reservations";
import { ISetTodayWal } from "../dto/request/userRequest";
import Category from "./categories";

@Table({ // 테이블 설정
  modelName: "TodayWal",
  tableName: "todayWals",
  freezeTableName: true,
  underscored: false,
  paranoid: false,
  timestamps: false,
  charset: "utf8", 
  collate: "utf8_general_ci", 
})

export default class TodayWal extends Model {

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
  public categoryId!: number

  @ForeignKey(() => Item)
  @Column(DataType.INTEGER)
  public itemId!: number;

  @ForeignKey(() => Reservation)
  @Column(DataType.INTEGER)
  public reservationId!: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public userDefined!: Boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public isShown!: Boolean;

  @AllowNull(false)
  @Column(DataType.DATE)
  public time!: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Item)
  item!: Item;

  @BelongsTo(() => Category)
  category!: Category;

  @BelongsTo(() => Reservation)
  reservation!: Reservation;

  static async setTodayWal(data: ISetTodayWal) {
    await this.create({ ...data });
  };

  static async getTodayWalsByUserId(id: number): Promise<TodayWal[]> {
    const todayWals = await this.findAll({
      where: {
        userId: id,
      },
      order: [
        ["time", "ASC"]
      ]
    });
    return todayWals;
  };

  static async getTodayReservation(userId: number, reservationId: number) {
    return await this.findOne({
      where: { 
        userId, 
        reservationId,
        userDefined: true
      }
    });
  };
    
  static async deleteTodayWal(userId: number, time?: Date, categoryId?: number) {
    await this.destroy({ where: { userId, time, categoryId } });
  };

  static async deleteAll() {
    await this.destroy({
      where: {},
      truncate: true
    });
  };


  static async getFcmByUserId(userId: number, time?: Date): Promise<{
    fcmtoken: string;
    itemId: number;
  } | {
    fcmtoken: string;
    reservationId: number;
  }> {
    
    if (time) {

      const wal = await this.findOne({
        where: { userId, time },
        include: [
          { model: User, attributes: ["fcmtoken"] }
        ]
      });

      return {
        fcmtoken: wal?.getDataValue("user").getDataValue("fcmtoken") as string,
        itemId: wal?.getDataValue("itemId") as number
      };

    } else {

      const wal = await this.findOne({
        where: {
          userId,
          userDefined: true
        },
        include: [
          { model: User, attributes: ["fcmtoken"] }
        ]
      });

      return { 
        fcmtoken: wal?.getDataValue("user").getDataValue("fcmtoken") as string,
        reservationId: wal?.getDataValue("reservationId") as number
      };
      
    }

  };


  static async updateShown(userId: number, mainId: number): Promise<TodayWal[]> {
    await this.update({
      isShown: true
      },{
      where: {
        id: mainId,
        userId
      }
    });

    return await this.getTodayWalsByUserId(userId);
  };
}