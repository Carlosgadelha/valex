import { Request, Response } from "express";
import { findById } from "../repositories/cardRepository.js";
import Cryptr from 'cryptr';

export async function  validateAction(req: Request, res: Response, next) {

    const { idCard, securityCode } = req.body;
    const { type } = req.headers;

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const isCard = await findById(idCard)

    if(isCard.password) return res.sendStatus(409);
    
    if(parseInt(cryptr.decrypt(isCard.securityCode)) !== securityCode ) return res.sendStatus(409); 
    
    next();
}