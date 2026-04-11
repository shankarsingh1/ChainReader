# Wallet Analyzer

A small web app that takes an Ethereum wallet address, loads recent on-chain activity via Etherscan, and returns a short plain-English summary using Groq.

## Features

- Web UI for entering an Ethereum address  
- Fetches the latest transactions (Etherscan)  
- AI-generated summary (Groq / Llama)  
- Express API + static frontend in `public/`

## Tech stack

- **Node.js** + **Express**  
- **Etherscan API** (transaction list)  
- **Groq** (chat completions)  
- **Vanilla HTML/CSS/JS** frontend

## Prerequisites

- Node.js 18+ recommended  
- [Etherscan API key](https://etherscan.io/apis)  
- [Groq API key](https://console.groq.com/)

## Environment variables

Create a `.env` file in the project root (do **not** commit it):

| Variable     | Description        |
|-------------|--------------------|
| `etherscan` | Etherscan API key  |
| `groq`      | Groq API key       |

Variable names are **case-sensitive** and must match what the server expects.

## Local setup

```bash
git clone <your-repo-url>
cd wallet_analyser
npm install
