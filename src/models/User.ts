import knex from "../database/connection";
import bcrypt from "bcrypt";
const saltRounds = 10;

class User {
  async createUser(email: string, password: string, name: string) {
    try {
      const hash = await bcrypt.hash(password, saltRounds);

      await knex
        .insert({ email, password: hash, name, role: 0 })
        .table("users");
    } catch (err) {
      console.log(err);
    }
  }

  async findEmail(email: string) {
    try {
      const result = await knex.select("*").from("users").where({ email });
      
      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

export default new User();
