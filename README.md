# 🪙 simplfin-js

[![npm version](https://img.shields.io/npm/v/simplefin-js.svg?color=blue)](https://www.npmjs.com/package/simplefin-js)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)
![Build Status](https://img.shields.io/github/actions/workflow/status/StephenODea54/simplefin-js/ci.yml?branch=main)

A lightweight Node.js SDK for interacting with the [SimpleFIN Bridge API](https://beta-bridge.simplefin.org/)

---

## ✨ Why simplfin-js?

[SimpleFIN Bridge](https://beta-bridge.simplefin.org/) provides a secure and simple way to access financial data.  
`simplfin-js` makes it easy to talk to that API without writing boilerplate or fiddling with auth headers and query strings.

✅ Simple to use  
✅ Fully typed (TypeScript included)  
✅ Handles setup tokens, access URLs, and multi-account queries  
✅ Works out-of-the-box with Node 18+ (ships with zero dependencies)

---

## 🚀 Installation

```bash
npm install simplfin-js
```

---

## 💡 Quick Start

```ts
import { SimpleFin } from 'simplfin-js';

async function main() {
  // Option 1: Start with a setup token
  // NOTE: Setup tokens have a one time use
  const client = await SimpleFin.fromSetupToken('your_setup_token_here');

  // Option 2: Or use a saved access URL directly
  // const client = SimpleFin.fromAccessUrl('your_access_token_here');

  // Get account data
  const accounts = await client.getAccounts({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    pending: true,
  });
  console.log('Accounts:', accounts);
}

main();
```

---

## 📘 API Reference

### **Class:** `SimpleFin`

#### `static async fromSetupToken(setupToken: string): Promise<SimpleFin>`

Claims an **access URL** using your one-time setup token.

```ts
const client = await SimpleFin.fromSetupToken('setup_token_here');
```

- Throws if the token is has already been claimed.

---

#### `static fromAccessUrl(accessUrl: string): SimpleFin`

Create a client directly from a previously claimed **access URL**.

```ts
const client = SimpleFin.fromAccessUrl(
  'simplefin://user:pass@bridge.simplefin.org',
);
```

---

#### `async getInfo(): Promise<GetInfoResponse>`

Returns what versions of the SimpleFIN Protocol the server supports. The strings returned will be in `MAJOR.MINOR.FIX` or `MAJOR.MINOR` format.

```ts
const info = await client.getInfo();
console.log(info);

// {
//   "versions": ["1.0"],
// }
```

---

#### `async getAccounts(params?): Promise<GetAccountsResponse>`

Fetches account and transaction data

```ts
const accounts = await client.getAccounts({
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  account: ['account_1', 'account_2'],
  pending: true,
  balancesOnly: false,
});

// {
//   "errors": [],
//   "accounts": [
//     {
//       "org": {
//         "domain": "mybank.com",
//         "sfin-url": "https://sfin.mybank.com"
//       },
//       "id": "2930002",
//       "name": "Savings",
//       "currency": "USD",
//       "balance": "100.23",
//       "available-balance": "75.23",
//       "balance-date": 978366153,
//       "transactions": []
//     }
//   ]
// }
```

##### **Parameters**

| Name           | Type                       | Description                                             |
| -------------- | -------------------------- | ------------------------------------------------------- |
| `startDate`    | `Date \| string \| number` | Only include transactions on or after this date         |
| `endDate`      | `Date \| string \| number` | Only include transactions before (but not on) this date |
| `pending`      | `boolean`                  | Include pending transactions                            |
| `account`      | `string \| string[]`       | One or more account IDs                                 |
| `balancesOnly` | `boolean`                  | Only return balances (skip transactions)                |

---

## 🧩 TypeScript Support

This SDK is written in TypeScript and ships with full type definitions.

---

## 🧰 Utility Helpers

### `toUnixEpoch(date: Date | string | number): string`

Converts any date-like value into a Unix timestamp (in seconds).

```ts
import { toUnixEpoch } from 'simplfin-js/utils';

console.log(toUnixEpoch(new Date())); // "1731139200"
```

Throws if the date is invalid.

---

## 🧪 Testing

This package uses [Vitest](https://vitest.dev/) for testing.

To run tests locally:

```bash
npm test
```

---

## 🧪 Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/stephenodea/simplefin-js.git
cd simplefin-js
npm install
```

### Scripts

| Command                 | Description                                |
| ----------------------- | ------------------------------------------ |
| `npm run dev`           | Run Vitest in watch mode                   |
| `npm run test`          | Run the full test suite once               |
| `npm run build`         | Compile TypeScript to `dist/`              |
| `npm run format`        | Format all files with Prettier             |
| `npm run check-format`  | Check code formatting                      |
| `npm run ci`            | Build, check format, and test              |
| `npm run local-release` | Version & publish locally using Changesets |

---

## 🧱 Project Structure

```
simplfin-js/
├── src/
|   |── tests/           # Vitest test suite
│   ├── client.ts        # Core SimpleFin client
│   ├── utils.ts         # Helpers (epoch date converter)
│   ├── types.ts         # TypeScript interfaces
│   └── index.ts         # Library entry point
├── package.json
└── README.md
```

---

## 🪪 License

MIT © [Stephen O'Dea](https://github.com/StephenODea54)
