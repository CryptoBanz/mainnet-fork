// SPDX-License-Identifier: GPL-2.0-only
// Copyright 2020 Spilsbury Holdings Ltd
pragma solidity 0.8.0;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { IDefiBridge } from "./interfaces/IDefiBridge.sol";
import { Types } from "./Types.sol";

import 'hardhat/console.sol';

interface VaultAPI {
    function deposit(uint256 amount, address recipient) external returns (uint256);
    function withdraw(uint256 maxShares, address recipient) external returns (uint256);
}

contract YearnBridge is IDefiBridge {
  using SafeMath for uint256;

  address public immutable rollupProcessor;
  address public immutable yvdaiAddress= 0xdA816459F1AB5631232FE5e97a05BBBb94970c95; 
  address public immutable daiAddress= 0x6B175474E89094C44Da98b954EedeAC495271d0F; 

  constructor(address _rollupProcessor) public {
    rollupProcessor = _rollupProcessor;
  }

  receive() external payable {}

  function convert(
    Types.AztecAsset calldata inputAssetA,
    Types.AztecAsset calldata,
    Types.AztecAsset calldata outputAssetA,
    Types.AztecAsset calldata,
    uint256 inputValue,
    uint256,
    uint64
  )
    external
    payable
    override
    returns (
      uint256 outputValueA,
      uint256,
      bool isAsync
    )
  {
    require(
            msg.sender == rollupProcessor,
            "YearnBrdige: INVALID_CALLER"
        );

    isAsync = false;
    
    IERC20 daiContract = IERC20(daiAddress);

    // Deposit
    if(inputAssetA.erc20Address == daiAddress ){
        console.log('---- Starting deposit ----');
        VaultAPI vault = VaultAPI(outputAssetA.erc20Address);
        daiContract.approve(rollupProcessor, inputValue);
        uint256 outputValueA = vault.deposit(inputValue, rollupProcessor);
    } 

    // Withdraw 
    else {
        console.log('---- Starting withdraw ----');
        VaultAPI vault = VaultAPI(inputAssetA.erc20Address);
        uint256 outputValueA = vault.withdraw(inputValue, rollupProcessor);
    } 

  }


  function canFinalise(
    uint256 /*interactionNonce*/
  ) external view override returns (bool) {
    return false;
  }

  function finalise(
    Types.AztecAsset calldata,
    Types.AztecAsset calldata,
    Types.AztecAsset calldata,
    Types.AztecAsset calldata,
    uint256,
    uint64
  ) external payable override returns (uint256, uint256) {
    require(false);
  }
}
