import dotenv from 'dotenv';
dotenv.config();

import { findById } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { insertRecharge } from "../repositories/rechargeRepository.js";

export async function newRechargeCard(apiKey: string, cardId: number, amount: number) {
    const company = await findByApiKey(apiKey);
    const card = await findById(cardId);

    if (amount < 0) return 409;
    if (!company) return 404;
    if (card.isBlocked) return 409;

    await insertRecharge({
        cardId,
        amount
    })

    return 200;
}
