# Web3athon 2023 Hackathon

## Moonbeam Challenge -

## Use Moonbeam and a GMP Protocol to call a contract on a remote chain

<br>

### Description: github link in here

<br/>
To Install

    $yarn

To Run

    $npm start

# Spot the Ball

<br>

## Table of Contents

1. [General Info](#general-info)
2. [Repos](#repos)
3. [Installation](#installation)
4. [Business Logic](#business-logic)
5. [Phat Contract Logic](#phat-contract)

<br>

## General Info

---

<p>
The Polkadot ecosystem is composed by a relay chain acting as the shared security of the ecoystem and parachains that using Substrate unique strengths to offer custom based logic such as pirvacy, Defi, NFTs, etc.

The horizontal parachain interconnectiviy that Polkadot XCM brings is further enhanced with a vetical interconnectivity between Polkadot and other Ecosystems (e.g. Binance Smart Chain) via the Moonbeam parachain and the GMP protocols e.g. Axelar

In our submission we are trying to show a portion of the above in a natural business logic flow

We have built a classic Web2 game with existing multi-decade audience in at least UK and USA

The game is called spot the ball.

Each game has a fixed time duration and an image (with an imgae hash) from a popular sport that has the ball digitally removed

Each player is trying to guess the position of the ball by observing the sport players eyes and body position

Each player can pay as many times as he/she wants submitting 1 or mutiple tickets each time

Each ticket carries an X,Y cooridnatrs (player's estimation) and has a fixed price of 1 axlUSDC but payment is accepted also in INTR and ASTR for players that keep a balance in the repsective parachains

More analytucally a player with a Binance Smart Chain wallet or a Moonbeam wallet can pay for a ticket using axlUSDC

A player that has an INTR balance in Interlay or an ASTR balance in Astar can pay using their existing native currency balance price. The ticker price of 1 axlUSDC will be calualted in INTR or ASTR repsectively, transferred via XCM from the parachains Interlay and Astar) to Moonbeam and swapped for axlUSDC before deposited to the Game Prize Pot

The winning solution of the game is calculated by finding the average of all tickets played in a game. It is scientifically proven that the what so called wisdom of the crowd converges to the real answer.

The winner of the game is the player whose coordinates have the shortest distance from the wisdom of the crowd solutions

The game is comprised of a Phat Ink! and Solidity EVM Saart Contracts deployed in Phala, Moonbeam, Binance

Phala is a parachain that among other things offers privacy and advanced off-chain decentralised computational abilities. Therefore we have created a Phat contract that offes privacy for each ticket played and to also calculate the distances of all tickets played, sorting them to offer the ability of multiple winners and calculating both the wisdom of the crowd and winning ticket

Moonbeam is a parahain that offers a fully compatible EVM enironment with a long list of precompiles that offer added functionality in our case here the Xtoknes Precompile for transferring winning to a Astar or Interlay Parachain

Astar is the biggest blockcahin in Japan and offers an EVM enivironement and an Ink! smart contract environment plus accommodating multiple blockchain bridges

Interlay is the defacto decentralised point of entry in Polkadot for the biggest crypto currency BTC

Binance Smart Chain is within the top 3 biggest blokckains with very advanced protocols and large audience

It felt natural to the team that since the technology now exists for the first time the design of a Game should follow an HQ+Satelite pattern. Such pattern offers the most economic efficiency and the easiest onboarding to the game leaving to the user to just okay and enjoy using his usual tools and without having to learn new technical terms and tools such as parachains, XCM etc.

Just to be as stated above the Phat contract hosted in Phala testnet is used for privace and computational reasons so the game cannot be tricked (as in most blockcahin the data are transaparent)

From then on 3 solidity smart contracts are deployed in Moonbeam which is the acting headquarters of Game financials and 3 almost identical solidity smart contract are deployed in Binance Smart Chain

These smart contracts are called AxelarGameManager.sol, GameDeposits.sol and GamePlayers.sol

A player residing in Binance Smart chain deposits 1 axlUSDC per ticket in the GameDeposits.sol smart conract which is then forwarded to the Binance residing AxelarGameMananger
A player residing in Interlay or Astar, has the equivalent of 1 axlUSDC in INTR or ASTR being transferred from Interlay or Axelar to the Moonbeam based GameDeposits,sol which as soon as it arrives is swapped for axlUSDC.
A player in Moonbeam pays 1 axlUSDC per ticket by depositing into the Moonbeam based GaemDeposits.sol and together with any previous INTR or ASTR swapped to axlUSDC are transferred to the Moonbean based AxelarGameManager.

> Note: When a player submits a ticket and pays the equivalent of 1 axlUSC whether after an INTR or ASTR swap or natively axlUSDC his details are registered in the GamePlayers.sol
> The players EVM address and if applicable Substrate address is recorded in the Moonbeam based GamePlayers.sol
> These details will be used in the final phase of the game to tranfer all winning to the winner's native wallet e.g. transfer winnngs in ASTR to winner Astar Substrate address, or if the winner is Moonbeam based to his Moonbeam EVM account

At this point the finances of the Gem are held in 2 deparate AxelarGameManager smart contracts deployed in Moonbeam and Binance Smart Chain.

All Axelar GMP messages between the 2 AxelarGameManagers at this point is about

1. Registerign a new gmae that is is now ready for players' tickets
2. Unregistering an existing game to state that the game is now expired and cannot acccept new deposits

Following the Phat contract cacuations that result in spotting the winner of the game our gae moves to its next phase

Axelar GMP messages spread the word about the winner's address and his ecosystem (Moonbeam or Binance) side in the AxelarGameManager smart contracts

In the Moonbeam AxelarGameManager headquarters a record of the winner address is kept as it is read by all satelite AxelarGameManager contracts (in our case here Binance Smart Chain Satelite AxelarGameManager smart contract)

Now that all parties (AxelarGameManager smart contract) in both Moonbeam and Binance are in sync about what the winner address is and what Ecosystem it resides we are ready for the final phase of the Game

In the final phase if the winner's address is in Binance Smart chain then an Axelar GMP message transferring all axlUSD balance of the Game in Moonbeam is tranferred to the Binance Smart chain

If the winner's address is in the Moonbeam eosystem then the reverse occurs.=, i.e. Any axlUSDC balace held for the game in the AxelarGameManager in Binance Smart Chain is transferred over Axelar GMP messages to the Moonbeam based AxelarGameManager

The last thing remaining is payment of the winner
In the case that the winner is in the Binance Smart Chain ecosystem all axlUSDC balance from the Binance based AxelarGameManager is trasferred to the GamePlayers.sol and from there to the winner's address

In a future version it will be enabled swapping of axlUSDC to winner's preferred token, predefined at game registration phase

In the case of a winner being in Moonbeam natively then a identical route is followed
In nthe case where the winner's address is from Astar or Interlay then there is an added step where axlUSDC winnings transferred from Moonbeam based AxelarGameManager to the Moonbeam based GamePlayers.sol are swapped for ASTR or INTR and transferred to Astar and Interlay respectively.

At this point the game ends and the winner enjoys his winnings in his origin wallet in Moonbeam,Binance, Astar, or Interlay

> Note:
> Several game automations such as the expiry of a game, Axelar GMP messages and Axelar GMP token transfers require the use of an environment based EVM account pre-financed to support the above automations.
> In terms of hackathon we are financign these accounts with a small balance to showcase our submission
> In terms of business logic, such cost can be recouped by the Game winnings commision retained for supporting the game

<br>

## Repos

---

Phat contracts repo

https://github.com/Entity54/Phat-Games-STB

<br>

Front End repo

https://github.com/Entity54/Phat-Front-End-SpotTheBall

<br>

### Installation

---

The Phat contracs were written in the ink! Version 4. In the Phat contract repo the user can either build these from scratch usign:

    $cargo contract build

or can find the ABI(metadata) phala_games_STB.json and the phala_games_STB.contract in the Phat_contracts folder here

For the front end the user can

    $yarn
    $npm start

and can see in http://localhost:3000/ the front end application connected to this Phat contract

---

<br>
<br>

## Business Logic

---

In the Tickets page we can see the Start button which is Green when a new game can be started or greyed out if there is already an active game. A new game can only start after the completion of any active game.

The Start and End time show when the game started and when it will be completed

Finally the remaining amount of minutes in the game is shown

<br>

![plot](./PrintScreens/FEGameInProgress.png)

<br>

Once a new game has started a fresh image is loaded which has the ball digitally removed

Each game participant can click on the image and create a ticket with the generated coordinates

Each ticket has a cost of 1 PHA and the user can play one or multiple tickets per time

Each time the user clicks on the image he should click the Play button to generate a ticket with these coordinates

When he is ready he can click Submit to submit his tickets. The total cost in PHA is shown next to the submit button

<br>

![plot](./PrintScreens/FE_PlayTickets.png)

<br>

The Pot Size shows the total PHA that have been deposited

The Payout is 80% of the Pot Size and the Fees (20%) is for the owner of the game.

<br>

![plot](./PrintScreens/FE_PotSize.png)

<br>

When the game expires the Number of tickets played in the current game is shown underneath the Start button

The winner of the game along with previous winners are shown in the second tab Hall of Fame with all relevant details e.g. owener of the ticket winning coordinates, competition id, number of players (account addresses), number of tickets and the Prize Money won

<br>

![plot](./PrintScreens/FE_GameEnded_Tickets_HallofFame.png)

<br>

When the competition completes in the SpotTheBall page we can see the solution: "Wisdom of the Crowd Answer" and the winning ticket coordinates

Finally the user account balance in PHA is shown at the top right corner of the page

The wisdom of the crowd dictates that the more tickets played, the closer the average prediction of the coordinates is to the real position of the ball.

Therefore the winning ticket is the one with the smallest distance to the Wisdom of the Crowd Answer

<br>

![plot](./PrintScreens/FE_WisdomWinner.png)

<br>

<br>
<br>
<br>
<br>

## Phat Contract

---

<br>

![plot](./PrintScreens/Phat-Contract-CB-UI-1.png)

<br>

By clicking the Start button in the front end in essence we call config_game function passing the imagehash (to be loaded from 4everland in next relase) the start and end time of th egame the ticket cost and fees percentage. The default ticket cost is 1 PHA and the default fees percentage is 20 for 20%

Soon after the check_game function is called every 2 blocks in the front end

> Note: Please be aware that sometime sthe block interval is as high as 2mins in the testnet, so please be patient to wait few blocks after transaction submission. After couple of blocks the transaction are mined and the fron end updates

The check_game functio is responsible for

1. Starting the game if the block timestmap is greater than the game start time. It also resets certain storage variables to default so that the game can be played repeatedly

2. Ending the game when the block timestamp has surpassed the end time fo the game. It first turns the state of the game to false and then calls calculate_distances, find \_winners, set the winner halloffame struct and add it to the hall_of_fame_vec and finally transfer the Pot PHA funds to the winner (80% of the Pot) and the game owner (20% of the Pot after ensuring there is enough existential deposit for the phat contract)

The get_game_stat can be called at any time to see the game specifications

The get_players shows us the unique account address that have played the game

The get_players_mapping map a game particpant account address to the vector of all tickets he has played

The get_all_tickets retireves all the ticket coordiantes played and the get_ordered_ticket_ids retrieves the unique ticket ids

> Note: Bearing in mind the above a lto of analytics dash boards can be created to show the most frequest and biggest players for possibly allocating motivational rewards to futures games

The get_sums query retrieves the runnign sum for x and y coordinates that is calcualted eveytime a new ticket(s) is played

<br>

![plot](./PrintScreens/Phat-Contract-CB-UI-2.png)

<br>

calculate_wisdom_of_crowd_coordinates calculates the average of x and y coordiantes of all tickets and it is viewable by calling get_wisdom_of_crowd_coordinates

submit_tickets is used to sub,it one or more ticket coordinates. It ensures that the reuired amount of PHA has also been paid and it updates the total_pot, total_net_pot and total_fees

calculate_distances uses the Pythagorean Square theorem to calculate the distance of every played ticket from the Wisdom of Crowd (x,y) coordinates. Finally it sorts the tickets based on the minimum distance and stores the relevant ticket ids in ordered_ticket_ids

> Note: The amount of computation makes Phat contracts the perfect medium to operate the game

Now the find_winners can be called

> Note: in the current version we are using th case of a single winnner, but this function shows how easy it is to switch to a game version with multiple winners and variable winning prizes

get_winning_tickets allows us to views the winning tickets

The make_payments functions is called privaely from the check_game to make the payments to the winning account address and the administrator address (owner of the game)

Finally the get_hall_of_fame query allows us to retreive the vec with all hall of fame structs. Now we have a list of all past winners

> Note: Having the lsit of past winners in a future version we could allocate NFTs enabling game competions with much higher prize or game stags for the NFT holders

<br>
<br>

## APPEDNIX

---

## Addresses of deployed contracts

### Moonbase Alpha Testnet

axelar_game_manager_moonbase_address = "0x264D7022404bD7AE3ca3CE817347DC1cDD036368";

game_players_moonbase_address = "0xe34dc382EAf965fDbBEFC267c59ed399fBCD1Dd6";

game_deposits_moonbase_address = "0x20a9C9dAFef8D9BDaC2de110FD13443fB5679913";
<br>

### Binance Testnet

axelar_game_manager_binanceTestNet_address = "0xe295348aC14AdC064273d71A21f6520b2B634884";
game_players_binanceTestNet_address = "0x78ae32d083606fdf12630A9f8A20bF0FEDcbcFdD";
game_deposits_binanceTestNet_address = "0xA7ceeB7D789f68d197A3181156B69372c8eE6a5F";
<br>

### Phala Closed-Beta Testnet

phat_games_STB_contractId = "0xe1302a8db9ead738c2de1f483a6c01d4b4e3595ca271aa291cc7ecdbbd2b42ab"

CODE HASH 0x6f6dc3a36a2dc00c2fa56f9b6f8f6814e7d92403e1909d98058909fdb4b57215

LANGUAGE ink! 4.2.0

COMPILER rustc 1.68.2

DEVELOPER 464inykovjdRPhMhW2zbJ47iA8qYSmPWqKLkaEgH2xc6SQ4c

CLUSTERID 0x0000000000000000000000000000000000000000000000000000000000000001

STAKES 0.01

<br>
<br>

# MAINNET

StellaSwap = 0x24aA375Ba88cC6751c2998fA24B007C48d0bA6a4
