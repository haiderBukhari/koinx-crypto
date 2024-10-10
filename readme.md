
# Koinx Crypto App

This app fetches cryptocurrency data from the CoinGecko API, stores it in a MongoDB database, and provides APIs to retrieve information about cryptocurrencies.

## Features

- Fetches current prices, market caps, and 24-hour changes for Bitcoin, Ethereum, and Matic every 2 hours.
- Provides an API endpoint to get the standard deviation of the last 100 price records for a specified cryptocurrency.

## Technologies Used

- Node.js
- Express.js
- Mongoose
- CoinGecko API
- MongoDB
- Node-Cron
- Simple-Statistics

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/haiderBukhari/koinx-crypto
   cd koinx
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
   ```
   MONGODB_CONNECTION_STRING=mongodb://localhost:PORT/cryptoPrices
   ```

4. Start the application:
   ```bash
   npm run dev
   ```

## API Endpoints

### 1. Fetch Current Cryptocurrency Data

The background job runs every 2 hours to fetch the latest data for the following cryptocurrencies:

- **Bitcoin** (`bitcoin`)
- **Ethereum** (`ethereum`)
- **Matic** (`matic-network`)

This data includes:
- Current Price (in USD)
- Market Cap (in USD)
- 24-hour Change (%)

### 2. Get Standard Deviation of Prices

**Endpoint**: `/stats`

**Method**: `GET`

**Query Parameters**:
- `coin`: The cryptocurrency for which to get the standard deviation. Acceptable values are:
  - `bitcoin`
  - `ethereum`
  - `matic`

**Example Request**:
```
GET /stats?coin=bitcoin
```

**Sample Response**:
```json
{
    "name": "Bitcoin",
    "price": 60136,
    "marketCap": 1187195377127.3296,
    "change24h": -2.728548484906424,
    "createdAt": "2024-10-10T17:22:01.118Z"
}
```


**Endpoint**: `/deviation`

**Method**: `GET`

**Query Parameters**:
- `coin`: The cryptocurrency for which to get the standard deviation. Acceptable values are:
  - `bitcoin`
  - `ethereum`
  - `matic`

**Example Request**:
```
GET /deviation?coin=bitcoin
```

**Sample Response**:
```json
{
    "deviation": 4082.48
}
```

### 3. Error Handling

- Middleware is used so, if the `coin` parameter is missing in the request to `/deviation` or `/stats`, a `400 Bad Request` status will be returned with an error message.
- If no records are found for the specified cryptocurrency, a `404 Not Found` status will be returned.

## Cron Job

The application uses `node-cron` to schedule a job that fetches cryptocurrency data from CoinGecko every 2 hours. The cron job is defined with the following expression:

```javascript
cron.schedule('0 */2 * * *', fetchCryptoData);
```
