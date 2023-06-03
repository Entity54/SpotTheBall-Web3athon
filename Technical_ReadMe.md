    function setAcceptedCurrency(string memory _gameTokenSymbol, address _gameTokenCurrency) external onlyAdmin

    function set_Game_Manager(address _gameManager, bool approveManager) public onlyAdmin

    function readPlayer(address _playerEVMadddress) external view returns(Player memory gameplayer)

Read all details of a registered player

    function registerPlayer(address _playerEVMadddress , string memory _playerEVMAddressString, string memory _playerChain, string memory _playerSubstrateAddressString, string memory _playerHex) external onlyGameAuthority {

Player struct has the folliwn format

    struct Player {
        address   playerEVMAddress;
        string    playerEVMAddressString;
        string    playerChain;            //Astar,Interlay,Moonbeam
        string    playerSubstrateAddressString;
        string    playerHex;
    }

We know for each player the EVM addrss in address and string type
the player's original chain e.g. Interlay,Astar, Moonbeam, Binance, Fantom
Player's Substrate address where applicable
Player's playerHex which is part of the EVM address but is needed to be used to send an dXCM usign Moonbeam precompiles

    function registerWinner(address winnerEVMadddress, string memory gameHash, uint winnings) external onlyGameAuthority {

This registers the winner and pre-fills the whole struct for the Players by retieving registrations haivng just player's EVM addrress
This fucntion also pull the relevant funds from the AxelarManager contract

> NOTE: The Axelar Manager contract needs to APPROVE the GamePlayers.sol

    function payWinner(string memory gameHash) external onlyGameAuthority {

This function will either transfer axlUSDC to the winner
OR
will convert axlUSDC to the parachain tokens e.g. INTR, ASTR and transfer this back tot he user

## GamePlayers.sol

1. setGameManager(Optional)
2. setAcceptedCurrency
3. NEW DEPOSIT => registerPlayer when a new player plays

LATER ON CALL FROM AxelarGameManager registerWinner and payWinner

<br>
<br>
<br>

## GameDeposits.sol

1. setGameManager(Optional)
2. setAcceptedCurrency
3. set_Axelar_Manager
4. NEW DEPOSIT => allocateDeposits
5. depositFundsToGame (take all existing deposits convert to axlUSDC and deposit these to the AxelarGameManager)

## AxelarGameManager.sol

1. setGameManager(Obligatory => REMEMBER to APROVE Axelar Realy Address)
2. setAcceptedCurrency
3. setRouter This is the GamePlayers.sol routerAddress
4. set_Satelite Registers Sateliate AxelarGameManager contracts from other chains so we know where to send messages EXAMPLE: 0x332dBCFf817447E78Db88480E2c5467367C97E8b,binance

NEW PLAY

=> GameDeposits.sol
=> depositsFundsToGame
=> Call AxelarGaemManager.sol payToPlayGame(gameHash, amount)

<br>
<br>
<br>

## Infrastructure

1. setAcceptedCurrency => GamePlayers.sol
2. setAcceptedCurrency => GameDeposits.sol
3. setAcceptedCurrency => AxelarGameManager.sol
4. setRouter => AxelarGameManager.sol Pass GamePlayers.sol address
5. setGameManager => GamePlayers.sol Add address AxelarGameManager.sol Example: 0xe6520eb8f7e71F3fc549123dafBd047Cf4Af54bd,true
6. setGameManager => GameDeposits.sol Add address AxelarGameManager.sol
7. set_Axelar_Manager => GameDeposits.sol Pass address of AxelarGameManager.sol
8. set_Satelite => AxelarGameManager.sol Pass the address of similar sc from other chains
   => address,chainName

<br>

## Organise Game

# IMPORTANT CHANGES. NEW AXELARMANAGER HAS THE sendMessageToSatelites soplit to 2 fundtion

sendMessageToLocalSatelite
sendMessageToSatelites
that need to be called sequentially

### A. Global Game Registration

1.  AxelarGameManager.sol

    function sendMessageToSatelites( uint256 messageCode, string memory gameHash, bool gameState, string memory winnerChain, string memory winner) public payable

REGISTER PASS 8 DEV for fees

    1,abc,true,0,0

GAME IS NOW REGISTERED GLOBALLY AND CAN BE PLAYED

PLAY THE GAME

1. registerPlayer GamePlayers.sol

0xa95b7843825449DC588EC06018B48019D1111000,"0xa95b7843825449DC588EC06018B48019D1111000","MOONBEAM","5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb","0xa95b7843825449DC588EC06018B48019D1111000D1111000"

2. PLAYER APPROVE WDEV for GameDeposits.sol - For toher tokens there is no need (INTR,ASTR) as are already in the smart contract

Use https://moonbase.moonscan.io/address/0x1436ae0df0a8663f18c0ec51d7e2e46591730715#readContract

3. allocateDeposits GameDeposits.sol

=> WDEV,abc,10000000001 //10 decimals

Now funds are in GameDeposits.sol

4. depositFundsToGame GameDeposits.sol

=> abc

REPEAT PROCESS FOR ALL CHAINS AS PLAYERS FROM MOONBEAM AND PARACHAIN KEEP PLAYING THE GAME

## END OF GAME

1. sendMessageToSatelites AxelarGameManager.sol Unregister the game so it cannot accept new entries

   1,abc,false,0,0 PASS 8 DEV for fees

## SUBMIT THE WINNER

1. sendMessageToSatelites AxelarGameManager.sol

   2,abc,false,Moonbeam,0xa95b7843825449DC588EC06018B48019D1111000 PASS 8 DEV for fees

   or

   2,abc,false,binance,0xa95b7843825449DC588EC06018B48019D1111000 PASS 8 DEV for fees

> Once the Axelar callback arrives then Moonbema Axelar Manager will know that itself and satelite contract e.g. Binance Axelar Manager have updated and all have the same winner

> NOW THAT ALL SATELITES HAVE THE SAME WINNER VALUES WE CAN START THE PAYMENT PROCEDURE

<br>
<br>
<br>
<br>
<br>
<br>

> NOTE: Matching Moonbeam local varibale with Statelit Global variable

globalGameState[gameHash][binance] = gameState;
globalGameWinner[gameHash][binance] = gameWinner(gameHash] = Player({ playerAddressString: winner, playerChain: winnerChain });

<br>
<br>

## IMPORTANT AS SOON AS WE GET THE BELOW BY READING THE AXELARMANAGER IN MOONBEAM WE ARE READY TO PAY WINNER

globalGameWinner["abc"]["binance"] is the same with Moonbeam gameWinnerInfo["abc"]

<br>
<br>

READY TO MAKE PAYMENTS

## PAY THE WINNER

### Transfer winnings to Sateliete of Chain the Winner belongs to

1. sendMessageToSatelites AxelarGameManager.sol

   3,abc,false,0,0 PASS 8 DEV for fees

AxelarManager.sol Moonbeam
globalGameWinningsReceived[gameHash][Moonbeam] = true;
globalGameWinningsReceived[gameHash][binance] = true;

> EVEN IF THE WINNER IS IN BINANCE SO FAR WE ONLY CALL THE AXELAR GAME MANAGER ON MOONBEAM AS THIS IS THE MAIN CONTRACT

<br>

> NOW THAT WE KNOW THE WINNER IS IN BINANCE WE CAN CALL THE BINANCE AXELAR GAME MANAGER CONTRACT

<br>

### Transfer Funds to Router of Satelite Smart Contract

IN BINANCE if winner is in binance

    transferWinningsToRouter( abc )

=> invalidateGame(abc) => gameIsPlayed( abc ) = true

=> router.registerWinner
=> Tranfer axlUSDC / WDEV to router GamePlayers.sol
=> define gameWinner for abc and the winnings

## Swap axlUSDC if necessary and transfer to Winners Native Chain and native token

    payWinner

DONE

REPEAT THE SAME PROCESS FOR CASE WINER is in binance chain

0x9a27568077C9b058F7bd7a88B231A1B1B9D881ae
0x9a27568077C9b058F7bd7a88B231A1B1B9D881ae
sendToMany(destinationChain, destinationAddress.toString(), amountToTransfer, gameHash);
