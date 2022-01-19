import {hre, ethers, network } from 'hardhat';
import "@nomiclabs/hardhat-waffle";
import { Contract, Signer } from 'ethers';
import { DefiBridgeProxy, AztecAssetType } from './defi_bridge_proxy';
import { expect} from "chai";


const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const daiAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount)",
  "function approve(address spender, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

const yvdaiAddress = "0xdA816459F1AB5631232FE5e97a05BBBb94970c95";
const yvdaiAbi = [
    "function deposit(uint256 _amount, address recipient) returns (uint256)",
    "function withdraw(uint256 maxShares, address recipient) returns (uint256)",
    "function balanceOf(address) view returns (uint)"
];


describe('defi bridge', function () {
    let bridgeProxy : DefiBridgeProxy;
    let signerAddress : string;
    let yearnBridgeAddress : string;
    let signer : Signer;
    let yvdai : Contract;
    let dai : Contract;
   
    before(async () => {
        
        const anEthersProvider = new ethers.providers.Web3Provider(network.provider);
        const yvdai =  new ethers.Contract(yvdaiAddress, yvdaiAbi, anEthersProvider);
        const dai =  new ethers.Contract(daiAddress, daiAbi, anEthersProvider);

        [signer] = await ethers.getSigners();
        signerAddress = await signer.getAddress();
        bridgeProxy = await DefiBridgeProxy.deploy(signer);
        const yearnBridgeAddress = await bridgeProxy.deployBridge(signer, abi, [yvdaiAddress]);


        // Fund rollup with dai.
        await hre.network.provider.request({
          method: "hardhat_impersonateAccount",
          params: ["0x6f6c07d80d0d433ca389d336e6d1febea2489264"],
        }); 
        const signer2 = await ethers.getSigner("0x6f6c07d80d0d433ca389d336e6d1febea2489264");
        await dai.connect(signer2).transfer(yearnBridgeAddress, 150);

  });

  it('should swap dai to yvDai tokens', async () => {
    const { isAsync, outputValueA, outputValueB } = await bridgeProxy.convert(
      signer,
      yearnBridgeAddress,
      {
        assetType: AztecAssetType.ERC20,
        id: 0,
        erc20Address: daiAddress, 
      },
      {},
      {
        assetType: AztecAssetType.ERC20,
        id: 1,
        erc20Address: yvdaiAddress,
      },
      {},
      100n,
      0n,
      0n,
    );

    console.log(await yvdai.balanceOf(yearnBridgeAddress));
    expect(isAsync).equal(false);
  });
});
