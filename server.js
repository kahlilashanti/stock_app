import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = 3000;

// Your Polygon.io API key
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

// Convert file URL to path for __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to search for stocks
// app.get('/search-stock', async (req, res) => {
//     try {
//         const symbol = req.query.symbol;
//         const response = await fetch(`https://api.polygon.io/v1/meta/symbols/${symbol}/company?apiKey=${POLYGON_API_KEY}`);
//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         res.status(500).send('Error retrieving stock data');
//     }
// });

//endpoints to get more info
app.get('/search-stock', async (req, res) => {
    try {
        const symbol = req.query.symbol;
        const companyInfoUrl = `https://api.polygon.io/v1/meta/symbols/${symbol}/company?apiKey=${POLYGON_API_KEY}`;
        const stockPriceUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?apiKey=${POLYGON_API_KEY}`;

        const companyResponse = await fetch(companyInfoUrl);
        const companyData = await companyResponse.json();

        const priceResponse = await fetch(stockPriceUrl);
        const priceData = await priceResponse.json();

        res.json({ company: companyData, price: priceData });
    } catch (error) {
        res.status(500).send('Error retrieving stock data');
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
