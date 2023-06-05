//SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

import './AxelarGameManager.sol';
import { IERC20 } from "https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/contracts/interfaces/IERC20.sol";

// WDEV Binance 0xa893Fd868c3159B294f6416F512203be53315fd8

contract GameDeposits { 
 
    address public admin;     
    address public axelarManagerAddress; 
 
    //Game currency 
    address public gameTokenCurrency;
    IERC20 public gameToken;
    string public gameTokenSymbol;
    
     // Game Managers
    mapping(address => bool) public gameManagers;  //is address an approved game manager

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
    }

    function set_Game_Manager(address _gameManager, bool approveManager) public onlyAdmin {
        gameManagers[_gameManager] = approveManager;
    }

    //Binance WDEV,0xa893Fd868c3159B294f6416F512203be53315fd8   
    function setAcceptedCurrency(string memory _gameTokenSymbol, address _gameTokenCurrency) external onlyGameAuthority {
        gameTokenCurrency = _gameTokenCurrency;
        gameTokenSymbol = _gameTokenSymbol;
        gameToken = IERC20(_gameTokenCurrency);
    }

    function set_Axelar_Manager(address _axelarManagerAddress) public onlyGameAuthority {
        axelarManagerAddress = _axelarManagerAddress;
    }
 
    // If player pays with gameToken he needs to APPROVE this contract   Example: WDEV,ab,10000000001 
    function allocateDeposits(string memory symbol, string memory gameHash, uint amount) external {
    
        if (keccak256(bytes(symbol)) == keccak256(bytes(gameTokenSymbol)) )  //keccak256(bytes("axlUSDC"))  or keccak256(bytes("WDEV"))
        {
            gameDeposit_AXLUSDC[gameHash] +=amount;
            gameToken.transferFrom(msg.sender,address(this),amount);
        }  
    }  

    function depositFundsToGame(string memory gameHash) external onlyGameAuthority {
        uint amount = 0;
       
        //reserve for multiple currencies e.g. USDT
        if ( gameDeposit_AXLUSDC[gameHash] > 0)
        {
            amount +=gameDeposit_AXLUSDC[gameHash];
        }

        if (amount > 0)
        {
            gameToken.approve(axelarManagerAddress,amount);
            AxelarGameManager(axelarManagerAddress).payToPlayGame(gameHash, amount);

            gameDeposit_AXLUSDC[gameHash] = 0;
        }

    }  

}
