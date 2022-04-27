import { UserSetTime } from "../request/userRequest";
import { UserInfo } from "./authResponse";

export interface UserSettingResponse {
  nickname?: string
}

export interface UserInfoResponse extends UserInfo {
  readonly times?: UserSetTime,
  readonly categories?: number[]
}