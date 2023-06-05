//SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

import { IERC20 } from "https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/contracts/interfaces/IERC20.sol";
import './IStellaSwap.sol';  //1

// WDEV Moonbeam 0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715. Binance 0xa893Fd868c3159B294f6416F512203be53315fd8
/**
  => register players and have full details so we know which account and chain to send prize to
  => register winner
  ==> pay winner
*/
    
contract GamePlayers { 

    address public admin;  
    address public stellaSwapAddress;  //2
    IStellaSwap public dex; //3

    address public constant xcINTRaddress = 0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab;
    address public constant xcASTRaddress = 0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf;
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

    struct Player {
        address   playerEVMAddress;
        string    playerEVMAddressString;    
        string    playerChain;            //ASTAR,INTERLAY,Moonbeam
        string    playerSubstrateAddressString;  
        string    playerHex;
    }   
    mapping(address => Player) public players;          // playerEVMAddress => Player struct
    mapping(string => Player) public gameWinner;        // gameHash => Winner
    mapping(string => uint) public gameWinningsAXLUSD;  // gameHash => Winnings in AXLUSDC
    mapping(string => bool) public gameState;           // gameHash => true for active game

    mapping(string => uint) public gameDeposit_INTR;      // gameHash => total
    mapping(string => uint) public gameDeposit_ASTR;      // gameHash => total

    string public winnerPaidInThisChain;
 
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

    // 0x24aA375Ba88cC6751c2998fA24B007C48d0bA6a4
    function set_StellaSwap(address _stellaSwapAddress) public onlyGameAuthority { //4
        stellaSwapAddress = _stellaSwapAddress;
        dex = IStellaSwap(_stellaSwapAddress);
    }

    function activateGame(string memory gameHash) external onlyGameAuthority {
        gameState[gameHash] = !gameState[gameHash];
    }

    function readPlayer(address _playerEVMadddress) external view returns(Player memory gameplayer) {
        gameplayer = players[_playerEVMadddress];
    }
   
    // 0xa95b7843825449DC588EC06018B48019D1111000,"0xa95b7843825449DC588EC06018B48019D1111000","Moonbeam","5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb","0xa95b7843825449DC588EC06018B48019D1111000D1111000"
    // 0xa95b7843825449DC588EC06018B48019D1111000,"0xa95b7843825449DC588EC06018B48019D1111000","INTERLAY","5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb","0xa95b7843825449DC588EC06018B48019D1111000D1111000"
    // 0xa95b7843825449DC588EC06018B48019D1111000,"0xa95b7843825449DC588EC06018B48019D1111000","ASTAR","5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb","0xa95b7843825449DC588EC06018B48019D1111000D1111000"
    function registerPlayer(address _playerEVMadddress , string memory _playerEVMAddressString, string memory _playerChain, string memory _playerSubstrateAddressString, string memory _playerHex) external {
            players[_playerEVMadddress] = Player({ 
                                                    playerEVMAddress: _playerEVMadddress, 
                                                    playerEVMAddressString: _playerEVMAddressString, 
                                                    playerChain: _playerChain, 
                                                    playerSubstrateAddressString: _playerSubstrateAddressString, 
                                                    playerHex: _playerHex 
                                                });
    } 
    
    // 0xa95b7843825449DC588EC06018B48019D1111000,abc,1000000
    function registerWinner(address winnerEVMadddress, string memory gameHash, uint winnings) external onlyGameAuthority {
            Player memory winner = players[winnerEVMadddress];
            gameWinner[gameHash] = winner;
            gameWinningsAXLUSD[gameHash] = winnings;
            gameToken.transferFrom(msg.sender, address(this), winnings);
    }
 
    function payWinner(string memory gameHash) external { 

            Player memory winner = gameWinner[gameHash];

            if (winner.playerEVMAddress!=address(0))
            {
                uint winningsAXLUSD = gameWinningsAXLUSD[gameHash];

                if (keccak256(bytes(winner.playerChain)) == keccak256(bytes("INTERLAY")) )
                {
                    // SWAP AXLUSDC TO INTR
                    gameToken.approve(stellaSwapAddress,winningsAXLUSD);
                    uint amountOut_USDC =  dex.stableSwapExactInput(axlUSDC_address,USDC_address,winningsAXLUSD);

                    USDC.approve(stellaSwapAddress,amountOut_USDC);
                    uint amountOut_xcINTR = dex.swapExactInputMulti3hops(USDC_address,WGLMR_address,xcINTRaddress,amountOut_USDC);
                
                    gameDeposit_INTR[gameHash] = amountOut_xcINTR;

                    //SEND INTR TO winner.playerSubstrateAddressString in  Interlay using his winner.playerHex
                    execute_XCM_Transfers(gameHash);

                    winnerPaidInThisChain = "INTERLAY";
                    gameState[gameHash] = false;
                }
                else if (keccak256(bytes(winner.playerChain)) == keccak256(bytes("ASTAR")) )
                {
                    // SWAP AXLUSDC TO ASTR
                    gameToken.approve(stellaSwapAddress,winningsAXLUSD);
                    uint amountOut_USDC =  dex.stableSwapExactInput(axlUSDC_address,USDC_address,winningsAXLUSD);

                    USDC.approve(stellaSwapAddress,amountOut_USDC);
                    uint amountOut_xcASTR = dex.swapExactInputMulti4hops(USDC_address,WGLMR_address,xcDOT_address,xcASTRaddress,amountOut_USDC);
                
                    gameDeposit_ASTR[gameHash] = amountOut_xcASTR;

                    //SEND ASTR TO winner.playerSubstrateAddressString in  Astar using his winner.playerHex
                    execute_XCM_Transfers(gameHash);

                    winnerPaidInThisChain = "ASTAR";
                    gameState[gameHash] = false;
                }
                else  
                {
                    // Winner is Moonbeam or Binance based
                    gameToken.transfer(winner.playerEVMAddress, winningsAXLUSD);

                    winnerPaidInThisChain = "MOONBEAM or BINANCE";
                    gameState[gameHash] = false;   
                } 

            }
            else
            {
                winnerPaidInThisChain = "NO PAYMENT";
            }


    }  

    function execute_XCM_Transfers(string memory gameHash) public { 
    
            Player memory winner = gameWinner[gameHash];

            if (keccak256(bytes(winner.playerChain)) == keccak256(bytes("INTERLAY")) &&   gameDeposit_INTR[gameHash] > 0 )
            {
                    //TEST transfer to local MoonbeamAccount. Comment out once XCM is enabled
                    xcINTR.transfer(admin, gameDeposit_INTR[gameHash] );

                    // Todo SEND INTR TO winner.playerSubstrateAddressString in  Interlay using his winner.playerHex

                    gameDeposit_INTR[gameHash] = 0;
            }
            else if (keccak256(bytes(winner.playerChain)) == keccak256(bytes("ASTAR")) && gameDeposit_ASTR[gameHash] > 0)
            {
                    //TEST transfer to local MoonbeamAccount. Comment out once XCM is enabled
                    xcASTR.transfer(admin, gameDeposit_ASTR[gameHash] );

                    //Todo SEND ASTR TO winner.playerSubstrateAddressString in  Astar using his winner.playerHex

                    gameDeposit_ASTR[gameHash]  = 0;
            }

    }

    //ONLY FOR TESTING
    function getMyaxlUSDCout() external onlyGameAuthority {
        gameToken.transfer(msg.sender, gameToken.balanceOf(address(this)) );
    }

}