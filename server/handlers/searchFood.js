const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
require("dotenv").config();

// Replace with environment variables for security
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

// Initialize OAuth 1.0a
const oauth = OAuth({
    consumer: { key: API_KEY, secret: API_SECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
});

const generateNonce = () => {
    return crypto.randomBytes(16).toString('hex');
};

const searchFood = async (req, res) => {
    const query = req.query.term;
    if (!query) {
        return res.status(400).send('Search term is required.');
    }

    const baseUrl = 'https://platform.fatsecret.com/rest/server.api';

    const request_data = {
        url: baseUrl,
        method: 'GET',
        data: {
            method: 'foods.search',
            search_expression: query,
            format: 'json',
            oauth_consumer_key: API_KEY,
            oauth_nonce: generateNonce(),
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version: '1.0',
        }
    };

    const authorizedData = oauth.authorize(request_data);
    const headers = oauth.toHeader(authorizedData);

    try {
        const response = await axios({
            url: request_data.url,
            method: request_data.method,
            params: authorizedData,
            headers: headers
        });

        res.status(200).send(response.data);
    } catch (error) {
        console.error('Error making API request:', error);
        res.status(500).send('An error occurred while fetching data.');
    }
};

module.exports = searchFood;
