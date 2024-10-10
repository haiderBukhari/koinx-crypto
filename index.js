const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const cron = require('node-cron');
const mongoose = require('mongoose');
const { connectDB } = require('./db/connectDB');
const { configDotenv } = require('dotenv');

configDotenv();
connectDB();

const app = express();
app.use(morgan('dev'))

// const Crypto = mongoose.model('Crypto', cryptoSchema);

// Fetch data from CoinGecko
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

        // Store data in the database
        for (const data of cryptoData) {
            await addCryptoData(data);
        }

        // console.log('Data successfully stored:', cryptoData);

    } catch (error) {
        console.error('Error fetching crypto data:', error);
    }
}

fetchCryptoData();

// Schedule the task to run every 2 hours
// cron.schedule('0 */2 * * *', fetchCryptoData);

module.exports = { app }
console.log('Scheduled task to fetch cryptocurrency data every 2 hours.');
