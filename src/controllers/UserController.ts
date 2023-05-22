import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";
import PasswordToken from "../models/PasswordToken";

const secret = "1fKncK3D#$%kcmdkJ!ds";

class UserController {
  async index(req: Request, res: Response) {
    const users = await User.findAll();
    res.json(users);
  }

  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (email == undefined) {
      res.status(400); //Requisição inválida
      res.json({ err: "E-mail inválido" });
      return;
    }

    const emailExists = await User.findEmail(email);

    if (emailExists) {
      res.status(406);
      res.json({ err: "O e-mail já está em uso" });
      return;
    } else {
      await User.createUser(email, password, name);
      res.status(200);
      res.send("Success!");
    }
  }

  async indexById(req: Request, res: Response) {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user == undefined) {
      res.status(404);
      res.json({});
    } else {
      res.status(200);
      res.json(user);
    }
  }

  async edit(req: Request, res: Response) {
    const { id, name, role, email } = req.body;

    const result = await User.update(id, email, name, role);

    if (result != undefined) {
      if (result.status) {
        res.status(200);
        res.send("Updated");
      } else {
        res.status(406);
        res.send(result.err);
      }
    } else {
      res.status(406);
      res.send("Ocorreu um erro no servidor");
    }
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;

    const result = await User.delete(id);

    if (result != undefined) {
      if (result.status) {
        res.status(200);
        res.send("Deleted");
      } else {
        res.status(406);
        res.send(result.err);
      }
    } else {
      res.status(406);
      res.send("Ocorreu um erro no servidor");
    }
  }

  async recoverPassword(req: Request, res: Response) {
    const { email } = req.body;

    const result = await PasswordToken.create(email);

    if (result.status) {
      console.log(result.token);
      res.status(200);
      res.send(result.token?.toString());
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async changePassword(req: Request, res: Response) {
    const { token, password } = req.body;

    try {
      const isTokenValid = await PasswordToken.validate(token);

      if (isTokenValid.status) {
        await User.changePassword(
          password,
          isTokenValid.token.user_id,
          isTokenValid.token.token
        );
        res.status(200);
        res.send("Senha alterada com sucesso");
      } else {
        res.status(406);
        res.send("Token inválido!");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (user != undefined) {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const token = jwt.sign({ email: user.email, role: user.role }, secret);

        res.status(200);
        res.json({ token });
      } else {
        res.send("Senha incorreta");
        res.status(406);
      }
      res.json({ status: result });
    } else {
      res.json({ status: false });
    }
  }
}

export default new UserController();
