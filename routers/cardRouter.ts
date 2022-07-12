import { Router } from "express";
import { activate, card, newPurchase, rechargeCard } from "../controllers/cardsControllers.js";
import { existsType } from "../middlewares/exitCardType.js";

const cardRouter = Router();

cardRouter.post("/card", existsType, card);
cardRouter.post("/activate", activate);
cardRouter.post("/recharge", rechargeCard);
cardRouter.post("/purchase", newPurchase);

export default cardRouter;
