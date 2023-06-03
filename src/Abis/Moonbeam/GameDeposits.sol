//SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

import './AxelarGameManager.sol';
import { IERC20 } from "https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/contracts/interfaces/IERC20.sol";

// WDEV Moonbeam 0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715. Binance 0xa893Fd868c3159B294f6416F512203be53315fd8

contract GameDeposits { 
 
    address public admin;     
    address public axelarManagerAddress; 

    address public constant xcINTRaddress = 0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab;
    address public constant xcASTRaddress = 0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf;
    IERC20 public xcINTR;
    IERC20 public xcASTR;
 
    //Game currency 
    address public gameTokenCurrency;
    IERC20 public gameToken;
    string public gameTokenSymbol;
    
     // Game Managers
    mapping(address => bool) public gameManagers;  //is address an approved game manager

    mapping(string => uint) public gameDeposit_INTR;      // gameHash => total
    mapping(string => uint) public gameDeposit_ASTR;      // gameHash => total
    mapping(string => uint) public gameDeposit_AXLUSDC;   // gameHash => total
  
    modifier onlyAdmin {
        require(msg.sender==admin,"action only for admin");
        _;
    } 
    modifier onlyGameAuthority {
        require(msg.sender==admin || gameManagers[msg.sender] ,"action only for game authority");
        _;
    }  
   
  
    constructor() {
        admin = msg.sender; 
        xcINTR = IERC20(xcINTRaddress);
        xcASTR = IERC20(xcASTRaddress);
    }

    function set_Game_Manager(address _gameManager, bool approveManager) public onlyAdmin {
        gameManagers[_gameManager] = approveManager;
    }

    //Moonbeam WDEV,0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715
    function setAcceptedCurrency(string memory _gameTokenSymbol, address _gameTokenCurrency) external onlyGameAuthority {
        gameTokenCurrency = _gameTokenCurrency;
        gameTokenSymbol = _gameTokenSymbol;
        gameToken = IERC20(_gameTokenCurrency);
    }

    function set_Axelar_Manager(address _axelarManagerAddress) public onlyGameAuthority {
        axelarManagerAddress = _axelarManagerAddress;
    }
 
    // Call this function once XCM completes
    // If player pays with gaemToken he needs to APPROVE this contract   Example: WDEV,ab,10000000001 
    function allocateDeposits(string memory symbol, string memory gameHash, uint amount) external onlyGameAuthority{

        if (keccak256(bytes(symbol)) == keccak256(bytes("INTR")) )
        {
            gameDeposit_INTR[gameHash] +=amount;
        } 
        else if (keccak256(bytes(symbol)) == keccak256(bytes("ASTR")) )
        {
            gameDeposit_ASTR[gameHash] +=amount;
        }  
        else if (keccak256(bytes(symbol)) == keccak256(bytes(gameTokenSymbol)) )  //keccak256(bytes("AXLUSDC"))
        {
            gameDeposit_AXLUSDC[gameHash] +=amount;
            gameToken.transferFrom(msg.sender,address(this),amount);
        }  
    } 

    function depositFundsToGame(string memory gameHash) external onlyGameAuthority {
        uint amount = 0;
        if ( gameDeposit_INTR[gameHash] > 0)
        {
            //Swap INTR to axlUSDC 
            amount +=0;
        }
        else if ( gameDeposit_ASTR[gameHash] > 0)
        {
            //Swap ASTR to axlUSDC
            amount +=0;
        }
        else if ( gameDeposit_AXLUSDC[gameHash] > 0)
        {
            amount +=gameDeposit_AXLUSDC[gameHash];
        }

        if (amount > 0)
        {
            gameToken.approve(axelarManagerAddress,amount);
            AxelarGameManager(axelarManagerAddress).payToPlayGame(gameHash, amount);
        }

    }  

}
