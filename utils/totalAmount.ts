import { findByCardIdPayment } from "../repositories/paymentRepository.js";
import { findByCardId } from "../repositories/rechargeRepository.js";

export async function saldo(cardId: number): Promise<number> {

    const infoCard = await findByCardId(cardId);
    const infoCardPayment = await findByCardIdPayment(cardId);
    let sum = 0

    infoCard.forEach(saldo => {
        sum += +saldo.amount
    })
    
    infoCardPayment.forEach(compra => {
        sum -= +compra.amount
    })
    return sum
}