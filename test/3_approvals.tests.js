const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContract } = require("../test-helpers/contracts-helper");

const gasPrice = 150000000
const gasLimit = 15000000000

describe("Approvals tests", function () {
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

  context("Approval checks", function () {
    it("Approved tokens can be moved", async function () {
      let balance = await this.contract.balanceOf(aAddr.address)
      expect(balance.toString()).to.equal("100000000000000000000")
      await this.contract.connect(aAddr).approve(fAddr.address, "100000000000000000000", {gasPrice: gasPrice, gasLimit: gasLimit})
      await this.contract
          .connect(fAddr)
          ["transferFrom(address,address,uint256)"](
            aAddr.address,
            fAddr.address,
            "100000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
          )
      balance = await this.contract.balanceOf(fAddr.address)
      expect(balance.toString()).to.equal("100000000000000000000")
      balance = await this.contract.balanceOf(aAddr.address)
      expect(balance.toString()).to.equal("0")
    });

    it("Allowance matches", async function () {
      let balance = await this.contract.balanceOf(aAddr.address)
      expect(balance.toString()).to.equal("100000000000000000000")
      await this.contract.connect(aAddr).approve(fAddr.address, "800000000000000000000", {gasPrice: gasPrice, gasLimit: gasLimit})
      const allowance = await this.contract.allowance(aAddr.address, fAddr.address, {gasPrice: gasPrice, gasLimit: gasLimit})
      expect(allowance.toString()).to.equal("800000000000000000000")
    });

    it("Increase allowance matches", async function () {
      let balance = await this.contract.balanceOf(aAddr.address)
      expect(balance.toString()).to.equal("100000000000000000000")
      await this.contract.connect(aAddr).increaseAllowance(fAddr.address, "800000000000000000000", {gasPrice: gasPrice, gasLimit: gasLimit})
      let allowance = await this.contract.allowance(aAddr.address, fAddr.address, {gasPrice: gasPrice, gasLimit: gasLimit})
      expect(allowance.toString()).to.equal("800000000000000000000")
      await this.contract.connect(aAddr).increaseAllowance(fAddr.address, "800000000000000000000", {gasPrice: gasPrice, gasLimit: gasLimit})
      allowance = await this.contract.allowance(aAddr.address, fAddr.address, {gasPrice: gasPrice, gasLimit: gasLimit})
      expect(allowance.toString()).to.equal("1600000000000000000000")
    });

    it("Decrease allowance matches", async function () {
      let balance = await this.contract.balanceOf(aAddr.address)
      expect(balance.toString()).to.equal("100000000000000000000")
      await this.contract.connect(aAddr).increaseAllowance(fAddr.address, "800000000000000000000", {gasPrice: gasPrice, gasLimit: gasLimit})
      let allowance = await this.contract.allowance(aAddr.address, fAddr.address, {gasPrice: gasPrice, gasLimit: gasLimit})
      expect(allowance.toString()).to.equal("800000000000000000000")
      await this.contract.connect(aAddr).decreaseAllowance(fAddr.address, "400000000000000000000", {gasPrice: gasPrice, gasLimit: gasLimit})
      allowance = await this.contract.allowance(aAddr.address, fAddr.address, {gasPrice: gasPrice, gasLimit: gasLimit})
      expect(allowance.toString()).to.equal("400000000000000000000")
    });

    it("Cannot decrease allowance below 0", async function () {
      let balance = await this.contract.balanceOf(aAddr.address)
      expect(balance.toString()).to.equal("100000000000000000000")
      await expect(
        this.contract.connect(aAddr)
        .decreaseAllowance(fAddr.address, "400000000000000000000", {gasPrice: gasPrice, gasLimit: gasLimit})
      ).to.be.reverted
      const allowance = await this.contract.allowance(aAddr.address, fAddr.address, {gasPrice: gasPrice, gasLimit: gasLimit})
      expect(allowance.toString()).to.equal("0")
    });

    it("Cannot move more than approved", async function () {
      let balance = await this.contract.balanceOf(aAddr.address)
      expect(balance.toString()).to.equal("100000000000000000000")
      await this.contract.connect(aAddr).approve(fAddr.address, "10000000000000000000", {gasPrice: gasPrice, gasLimit: gasLimit})
      await expect(this.contract
          .connect(fAddr)
          ["transferFrom(address,address,uint256)"](
            aAddr.address,
            fAddr.address,
            "50000000000000000000", 
          {gasPrice: gasPrice, gasLimit: gasLimit}
          )).to.be.reverted
      balance = await this.contract.balanceOf(aAddr.address)
      expect(balance.toString()).to.equal("100000000000000000000")
      balance = await this.contract.balanceOf(fAddr.address)
      expect(balance.toString()).to.equal("0")
    });

    it("Cannot approve for zero address", async function () {
      let balance = await this.contract.balanceOf(aAddr.address)
      expect(balance.toString()).to.equal("100000000000000000000")
      await expect(
         this.contract
          .connect(aAddr)
          .approve("0x0000000000000000000000000000000000000000", "800000000000000000000", {gasPrice: gasPrice, gasLimit: gasLimit})
      ).to.be.reverted
    });

  });
});
