import { User } from "./user";

export interface LoginInfo extends User {
  token: string;
}
