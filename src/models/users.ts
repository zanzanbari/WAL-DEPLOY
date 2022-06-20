import { 
  AllowNull, 
  AutoIncrement, 
  Column, 
  DataType, 
  HasOne,
  HasMany, 
  Model, 
  PrimaryKey, 
  Table, 
  Unique } from "sequelize-typescript"
import Time from "./times";
import Reservation from "./reservations";
import UserCategory from "./userCategories";
import rm from "../constant/resultMessage";
import { TokenDto } from "../dto/request/authRequest";
import { Token, UserInfo } from "../dto/response/authResponse";
import { Op } from "sequelize";

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
  @Unique
  @Column(DataType.STRING(50))
  public email!: string;


  @AllowNull(true)
  @Column(DataType.STRING(20))
  public nickname?: string | null;


  @AllowNull(true)
  @Column(DataType.STRING(100))
  public password?: string;


  @AllowNull(true)
  @Unique
  @Column(DataType.TEXT)
  public refreshtoken?: string;   


  @AllowNull(true)
  @Unique
  @Column(DataType.TEXT)
  public fcmtoken?: string;   

  @HasMany(() => UserCategory)
  userCategories!: UserCategory[];

  @HasOne(() => Time)
  time!: Time

  @HasMany(() => Reservation)
  reservations!: Reservation[];


  /*
   * custom method 
   */
    
  static async findByEmail(email: string): Promise<User> {
    const user = await this.findOne({ where: { email } });
    if (!user) throw new Error(rm.NO_USER);
    return user;
  };


  static async findOneByRefreshToken(token: string): Promise<User> {
    const user = await this.findOne({ where: { refreshtoken: token } });
    if (!user) throw new Error(rm.NO_USER);
    return user;
  };

  
  static async findById(id: number): Promise<User> {
    const user = await this.findOne({ where: { id } });        
    if (!user) throw new Error(rm.NO_USER);
    return user;
  }


  static async findByIdAndResetNickname(id: number, nickname: string): Promise<User> {
    await this.update({
      nickname
    }, {
      where: { id }
    });
    const user =  await this.findOne({ where: { id } });
    if (!user) throw new Error(rm.NO_USER);
    return user;
  };

  static async createSocialUser(
    social: string, 
    userInfo: UserInfo, 
    request: TokenDto, 
    refreshtoken: Token
  ): Promise<User> {
    return await this.create({
      social,
      email: userInfo.email,
      nickname: userInfo.nickname,
      password: null,
      fcmtoken: request.fcmtoken,
      refreshtoken
    });
  };

  static async findByEmailOrCreateSocialUser(
    social: string,
    userInfo: UserInfo,
    request: TokenDto, 
    refreshtoken: Token
  ): Promise<User> { 
    // 새 객체가 생성되었을 경우 true, 그렇지 않을 경우 false 
    const user = await this.findOrCreate({
      raw: true,
      where: { email: userInfo.email },
      defaults: {
        social,
        email: userInfo.email,
        nickname: userInfo.nickname,
        password: null,
        // fcmtoken: request.fcmtoken,
        refreshtoken
      }
    });

    if (user[1] === true) { // 회원가입
      user[0].nickname = null;
      return user[0];
    }

    return user[0]; // boolean 값 빼고 반환
  };

  // 기본적으로 delete는 유저 정보 반환 안하므로 custom 해줌 (삭제된 유저 정보 얻기 위해)
  static async findAndDelete(id: number): Promise<User> {
    return await this.findOne({ where: { id } })
      .then(async resolve => {
        await this.destroy({ where: { id } });
        return resolve?.getDataValue("id");
      });
  };


  static async setNickname(id: number, nickname: string): Promise<void> {
    await this.update({
      nickname,
    }, {
      where: { id }
    });
  };


  static async getFCMToken(id: number): Promise<String | undefined> {
    const user = await this.findOne({
      where: { id },
      attributes: ["fcmtoken"]
    });
    return user?.fcmtoken;
  };


  static async getUserTimeReserveInfo(userIds: number[]): Promise<User[]> {
    const usersInfo = await this.findAll({
      where: { id: { [Op.in]: userIds } },
      include: [
        { model: Time, attributes: ["morning", "afternoon", "night"]}, 
        { model: Reservation, attributes: ["id", "sendingDate"] }
      ],
      attributes: ["id"]
    });
    if (!usersInfo) throw new Error(rm.NO_USER);
    return usersInfo;
  };

}