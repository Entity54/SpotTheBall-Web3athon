//SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

import { IERC20 } from "https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/contracts/interfaces/IERC20.sol";

// WDEV Binance 0xa893Fd868c3159B294f6416F512203be53315fd8
    
contract GamePlayers { 

    address public admin;     

    //Game currency
    address public gameTokenCurrency;
    IERC20 public gameToken;
    string public gameTokenSymbol;
    // Game Managers
    mapping(address => bool) public gameManagers;  //is address an approved game manager

    struct Player {
        address   playerEVMAddress;
        string    playerEVMAddressString;    
        string    playerChain;            //Astar,Interlay,Moonbeam
        string    playerSubstrateAddressString;  
        string    playerHex;
    }   
    mapping(address => Player) public players;          // playerEVMAddress => Player struct
    mapping(string => Player) public gameWinner;        // gameHash => Winner
    mapping(string => uint) public gameWinningsAXLUSD;  // gameHash => Winnings in AXLUSDC
    mapping(string => bool) public gameState;           // gameHash => true for active game

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

    function activateGame(string memory gameHash) external onlyGameAuthority {
        gameState[gameHash] = true;     
    }

    function readPlayer(address _playerEVMadddress) external view returns(Player memory gameplayer) {
        gameplayer = players[_playerEVMadddress];
    }
   
    // 0xa95b7843825449DC588EC06018B48019D1111000,"0xa95b7843825449DC588EC06018B48019D1111000","Moonbeam","5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb","0xa95b7843825449DC588EC06018B48019D1111000D1111000"
    function registerPlayer(address _playerEVMadddress , string memory _playerEVMAddressString, string memory _playerChain, string memory _playerSubstrateAddressString, string memory _playerHex) external {
            players[_playerEVMadddress] = Player({ 
                                                    playerEVMAddress: _playerEVMadddress, 
                                                    playerEVMAddressString: _playerEVMAddressString, 
                                                    playerChain: _playerChain, 
                                                    playerSubstrateAddressString: _playerSubstrateAddressString, 
                                                    playerHex: _playerHex 
                                                });
    } 
    
    function registerWinner(address winnerEVMadddress, string memory gameHash, uint winnings) external onlyGameAuthority {
            Player memory winner = players[winnerEVMadddress];
            gameWinner[gameHash] = winner;
            gameWinningsAXLUSD[gameHash] = winnings;
            gameToken.transferFrom(msg.sender, address(this), winnings);
    }
 
    function payWinner(string memory gameHash) external onlyGameAuthority { 

            Player memory winner = gameWinner[gameHash];

            if (winner.playerEVMAddress!=address(0))
            {
                uint winningsAXLUSD = gameWinningsAXLUSD[gameHash];
                
                gameToken.transfer(winner.playerEVMAddress, winningsAXLUSD);
                winnerPaidInThisChain = "BINANCE";
                gameState[gameHash] = false;  
            }
            else
            {
                winnerPaidInThisChain = "NO PAYMENT";
            }

    }

}