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
    Default} from "sequelize-typescript"
import User from "./users";
import Item from "./items";
import Reservation from "./reservations";
import { ISetTodayWal } from "../interface/dto/request/userRequest";

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
    }


    static async getTodayWalsByUserId(id: number): Promise<TodayWal[]> {
        const todayWals = await this.findAll({
            where: {
                user_id: id,
            },
            order: [
                ["time", "ASC"]
            ]
        })
        return todayWals;
    }
    
    static async deleteTodayWal(user_id: number, time?: Date) {
        await this.destroy({ where: { user_id, time } });
    }

}