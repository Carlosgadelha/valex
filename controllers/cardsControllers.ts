import { Request, Response } from "express";
import { findById } from "../repositories/cardRepository.js";
import { activateCard, blockCard, getTransactions, newCard, unlockCard } from "../services/cardsServices.js";


export async function card(req: Request, res: Response) {

    const apiKey = req.headers['x-api-key'].toString();
    
    const {employeeId, type} = res.locals;
    
    const card = await newCard(apiKey, employeeId, type);
    
    res.send(card);
}

export async function activate(req: Request, res: Response) {
    const { idCard, securityCode, password } = req.body;

    try {

        await activateCard(idCard, securityCode, password);
        
    } catch (error) {
        res.sendStatus(500);
    }

    res.sendStatus(200);


}

export async function transactions(req: Request, res: Response) {
    const { idCard } = req.body;

    try {

        const card = await findById(idCard);
        if(!card) return res.sendStatus(404);

        const transactions = await getTransactions(idCard);
        res.send(transactions);
        
    } catch (error) {
        res.sendStatus(500);
    }
}


export async function block(req: Request, res: Response) {
    const { idCard, password } = req.body;

    try {

        await blockCard(idCard, password);
        
    } catch (error) {
        res.sendStatus(500);
    }

    res.sendStatus(200);

}

export async function unlock(req: Request, res: Response) {
    const { idCard, password } = req.body;

    try {

        await unlockCard(idCard, password);
        
    } catch (error) {
        res.sendStatus(500);
    }

    res.sendStatus(200);

}
