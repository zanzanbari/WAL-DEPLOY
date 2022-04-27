import { UserSetTime } from "@/interface/dto/request/userRequest";
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

    public static async setTime(id: number, timeInfo: UserSetTime) {
        await this.create({
            user_id: id,
            ...timeInfo
        });
    }
}