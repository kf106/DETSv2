const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContract } = require("../test-helpers/contracts-helper");

const gasPrice = 150000000
const gasLimit = 15000000000

describe("Transfer tests", function () {
  let deployer, fund1, fund2, fund3, fund4, fund5
  let fAddr, aAddr, nAddr

  beforeEach(async function () {
    this.contract = await deployContract(100);

    [deployer, fund1, fund2, fund3, fund4, fund5] = await ethers.getSigners();

    fAddr = await new ethers.Wallet('0x0123456789012345678901234567890123456789012345678901234567890126', ethers.provider)
    aAddr = await new ethers.Wallet('0x0123456789012345678901234567890123456789012345678901234567890125', ethers.provider)
    nAddr = await new ethers.Wallet('0x0123456789012345678901234567890123456789012345678901234567890124', ethers.provider)

    // console.log(ethers.provider)

        
    await fund4.sendTransaction({
      to: fAddr.address,
      value: ethers.utils.parseEther("10")
    })

    await fund5.sendTransaction({
      to: aAddr.address,
      value: ethers.utils.parseEther("10")
    })

  });

  context("Balance checks", function () {
    it("Customer has a tokens because it has ETH", async function () {
      const balance = await this.contract.balanceOf(aAddr.address)
      expect(balance.toString()).to.equal("100000000000000000000")
    });

    it("Address ending in F has no tokens", async function () {
      const balance = await this.contract.balanceOf(fAddr.address)
      expect(balance.toString()).to.equal("0")
    });

    it("Address with no ETH has no tokens", async function () {
      const balance = await this.contract.balanceOf(nAddr.address)
      expect(balance.toString()).to.equal("0")
    });

    it("Cannot transfer more than balance", async function () {
      // check amount bigger than balance
      await expect(
        this.contract
          .connect(aAddr)
          ["transfer(address,uint256)"](
            fAddr.address,
            "100000000000000000001", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
          )
        ).to.be.reverted
      // check for address with no balance
      await expect(
        this.contract
          .connect(fAddr)
          ["transfer(address,uint256)"](
            aAddr.address,
            "1",
            {gasPrice: gasPrice, gasLimit: gasLimit}
          )
        ).to.be.reverted
    });

    it("Check events emitted on token transfer", async function () {
        const tx = await this.contract
          .connect(aAddr)
          ["transfer(address,uint256)"](
            fAddr.address,
            "50000000000000000000",
            {gasPrice: gasPrice, gasLimit: gasLimit}
          )
        const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        const interfaceTx = new ethers.utils.Interface(
          ["event Transfer(address indexed from, address indexed to, uint256 amount)"]
        )
        const data0 = receipt.logs[0].data;
        const topics0 = receipt.logs[0].topics;
        const event0 = interfaceTx.decodeEventLog("Transfer", data0, topics0)
        expect(event0[0]).to.equal("0x0000000000000000000000000000000000000000")
        expect(event0[1]).to.equal(aAddr.address)
        expect(event0[2].toString()).to.equal("100000000000000000000")
        const data1 = receipt.logs[1].data;
        const topics1 = receipt.logs[1].topics;
        const event1 = interfaceTx.decodeEventLog("Transfer", data1, topics1)
        expect(event1[0]).to.equal(aAddr.address)
        expect(event1[1]).to.equal(fAddr.address)
        expect(event1[2].toString()).to.equal("50000000000000000000")
    });

    it("Transfer of tokens results in new balance for both", async function () {
      // transfer to excluded by F address
      await this.contract
        .connect(aAddr)
        ["transfer(address,uint256)"](
          fAddr.address,
          "25000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
        );
      const balanceFrom = await this.contract.balanceOf(aAddr.address)
      expect(balanceFrom.toString()).to.equal("75000000000000000000")
      const balanceTo = await this.contract.balanceOf(fAddr.address)
      expect(balanceTo.toString()).to.equal("25000000000000000000")
      // transfer to balance holding address
      await this.contract
        .connect(aAddr)
        ["transfer(address,uint256)"](
          nAddr.address,
          "50000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
        );
      const balanceFrom2 = await this.contract.balanceOf(aAddr.address)
      expect(balanceFrom2.toString()).to.equal("25000000000000000000")
      const balanceTo2 = await this.contract.balanceOf(nAddr.address)
      expect(balanceTo2.toString()).to.equal("50000000000000000000")
    });

  });
});
