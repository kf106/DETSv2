const { ethers } = require("hardhat");

const deployContract = async function (max
) {
  const [deployer, customer, malicious, bystander] = await ethers.getSigners();
  const Contract = await ethers.getContractFactory("DETSv2");
  const contract = await Contract.deploy(max);
  await contract.deployed();

  return contract;
};

module.exports = {
  deployContract
};
