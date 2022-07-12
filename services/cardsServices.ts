import dayjs from "dayjs";
import Cryptr from 'cryptr';
import dotenv from 'dotenv';
dotenv.config();

import { findById, insert, TransactionTypes, update } from "../repositories/cardRepository.js";
import { findByIdEmployee } from "../repositories/employeeRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";

import { faker } from '@faker-js/faker';
import { findByCardId, insertRecharge } from "../repositories/rechargeRepository.js";
import { findByIdBusiness } from "../repositories/businessRepository.js";
import { saldo } from "../utils/totalAmount.js";
import { insertPayment } from "../repositories/paymentRepository.js";

function cardName(name: string) {
    const fullName = name.split(' ');
    let result = "";

    fullName.forEach((nomes, index) => {
        if (index === 0) {
            result += `nomes.toLocaleUpperCase() `;
        } else if (index === fullName.length - 1) {
            result += ` ${nomes.toLocaleLowerCase()}`;
        } else {
            if (nomes.length > 2)  result = `${nomes[0].toLocaleUpperCase()}`;  
        }
    })

  return result;
}

export async function newCard(apiKey: string, employeeId: number, type: TransactionTypes) {
    try {
        const employee = await findByIdEmployee(employeeId);
        const isValid = await findByApiKey(apiKey);
        const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

        const number = faker.finance.creditCardNumber();
        const cardholderName = cardName(employee.fullName);
        const securityCode = faker.finance.creditCardCVV();
        const expirationDate = dayjs(new Date).add(5, 'year').format('MM/YY');

        
        if (employee && isValid) {
            await insert({
                employeeId,
                number,
                cardholderName,
                securityCode: cryptr.encrypt(securityCode),
                expirationDate,
                password: undefined,
                isVirtual: false,
                originalCardId: undefined,
                isBlocked: true,
                type: type
            })

            return {
                employeeId,
                number,
                cardholderName,
                securityCode,
                expirationDate,
                type: type
            }
        }

    } catch (error) {
        console.log(error);
        
    }
    

}

export async function activateCard(cardId: number, securityCode: number, password: number) {

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const isCard = await findById(cardId) // se tem um cartão com esse id

    if (!isCard) return 404;
    if (isCard.expirationDate <= dayjs(Date.now()).format('MM/YY')) return 409; // se nao esta vencido
    if(isCard.password) return 409; // cartao ja com senha
    
    if(parseInt(cryptr.decrypt(isCard.securityCode)) !== securityCode ) return 409; // codico de segurança invalida
    
    // falta validação da senha com o join

    await update(cardId, {
        password: cryptr.encrypt(password)
    })

    return 200;
}

export async function newRechargeCard(apiKey: string, cardId: number, amount: number) {
    const company = await findByApiKey(apiKey);
    const card = await findById(cardId);

    if(amount < 0) return 409;
    if (!company) return 404;
    if (!card) return 404;
    if (card.isBlocked) return 409;
    if (card.expirationDate <= dayjs(Date.now()).format('MM/YY')) return 409; // se nao esta vencido

    await insertRecharge({
        cardId,
        amount
    })

    return 200;
}

export async function newPurchaseCard(cardId: number, password: number, businessId: number, amount: number){

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const card = await findById(cardId);
    const business = await findByIdBusiness(businessId);

    if (amount < 0) return 409;
    if (!card) return 404;
    if (card.isBlocked) return 409;
    if (card.expirationDate <= dayjs(Date.now()).format('MM/YY')) return 409; // se nao esta vencido
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
