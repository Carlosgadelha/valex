import dayjs from "dayjs";
import { Request, Response } from "express";
import { findById } from "../repositories/cardRepository.js";

export async function validateCard(req: Request, res: Response, next) {

    const { idCard } = req.body;
    const card = await findById(idCard);

    if (!card) return res.sendStatus(404);
    if (card.expirationDate <= dayjs(Date.now()).format('MM/YY')) return res.status(409); 

    next();

}