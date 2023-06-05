// SPDX-License-Identifier: MIT
pragma solidity  >=0.6.0 <0.8.0;

interface IStableSwap {
    // pool data view functions
    function getA() external view returns (uint256);
    function getTokenIndex(address tokenAddress) external view returns (uint8);
    function getTokenBalance(uint8 index) external view returns (uint256);
    function getVirtualPrice() external view returns (uint256);
    function getNumberOfTokens() external view returns (uint256);

// USDC,axlUSDC,amountUSDC,minimumAmount=0,Blocktimestmp+something for deadline. 6 decimals. 0.012 USDC
// 1,0,12000,0,1685908528

// axlUSDC,USDC,amount_axlSUDC,minimumAmount=0,Blocktimestmp+something for deadline 6 decimals.  0.11 axlSUSDC
// 0,1,110000,0,1685908912   
 
    function swap(
        uint8 tokenIndexFrom,
        uint8 tokenIndexTo,
        uint256 dx,
        uint256 minDy,
        uint256 deadline
    ) external returns (uint256);
}