import { 
    AllowNull, 
    AutoIncrement, 
    Column, 
    DataType, 
    Model, 
    PrimaryKey,
    Table, 
    Unique } from "sequelize-typescript"

@Table({
    modelName: "Drip",
    tableName: "drips",
    freezeTableName: true,
    underscored: false,
    paranoid: false,
    timestamps: false,
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
})

export default class Drip extends Model {
    @PrimaryKey
    @AutoIncrement
    @Unique
    @Column(DataType.INTEGER)
    public readonly id!: number;


    @AllowNull(false)
    @Column(DataType.TEXT)
    public content!: string;


    @AllowNull(true)
    @Column(DataType.TEXT)
    public voice!: string;


}