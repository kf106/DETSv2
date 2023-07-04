import { ethers } from 'hardhat';
const pressAnyKey = require('press-any-key');
const hre = require('hardhat');

console.log(hre.network.config);
const BASE = ethers.BigNumber.from(hre.network.config.base_gas);
const PRIORITY = ethers.BigNumber.from(hre.network.config.priority_gas);
const MAX = BASE.mul(parseInt(parseFloat(hre.network.config.multiplier) * 1000)).div(1000).add(PRIORITY);

async function main () {
  const dets = await ethers.getContractFactory('DETS');
  // Start deployment, returning a promise that resolves to a contract object
  const Dets = await dets.deploy({
    maxFeePerGas: MAX,
    maxPriorityFeePerGas: PRIORITY,
  });
  console.log('Contract deployed to address:', Dets.address);
}

console.log('Preparing to deploy DETS contract');
console.log('Base gas price is ' + BASE.toString() + ' (' + ethers.utils.formatUnits(BASE, 'gwei') + ' gwei)');
console.log('Priority gas price is ' + PRIORITY.toString() +
    ' (' + ethers.utils.formatUnits(PRIORITY, 'gwei') + ' gwei)');
console.log('Multiplier is ' + hre.network.config.multiplier);
console.log('Max gas fee is ' + MAX.toString() + ' (' + ethers.utils.formatUnits(MAX, 'gwei') + ' gwei)');
console.log();

pressAnyKey('Press any key to continue, or CTRL+C to cancel', {
  ctrlC: 'reject',
})
  .then(() => {
    main()
      .then(() => process.exit(0))
      .catch(error => {
        console.error(error);
        process.exit(1);
      });
  })
  .catch(() => {
    console.log('You cancelled with CTRL+C');
  });
