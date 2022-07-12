import { Request, Response } from "express";
import { activateCard, blockCard, newCard, unlockCard } from "../services/cardsServices.js";
import { newPurchaseCard } from "../services/purchasesServices.js";
import { newRechargeCard } from "../services/rechargesServices.js";

export async function card(req: Request, res: Response) {

    const apiKey = req.headers['x-api-key'].toString();
    
    const {employeeId, type} = res.locals;
    
    const card = await newCard(apiKey, employeeId, type);
    
    res.send(card);
}

export async function activate(req: Request, res: Response) {
    const { idCard, securityCode, password } = req.body;

    try {

        const status = await activateCard(idCard, securityCode, password);
        res.sendStatus(status);
        
    } catch (error) {
        res.sendStatus(500);
    }


}

export async function block(req: Request, res: Response) {
    const { idCard, password } = req.body;

    try {

        const status = await blockCard(idCard, password);
        res.sendStatus(status);
        
    } catch (error) {
        res.sendStatus(500);
    }

}

export async function unlock(req: Request, res: Response) {
    const { idCard, password } = req.body;

    try {

        const status = await unlockCard(idCard, password);
        res.sendStatus(status);
        
    } catch (error) {
        res.sendStatus(500);
    }

}
