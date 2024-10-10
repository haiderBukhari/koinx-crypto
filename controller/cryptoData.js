const Crypto = require("../model/cryptoModel");

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

module.exports = { addCryptoData };
