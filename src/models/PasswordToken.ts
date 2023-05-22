import knex from "../database/connection";
import User from "./User";

class PasswordToken {
  async create(email: string) {
    const user = await User.findByEmail(email);

    if (user != undefined) {
      try {
        const token = Date.now();

        await knex
          .insert({
            user_id: user.id,
            used: 0,
            token, //Sugestão de uso UUID
          })
          .table("passwordtokens");

        return {
          status: true,
          token,
        };
      } catch (err) {
        console.log(err);
        return {
          status: false,
          err,
        };
      }
    } else {
      return {
        status: false,
        err: "O e-mail passado não existe no banco de dados",
      };
    }
  }

  async validate(token: string) {
    // Método para validar se um token existe ou se já foi utilizado
    try {
      const result = await knex
        .select()
        .where({ token })
        .table("passwordtokens");

      if (result.length > 0) {
        const tkn = result[0];

        if (tkn.used) {
          return { status: false };
        } else {
          return { status: true, token: tkn };
        }
      } else {
        return { status: false };
      }
    } catch (err) {
      console.log(err);
      return { status: false };
    }
  }

  async setUsed(token: string) {
    await knex.update({ used: 1 }).where({ token }).table("passwordtokens");
  }
}

export default new PasswordToken();
