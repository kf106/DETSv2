const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

const {
  deployContract
} = require("../test-helpers/contracts-helper");

const provider = waffle.provider;

describe("Coverage tests", function () {

  beforeEach(async function () {
    this.contract = await deployContract(100);
  });

  context("Base Coverage", function () {
    it("Name is 'DETS v2 token'", async function () {
      expect(await this.contract.name()).to.equal("DETS v2 token");
    });

    it("Symbol is 'DETSv2'", async function () {
      expect(await this.contract.symbol()).to.equal("DETSv2");
    });

    it("Total supply is 2**256-1", async function () {
      const result = await this.contract.totalSupply()
       expect(result.toString())
         .to.equal("115792089237316195423570985008687907853269984665640564039457584007913129639935")
    });

    it("Decimals are 18", async function () {
      const result = await this.contract.decimals()
      expect(result.toString()).to.equal("18");
    });

  });
});
