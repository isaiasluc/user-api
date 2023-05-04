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

  async findAll() {
    try {
      const result = await knex
        .select(["id", "email", "name", "role"])
        .table("users");
      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async findById(id: string) {
    try {
      const result = await knex
        .select(["id", "email", "name", "role"])
        .where({ id })
        .table("users");

      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async update(id: string, email: string, name: string, role: number) {
    const user = await this.findById(id);
    let editUser = {
      email,
      name,
      role,
    };

    if (user != undefined) {
      if (email != user.email) {
        const result = await this.findEmail(email);

        if (!result) {
          editUser.email = email;
        } else {
          return { status: false, err: "O e-mail já está cadastrado" };
        }
      }

      if (name != undefined) {
        editUser.name = name;
      }

      if (role != undefined) {
        editUser.role = role;
      }

      try {
        await knex.update(editUser).where({ id }).table("users");
        return { status: true };
      } catch (err) {
        return { status: false, err };
      }
    } else {
      return { status: false, err: "O usuário não existe" };
    }
  }

  async delete(id: string) {
    const user = await this.findById(id);

    if (user != undefined) {
      try {
        await knex.del().where({ id }).table("users");
        return { status: true };
      } catch (err) {
        return { status: false, err };
      }
    } else {
      return { status: false, err: "O usuário não existe" };
    }
  }
}

export default new User();
