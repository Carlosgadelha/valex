import { Router } from "express";
import { card } from "../controllers/cardsControllers.js";

const cardRouter = Router();

cardRouter.post("/card", card);

export default cardRouter;
