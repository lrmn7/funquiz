<p align="center">
  <h1 align="center">Build the Quiz, Break the Minds</h1>
  <h3 align="center">Your Quiz, Your Rules. The World Plays.</h3>
</p>

<p align="center">
  <img src="https://fun-quiz.fun/og-fun-quiz.png" alt="Quiz OG Banner" width="1280"/>
</p>

-----

# FunQuiz ✨

**A decentralized quiz platform built on the Somnia network.**

FunQuiz is a complete Web3 application where users can create, play, and compete in live quizzes on the blockchain. All quiz scores and data are stored on-chain. The platform also provides a public API for third-party integration, allowing other applications to utilize FunQuiz user data.

## Features

  - **Create Quizzes:** Users can pay a fee to create their own quizzes with a title, description, and 10 custom questions.
  - **Dynamic Games:** Take part in timed quizzes where accuracy and speed are equally important, thanks to on-chain time bonus calculations.
  - **On-Chain Scoring:** User answers and final scores are sent to the smart contract.
  - **Real-Time Leaderboard:** Each quiz has its own leaderboard, updated in real-time as players submit their scores.
  - **One-Time Rule:** To ensure fair competition, each wallet address can only submit a score for a specific quiz once.  
  - **Contract Owner Admin Panel:** A dedicated page for contract owners to manage creation/play fees and withdraw contract funds.
  - **Public API:** A fast and scalable public API to verify player activity (quizzes created and completed) for third-party integration.  
  - **CSV Leaderboard Export:** Quiz creators can download their quiz leaderboards as CSV files.

-----

## Tech Stack & Architecture

This project combines a modern frontend with decentralized backend technologies to create a robust and scalable dApp.

  - **Frontend:** **Next.js**, **React**, **Tailwind CSS**
  - **Blockchain Interaction:** **Wagmi** & **Viem**
  - **Smart Contract:** **Solidity**, **Hardhat**, **OpenZeppelin**
  - **Data Indexing:** **The Graph Protocol** (Subgraph)
  - **Blockchain Network:** **Somnia Network**

The core logic resides in the **FunQuiz.sol** smart contract. To provide fast data queries, a **Subgraph** indexes events from the contract. The **Next.js frontend** interacts with both the smart contract (for transactions) and the Subgraph (for reading data). Finally, a **Next.js API Route** consumes the Subgraph data to provide a clean, public API.

-----

## Getting Started

Follow these steps to run the project locally.

### 1\. Prerequisites

  - [Node.js](https://nodejs.org/en) (v18 or later)
  - [pnpm](https://pnpm.io/installation) (or npm/yarn)
  - A Web3 wallet (e.g., MetaMask) connected to the Somnia Testnet.

### 2\. Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/lrmn7/funquiz.git
    cd funquiz
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add the following variables.

    ```env
    # deployed contract addresses for FunQuiz and FunCard
    NEXT_PUBLIC_FUNQUIZ_CONTRACT_ADDRESS="your_funquiz_contract_address"
    NEXT_PUBLIC_FUNCARD_CONTRACT_ADDRESS="your_funcard_contract_address"

    # walletconnect project id (get it from https://reown.com/)
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_walletconnect_project_id"

    # pinata jwt key for uploading files/metadata (https://pinata.cloud/)
    PINATA_JWT="your_pinata_jwt"

    # subgraph query url (from https://subgraph.somnia.network/dashboard/subgraphs)
    NEXT_PUBLIC_SUBGRAPH_API_URL="your_subgraph_query_url"
    ```

4.  **Run the development server:**

    ```bash
    pnpm run dev
    ```

    Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

-----

## How to Play

1.  **Connect Wallet:** Connect your Web3 wallet to the Somnia Network.
2.  **Explore Quizzes:** Browse the list of available quizzes created by other users.
3.  **Pay to Play:** Select a quiz and pay a one-time fee to unlock it. This is a blockchain transaction.
4.  **Answer Questions:** The quiz will begin\! You have a time limit for each of the 10 questions. The faster you answer correctly, the higher your time bonus.
5.  **Submit Answers:** Once you've answered all questions, submit your answers via a final blockchain transaction. The smart contract will calculate your official score.
6.  **Check the Leaderboard:** See your rank and score on the quiz's leaderboard\!

-----

## Public API Documentation 📚

A public API is available for developers and other applications to verify a player's activity on FunQuiz.

### Endpoint

`GET /api/event/verify-player/{walletAddress}`

### Description

Retrieves a complete history of a player's activity, including quizzes they have created and completed.

### Path Parameter

  - `walletAddress` (string, required): The user's EVM-compatible wallet address.

### Success Response (200 OK)

The API returns a JSON object with the player's data, wrapped in a `data` key.

**Example Response:**

```json
{
  "status": "success",
  "data": {
    "walletAddress": "0x90a69de07adeedba5d2f2d0afdc0f4d9affcba4f",
    "chain": "Somnia Testnet",
    "contractAddress": "0x4bF5dDCe61270965b125Cd48A42F608C0E007403",
    "lastChecked": "2025-08-19T03:30:00.000Z",
    "summary": {
      "hasCreatedQuiz": true,
      "completedQuizCount": 2
    },
    "createdQuizzes": [
      {
        "quizId": 1,
        "title": "History of Web3",
        "description": "A short quiz about key moments in Web3 history."
      }
    ],
    "completedQuizzes": [
      {
        "quizId": 3,
        "score": 1450
      },
      {
        "quizId": 5,
        "score": 980
      }
    ]
  }
}
```

### Error Responses

  - **400 Bad Request:** Returned if the provided `{walletAddress}` is invalid.
  - **500 Internal Server Error:** Returned if there is an issue fetching data from the Subgraph or the blockchain.