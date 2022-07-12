import { Router } from "express";
import { activate, card, block, unlock } from "../controllers/cardsControllers.js";
import { newPurchase } from "../controllers/purchasesControllers.js";
import { rechargeCard } from "../controllers/rechargesControllers.js";
import { existsType } from "../middlewares/exitCardType.js";
import { validateCard } from "../middlewares/isCardValidate.js";

const cardRouter = Router();

cardRouter.post("/card", existsType, card);
cardRouter.post("/activate", activate);
cardRouter.post("/blockCard", validateCard, block);
cardRouter.post("/unlockCard", validateCard, unlock);

cardRouter.post("/recharge", validateCard, rechargeCard);

cardRouter.post("/purchase", validateCard, newPurchase);


export default cardRouter;
