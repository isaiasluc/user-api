import { Request, Response } from "express";
import User from "../models/User";

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
}

export default new UserController();
