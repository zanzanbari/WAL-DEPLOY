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
    Default} from "sequelize-typescript"
import User from "./users";
import rm from "../constant/resultMessage";
import sequelize from "../models";
import { Op } from "sequelize";

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
    public user_id!: number;


    @AllowNull(false)
    @Column(DataType.TEXT)
    public content!: string;


    @AllowNull(false)
    @Default(Date.now())
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

    static async getSendingItems(id: number): Promise<Reservation[]> {
        const reservations = await this.findAll({
            where: {
                user_id: id,
                completed: false
            },
            order: [
                ["reservedAt", "DESC"],
                ["sendingDate", "DESC"]
            ] //보낸 날짜 desc정렬
        })
        return reservations;
    }

    static async getCompletedItems(id: number): Promise<Reservation[]> {
        const reservations = await this.findAll({
            where: {
                user_id: id,
                completed: true
            },
            order: [["sendingDate", "DESC"]] //받은 날짜 desc정렬
        })
        return reservations;
    }

    static async getReservationByDate(id: number, date: string): Promise<Reservation|null> {
        const reservation = await this.findOne({
            where: {
                user_id: id,
                $and: sequelize.where(sequelize.fn('date', sequelize.col('sendingDate')), '=', new Date(date))
            
        }});
  
        return reservation;
    }


    static async postReservation(
        id: number, 
        date: string, 
        time: string, 
        hide: boolean, 
        content: string
        ): Promise<number> {

        const reservation = await this.create({
            user_id: id,
            sendingDate: new Date(`${date} ${time}`),
            hide,
            content
        });

        return reservation.id;
    }

    static async getReservationById(id: number): Promise<Reservation|null> {

        const reservation = await this.findOne({ 
            where: { 
                id
            }
        });

        return reservation;
        
    }

    static async getReservationsFromTomorrow(id: number): Promise<Reservation[]> {

        const reservations = await this.findAll({
            where: {
                user_id: id,
                $and: sequelize.where(sequelize.fn('date', sequelize.col('sendingDate')), '>', new Date())
            },
            attributes: ["sendingDate"]
        })

        return reservations;
    }
 
    
    static async getReservationByPostId(postId: number, id: number, completed: boolean): Promise<Reservation|null> {

        const reservation = await this.findOne({ 
            where: { 
                id: postId,
                user_id: id,
                completed
            }
        });

        return reservation;
        
    }
}