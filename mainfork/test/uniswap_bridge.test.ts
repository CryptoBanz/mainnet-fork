import { ethers } from 'hardhat';
import { deployErc20 } from '../deploy/deploy_erc20';
import { deployUniswap, createPair } from '../deploy/deploy_uniswap';
import abi from '../artifacts/contracts/UniswapBridge.sol/UniswapBridge.json';
import { Contract, Signer } from 'ethers';
import { DefiBridgeProxy, AztecAssetType } from './defi_bridge_proxy';


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
    "function deposit(uint256 _amount, address recipient) returns (uint256)",
    "function withdraw(uint256 maxShares, address recipient) returns (uint256)",
    "function balanceOf(address) view returns (uint)"
];

describe('defi bridge', function () {
  let bridgeProxy: DefiBridgeProxy;
  let signer: Signer;
  let signerAddress: string;

  beforeAll(async () => {
    const anEthersProvider = new ethers.providers.Web3Provider(network.provider);
    [signer] = await ethers.getSigners();
    signerAddress = await signer.getAddress();

    bridgeProxy = await DefiBridgeProxy.deploy(signer);
    yearnBridgeAddress = await bridgeProxy.deployBridge(signer, abi, [ydaiAddress]);

    // Bridge proxy can be thought of as the rollup contract. Fund it.
    // TODO: Do for tokens.
    await signer.sendTransaction({
      to: bridgeProxy.address,
      value: 10000n,
    });
  });

  it('should swap ETH to ERC20 tokens', async () => {
    // Call convert to swap ETH to ERC20 tokens and return them to caller.
    const { isAsync, outputValueA, outputValueB } = await bridgeProxy.convert(
      signer,
      uniswapBridgeAddress,
      {
        assetType: AztecAssetType.ETH,
        id: 0,
      },
      {},
      {
        assetType: AztecAssetType.ERC20,
        id: 1,
        erc20Address: erc20.address,
      },
      {},
      1000n,
      1n,
      0n,
    );

    const proxyBalance = BigInt((await erc20.balanceOf(bridgeProxy.address)).toString());
    expect(proxyBalance).toBe(outputValueA);
    expect(outputValueB).toBe(0n);
    expect(isAsync).toBe(false);
  });
});
