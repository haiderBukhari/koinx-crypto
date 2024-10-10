const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const cron = require('node-cron');
const { connectDB } = require('./db/connectDB');
const { configDotenv } = require('dotenv');
const { addCryptoData, getStats, getCryptcurrencyDeviation } = require('./controller/cryptoData');
const { validateCoin } = require('./middleware/validateCoin');

const app = express();

configDotenv();
connectDB();
app.use(morgan('dev'))


async function fetchCryptoData() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: 'bitcoin,ethereum,matic-network',
                vs_currencies: 'usd',
                include_market_cap: 'true',
                include_24hr_change: 'true'
            }
        });

        const cryptos = response.data;
        const cryptoData = [
            {
                name: 'Bitcoin',
                price: cryptos.bitcoin.usd,
                marketCap: cryptos.bitcoin.usd_market_cap,
                change24h: cryptos.bitcoin.usd_24h_change
            },
            {
                name: 'Ethereum',
                price: cryptos.ethereum.usd,
                marketCap: cryptos.ethereum.usd_market_cap,
                change24h: cryptos.ethereum.usd_24h_change
            },
            {
                name: 'Matic',
                price: cryptos['matic-network'].usd,
                marketCap: cryptos['matic-network'].usd_market_cap,
                change24h: cryptos['matic-network'].usd_24h_change
            }
        ];

        for (const data of cryptoData) {
            await addCryptoData(data.name, data.price, data.marketCap, data.change24h);
        }

    } catch (error) {
        console.error('Error fetching crypto data:', error);
    }
}

cron.schedule('0 */2 * * *', fetchCryptoData);

app.get('/stats', validateCoin, getStats)
app.get('/deviation', validateCoin, getCryptcurrencyDeviation)

module.exports = { app }