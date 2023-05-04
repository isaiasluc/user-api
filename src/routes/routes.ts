import express from "express";
const app = express();
const router = express.Router();
import HomeController from "../controllers/HomeController";
import UserController from "../controllers/UserController";

router.get("/", HomeController.index);
router.post("/user", UserController.create);
router.get("/user", UserController.index);
router.get("/user/:id", UserController.indexById);
router.put("/user", UserController.edit);
router.post("/user/:id", UserController.remove);

module.exports = router;
