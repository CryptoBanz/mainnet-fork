const { expect } = require('chai');
const { ethers } = require("hardhat");


const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const daiAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

describe('mint', function () {
  before(async function () {
    this.ERC20 = await ethers.getContractFactory('ERC20Mintable');
    [addr1, addr2, addr3, addr4, _] = await ethers.getSigners();

  });

  beforeEach(async function () {
    this.erc20 = await this.ERC20.deploy();
    await this.erc20.deployed();
  });

  it('mint it', async function () {
    await this.erc20.mint(addr1.address, 10);
    
      expect(await this.erc20.balanceOf(addr1.address)).to.equal(10);

  });

  it('dai balance', async function () {
      //.... I need the bytecode and abi, not only an interface?
    //const provider = new ethers.provider;
    const anEthersProvider = new ethers.providers.Web3Provider(network.provider);
    const dai =  new ethers.Contract(daiAddress, daiAbi, anEthersProvider);
    balance = await dai.balanceOf("0x6b29a3f9a1e378a57410dc480c1b19f4f89de848"); 
    console.log(balance)


  });

});
