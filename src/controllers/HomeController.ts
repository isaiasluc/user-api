import { Request, Response } from "express";

class HomeController {
  async index(req: Request, res: Response) {
    res.send("APP EXPRESS! - Guia do programador");
  }
}

export default new HomeController();
