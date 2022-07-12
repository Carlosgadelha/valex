import { Request, Response } from "express";
import { findById } from "../repositories/cardRepository.js";
import Cryptr from 'cryptr';

export async function validateActivation(req: Request, res: Response, next) {

    const { idCard, securityCode, password } = req.body;
    
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const isCard = await findById(idCard)
    const regx = /^[0-9]{4}$/;

    if(isCard.password) return res.sendStatus(409);
    if(!regx.test(password)) return res.status(409).send("A Senha deve conter 4 digitos numericos");
    
    if(parseInt(cryptr.decrypt(isCard.securityCode)) !== securityCode ) return res.sendStatus(409); 

    next();
}
