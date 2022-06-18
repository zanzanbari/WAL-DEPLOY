import { ISetTime } from "../request/userRequest";
import { UserInfo } from "./authResponse";

export interface UserSettingResponse {
  nickname?: string
}

export interface UserInfoResponse extends UserInfo {
  readonly times?: ISetTime,
  readonly categories?: number[]
}