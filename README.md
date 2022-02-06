<p align="center"><img width=60% alt="Spector Trades" src="https://github.com/JoshuaHaughton/spector-trades/blob/update/readme/docs/logo.png"></p>

<h4 align="center">Manage stock and crypto investments, track portfolio performance, and follow an investment curated newsfeed. </h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#getting-started">Getting Started</a> •
    <a href="#repo-directory">Repo Directory</a> •
  <a href="#credits">Credits</a>
</p>

<p align="center"><img width=80% alt="Spector Trades Slideshow" src="https://github.com/JoshuaHaughton/spector-trades/blob/update/readme/docs/slideshow.gif"></p>

## Key Features

- Create and manage investment portfolios
  - Use Live Portfolios to track your real stock and/or crypto assets.
  - Play around with pseudo-investments with Speculative Portfolios.
  - View sophisticated analytics to track portfolio performance.
- Buy and sell stock and crypto investments
  - Get live price information of each asset.
  - Calculate the ROI when making a sale.
  - View the price history of the selected investment.
- Follow a curated newsfeed
  - Read the latest news articles relevant to your investments
  - Post and share content with other investors within the platform.
  - Engage with posts and articles with likes and comments.

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

## Repo Directory
* [Client](/client)
* [Server](/server)
  * [Schemas](/server/db/schema)
  * [Seeds](/server/db/seeds)
* [Docs](/docs)
* [Images used in the project](client/public/static/images)
* [API Routes](/server/routes)
* [Pages](/client/src/pages)

## Credits
This software uses the following open source packages:

- [Next.js](https://nextjs.org/)
- [MUI](https://mui.com/)
- [ApexCharts](https://apexcharts.com/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [axios](https://axios-http.com)
- [node-postgres](https://node-postgres.com/)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
