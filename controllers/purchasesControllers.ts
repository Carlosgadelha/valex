import { Request, Response } from "express";
import { newPurchaseCard } from "../services/purchasesServices.js";

export async function newPurchase(req: Request, res: Response) {
    const {cardId, password, businessId, amount} = req.body;

    try {
        
        const status = await newPurchaseCard(cardId, password, businessId, amount);
        res.sendStatus(status);
        
    } catch (error) {
        res.sendStatus(500);
    }

}
