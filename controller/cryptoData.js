const Crypto = require("../model/cryptoModel");
const ss = require('simple-statistics');


const addCryptoData = async (name, price, marketCap, change24h) => {
    try {
        if (!name || price === undefined || marketCap === undefined || change24h === undefined) {
            return { error: 'All parameters are required' };
        }

        const newCrypto = new Crypto({
            name,
            price,
            marketCap,
            change24h
        });

        await newCrypto.save();

        return { message: `${name} crypto data added` };
    } catch (error) {
        console.error('Error adding cryptocurrency data:', error.message);
        return { error: 'An error occurred while adding cryptocurrency data' };
    }
};

const getStats =  async (req, res) => {
    try {
        const { coin } = req.query;

        const cryptoData = await Crypto.findOne({ name: new RegExp(coin, 'i') }).sort({ createdAt: -1 }).exec();

        if (!cryptoData) {
            return res.status(404).json({ error: 'Data not found for the requested coin' });
        }

        return res.json({
            name: cryptoData.name,
            price: cryptoData.price,
            marketCap: cryptoData.marketCap,
            change24h: cryptoData.change24h,
            createdAt: cryptoData.createdAt
        });
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getCryptcurrencyDeviation = async (req, res) => {
    const { coin } = req.query;

    try {
        const records = await Crypto.find({ name: new RegExp(coin, 'i') }).sort({ createdAt: -1 }).limit(100);

        if (records.length === 0) {
            return res.status(404).json({ error: 'No records found' });
        }

        const prices = records.map(record => record.price);

        const stdDev = ss.standardDeviation(prices);

        res.json({ deviation: stdDev });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { addCryptoData, getStats, getCryptcurrencyDeviation };