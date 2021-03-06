import { connection } from "../database.js";
import { TransactionTypes } from "./cardRepository.js";

export interface Business {
  id: number;
  name: string;
  type: TransactionTypes;
}

export async function findByIdBusiness(id: number) {
  const result = await connection.query<Business, [number]>(
    "SELECT * FROM businesses WHERE id=$1",
    [id]
  );

  return result.rows[0];
}
