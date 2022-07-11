CREATE DATABASE "valex" WITH ENCODING 'UTF8';

CREATE TABLE "companies"(
    "id" SERIAL PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "apiKey" TEXT 
);

CREATE TABLE "employees" (
	"id" SERIAL PRIMARY KEY,
	"fullName" TEXT  NOT NULL,
    "cpf" TEXT UNIQUE NOT NULL,
	"email" TEXT UNIQUE NOT NULL ,
    "companyId" INTEGER NOT NULL REFERENCES "companies"("id"),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT Null
);

CREATE TYPE types AS ENUM ('groceries', 'restaurants', 'transport', 'education', 'health');

CREATE TABLE "cards" (
    "id" SERIAL PRIMARY KEY,
    "employeeId" INTEGER NOT NULL REFERENCES "employees"("id"),
    "number" TEXT NOT NULL,
    "expirationDate" TEXT NOT NULL,
    "password" TEXT ,
    "isVirtual" BOOLEAN NOT NULL DEFAULT FALSE,
    "originalCardId" INTEGER REFERENCES "cards"("id"),
    "isBlocked" BOOLEAN NOT NULL DEFAULT TRUE,
    "type" types NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT Null
);

CREATE TABLE "payments" (
    "id" SERIAL PRIMARY KEY,
    "cardId" INTEGER NOT NULL REFERENCES "cards"("id"),
    "timestamp" TIMESTAMP NOT NULL DEFAULT NOW(),
    "amount" NUMERIC NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT Null
);

CREATE TABLE "businesses" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "type" types NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT Null
);

CREATE TABLE "recharges" (
    "id" SERIAL PRIMARY KEY,
    "cardId" INTEGER NOT NULL REFERENCES "cards"("id"),
    "timestamp" TIMESTAMP NOT NULL DEFAULT NOW(),
    "amount" NUMERIC NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT Null
);