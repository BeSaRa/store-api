import { User } from "../interfaces/user";
import CRUDRepository from "../helpers/CRUDRepository";
import bcrypt from "bcrypt";
import { LoginInfo } from "../interfaces/login-info";
import jwt from "jsonwebtoken";

const { PASSWORD_PEPPER, SALT_ROUNDS, SECRET_TOKEN_KEY } = process.env;
export default class UserStore extends CRUDRepository<User, number> {
  protected table: string = "users";
  protected primaryKey: string = "id";
  protected insertable_fields: string[] = [
    "username",
    "first_name",
    "last_name",
    "password",
  ];

  async create(model: Partial<User>): Promise<User> {
    const hash = bcrypt.hashSync(
      model.password! + PASSWORD_PEPPER,
      parseInt(SALT_ROUNDS!)
    );
    return super.create({ ...model, password: hash });
  }

  async authenticate(
    username: string,
    password: string
  ): Promise<LoginInfo | null> {
    await this.open();
    const result = await this.conn.query<User>(
      `SELECT * FROM users WHERE username=$1`,
      [username]
    );

    if (
      result.rowCount &&
      bcrypt.compareSync(password + PASSWORD_PEPPER, result.rows[0].password)
    ) {
      const user = result.rows[0];
      return {
        ...user,
        token: jwt.sign(user, SECRET_TOKEN_KEY || ""),
      };
    }
    return null;
  }
}
