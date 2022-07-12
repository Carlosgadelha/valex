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
import { findByCardIdPayment, insertPayment } from "../repositories/paymentRepository.js";

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
    
    // falta validação da senha com o join

    await update(cardId, {
        password: cryptr.encrypt(password)
    })

}

export async function getTransactions(cardId: number) {
    const transactions = await findByCardIdPayment(cardId);
    const balance = saldo(cardId);
    const recharges = await findByCardId(cardId);
    return {
        balance,
        transactions,
        recharges
    };
}

export async function blockCard(cardId: number, password: number) {

    await update(cardId, {
        isBlocked: true
    })

}

export async function unlockCard(cardId: number, password: number) {

    await update(cardId, {
        isBlocked: false
    })

}