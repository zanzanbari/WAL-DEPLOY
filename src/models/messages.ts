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
import Category from "./categories";

@Table({
    modelName: "Message",
    tableName: "messages",
    freezeTableName: true,
    underscored: false,
    paranoid: false,
    timestamps: true,
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
})

export default class Message extends Model {
    @PrimaryKey
    @AutoIncrement
    @Unique
    @Column(DataType.INTEGER)
    public readonly id!: number;


    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    public user_id!: number;

    
    @ForeignKey(() => Category)
    @Column(DataType.INTEGER)
    public category_id!: number;


    @Default(1)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    public idx!: number;


    @BelongsTo(() => User)
    user!: User

    @BelongsTo(() => Category)
    category!: Category

    
}