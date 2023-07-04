const { ethers } = require("hardhat");

const deployContract = async function (
) {
  const [deployer, customer, malicious, bystander] = await ethers.getSigners();
  const Contract = await ethers.getContractFactory("DETSv2");
  const contract = await Contract.deploy();
  await contract.deployed();

  return contract;
};

module.exports = {
  deployContract
};
