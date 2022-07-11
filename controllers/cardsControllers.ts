import { Request, Response } from "express";
import { newCard } from "../services/cardsServices.js";

export async function card(req: Request, res: Response) {

    const apiKey = req.headers['x-api-key'].toString();
    console.log(apiKey);
    
    const {employeeId, password, type}= req.body;

    const card = await newCard(apiKey, employeeId, password, type);
    console.log(card);
    
    res.send(card);
    // res.sendStatus(200);
}