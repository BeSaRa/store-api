import { User } from "../interfaces/user";
import CRUDRepository from "../helpers/CRUDRepository";

export default class UserStore extends CRUDRepository<User, number> {
  table: string = "users";
  primaryKey: string = "id";
  insertable_fields: string[] = ["first_name", "last_name", "password"];
}
