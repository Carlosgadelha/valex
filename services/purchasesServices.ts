import Cryptr from 'cryptr';
import dotenv from 'dotenv';
dotenv.config();

import { findById } from "../repositories/cardRepository.js";
import { findByIdBusiness } from "../repositories/businessRepository.js";
import { saldo } from "../utils/totalAmount.js";
import { insertPayment } from "../repositories/paymentRepository.js";

export async function newPurchaseCard(cardId: number, password: number, businessId: number, amount: number){

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const card = await findById(cardId);
    const business = await findByIdBusiness(businessId);

    if (amount < 0) return 409;
    if (card.isBlocked) return 409;
    if (parseInt(cryptr.decrypt(card.password)) !== password ) return 409; // codico de segurança invalida
    if (!business) return 404;
    if (business.type !== card.type) return 409;
    const saldoCard = await saldo(cardId);
    if (saldoCard < amount) return 409;

    await insertPayment({
        cardId,
        businessId,
        amount
    })

    return 200;

}
