import { Router } from "express";
import { activate, card, block, unlock, transactions } from "../controllers/cardsControllers.js";
import { newPurchase } from "../controllers/purchasesControllers.js";
import { rechargeCard } from "../controllers/rechargesControllers.js";
import { validateAction } from "../middlewares/actionValidate.js";
import { validateActivation } from "../middlewares/activationValidate.js";
import { existsType } from "../middlewares/exitCardType.js";
import { validateCard } from "../middlewares/isCardValidate.js";

const cardRouter = Router();

cardRouter.post("/card", existsType, card);
cardRouter.post("/activate", validateCard, validateActivation, activate);
cardRouter.get("/transactions", transactions);
cardRouter.post("/blockCard", validateCard, validateAction, block);
cardRouter.post("/unlockCard", validateCard, validateAction, unlock);

cardRouter.post("/recharge", validateCard, rechargeCard);

cardRouter.post("/purchase", validateCard, newPurchase);


export default cardRouter;
