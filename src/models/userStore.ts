import { User } from "../interfaces/user";
import CRUDRepository from "../helpers/CRUDRepository";

export default class UserStore extends CRUDRepository<User, number> {
  protected table: string = "users";
  protected primaryKey: string = "id";
  protected insertable_fields: string[] = [
    "first_name",
    "last_name",
    "password",
  ];
}
