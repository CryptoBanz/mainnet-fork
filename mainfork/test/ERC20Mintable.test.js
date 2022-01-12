// test/Box.test.js
// Load dependencies
const { expect } = require('chai');
const { ethers } = require("hardhat");

// Start test block
describe('mint', function () {
  before(async function () {
    this.ERC20 = await ethers.getContractFactory('ERC20Mintable')
    const [owner, addr1] = await ethers.getSigners();
  });

  beforeEach(async function () {
    this.erc20 = await this.ERC20.deploy();
    await this.erc20.deployed();
  });

  it('mint it', async function () {
    await this.erc20.mint(addr1.address, 10);
    

  });
});
