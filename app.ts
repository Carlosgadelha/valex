import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { card } from "./controllers/cardsControllers.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors())

app.post("/card", card);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
}); 