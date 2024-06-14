const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const port = 5000;

const API_KEY = '7ExmyTm4HBz172FVg6';
const SECRET_KEY = 'iaenXUVhwSp6fys1b8Icf0WVGWLtn5IttZmP';
const BASE_URL = 'https://api.bybit.com';

app.use(cors());

app.get('/api/trade-history', async (req, res) => {
  const endpoint = '/v5/execution/list';
  const params = {
    api_key: API_KEY,
    timestamp: Date.now(),
  };

  const queryString = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  const sign = crypto.createHmac('sha256', SECRET_KEY).update(queryString).digest('hex');
  params.sign = sign;

  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, { params });
    if (response.data.retCode !== 0) {
      throw new Error(`API Error: ${response.data.retMsg}`);
    }
    res.json(response.data.result);
  } catch (error) {
    console.error('Error fetching trade history:', error.message || error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
