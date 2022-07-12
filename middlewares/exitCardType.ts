import { Request, Response } from "express";
import { findByTypeAndEmployeeId, TransactionTypes } from "../repositories/cardRepository.js";

export async function existsType(req: Request, res: Response, next) {

    const { employeeId, type } : { 
        employeeId: number,
        type: TransactionTypes
    } = req.body;
    
    res.locals.employeeId = employeeId;
    res.locals.type = type;

    const existsCardType = await findByTypeAndEmployeeId(type, employeeId)
    console.log(existsCardType);
    
    if (existsCardType) {
        return res.sendStatus(409);
    }
    next();
}