import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { secret } from "../controllers/UserController";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers["authorization"];

  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];
    try {
      const decoded: any = jwt.verify(token, secret);

      if (decoded.role == 1) {
        next();
      } else {
        res.status(403);
        res.send("Você não tem permissão para isso");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(403);
    res.send("Você não está autenticado");
    return;
  }
}
