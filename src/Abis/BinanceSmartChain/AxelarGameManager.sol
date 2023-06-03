//SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;
import {IAxelarGateway} from "https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/contracts/interfaces/IAxelarGasService.sol";
import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import { IERC20 } from "https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/contracts/interfaces/IERC20.sol";
import { StringToAddress, AddressToString } from "https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/contracts/utils/AddressString.sol";

import './GamePlayers.sol';


//Gas Service Contract: 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
//Chain Name: Moonbeam (Moonbase)   Gateway Contract: 0x5769D84DD62a6fD969856c75c7D321b84d455929. WDEV 0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715
//Chain Name: binance               Gateway Contract: 0x4D147dCb984e6affEEC47e44293DA442580A3Ec0. WDEV 0xa893Fd868c3159B294f6416F512203be53315fd8
//0x63822F323DBb687Fa27EB6E3a79c0caE5aDe8753

contract AxelarGameManager is AxelarExecutable {
    using StringToAddress for string;
    using AddressToString for address;

    string public chainName;
    address public admin;
    address public routerAddress;   //router is GamePlayers.sol responsible to send winnings , convert and send to winner
    GamePlayers router;

    //Axelar
    IAxelarGasService public immutable gasService;
    string public sourceChain;
    string public sourceAddress;
    mapping(string => address) public satelites;
    mapping(string => bool) public hasSatelite;
    string[] public satelitesChainsArray;

    //Game
    struct Player {
        string    playerAddressString;
        string    playerChain;
    }

    //Game currency
    address public gameTokenCurrency;
    IERC20 public gameToken;
    string public gameTokenSymbol;

    mapping(string => bool) public games;  //is game active
    mapping(string => bool) public gamesIsPlayed;  //is game played before

    string[] public gameHashesArray;     //list of active games gameHashesArray
    mapping(string => Player) public gameWinnerInfo;  // for gameHash => Player struct
    mapping(string => uint256) public gameBalance;
    //Global Variables
    mapping(string => mapping(string => bool)) public globalGameState;   //gameHash => binance => true
    mapping(string => mapping(string => Player)) public globalGameWinner; // gameHash => binance => Player struct
    mapping(string => mapping(string => bool)) public globalGameWinningsReceived;   //gameHash => binance => true

    event Executed(address indexed from, uint256 indexed messageCode, string indexed gameHash, bool gameState,  string winnerChain, string winner);

    modifier onlyAdmin {
        require(msg.sender==admin,"action only for admin");
        _;
    }

//Testnet
// 0x5769D84DD62a6fD969856c75c7D321b84d455929,0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6,"Moonbeam"
// 0x4D147dCb984e6affEEC47e44293DA442580A3Ec0,0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6,"binance"
    constructor(address _gateway, address _gasReceiver, string memory _chainName) AxelarExecutable(_gateway) {
        gasService = IAxelarGasService(_gasReceiver);
        admin = msg.sender;
        chainName = _chainName;
    }

// Testnet: WDEV Mainnet axlUSDC
    function setAcceptedCurrency(string memory _gameTokenSymbol) external onlyAdmin {
        gameTokenCurrency = gateway.tokenAddresses(_gameTokenSymbol);
        gameTokenSymbol = _gameTokenSymbol;
        gameToken = IERC20(gameTokenCurrency);
    }

//GamePlayers Address
    function setRouter(address _routerAddress) external onlyAdmin {
        routerAddress = _routerAddress;
        router = GamePlayers(_routerAddress);
    }

// sateliteAddress,"binance"
// sateliteAddress,"Moonbeam"
    function set_Satelite(address sateliteAddress, string memory chain_Name) external onlyAdmin {
        if (!hasSatelite[chain_Name])
        {
            hasSatelite[chain_Name] = true;
            satelitesChainsArray.push(chain_Name);
        }
        satelites[chain_Name] = sateliteAddress;
    }

    function register_Game(string memory gameHash) internal {
        if (!games[gameHash] && !gamesIsPlayed[gameHash])
        {
            games[gameHash] = true;
            gameHashesArray.push(gameHash);
            globalGameState[gameHash][chainName] = true;
        }
    }

    function unregister_Game(string memory gameHash) internal {
        if (games[gameHash])
        {
            games[gameHash] = false;
            globalGameState[gameHash][chainName] = false;

            string[] memory newGameAddresses = new string[](gameHashesArray.length-1);
            uint j = 0;
            for (uint i = 0; i < gameHashesArray.length; i++) {

                if (keccak256(bytes(gameHashesArray[i])) != keccak256(bytes(gameHash)))
                {
                    newGameAddresses[j] = gameHashesArray[i];
                    j +=1;
                }
            }
            gameHashesArray = newGameAddresses;
        }
    }

    function payToPlayGame(string memory gameHash, uint256 amount) external {
        if (games[gameHash])
        {
            gameToken.transferFrom(msg.sender, address(this), amount);
            gameBalance[gameHash] +=amount;
        }
    }

    function submitGameWinnerInfo(string memory gameHash, string memory winner, string memory winnerChain) internal {
        gameWinnerInfo[gameHash] = Player({ playerAddressString: winner, playerChain: winnerChain });
    }

    function invalidateGame(string memory gameHash) internal {
        bool game_is_played = true;
        for (uint256 i = 0; i < satelitesChainsArray.length; i++) {
            if (!globalGameWinningsReceived[gameHash][satelitesChainsArray[i]])
            {
                game_is_played = false;
            }
        }
        gamesIsPlayed[gameHash] = game_is_played;
    }

    //This transfers funds to Router GamePlayers
    function transferWinningsToRouter(string memory gameHash) external {

        if (!games[gameHash] && !gamesIsPlayed[gameHash])
        {
            address winnerAddress =  (gameWinnerInfo[gameHash].playerAddressString).toAddress();
            uint amountToTransfer = gameBalance[gameHash];
            gameBalance[gameHash] = 0;

            gameToken.approve( routerAddress, amountToTransfer );
            router.registerWinner( winnerAddress, gameHash, amountToTransfer);

            invalidateGame(gameHash);
        }
    }

    //Transfer Winnings to Satelite Contract of the chain the winner was found
    function payWinnerForeignChain( string memory gameHash, string memory destinationChain, address destinationAddress) internal {
        if (!games[gameHash])
        {
            uint amountToTransfer = gameBalance[gameHash];
            gameBalance[gameHash] = 0;
            sendToMany(destinationChain, destinationAddress.toString(), amountToTransfer, gameHash);
        }
    }

    function payPrize(string memory gameHash) public {
            string memory winner_Chain = gameWinnerInfo[gameHash].playerChain;
            if (keccak256(bytes(winner_Chain)) == keccak256(bytes(chainName)))
            {
                 globalGameWinningsReceived[gameHash][chainName] = true;
            }
            else
            {
              address destination_Address = satelites[winner_Chain];
              payWinnerForeignChain( gameHash, winner_Chain, destination_Address);
            }
    }


    /**
        This acts a global messenger to send GMPs
        * Register     1,abc,true,0,0      PASS 8 DEV for fees
        * UnRegister   1,abc,false,0,0      PASS 8 DEV for fees
        * Submitwinner 2,abc,false,Moonbeam,0xa95b7843825449DC588EC06018B48019D1111000
        * PayWinner.   3,abc,false,Moonbeam,0xa95b7843825449DC588EC06018B48019D1111000
        *              3,abc,false,binance,0xa95b7843825449DC588EC06018B48019D1111000
        messageCode:
        0: Callback
        1: registration
        2: submitwinner
        3: Transfer all funds to Satelite Contract that the Winner is found
    */
    function sendMessageToSatelites( uint256 messageCode, string memory gameHash, bool gameState, string memory winnerChain, string memory winner) public payable {
        for (uint256 i = 0; i < satelitesChainsArray.length; i++) {
            string memory destinationChain = satelitesChainsArray[i];
            string memory destinationAddress = (satelites[destinationChain]).toString();
            sendMessage(destinationChain, destinationAddress, messageCode, gameHash, gameState, winnerChain, winner);
        }
    }
    /// OK Send a message cross chain to a specific chain and specific contract destinationChain : binance    destinationAddress: AxelarManager.sol address
    function sendMessage( string memory destinationChain, string memory destinationAddress, uint256 messageCode, string memory gameHash, bool gameState, string memory winnerChain, string memory winner) public payable {
        if (messageCode==1)
        {
            if (gameState)
            {
                register_Game(gameHash);
                router.activateGame(gameHash);
            }
            else {
                unregister_Game(gameHash);
            }
        }
        else if (messageCode==2)
        {
            submitGameWinnerInfo(gameHash,winner,winnerChain);
        }
        else if (messageCode==3)
        {
            payPrize(gameHash);
        }

        bytes memory payload = abi.encode(messageCode,gameHash,gameState,winnerChain,winner);

        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{value: msg.value}(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                msg.sender
            );
        }
        gateway.callContract(destinationChain, destinationAddress, payload);
    }


    function _execute(string calldata sourceChain_, string calldata sourceAddress_, bytes calldata payload) internal override {
        (uint256 messageCode, string memory gameHash, bool gameState, string memory winnerChain,  string memory winner) = abi.decode(payload, (uint256,string,bool,string,string));
        sourceChain = sourceChain_;
        sourceAddress = sourceAddress_;

        if (messageCode==1)
        {
            if (gameState)
            {
                register_Game(gameHash);
                router.activateGame(gameHash);
            }
            else {
                unregister_Game(gameHash);
            }

            sendMessage(sourceChain_, sourceAddress_, 0, gameHash, gameState, winnerChain, winner);
        }
        else if (messageCode==2)
        {
            submitGameWinnerInfo(gameHash,winner,winnerChain);

            sendMessage(sourceChain_, sourceAddress_, 0, gameHash, gameState, winnerChain, winner);
        }
        else if (messageCode==3) //Transfer prize to winner in winning chain of Satelite contract
        {
            payPrize(gameHash);
        }
        else if (messageCode==0)
        {
            globalGameState[gameHash][sourceChain_] = gameState;
            globalGameWinner[gameHash][sourceChain_] = Player({ playerAddressString: winner, playerChain: winnerChain });
        }

        emit Executed(msg.sender, messageCode, gameHash, gameState, winnerChain, winner);
    }

    /// destinationChain : binance , AxelarManager.sol address, amount, gameHash Moonbeam,0x9a27568077C9b058F7bd7a88B231A1B1B9D881ae,0,dbc
    function sendToMany( string memory destinationChain, string memory destinationAddress, uint256 amount, string memory gameHash) public payable {
        gameToken.approve(address(gateway), amount);
        bytes memory payload = abi.encode(gameHash);

        if (msg.value > 0) {
            gasService.payNativeGasForContractCallWithToken{ value: msg.value }(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                gameTokenSymbol,
                amount,
                msg.sender
            );
        }
        gateway.callContractWithToken(destinationChain, destinationAddress, payload, gameTokenSymbol, amount);
    }

    function _executeWithToken(string calldata sourceChain_, string calldata , bytes calldata payload, string calldata, uint256 amount ) internal override {
        (string memory gameHash ) = abi.decode(payload, (string));
        globalGameWinningsReceived[gameHash][sourceChain_] = true;
        gameBalance[gameHash] +=amount;
    }

}