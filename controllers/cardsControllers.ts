import dayjs from "dayjs";
// import  join from "join";
import { Request, Response } from "express";
import { findById, update } from "../repositories/cardRepository.js";
import { activateCard, newCard, newPurchaseCard, newRechargeCard } from "../services/cardsServices.js";
import Cryptr from 'cryptr';

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

export async function rechargeCard(req: Request, res: Response) {
    
    const apiKey = req.headers['x-api-key'].toString();
    const {idCard, value} = req.body;

    try {
        
        const status = await newRechargeCard(apiKey, idCard, value);
        res.sendStatus(status);
        
    } catch (error) {
        res.sendStatus(500);
    }

}

export async function newPurchase(req: Request, res: Response) {
    const {cardId, password, businessId, amount} = req.body;

    try {
        
        const status = await newPurchaseCard(cardId, password, businessId, amount);
        res.sendStatus(status);
        
    } catch (error) {
        res.sendStatus(500);
    }

}
