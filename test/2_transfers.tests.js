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
    it("Customer has a balance because it has ETH", async function () {
      console.log(signers[1].address)
      const balance = await this.contract.balanceOf(signers[1].address)
      console.log(balance)
      expect(balance.toString()).to.equal("100000000000000000000")
    });

    it("Address ending in F has no balance", async function () {
      console.log(signers[8].address)
      const balance = await this.contract.balanceOf(signers[8].address)
      console.log(balance)
      expect(balance.toString()).to.equal("0")
    });

    it("Address with no ETH has no balance", async function () {
      const balance = await this.contract.balanceOf("0x38106f0C4Af7AAd085e7948dEf430581243654cE")
      console.log(balance)
      expect(balance.toString()).to.equal("0")
    });


  /*
    it("Cannot transfer own token twice", async function () {
      await this.contract.setLocked(false);
      await this.contract
        .connect(customer)
        ["safeTransferFrom(address,address,uint256)"](
          customer.address,
          bystander.address,
          0
        );
      expect(await this.contract.ownerOf(0)).to.equal(bystander.address);
      await expect(
        this.contract
          .connect(customer)
          ["safeTransferFrom(address,address,uint256)"](
            bystander.address,
            customer.address,
            0
          )
      ).to.be.reverted;
    });

    it("Can transfer token back", async function () {
      await this.contract.setLocked(false);
      await this.contract
        .connect(customer)
        ["safeTransferFrom(address,address,uint256)"](
          customer.address,
          bystander.address,
          0
        );
      expect(await this.contract.ownerOf(0)).to.equal(bystander.address);
      await this.contract
        .connect(bystander)
        ["safeTransferFrom(address,address,uint256)"](
          bystander.address,
          customer.address,
          0
        );
      expect(await this.contract.ownerOf(0)).to.equal(customer.address);
    });

    it("Cannot transfer other person's token", async function () {
      await this.contract.setLocked(false);
      await expect(
        this.contract
          .connect(bystander)
          ["safeTransferFrom(address,address,uint256)"](
            customer.address,
            bystander.address,
            0
          )
      ).to.be.reverted;
      expect(await this.contract.ownerOf(0)).to.equal(customer.address);
    });
  });

  context("Single transfers when locked", function () {
    it("Cannot transfer single locked token", async function () {
      await this.contract.setLocked(true);
      await expect(
        this.contract
          .connect(customer)
          ["safeTransferFrom(address,address,uint256)"](
            customer.address,
            bystander.address,
            0
          )
      ).to.be.revertedWith("Transfers locked");
      expect(await this.contract.ownerOf(0)).to.equal(customer.address);
    });

    it("Operator can transfer single locked token", async function () {
      await this.contract.setLocked(true);
      await this.contract.setOperator(customer.address);
      await this.contract
        .connect(customer)
        ["safeTransferFrom(address,address,uint256)"](
          customer.address,
          bystander.address,
          0
        );
      expect(await this.contract.ownerOf(0)).to.equal(bystander.address);
    });

  */
  });
});
