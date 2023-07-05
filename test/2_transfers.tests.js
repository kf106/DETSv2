const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContract } = require("../test-helpers/contracts-helper");

describe("Transfer tests", function () {
  let signers

  beforeEach(async function () {
    this.contract = await deployContract();

    signers = await ethers.getSigners();
    //for (let i=0; i <20; i++) {
    //  console.log(i, signers[i].address)
    //}
  });

  context("Balance checks", function () {
    it("Customer has a tokens because it has ETH", async function () {
      const balance = await this.contract.balanceOf(signers[1].address)
      expect(balance.toString()).to.equal("100000000000000000000")
    });

    it("Address ending in F has no tokens", async function () {
      const balance = await this.contract.balanceOf(signers[8].address)
      expect(balance.toString()).to.equal("0")
    });

    it("Address with no ETH has no tokens", async function () {
      const balance = await this.contract.balanceOf("0x38106f0C4Af7AAd085e7948dEf430581243654cE")
      expect(balance.toString()).to.equal("0")
    });

    it("Cannot transfer more than balance", async function () {
      // check amount bigger than balance
      await expect(
        this.contract
          .connect(signers[1])
          ["transfer(address,uint256)"](
            signers[8].address,
            "100000000000000000001"
          )
        ).to.be.revertedWith("InsufficientBalance(100000000000000000000, 100000000000000000001)") 
      // check for address with no balance
      await expect(
        this.contract
          .connect(signers[8])
          ["transfer(address,uint256)"](
            signers[1].address,
            "1"
          )
        ).to.be.revertedWith("InsufficientBalance(0, 1)") 
    });

    it("Check events emitted on token transfer", async function () {
        const tx = await this.contract
          .connect(signers[1])
          ["transfer(address,uint256)"](
            signers[8].address,
            "50000000000000000000"
          )
        const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        const interfaceTx = new ethers.utils.Interface(
          ["event Transfer(address indexed from, address indexed to, uint256 amount)"]
        )
        const data0 = receipt.logs[0].data;
        const topics0 = receipt.logs[0].topics;
        const event0 = interfaceTx.decodeEventLog("Transfer", data0, topics0)
        expect(event0[0]).to.equal("0x0000000000000000000000000000000000000000")
        expect(event0[1]).to.equal(signers[1].address)
        expect(event0[2].toString()).to.equal("100000000000000000000")
        const data1 = receipt.logs[1].data;
        const topics1 = receipt.logs[1].topics;
        const event1 = interfaceTx.decodeEventLog("Transfer", data1, topics1)
        expect(event1[0]).to.equal(signers[1].address)
        expect(event1[1]).to.equal(signers[8].address)
        expect(event1[2].toString()).to.equal("50000000000000000000")
    });

    it("Transfer of tokens results in new balance for both", async function () {
      // transfer to excluded by F address
      await this.contract
        .connect(signers[1])
        ["transfer(address,uint256)"](
          signers[8].address,
          "25000000000000000000"
        );
      const balanceFrom = await this.contract.balanceOf(signers[1].address)
      expect(balanceFrom.toString()).to.equal("75000000000000000000")
      const balanceTo = await this.contract.balanceOf(signers[8].address)
      expect(balanceTo.toString()).to.equal("25000000000000000000")
      // transfer to balance holding address
      await this.contract
        .connect(signers[1])
        ["transfer(address,uint256)"](
          signers[7].address,
          "50000000000000000000"
        );
      const balanceFrom2 = await this.contract.balanceOf(signers[1].address)
      expect(balanceFrom2.toString()).to.equal("25000000000000000000")
      const balanceTo2 = await this.contract.balanceOf(signers[7].address)
      expect(balanceTo2.toString()).to.equal("150000000000000000000")
    });

  });
});
