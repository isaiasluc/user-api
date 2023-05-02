import express from "express";
const app = express();
const router = express.Router();
import HomeController from "../controllers/HomeController";
import UserController from "../controllers/UserController";

router.get("/", HomeController.index);
router.post("/user", UserController.create);

module.exports = router;
