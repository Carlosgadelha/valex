import { Request, Response } from "express";
import { newRechargeCard } from "../services/rechargesServices.js";


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