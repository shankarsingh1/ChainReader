require('dotenv').config();
const express = require('express');
const axios = require('axios');
const Groq = require('groq-sdk');
const path = require('path');

const app = express();
const groq = new Groq({ apiKey: process.env.groq });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/analyze', async (req, res) => {
  const { address } = req.query;
  try {
    const ethRes = await axios.get(`https://api.etherscan.io/v2/api`, {
      params: {
        chainid: 1,
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 10,
        sort: 'desc',
        apikey: process.env.etherscan
      }
    });

    const txs = ethRes.data.result.map(tx => ({
      from: tx.from,
      to: tx.to,
      value: (tx.value / 1e18).toFixed(4) + ' ETH',
      time: new Date(tx.timeStamp * 1000).toLocaleString(),
      status: tx.isError === '0' ? 'Success' : 'Failed'
    }));

    const chat = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `Here are the last 10 transactions for wallet ${address}:\n${JSON.stringify(txs, null, 2)}\n\nSummarize in 4-5 plain English sentences for a non-technical person.`
      }]
    });

    res.json({ summary: chat.choices[0].message.content, txs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Listening on port ${PORT} (local: http://localhost:${PORT})`)
);



// require('dotenv').config();
// const axios = require('axios');
// const Groq = require('groq-sdk');

// const groq = new Groq({ apiKey: process.env.groq});
// const WALLET_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

// async function getWalletData(address) {
//   const url = `https://api.etherscan.io/v2/api` +
//     `?chainid=1` +
//     `&module=account` +
//     `&action=txlist` +
//     `&address=${address}` +
//     `&startblock=0` +
//     `&endblock=99999999` +
//     `&page=1` +
//     `&offset=10` +
//     `&sort=desc` +
//     `&apikey=${process.env.etherscan}`;

//   const response = await axios.get(url);
//   const transactions = response.data.result;

//   const parsed = transactions.map(tx => ({
//     from: tx.from,
//     to: tx.to,
//     value: (tx.value / 1e18).toFixed(4) + ' ETH',
//     time: new Date(tx.timeStamp * 1000).toLocaleString(),
//     status: tx.isError === '0' ? 'Success' : 'Failed'
//   }));

//   console.log('Raw transactions fetched. Sending to Groq...\n');

//   // Send to Groq
//   const summary = await summarizeWithGroq(parsed, address);
//   console.log('AI Summary:\n');
//   console.log(summary);
// }

// async function summarizeWithGroq(transactions, address) {
//   const chat = await groq.chat.completions.create({
//    model: 'llama-3.3-70b-versatile',
//     messages: [
//       {
//         role: 'user',
//         content: `Here are the last 10 transactions for Ethereum wallet ${address}:
        
// ${JSON.stringify(transactions, null, 2)}

// Summarize this wallet's activity in 4-5 plain English sentences.
// Mention: what the wallet mostly does, transaction amounts, recent activity, anything interesting.
// Write it like you're explaining to a non-technical person.`
//       }
//     ]
//   });

//   return chat.choices[0].message.content;
// }

// getWalletData(WALLET_ADDRESS);