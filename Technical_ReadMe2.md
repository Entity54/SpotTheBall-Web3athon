Axelar Game Manager

1. constructor

   0x5769D84DD62a6fD969856c75c7D321b84d455929,0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6,"Moonbeam"
   0x4D147dCb984e6affEEC47e44293DA442580A3Ec0,0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6,"binance"

2. setAcceptedCurrency

   "WDEV"

3. Register Game cost 8 DEV

   sendMessageToSatelites

   1,abc,true,0,0

4. Play Game

a> USER ACCOUNT APPROVE SC for 1 WDEV

b> payToPlayGame(string memory gameHash, uint256 amount)

abc,12000000001

isGamePlayer[msg.sender][gameHash] = true;
gamePlayers[gameHash].push(msg.sender);
gameBalance[gameHash] +=amount;
WILL UPDATE

5. GAME EXPIRED

Unregister the game

    sendMessageToSatelites

    1,abc,false,0,0

6. Submit Winner Cost 8 DEV

   sendMessageToSatelites

   2,abc,false,Moonbeam,0xa95b7843825449DC588EC06018B48019D1111000

<br>
<br>
<br>

<br>
<br>
<br>

HQ Moonbeam

GMPS

1 Register new game
2 Unregister new game

3 payWinnerForeignChain

NO GMPS
1 payToPlayGame
2 payWinnerNativeChain

Phat Contract

1 submit coordinates

1 Pass information of how many funds are deposited on one chain for a specific game address

2 Actually transfer all Funds to the winner in any chain

<br>
<br>
<br>
<br>

Axelar Game Manager

Constuctor
constructor(address \_gateway, address \_gasReceiver, string memory \_chainName) AxelarExecutable(\_gateway)

Pass getway, gasreceiver and chaninName

Examples:

    Testnet

1.  Moonbeam
    0x5769D84DD62a6fD969856c75c7D321b84d455929,0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6,"Moonbeam"
2.  BinanceTestnet
    0x4D147dCb984e6affEEC47e44293DA442580A3Ec0,0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6,"binance"

Contract is now ready to talk to the Axelar ecosystem

Set accepted game currency

    function setAcceptedCurrency(string memory _gameTokenSymbol) external onlyAdmin

Default:
For Testing "WDEV"
For Mainet "axlUSDC"

     gameTokenCurrency = gateway.tokenAddresses(_gameTokenSymbol);

3. Moonbeam WDEV // NO NEED 0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715
4. binance WDEV // NO NEED 0xa893Fd868c3159B294f6416F512203be53315fd8

Will set the game currency address

Set Game Manager where game manager can be any Axelar smart contract deployed in any chain that needs to communicate with this smart contract and
execute sensitive tasks

    function set_Game_Manager(address _gameManager, bool approveManager) external onlyAdmin

Register a Game

5. Example: 1,abc,true,0,0

   function register_Game(string memory gameHash) public onlyGameAuthority

Unregister a Game

60. Example: 1,abc,false,0,0

    function unregister_Game(tring memory gameHash) public onlyGameAuthority

Although the Register and Unregister a Game functions can work locally on an AxelarGameManager thse function are only meant to be called loccaly in the Head Quarters AxelarGameManager in Moonbeam and then usign Axelar GMP beign passed to satelites

Submit winner information

    function submitGameWinnerInfo(string memory gameHash, string memory winner, string memory winnerChain) public onlyGameAuthority

Registers on chain tha winner address in STRING and the winner chain in STRING

Pay to play the game in Game Chose currency

    function payToPlayGame(string memory gameHash, uint256 amount) external

Pay the winner

Analysis:
All Binance players when they play deposit funds in the Binace deployed Axelar Manager contract
Similarly for all Moonbeam players, therir deposits are deposited tothe Moonbeam deployed contract and so on

WINNER IS IN Binance

1. Winner will receice the Binance pot
2. Winner will receive the Moonbeam pot transferred to him via Axelar from the Axelar deployed smart contract in Moonbeam

WINNER IS IN Moonbeam

1. Winner will receice the Moonbeam pot
2. Winner will receive the Binance pot transferred to him via Axelar from the Axelar deployed smart contract in Binance

For 1)

    function payWinnerNativeChain(address winner, string memory gameHash) public onlyGameAuthority

For 2) triggerred from satelite contract compared to the place the winner comes from

     function payWinnerForeignChain(address winner, string memory gameHash, string memory destinationChain, address destinationAddress) public onlyGameAuthority

Axelar function that sends the instruction to make the payment to the winner from the satelite contracts

    function sendToMany( string memory destinationChain, string memory destinationAddress, string memory suppliedSymbol, uint256 amount, address winner, string memory gameHash) public payable

Axealr function that received GMP and actually makes the payment to the winner once the tokens have arrived

    function _executeWithToken(string calldata sourceChain_, string calldata sourceAddress_, bytes calldata payload, string calldata tokenSymbol, uint256 amount ) internal override

<br>

SEND AXELAR GMP INSTRUCTIONS

    function sendMessage( string calldata destinationChain, string calldata destinationAddress, uint messageCode, string memory gameHash, bool gameState) public payable

messageCode:
0: Callback
1: registration
2: paywinner

RECEIVE AND EXECUTE GMP INSTRUCTIONS

    function _execute(string calldata sourceChain_, string calldata sourceAddress_, bytes calldata payload) internal override

<br>

When a message with messageCode = 1 is sent then

It registers a new Game locally and it sends instruction to all satelite contracts as well to register it

<br>

When a message with messageCode = 2 is sent then

It pays winner in local
