import express from "express";
const app = express();
const router = express.Router();
import HomeController from "../controllers/HomeController";
import UserController from "../controllers/UserController";
import { adminAuth } from "../middlewares/adminAuth";

router.get("/", HomeController.index);
router.post("/user", adminAuth, UserController.create);
router.get("/user", UserController.index);
router.get("/user/:id", UserController.indexById);
router.put("/user", adminAuth, UserController.edit);
router.post("/user/:id", adminAuth, UserController.remove);
router.post("/recoverpassword", UserController.recoverPassword);
router.post("/changepassword", UserController.changePassword);
router.post("/login", UserController.login);

module.exports = router;
