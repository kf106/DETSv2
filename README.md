# DETS version 2

A standard ERC20 token or is it? [OpenZeppelin ERC20 contract templates](https://openzeppelin.com/contracts/).

## The airdrop

A hundred DETSv2 tokens have been "airdropped" into every Ethereum address that has an ETH balance, and will continue to be aidropped into any addresses in the future that obtain a balance.

Except for addresses ending in F, because we don't like those.

## About the contract

The Solidity mapping data structure does not distinguish between a "null" record and a zero record, and so in an ERC20 the balanceOf function returns 0 if you have a balance, but it is 0, and it returns 0 if you have no balance.

These two things are actually different, and so trick with this smart contract is that it uses the most significant bit of your balance to record whether you truly have a balance or not. A null balance returns 0, and a balance of 0x80000000000000000000000000000000 also returns 0.

This allows us to check whether someone has yet to receive the aidrop, or whether they already have and spent it.

As a side effect we can only store balances up to 2**255 - 1, but that's still a pretty big number.
