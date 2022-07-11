import dayjs from "dayjs";
import Cryptr from 'cryptr';
import dotenv from 'dotenv';
dotenv.config();

import { insert, TransactionTypes } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { faker } from '@faker-js/faker';

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


export async function newCard(apiKey: string, employeeId: number, password: string, type: TransactionTypes) {
    try {
        const employee = await findById(employeeId);
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
                securityCode,
                expirationDate,
                password: cryptr.encrypt(password),
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