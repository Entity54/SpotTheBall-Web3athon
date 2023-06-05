//SPDX-License-Identifier: MIT
pragma solidity >=0.8.3;
 
interface ImyXCM {
    function initiate_XCM(uint parachainId, string memory accountHexString, uint256 amount) external;
}