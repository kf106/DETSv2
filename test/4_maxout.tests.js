const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContract } = require("../test-helpers/contracts-helper");

const gasPrice = 150000000
const gasLimit = 15000000000

describe("Max out tests", function () {
  let deployer, fund1, fund2, fund3
  let fAddr, aAddr, nAddr

  beforeEach(async function () {
    this.contract = await deployContract(5);

    [deployer, fund1, fund2, fund3] = await ethers.getSigners();

    aAddr = await new ethers.Wallet('0x0123456789012345678901234567890123456789012345678901234567890125', ethers.provider)

    await fund2.sendTransaction({
      to: aAddr.address,
      value: ethers.utils.parseEther("1")
    })
    await fund3.sendTransaction({
      to: "0x1111111111111111111111111111111111111111",
      value: ethers.utils.parseEther("0.1"),
      gasPrice: gasPrice, gasLimit: gasLimit
    })
    await fund3.sendTransaction({
      to: "0x1111111111111111111111111111111111111112",
      value: ethers.utils.parseEther("0.1"),
      gasPrice: gasPrice, gasLimit: gasLimit
    })
    await fund3.sendTransaction({
      to: "0x1111111111111111111111111111111111111113",
      value: ethers.utils.parseEther("0.1"),
      gasPrice: gasPrice, gasLimit: gasLimit
    })
    await fund3.sendTransaction({
      to: "0x1111111111111111111111111111111111111114",
      value: ethers.utils.parseEther("0.1"),
      gasPrice: gasPrice, gasLimit: gasLimit
    })
    await fund3.sendTransaction({
      to: "0x1111111111111111111111111111111111111115",
      value: ethers.utils.parseEther("0.1"),
      gasPrice: gasPrice, gasLimit: gasLimit
    })

  });

  context("Max claimable", function () {

    it("Claim five balances and check no one has a balance after that", async function () {

    const balance = await this.contract.balanceOf(aAddr.address)
      expect(balance.toString()).to.equal("100000000000000000000")

      await this.contract
        .connect(fund1)
        ["transfer(address,uint256)"](
          "0x1111111111111111111111111111111111111111",
          "5000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
        );
      // check that two airdrops have emitted events
      let claimed = await this.contract.claimed()
      expect(claimed.toString()).to.equal("2")
      await this.contract
        .connect(fund1)
        ["transfer(address,uint256)"](
          "0x1111111111111111111111111111111111111112",
          "5000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
        );
      await this.contract
        .connect(fund1)
        ["transfer(address,uint256)"](
          "0x1111111111111111111111111111111111111113",
          "5000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
        );
      await this.contract
        .connect(fund1)
        ["transfer(address,uint256)"](
          "0x1111111111111111111111111111111111111114",
          "5000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
        );
      await this.contract
        .connect(fund1)
        ["transfer(address,uint256)"](
          "0x1111111111111111111111111111111111111115",
          "5000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
        );
      claimed = await this.contract.claimed()
      expect(claimed.toString()).to.equal("5")

      const balance2 = await this.contract.balanceOf(aAddr.address)
      expect(balance2.toString()).to.equal("0")

      await expect(
        this.contract
          .connect(aAddr)
          ["transfer(address,uint256)"](
            deployer.address,
            "25000000000000000000", 
            {gasPrice: gasPrice, gasLimit: gasLimit}
          )
        ).to.be.reverted

    });

  });
});