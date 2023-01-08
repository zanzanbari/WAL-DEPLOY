import { 
  AllowNull, 
  AutoIncrement, 
  Column, 
  DataType,
  BelongsTo,
  Model, 
  PrimaryKey, 
  ForeignKey,
  Table, 
  Unique, 
  Default, 
  CreatedAt} from "sequelize-typescript"
import User from "./users";
import sequelize from "../models";
import { ISetReserveDto } from "../dto/request/reserveRequest";

@Table({
  modelName: "Reservation",
  tableName: "reservations",
  freezeTableName: true,
  underscored: false,
  paranoid: false,
  timestamps: false,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})

export default class Reservation extends Model {

  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column(DataType.INTEGER)
  public readonly id!: number;


  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  public userId!: number;


  @AllowNull(false)
  @Column(DataType.TEXT)
  public content!: string;

  @CreatedAt
  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  public reservedAt!: Date;

    
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public hide!: Boolean;


  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public completed!: Boolean;


  @AllowNull(false)
  @Column(DataType.DATE)
  public sendingDate!: Date;


  @BelongsTo(() => User)
  user!: User

  static async getSendingItems(userId: number): Promise<Reservation[]> {
    const reservations = await this.findAll({
      where: {
        userId,
        $and: sequelize.where(sequelize.fn('date', sequelize.col('sendingDate')), '>', new Date())    
      },
      order: [
        ["reservedAt", "DESC"],
        ["sendingDate", "DESC"]
      ] //보낸 날짜 desc정렬
    });
    return reservations;
  };

  static async getCompletedItems(userId: number): Promise<Reservation[]> {
    const reservations = await this.findAll({
      where: {
        userId,
        $and: sequelize.where(sequelize.fn('date', sequelize.col('sendingDate')), '<', new Date())
      },
      order: [["sendingDate", "DESC"]] //받은 날짜 desc정렬
    });
    return reservations;
  };

  static async getReservationByDate(userId: number, date: string): Promise<Reservation|null> {
    const reservation = await this.findOne({
      where: {
        userId,
        $and: sequelize.where(sequelize.fn('date', sequelize.col('sendingDate')), '=', new Date(date))    
      }});
    return reservation;
  };


  static async setReservation(
    userId: number, 
    request: ISetReserveDto
  ): Promise<number> {
    const reservation = await this.create({
      userId,
      sendingDate: new Date(`${request.date} ${request.time}`),
      ...request
    });
    return reservation.id;
  };


  static async getContentById(id: number): Promise<string> {
    const reservation = await this.findOne({ where: { id } });
    const content: string = reservation?.getDataValue("content");
    return content;
  };

  static async getReservationsFromTomorrow(userId: number): Promise<Reservation[]> {
    const reservations = await this.findAll({
      where: {
        userId,
        $and: sequelize.where(sequelize.fn('date', sequelize.col('sendingDate')), '>', new Date())
      },
      attributes: ["sendingDate"]
    });
    return reservations;
  };
 
    
  static async getReservationByPostId(
    userId: number,
    postId: number, 
    completed: boolean
  ): Promise<Reservation | null> {
    const reservation = await this.findOne({ 
      where: { 
        id: postId,
        userId,
        completed
      }
    });
    return reservation;      
  };

  static async deleteReservation(id: number) {
    await this.destroy({ where: { id } });
  };

}