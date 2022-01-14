const { expect } = require('chai');
const { ethers } = require("hardhat");


const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const daiAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount)",
  "function approve(address spender, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

const ydaiAddress = "0xdA816459F1AB5631232FE5e97a05BBBb94970c95";
const ydaiAbi = [
    "function deposit() returns (uint256)",
    "function deposit(uint256 amount) returns (uint256)",
    "function deposit(uint256 amount, address recipient) returns (uint256)",
    "function withdraw() returns (uint256)",
    "function withdraw(uint256 maxShares) returns (uint256)",
    "function withdraw(uint256 maxShares, address recipient) returns (uint256)",
    "function balanceOf(address) view returns (uint)"
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
    const anEthersProvider = new ethers.providers.Web3Provider(network.provider);
    const dai =  new ethers.Contract(daiAddress, daiAbi, anEthersProvider);
    balance = await dai.balanceOf("0x6b29a3f9a1e378a57410dc480c1b19f4f89de848"); 
    console.log(balance)

  });

  it('dai balance', async function () {
    const anEthersProvider = new ethers.providers.Web3Provider(network.provider);
    const ydai =  new ethers.Contract(ydaiAddress, ydaiAbi, anEthersProvider);
    const dai =  new ethers.Contract(daiAddress, daiAbi, anEthersProvider);
    
    // Impersenate account with dai and try to deposit.
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x6f6c07d80d0d433ca389d336e6d1febea2489264"],
    }); 
    const signer = await ethers.getSigner("0x6f6c07d80d0d433ca389d336e6d1febea2489264");

    await dai.connect(signer).transfer(addr2.address, 150);
    
    //console.log(await dai.balanceOf(addr1.address));
    //console.log(await dai.balanceOf(addr2.address));
    //console.log(await dai.balanceOf("0x6f6c07d80d0d433ca389d336e6d1febea2489264"));

    await dai.connect(addr2).approve(daiAddress, 100); 
    const receivedToken =  await ydai.connect(addr2).deposit(100, daiAddress);
    console.log(receivedToken); 




  });

});
