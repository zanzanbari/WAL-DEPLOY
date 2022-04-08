import { 
    AllowNull, 
    AutoIncrement, 
    Column, 
    DataType, 
    Default,
    HasOne,
    HasMany, 
    IsEmail, 
    Model, 
    PrimaryKey, 
    Table, 
    Unique } from "sequelize-typescript"
import Message from "./messages";
import Time from "./times";
import Reservation from "./reservations";

@Table({
    modelName: "User",
    tableName: "users",
    freezeTableName: true,
    underscored: false,
    paranoid: false,
    timestamps: true,
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
})

export default class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Unique
    @Column(DataType.INTEGER)
    public readonly id!: number;


    @AllowNull(false)
    @Column(DataType.STRING(15))
    public social!: string;


    @AllowNull(false)
    @IsEmail
    @Unique
    @Column(DataType.STRING(40))
    public email!: string;


    @AllowNull(true)
    @Column(DataType.STRING(20))
    public nickname?: string;


    @AllowNull(false)
    @Column(DataType.STRING(100))
    public password!: string;


    @AllowNull(true)
    @Unique
    @Column(DataType.TEXT)
    public refreshtoken?: string;   


    @AllowNull(true)
    @Unique
    @Column(DataType.TEXT)
    public fcmtoken?: string;   


    @HasMany(() => Message)
    messages!: Message[];

    @HasOne(() => Time)
    time!: Time

    @HasMany(() => Reservation)
    reservations!: Reservation[];

}