/* hardhat.config.js */
require("@babel/register");
require("@babel/polyfill");

require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");

require('dotenv-safe').config();

const { 
    RINKEBY_API_URL, 
    MAINNET_API_URL,
    MATIC_API_URL,
    ETHSCAN_API_KEY,
    POLYGONSCAN_API_KEY,
    RINKEBY_PRIVATE_KEY, 
    MAINNET_PRIVATE_KEY,
    MATIC_PRIVATE_KEY,
    COINMARKETCAP_API_KEY,
    BASE_GAS,
    PRIORITY_GAS,
    MAX_FEE_MULTIPLIER,
} = process.env;

module.exports = {
  gasReporter: {
    currency: 'GBP',
    coinmarketcap: COINMARKETCAP_API_KEY
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // over-ride chain ID to allow MetaMask to connect to localhost:8545
      // see https://hardhat.org/metamask-issue.html
      chainId: 1337,
      blockGasLimit: 15000000
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      // over-ride chain ID to allow MetaMask to connect to localhost:8545
      // see https://hardhat.org/metamask-issue.html
      chainId: 1337,
      blockGasLimit: 15000000,
      base_gas: BASE_GAS,
      priority_gas: PRIORITY_GAS,
      multiplier: MAX_FEE_MULTIPLIER,
    },
    coverage: {
      url: 'http://127.0.0.1:8555',
      gas: 0xfffffffffff,
      gasPrice: 0x01,
      base_gas: BASE_GAS,
      priority_gas: PRIORITY_GAS,
      multiplier: MAX_FEE_MULTIPLIER,
    },
    rinkeby: {
      url: RINKEBY_API_URL,
      accounts: [`0x${RINKEBY_PRIVATE_KEY}`],
      base_gas: BASE_GAS,
      priority_gas: PRIORITY_GAS,
      multiplier: MAX_FEE_MULTIPLIER,
    },
    mainnet: {
      url: MAINNET_API_URL,
      accounts: [`0x${MAINNET_PRIVATE_KEY}`],
      base_gas: BASE_GAS,
      priority_gas: PRIORITY_GAS,
      multiplier: MAX_FEE_MULTIPLIER,
    },
    matic: {
      url: MATIC_API_URL,
      accounts: [`0x${MATIC_PRIVATE_KEY}`],
      base_gas: BASE_GAS,
      priority_gas: PRIORITY_GAS,
      multiplier: MAX_FEE_MULTIPLIER,
    }
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  mocha: {
    timeout: 3000000
  }
}
