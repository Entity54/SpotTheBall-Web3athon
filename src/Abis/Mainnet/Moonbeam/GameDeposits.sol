//SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

import './AxelarGameManager.sol';
import { IERC20 } from "https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/contracts/interfaces/IERC20.sol";
import './IStellaSwap.sol';  //1


// WDEV Moonbeam 0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715 Binance 0xa893Fd868c3159B294f6416F512203be53315fd8
// axlUSDC Moonbeam 0xCa01a1D0993565291051daFF390892518ACfAD3A

contract GameDeposits { 
 
    address public admin;     
    address public axelarManagerAddress; 
    address public stellaSwapAddress;  //2
    IStellaSwap public dex; //3

    address public constant xcINTRaddress = 0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab;    //10 decimals
    address public constant xcASTRaddress = 0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf;    //18 decimals
    address public constant WGLMR_address = 0xAcc15dC74880C9944775448304B263D191c6077F;    //18 decimals
    address public constant xcDOT_address = 0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080;    //10 decimals
    address public constant USDC_address = 0x931715FEE2d06333043d11F658C8CE934aC61D0c;     //6 decimals
    address public constant axlUSDC_address = 0xCa01a1D0993565291051daFF390892518ACfAD3A;  //6 decimals

    IERC20 public xcINTR;
    IERC20 public xcASTR;
    IERC20 public USDC;

   
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
        USDC = IERC20(USDC_address);
    }

    function set_Game_Manager(address _gameManager, bool approveManager) public onlyAdmin {
        gameManagers[_gameManager] = approveManager;
    }

    //Moonbeam WDEV,0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715   
    //Moonbeam axlUSDC,0xCa01a1D0993565291051daFF390892518ACfAD3A
    function setAcceptedCurrency(string memory _gameTokenSymbol, address _gameTokenCurrency) external onlyGameAuthority {
        gameTokenCurrency = _gameTokenCurrency;
        gameTokenSymbol = _gameTokenSymbol;
        gameToken = IERC20(_gameTokenCurrency);
    }

    function set_Axelar_Manager(address _axelarManagerAddress) public onlyGameAuthority {
        axelarManagerAddress = _axelarManagerAddress;
    }
    
    // 0x24aA375Ba88cC6751c2998fA24B007C48d0bA6a4
    function set_StellaSwap(address _stellaSwapAddress) public onlyGameAuthority { //4
        stellaSwapAddress = _stellaSwapAddress;
        dex = IStellaSwap(_stellaSwapAddress);
    }
  
    // Call this function once XCM completes
    // If player pays with gaemToken he needs to APPROVE this contract   
    //Example: WDEV,ab,10000000001, axlUSDC,ab,1000000  INTR,ab,10000000000 ASTR,ab,1000000000000000000
    function allocateDeposits(string memory symbol, string memory gameHash, uint amount) external { 

        if (keccak256(bytes(symbol)) == keccak256(bytes("INTR")) )
        {
            gameDeposit_INTR[gameHash] +=amount;
            xcINTR.transferFrom(msg.sender,address(this),amount);
        } 
        else if (keccak256(bytes(symbol)) == keccak256(bytes("ASTR")) )
        {
            gameDeposit_ASTR[gameHash] +=amount;
            xcASTR.transferFrom(msg.sender,address(this),amount);
        }  
        else if (keccak256(bytes(symbol)) == keccak256(bytes(gameTokenSymbol)) )  //keccak256(bytes("AXLUSDC"))
        {
            gameDeposit_AXLUSDC[gameHash] +=amount;
            gameToken.transferFrom(msg.sender,address(this),amount);
        }  
    } 

    function depositFundsToGame(string memory gameHash) external onlyGameAuthority {
        uint balance_INTR = xcINTR.balanceOf(address(this));
        uint balance_ASTR = xcASTR.balanceOf(address(this));

        if ( balance_INTR > 0)
        {
            //Swap xcINTR to axlUSDC This captures also Parachain Transfers
            xcINTR.approve(stellaSwapAddress,balance_INTR);
            uint amountOut_USDC = dex.swapExactInputMulti3hops(xcINTRaddress,WGLMR_address,USDC_address,balance_INTR);

            USDC.approve(stellaSwapAddress,amountOut_USDC);
            uint amountOut_axlUSDC =  dex.stableSwapExactInput(USDC_address,axlUSDC_address,amountOut_USDC);

            gameDeposit_AXLUSDC[gameHash] +=amountOut_axlUSDC;
            gameDeposit_INTR[gameHash] = 0;
        }

        if ( balance_ASTR > 0)
        {
            //Swap xcASTR to axlUSDC This captures also Parachain Transfers
            xcASTR.approve(stellaSwapAddress,balance_ASTR);
            uint amountOut_USDC = dex.swapExactInputMulti4hops(xcASTRaddress,xcDOT_address,WGLMR_address,USDC_address,balance_ASTR);
            
            USDC.approve(stellaSwapAddress,amountOut_USDC);
            uint amountOut_axlUSDC =  dex.stableSwapExactInput(USDC_address,axlUSDC_address,amountOut_USDC);

            gameDeposit_AXLUSDC[gameHash] +=amountOut_axlUSDC;
            gameDeposit_ASTR[gameHash] = 0; 
        }


        uint amount = gameDeposit_AXLUSDC[gameHash];

//COMMENTED OUT FOR TESTING   
        if (amount > 0)
        {
            gameToken.approve(axelarManagerAddress,amount);
            AxelarGameManager(axelarManagerAddress).payToPlayGame(gameHash, amount);

            gameDeposit_AXLUSDC[gameHash] = 0;
        } 

    }     
   
 
    //ONLY FOR TESTING     
    function getMyaxlUSDCout() external onlyGameAuthority {
        gameToken.transfer(msg.sender, gameToken.balanceOf(address(this)) );
    }

}
