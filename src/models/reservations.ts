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
    @Column(DataType.DATE)
    public reservedAt!: Date;


    @BelongsTo(() => User)
    user!: User

}