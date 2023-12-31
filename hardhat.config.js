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
    COINMARKETCAP_API_KEY,
} = process.env;

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      // over-ride chain ID to allow MetaMask to connect to localhost:8545
      // see https://hardhat.org/metamask-issue.html
      chainId: 1337,
      blockGasLimit: 15000000000,
    },
    coverage: {
      url: 'http://127.0.0.1:8555'
    }
  },
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  gasReporter: {
    currency: 'EUR',
    gasPrice: 30,
    coinmarketcap: `${COINMARKETCAP_API_KEY}`
  }
}
