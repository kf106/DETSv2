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
    await fund3.sendTransaction({
      to: "0x1111111111111111111111111111111111111116",
      value: ethers.utils.parseEther("0.1"),
      gasPrice: gasPrice, gasLimit: gasLimit
    })
    await fund3.sendTransaction({
      to: "0x1111111111111111111111111111111111111117",
      value: ethers.utils.parseEther("0.1"),
      gasPrice: gasPrice, gasLimit: gasLimit
    })

  });

  context("Max claimable", function () {

    it("Claim five balances and check subsequent balances are only 10", async function () {

      const balance = await this.contract.balanceOf(aAddr.address)
      expect(balance.toString()).to.equal("100000000000000000000")

      await this.contract
        .connect(aAddr)
        ["transfer(address,uint256)"](
          "0x1111111111111111111111111111111111111111",
          "5000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
        );
      // check that two airdrops have emitted events
      let claimed = await this.contract.claimed()
      expect(claimed.toString()).to.equal("2")
      await this.contract
        .connect(aAddr)
        ["transfer(address,uint256)"](
          "0x1111111111111111111111111111111111111112",
          "5000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
        );
      await this.contract
        .connect(aAddr)
        ["transfer(address,uint256)"](
          "0x1111111111111111111111111111111111111113",
          "5000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
        );
      await this.contract
        .connect(aAddr)
        ["transfer(address,uint256)"](
          "0x1111111111111111111111111111111111111114",
          "5000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
        );
      // this one only gets 10 DETSv2 because the first transaction adds balance to addrA
      await this.contract
        .connect(aAddr)
        ["transfer(address,uint256)"](
          "0x1111111111111111111111111111111111111115",
          "5000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
        );
      claimed = await this.contract.claimed()
      expect(claimed.toString()).to.equal("6")

      const balance2 = await this.contract.balanceOf(aAddr.address)
      expect(balance2.toString()).to.equal("75000000000000000000")

      await expect(
        this.contract
          .connect(aAddr)
          ["transfer(address,uint256)"](
            deployer.address,
            "75000000000000000001", 
            {gasPrice: gasPrice, gasLimit: gasLimit}
          )
        ).to.be.reverted

      const balance3 = await this.contract.balanceOf("0x1111111111111111111111111111111111111114")
      expect(balance3.toString()).to.equal("105000000000000000000")

      const balance4 = await this.contract.balanceOf("0x1111111111111111111111111111111111111115")
      expect(balance4.toString()).to.equal("15000000000000000000")

      const balance5 = await this.contract.balanceOf("0x1111111111111111111111111111111111111116")
      expect(balance5.toString()).to.equal("10000000000000000000")

      // transfer from an account that now only has 10 DETSv2
      await this.contract
        .connect(fund2)
        ["transfer(address,uint256)"](
          "0x1111111111111111111111111111111111111112",
          "5000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
        );
      const balance6 = await this.contract.balanceOf(fund2.address)
      expect(balance6.toString()).to.equal("5000000000000000000")
    });

  });
});
