import { Request, Response } from "express";
import User from "../models/User";

class UserController {
  async index(req: Request, res: Response) {}

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
}

export default new UserController();
