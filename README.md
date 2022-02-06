# Spector Trades
<p align="center"><img width=60% src="https://github.com/JoshuaHaughton/spector-trades/blob/update/readme/docs/logo.png"></p>

## Table of Contents
* [Client](/client)
* [Server](/server)
  * [Schemas](/server/db/schema)
  * [Seeds](/server/db/seeds)
* [Docs](/docs)
* [Images used in the project](client/public/static/images)
* [API Routes](/server/routes)
* [Pages](/client/src/pages)

## Getting Started

### Requirements

- Node 12.x
- Postgres

### Server
1. Use the `server/.env.example` to create an .env file with relevant settings in your system.
2. Install dependencies: `npm i`
3. Reset database: `npm run db:reset`
4. Run the server: `npm run local`
5. Default to test the endpoint at `http://localhost:3001/`

### Client
0. You'll need to be subscribed to Twelve API, CoinGecko API, and Exchange Rate API from Rapid API.
1. Use the `client/.env.example` to create an .env file with relevant settings in your system.
2. Install dependencies: `npm i`
3. Reset database: `npm run db:reset`
4. Run the server: `npm run dev`
5. Default URI to view the server: `http://localhost:3000/`

## Dependencies

- Node 12.x or above
- NPM 5.x or above
- PG 6.x
- Dotenv 2.x
- Nodemon 2.x
- Express 4.x or above
- Morgan 1.x or above
