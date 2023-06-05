//SPDX-License-Identifier: MIT
pragma solidity >=0.8.3;
    
import { IERC20 } from "https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/contracts/interfaces/IERC20.sol";
import './Xtokens.sol';

contract myXCM {  
     
    Xtokens precompileXtokens;
    address public constant xcINTRaddress = 0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab;
    address public constant xcASTRaddress = 0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf;
    IERC20 public xcINTR;
    IERC20 public xcASTR;


    constructor() {
        xcINTR = IERC20(xcINTRaddress);
        xcASTR = IERC20(xcASTRaddress);
        precompileXtokens = Xtokens(XTOKENS_ADDRESS);
    }

    //require approval of xcINTR, xcASTR ERC20 to deposit 10000000000
    // 2032,01f0f4360fc5dbb8cd7107edf24fc3f3c9ef3914b32585062bfd7aa84e02f8b84e00,10000000000
    // 2006,01f0f4360fc5dbb8cd7107edf24fc3f3c9ef3914b32585062bfd7aa84e02f8b84e00,1000000000000000000
    function initiate_XCM(uint parachainId, string memory accountHexString, uint256 amount) external {
        
        bytes[] memory interior_ = new bytes[](2);
        address tokenAddress;

        if (parachainId==2032)
        {
            xcINTR.transferFrom(msg.sender,address(this),amount);
            xcINTR.approve(XTOKENS_ADDRESS,amount);
            tokenAddress = xcINTRaddress;
            interior_[0] = bytes(fromHex("00000007f0"));
        }
        else if (parachainId==2006)
        {
            xcASTR.transferFrom(msg.sender,address(this),amount);
            xcASTR.approve(XTOKENS_ADDRESS,amount);
            tokenAddress = xcASTRaddress;
            interior_[0] = bytes(fromHex("00000007d6"));
        }
            
        // bytes[] memory interior_ = new bytes[](2);
        // interior_[0] = bytes(fromHex(parachainHexString));
        interior_[1] = bytes(fromHex(accountHexString)); 

        // bytes[] memory interior_ = new bytes[](2);
        // interior_[0] = bytes(fromHex("00000007f0"));
        // interior_[1] = bytes(fromHex("01f0f4360fc5dbb8cd7107edf24fc3f3c9ef3914b32585062bfd7aa84e02f8b84e00"));
        // [1,["0x00000007d6","0x01f0f4360fc5dbb8cd7107edf24fc3f3c9ef3914b32585062bfd7aa84e02f8b84e00"]]

        Xtokens.Multilocation memory destination = Xtokens.Multilocation({parents: 1, interior: interior_});
        
        uint64 weight = 4000000000;  

        precompileXtokens.transfer(tokenAddress, amount, destination, weight);
    } 

    // credit to https://ethereum.stackexchange.com/questions/39989/solidity-convert-hex-string-to-bytes
    // Convert an hexadecimal character to their value
    function fromHexChar(uint8 c) public pure returns (uint8) {
        if (bytes1(c) >= bytes1('0') && bytes1(c) <= bytes1('9')) {
            return c - uint8(bytes1('0'));
        }
        if (bytes1(c) >= bytes1('a') && bytes1(c) <= bytes1('f')) {
            return 10 + c - uint8(bytes1('a'));
        }
        if (bytes1(c) >= bytes1('A') && bytes1(c) <= bytes1('F')) {
            return 10 + c - uint8(bytes1('A'));
        }
        revert("fail");
    }

    // Convert an hexadecimal string to raw bytes
    function fromHex(string memory s) public pure returns (bytes memory) {
        bytes memory ss = bytes(s);
        require(ss.length%2 == 0); // length must be even
        bytes memory r = new bytes(ss.length/2);
        for (uint i=0; i<ss.length/2; ++i) {
            r[i] = bytes1(fromHexChar(uint8(ss[2*i])) * 16 +
                        fromHexChar(uint8(ss[2*i+1])));
        }
        return r;
    }

    //FOR TESTING ONLY
    function getOurtokensOut() external {
        xcINTR.transfer(msg.sender, xcINTR.balanceOf(address(this)) );
        xcASTR.transfer(msg.sender, xcASTR.balanceOf(address(this)) );
    }


}