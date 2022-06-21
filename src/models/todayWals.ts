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
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id!: number;

  @ForeignKey(() => Item)
  @Column(DataType.INTEGER)
  item_id!: number;

  @ForeignKey(() => Reservation)
  @Column(DataType.INTEGER)
  reservation_id!: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public userDefined!: Boolean;

  @AllowNull(false)
  @Column(DataType.DATE)
  public time!: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Item)
  item!: Item;

  @BelongsTo(() => Reservation)
  reservation!: Reservation;

  static async setTodayWal(data: ISetTodayWal) {
    await this.create({ ...data });
  };

  static async getTodayWalsByUserId(id: number): Promise<TodayWal[]> {
    const todayWals = await this.findAll({
      where: {
        user_id: id,
      },
      order: [
        ["time", "ASC"]
      ]
    });
    return todayWals;
  };

  static async getTodayReservation(user_id: number, reservation_id: number) {
    return await this.findOne({
      where: { 
        user_id, 
        reservation_id,
        userDefined: true
      }
    });
  };
    
  static async deleteTodayWal(user_id: number, time?: Date) {
    await this.destroy({ where: { user_id, time } });
  };

  static async deleteAll() {
    await this.destroy({
      where: {},
      truncate: true
    });
  };


  static async getFcmByUserId(user_id: number, time?: Date): Promise<{
    fcmtoken: string;
    itemId: number;
  } | {
    fcmtoken: string;
    reservationId: number;
  }> {
    
    if (time) {

      const wal = await this.findOne({
        where: { user_id, time },
        include: [
          { model: User, attributes: ["fcmtoken"] }
        ]
      });

      return {
        fcmtoken: wal?.getDataValue("user").getDataValue("fcmtoken") as string,
        itemId: wal?.getDataValue("item_id") as number
      };

    } else {

      const wal = await this.findOne({
        where: {
          user_id,
          userDefined: true
        },
        include: [
          { model: User, attributes: ["fcmtoken"] }
        ]
      });

      return { 
        fcmtoken: wal?.getDataValue("user").getDataValue("fcmtoken") as string,
        reservationId: wal?.getDataValue("reservation_id") as number
      };
      
    }

  };

}