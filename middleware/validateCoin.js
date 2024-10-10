const validateCoin = (req, res, next) => {
    const { coin } = req.query;

    if (!coin) {
        return res.status(400).json({ error: 'coin name is required' });
    }

    const validCoins = ['bitcoin', 'ethereum', 'matic'];
    if (!validCoins.includes(coin.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid coin' });
    }

    next();
}

module.exports = { validateCoin }