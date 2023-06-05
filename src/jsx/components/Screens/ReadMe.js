import React,{useState,useContext, useEffect} from 'react';
import { ThemeContext } from "../../../context/ThemeContext";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link } from "react-router-dom";
import glmr100 from "../../../images/glmr100.png";
import pha100 from "../../../images/pha100.png";
import astr100 from "../../../images/astr100.png";
import intr100 from "../../../images/intr100.png";
import bsc100 from "../../../images/bsc100.png";
import axl100 from "../../../images/axl100.png";


const ReadMe = () => {

	const { changeBackground, background } = useContext(ThemeContext);
	
	useEffect(() => {
		changeBackground({ value: "dark", label: "Dark" });

	}, []);

	return(
		<>
			<div className="row">
<<<<<<< HEAD
				<div className="row">
					<div className="col-xl-12">
						<div className="row">

<div className="col-xl-12 col-xxl-6 col-lg-6">
  <div className="card">
	<div className="card-body">
	  <PerfectScrollbar
		style={{ height: "auto" }}
		id="DZ_W_TimeLine"
		className="widget-timeline dz-scroll height370 ps ps--active-y"
	  >
		<ul className="timeline">
		  <li>
			<div className="timeline-badge primary"></div>
			<Link
			  className="timeline-panel text-muted"
			  to="/widget-basic"
			>
			  {/* <strong className="text-primary fs-28">Spot The Ball</strong>. */}

<p className="m-4 mt-4 text-white" style={{ fontSize:"40px"}}>
			  			  
Web3athon 2023 Hackathon<br></br>

Moonbeam Challenge - 

Use Moonbeam and a GMP Protocol to call a contract on a remote chain<br></br>
</p>
<p className="m-4 mt-4 text-dark" style={{ fontSize:"24px"}}>

To showcase the project, the following chains and protocols were included in the project:<br></br>

<img src={glmr100} width="50"></img>
<img src={pha100} width="50"></img>
<img src={astr100} width="50"></img>
<img src={intr100} width="50"></img>
<img src={bsc100} width="50"></img>
<img src={axl100} width="50"></img>

</p>
<li className="m-4 mt-4 text-dark" style={{ fontSize:"24px"}}>

Table of Contents<br></br>

1. General Info<br></br>
2. Chains Used<br></br>
3. Visual Game Walkthrough<br></br>
4. Detailed Walkthrough<br></br>
5. Repos<br></br>
6. Installation<br></br>
7. Phat Contract<br></br>
8. Appendix<br></br>

</li>


<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
			  
<h2 className="">General Info</h2>

{/* <p> */}
The Polkadot ecosystem is comprised of a relay chain, which provides the shared security of the network, and parachains that use Substrate unique strengths to offer custom based logic chains such as Privacy, Defi, NFTs, etc.<br></br>

The horizontal parachain interconnectiviy that XCM brings to Polkadot is further enhanced with interconnectivity between other Ecosystems external to Polkadot (e.g. Binance Smart Chain) via the Moonbeam parachain and the use of General Messaging Protocols (GMP) e.g. Axelar.<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
In our submission we will show a portion of the above in a natural business logic flow.<br></br>

For our use case we have built a version of the classic Web2 game called Spot The Ball.<br></br>

Each game has a fixed time duration and shows an image (with an image hash) from a popular sport where the ball has been digitally removed.<br></br>

The game players try to guess the position of the ball by using their observational skills regarding the position of the sportsmans eyes and body.<br></br>

Each player can pay as many times as he/she wants by submitting 1 or mutiple tickets at a time.<br></br>

Each ticket carries the X,Y co-ordinates (player's estimation) and has a fixed price of 1 axlUSDC (Axelar USD) but payment is accepted also in INTR and ASTR for players that keep a balance on those repsective parachains.<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
Therefore, a game player can pay for a ticket by sending either:<br></br>
- axlUSD directly when using either a wallet on Binance Smart Chain or Moonbeam<br></br>
- The native asset of INTR on the Interlay chain<br></br>
- The native asset of ASTR on the Astar chain<br></br>

 When playing the game with INTR or ASTR, the native asset amount of the ticket price (1 axlUSDC) will be calculated, transferred via XCM from the Interlay or Astar parachain to Moonbeam and then swapped for axlUSDC before finally deposited to the Game Prize Pot.<br></br>

To avoid cheating, the traditional game of spot the ball doesnt actually use the position of the removed ball as the winning co-ordinates. In many cases it would be too easy for someone to find the original image somewhere. Therefore, in some cases a panel of judges are used to decide together where the winning position should be and then the ticket entries are all compared to that position to find a winner.<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
We obviously do not want to include the centralised nature of this approach and have therefore incorporated the answer to be decided by a "wisdom of the crowd" approach.

The winning solution of the game is calculated by finding the average of all tickets played in a single game. <br></br>

The winner of the game is the player whose coordinates have the shortest distance from the wisdom of the crowd solution.<br></br>

The game is comprised of Phat Ink! and Solidity EVM Smart Contracts deployed in Phala, Moonbeam & Binance Smart Chain.<br></br>

</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
			  
<h2 className="">Chains Useds</h2>

</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
<img src={pha100} width="50"></img><br></br>
Phala is a parachain that among other things offers privacy and advanced off-chain decentralised computational abilities. Therefore we have created a Phat contract that provides:
- Privacy for each ticket played <br></br>
- Calculation of the wisdom of the crowd solution<br></br>
- Calculations on the distances of all ticket co-ordinates played to the WOTC solution to find the winning entry<br></br>
- Sorted entries to allow the competition to offer multiple prizes in the future for close entries etc
<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
<img src={glmr100} width="50"></img><br></br>
Moonbeam is a parachain that offers a fully compatible EVM environment with a long list of precompiles that offer added functionality. For our case we are using the Xtokens Precompile for transferring the prize funds if the winning entry resides on the Astar or Interlay Parachains.
<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
<img src={astr100} width="50"></img><br></br>
Astar is the biggest blockcahin in Japan and offers an EVM enivironement and an Ink! smart contract environment. It also incorporates multiple blockchain bridges.
<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
<img src={intr100} width="50"></img><br></br>
Interlay is the defacto decentralised point of entry in Polkadot for the biggest crypto asset, BTC.
<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
<img src={bsc100} width="50"></img><br></br>
Binance Smart Chain is within the top 3 biggest blockchains with advanced protocols and a large audience.
<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
<img src={axl100} width="50"></img><br></br>
Axelar delivers cross-chain communication for Web3 allowing Interchain dApps to be developed. It is possible to call a function in another ecosystem, wait for a callback and even transfer tokens with such instructions
<br></br>
</p>

<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
<h2 className="">Visual Game Walkthrough</h2>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
In the Tickets page we can see the Start button which is either green (meaning a new game can be started) or greyed out (if there is already an active game).<br></br> 

A new game can only start after the completion of any active game.<br></br>

The start and end times in the upper part of the screen show when the game started and when it will be completed.<br></br>

Finally the remaining amount of minutes in the game is also shown.
<br></br>
</p>

<p className="mx-4 mt-4" style={{ color:"yellow",fontSize:"34px"}}>
*** SCREENSHOT HERE - GAME IN PROGRESS ***
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
Once a new game has started, on the Spot The Ball page a fresh image is loaded within which the ball has been digitally removed.<br></br>

Each game participant can click on the image and create a ticket with the generated coordinates.<br></br>

Each ticket has a cost of 1 axlUSD and the user can play one or multiple tickets per time.<br></br>

Each time the user clicks on the image they should then click the "play" button to generate a ticket with these selected coordinates.<br></br>

When they are ready they can click "submit" to submit their tickets. The total cost in axlUSD is shown next to the submit button.
<br></br>
</p>

<p className="mx-4 mt-4" style={{ color:"yellow",fontSize:"34px"}}>
*** SCREENSHOT HERE - PLAY TICKETS ***
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
The Pot Size shows the total axlUSD that have been deposited for the current game.<br></br>

The Payout is 80% of the Pot Size and the Fees (20%) goes to the owner of the game.
<br></br>
</p>

<p className="mx-4 mt-4" style={{ color:"yellow",fontSize:"34px"}}>
*** SCREENSHOT HERE - POT SIZE ***
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
Back on the Tickets Page, when the game expires the number of tickets played in the current game is shown underneath the Start button.<br></br>

The winner of the game along with previous winners are shown. The bottom of the screen shows previous winners in a  "Hall of Fame" with all their relevant details e.g. owener of the ticket winning coordinates, competition id, number of players (account addresses), number of tickets and the Prize Money won.

<br></br>
</p>

<p className="mx-4 mt-4" style={{ color:"yellow",fontSize:"34px"}}>
*** SCREENSHOT HERE - GAME ENDED TICKETS HALL OF FAME ***
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
When the competition completes on the SpotTheBall page we can see the solution: "Wisdom of the Crowd Answer" and the winning ticket coordinates.<br></br>

The wisdom of the crowd dictates that the more tickets played, the closer the average prediction of the coordinates is to the real position of the ball.<br></br>

Therefore the winning ticket is the one with the smallest distance to the Wisdom of the Crowd Answer.

<br></br>
</p>

<p className="mx-4 mt-4" style={{ color:"yellow",fontSize:"34px"}}>
*** SCREENSHOT HERE - WISDOM WINNER ***
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
<h2 className="">Detailed Walkthrough</h2>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
Three solidity smart contracts are deployed on Moonbeam which are the acting headquarters of the game financials and three almost identical solidity smart contract are deployed in Binance Smart Chain as well.<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
These smart contracts are called AxelarGameManager.sol, GameDeposits.sol and GamePlayers.sol<br></br>

- A player residing in Binance Smart Chain deposits 1 axlUSDC per ticket in the GameDeposits.sol smart contract which is then forwarded to the Binance residing AxelarGameMananger.<br></br>
- A player residing in Interlay or Astar, has the equivalent of 1 axlUSDC in INTR or ASTR being transferred from Interlay or Axelar to the Moonbeam based GameDeposits.sol which as soon as it arrives is swapped for axlUSDC.<br></br>
- A player in Moonbeam pays 1 axlUSDC per ticket by depositing into the Moonbeam based GameDeposits.sol and together with any previous INTR or ASTR (swapped to axlUSDC) are transferred to the Moonbean based AxelarGameManager.<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
Note: When a player submits a ticket and pays the equivalent of 1 axlUSC whether after an INTR or ASTR swap or natively axlUSDC his details are registered in the GamePlayers.sol<br></br>
The players EVM address and if applicable Substrate address is recorded in the Moonbeam based GamePlayers.sol<br></br>
These details will be used in the final phase of the game to tranfer all winning to the winner's native wallet e.g. transfer winnngs in ASTR to winner Astar Substrate address, or if the winner is Moonbeam based, to his Moonbeam EVM account.<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
At this point the finances of the Game are held in 2 different AxelarGameManager smart contracts deployed in Moonbeam and Binance Smart Chain.<br></br>

All Axelar GMP messages between the 2 AxelarGameManagers at this point are about:<br></br>

1. Registering a new game that is is now ready for the player's tickets.<br></br>
2. Unregistering an existing game to state that the game has now expired and cannot acccept new deposits.<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
Following the Phat contract calculations that result in establishing the winner of the game our game moves to its next phase.<br></br>

Axelar GMP messages spread the word about the winner's address and their ecosystem (Moonbeam or Binance) side in the AxelarGameManager smart contracts.<br></br>

In the Moonbeam AxelarGameManager headquarters a record of the winner's address is kept as it is read by all satellite AxelarGameManager contracts (in our case here Binance Smart Chain Satelite AxelarGameManager smart contract).<br></br>

Now that all parties (AxelarGameManager smart contract) in both Moonbeam and Binance are in sync regarding the winning address and which ecosystem it resides on. <br></br>

We are now ready for the final phase of the Game.<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
In the final phase if the winner's address:<br></br>
- Resides on the Binance Smart chain then an Axelar GMP message transferring all axlUSD balance of the Game in Moonbeam is tranferred to the Binance Smart chain address.<br></br>

- Resides on the Moonbeam chain then the reverse occurs, i.e. Any axlUSDC balace held for the game in the AxelarGameManager in Binance Smart Chain is transferred over Axelar GMP messages to the Moonbeam based AxelarGameManager.<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
The last thing remaining is the final payment of the prize pool to the winner.<br></br>
- In the case that the winners address is on Binance Smart Chain all axlUSDC balance from the Binance based AxelarGameManager is trasferred to the GamePlayers.sol and from there to the winner's address.<br></br>

- In the case that the winners address is on Moonbeam natively then a identical route is followed.<br></br>

- In the case that the winners address is from Astar or Interlay then there is an added step where axlUSDC winnings transferred from Moonbeam based AxelarGameManager to the Moonbeam based GamePlayers.sol are ***swapped for ASTR or INTR tokens*** and then transferred natively to Astar and Interlay respectively.<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
At this point the game ends and the winner enjoys his winnings in their origin wallet on Moonbeam, Binance, Astar or Interlay.<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
Note:<br></br>
Several game automations such as the expiry of a game, Axelar GMP messages and Axelar GMP token transfers require the use of an environment based EVM account pre-financed to support the above automations.<br></br>
For the purpose of the hackathon we are financing these accounts with a small balance to showcase our submission.<br></br>
In terms of business logic, such cost can be recouped from the game winnings commision retained for supporting the game.
<br></br>
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
<h2 className="">Repos</h2>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
Phat contracts repo<br></br>
https://github.com/Entity54/Phat-Games-STB<br></br>

Front End repo<br></br>

https://github.com/Entity54/SpotTheBall-Web3athon

<br></br>
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
<h2 className="">Installation</h2>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
The Phat contracs were written in the ink! Version 4. In the Phat contract repo the user can either build these from scratch using:<br></br>

    $cargo contract build<br></br>

or can find the ABI(metadata) phala_games_STB.json and the phala_games_STB.contract in the Phat_contracts folder here<br></br>

For the front end, the user can:<br></br>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
    $yarn<br></br>
    $npm start<br></br>
</p>
and can see in http://localhost:3000/ the front end application connected to this Phat contract

<br></br>
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
<h2 className="">Phat Contract</h2>
</p>
<p className="mx-4 mt-4" style={{ color:"yellow",fontSize:"34px"}}>
*** SCREENSHOT HERE - PHAT CONTRACT CB UI 1 ***
<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>

By clicking the Start button in the front end in essence we call config_game function passing the imagehash (to be loaded from 4everland in next relase), the start and end time of the game, the ticket cost and fees percentage. The default ticket cost is 1 axlUSD and the default fees percentage is 20 for 20%.<br></br>

Soon after the check_game function is called every 2 blocks in the front end.<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
Note: Please be aware that sometimes on the testnet, the block interval can be as high as 2mins, so please be patient to wait a few blocks after transaction submission. After a couple of blocks the transactions are mined and the front end updates.<br></br>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
The check_game function is responsible for:<br></br>

1. Starting the game if the block timestmap is greater than the game start time. It also resets certain storage variables to default so that the game can be played repeatedly.<br></br>

2. Ending the game when the block timestamp has surpassed the end time for the game. It first turns the state of the game to false and then calls calculate_distances, find_winners, set the winner halloffame struct and add it to the hall_of_fame_vec and finally transfer the Pot axlUSD funds to the winner (80% of the Pot) and the game owner (20% of the Pot after ensuring there is enough existential deposit for the phat contract).<br></br>

The get_game_stat can be called at any time to see the game specifications.<br></br>

The get_players shows us the unique account address that have played the game.<br></br>

The get_players_mapping map a game particpant account address to the vector of all tickets he has played.<br></br>

The get_all_tickets retireves all the ticket coordiantes played and the get_ordered_ticket_ids retrieves the unique ticket ids.<br></br>

Note: Bearing in mind the above a lot of analytic dash boards can be created to show the most frequest and biggest players for possibly allocating motivational rewards in futures games.<br></br>

The get_sums query retrieves the running sum for x and y coordinates that is calcualted everytime a new ticket is played.
<br></br>
</p>
<p className="mx-4 mt-4" style={{ color:"yellow",fontSize:"34px"}}>
*** SCREENSHOT HERE - PHAT CONTRACT CB UI 2 ***
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
calculate_wisdom_of_crowd_coordinates calculates the average of x and y coordiantes of all tickets and it is viewable by calling get_wisdom_of_crowd_coordinates.<br></br>

submit_tickets is used to submit one or more ticket coordinates. It ensures that the required amount of axlUSD has also been paid and it updates the total_pot, total_net_pot and total_fees.<br></br>

calculate_distances uses the Pythagorean Square theorem to calculate the distance of every played ticket from the Wisdom of The Crowd (x,y) coordinates. Finally it sorts the tickets based on the minimum distance and stores the relevant ticket ids in ordered_ticket_ids.<br></br>
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
Note: The amount of computation makes Phat contracts the perfect medium to operate the game.<br></br>

Now the find_winners can be called.<br></br>

Note: in the current version we are using the case of a single winnner, but this function shows how easy it is to switch to a game version with multiple winners and variable winning prizes.<br></br>

get_winning_tickets allows us to view the winning tickets.<br></br>
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
The make_payments functions is called privately from the check_game to make the payments to the winning account address and the administrator address (owner of the game).<br></br>

Finally the get_hall_of_fame query allows us to retreive the vector with all hall of fame structs. Now we have a list of all past winners.<br></br>
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
Note: By having the list of past winners, in a future version we could allocate NFTs enabling exclusive game competions with much higher prizes for previous winners holding the NFTs.
<br></br>
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
<h2 className="">Appendix</h2>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
<h3 className="">Addresses Of Deployed Contracts</h3>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
<h3 className="">Moonbase Alpha Testnet</h3>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>

axelar_game_manager_moonbase_address = "0x264D7022404bD7AE3ca3CE817347DC1cDD036368";<br></br>

game_players_moonbase_address = "0xe34dc382EAf965fDbBEFC267c59ed399fBCD1Dd6";<br></br>

game_deposits_moonbase_address = "0x20a9C9dAFef8D9BDaC2de110FD13443fB5679913";
<br></br>
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
<h3 className="">Binance Testnet</h3>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
axelar_game_manager_binanceTestNet_address = "0xe295348aC14AdC064273d71A21f6520b2B634884";<br></br>
game_players_binanceTestNet_address = "0x78ae32d083606fdf12630A9f8A20bF0FEDcbcFdD";<br></br>
game_deposits_binanceTestNet_address = "0xA7ceeB7D789f68d197A3181156B69372c8eE6a5F";
<br></br>
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
<h3 className="">Phala Closed Beta Testnet</h3>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
phat_games_STB_contractId = "0xe1302a8db9ead738c2de1f483a6c01d4b4e3595ca271aa291cc7ecdbbd2b42ab"<br></br>

CODE HASH 0x6f6dc3a36a2dc00c2fa56f9b6f8f6814e7d92403e1909d98058909fdb4b57215<br></br>

LANGUAGE ink! 4.2.0<br></br>

COMPILER rustc 1.68.2<br></br>

DEVELOPER 464inykovjdRPhMhW2zbJ47iA8qYSmPWqKLkaEgH2xc6SQ4c<br></br>

CLUSTERID 0x0000000000000000000000000000000000000000000000000000000000000001<br></br>

STAKES 0.01<br></br>
</p>
<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
<h3 className="">Mainnet StellaSwap</h3>
</p>
<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
StellaSwap = 0x24aA375Ba88cC6751c2998fA24B007C48d0bA6a4<br/>

myXCM = 0xc440b4621b985d441DaA33b2d11C951Bc344C98e<br/>

Moonbeam <br/>

AxelarGameManager.sol = 0xEa88A112F8D6028BE88E5766581081E9F05A8b7f <br/>

GamePlayers.sol = 0xdcb5b9b361CA6c24C383158c825D9bf4C75b1b60 <br/>

GameDeposits.sol = 0xEdf6321Df783dB1cC2f145791E06cC7546F715e7<br/>

Binance<br/>

AxelarGameManager.sol = 0x70bEdA6E7dA0B08A0529b50F4A5d3a3c0D98EBa5<br/>

GamePlayers.sol = 0x6B4f4DBB62A98A8635Cb070E128D9f01C0aECebd<br/>

GameDeposits.sol = 0xB17F49d8f51AF38a16fF3D7e7e8199da995336e2<br/>


			  </p>
			</Link>
		  </li>
		</ul>
	  </PerfectScrollbar>
	</div>
  </div>
</div>
</div>


=======
				<div className="col-xl-12">
					<div className="row">
						<div className="col-xl-12 col-xxl-6 col-lg-6">
							<div className="card">
								<div className="card-body">
									<PerfectScrollbar
										style={{ height: "auto" }}
										id="DZ_W_TimeLine"
										className="widget-timeline dz-scroll height370 ps ps--active-y"
									>
										<ul className="timeline">
											<li>
												<div className="timeline-badge primary"></div>
													<Link
													className="timeline-panel text-muted"
													to="/widget-basic"
													>

													<p className="m-4 mt-4 text-white" style={{ fontSize:"40px"}}>
																			
													Web3athon 2023 Hackathon<br></br>

													Moonbeam Challenge - 

													Use Moonbeam and a GMP Protocol to call a contract on a remote chain<br></br>
													</p>
													<p className="m-4 mt-4 text-dark" style={{ fontSize:"24px"}}>

													To showcase the project, the following chains and protocols were included in the project:<br></br>

													<img src={glmr100} width="50"></img>
													<img src={pha100} width="50"></img>
													<img src={astr100} width="50"></img>
													<img src={intr100} width="50"></img>
													<img src={bsc100} width="50"></img>
													<img src={axl100} width="50"></img>

													</p>
													<li className="m-4 mt-4 text-dark" style={{ fontSize:"24px"}}>

													Table of Contents<br></br>

													1. General Info<br></br>
													2. Chains Used<br></br>
													3. Visual Game Walkthrough<br></br>
													4. Detailed Walkthrough<br></br>
													5. Repos<br></br>
													6. Installation<br></br>
													7. Phat Contract<br></br>
													8. Appendix<br></br>

													</li>


													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
																
													<h2 className="">General Info</h2>

													The Polkadot ecosystem is comprised of a relay chain, which provides the shared security of the network, and parachains that use Substrate unique strengths to offer custom based logic chains such as Privacy, Defi, NFTs, etc.<br></br>

													The horizontal parachain interconnectiviy that XCM brings to Polkadot is further enhanced with interconnectivity between other Ecosystems external to Polkadot (e.g. Binance Smart Chain) via the Moonbeam parachain and the use of General Messaging Protocols (GMP) e.g. Axelar.<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													In our submission we will show a portion of the above in a natural business logic flow.<br></br>

													For our use case we have built a version of the classic Web2 game called Spot The Ball.<br></br>

													Each game has a fixed time duration and shows an image (with an image hash) from a popular sport where the ball has been digitally removed.<br></br>

													The game players try to guess the position of the ball by using their observational skills regarding the position of the sportsmans eyes and body.<br></br>

													Each player can pay as many times as he/she wants by submitting 1 or mutiple tickets at a time.<br></br>

													Each ticket carries the X,Y co-ordinates (player's estimation) and has a fixed price of 1 axlUSDC (Axelar USD) but payment is accepted also in INTR and ASTR for players that keep a balance on those repsective parachains.<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													Therefore, a game player can pay for a ticket by sending either:<br></br>
													- axlUSD directly when using either a wallet on Binance Smart Chain or Moonbeam<br></br>
													- The native asset of INTR on the Interlay chain<br></br>
													- The native asset of ASTR on the Astar chain<br></br>

													When playing the game with INTR or ASTR, the native asset amount of the ticket price (1 axlUSDC) will be calculated, transferred via XCM from the Interlay or Astar parachain to Moonbeam and then swapped for axlUSDC before finally deposited to the Game Prize Pot.<br></br>

													To avoid cheating, the traditional game of spot the ball doesnt actually use the position of the removed ball as the winning co-ordinates. In many cases it would be too easy for someone to find the original image somewhere. Therefore, in some cases a panel of judges are used to decide together where the winning position should be and then the ticket entries are all compared to that position to find a winner.<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													We obviously do not want to include the centralised nature of this approach and have therefore incorporated the answer to be decided by a "wisdom of the crowd" approach.

													The winning solution of the game is calculated by finding the average of all tickets played in a single game. <br></br>

													The winner of the game is the player whose coordinates have the shortest distance from the wisdom of the crowd solution.<br></br>

													The game is comprised of Phat Ink! and Solidity EVM Smart Contracts deployed in Phala, Moonbeam & Binance Smart Chain.<br></br>

													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
																
													<h2 className="">Chains Useds</h2>

													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													<img src={pha100} width="50"></img><br></br>
													Phala is a parachain that among other things offers privacy and advanced off-chain decentralised computational abilities. Therefore we have created a Phat contract that provides:
													- Privacy for each ticket played <br></br>
													- Calculation of the wisdom of the crowd solution<br></br>
													- Calculations on the distances of all ticket co-ordinates played to the WOTC solution to find the winning entry<br></br>
													- Sorted entries to allow the competition to offer multiple prizes in the future for close entries etc
													<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													<img src={glmr100} width="50"></img><br></br>
													Moonbeam is a parachain that offers a fully compatible EVM environment with a long list of precompiles that offer added functionality. For our case we are using the Xtokens Precompile for transferring the prize funds if the winning entry resides on the Astar or Interlay Parachains.
													<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													<img src={astr100} width="50"></img><br></br>
													Astar is the biggest blockcahin in Japan and offers an EVM enivironement and an Ink! smart contract environment. It also incorporates multiple blockchain bridges.
													<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													<img src={intr100} width="50"></img><br></br>
													Interlay is the defacto decentralised point of entry in Polkadot for the biggest crypto asset, BTC.
													<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													<img src={bsc100} width="50"></img><br></br>
													Binance Smart Chain is within the top 3 biggest blockchains with advanced protocols and a large audience.
													<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													<img src={axl100} width="50"></img><br></br>
													Axelar delivers cross-chain communication for Web3 allowing Interchain dApps to be developed.
													<br></br>
													</p>

													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													<h2 className="">Visual Game Walkthrough</h2>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													In the Tickets page we can see the Start button which is either green (meaning a new game can be started) or greyed out (if there is already an active game).<br></br> 

													A new game can only start after the completion of any active game.<br></br>

													The start and end times in the upper part of the screen show when the game started and when it will be completed.<br></br>

													Finally the remaining amount of minutes in the game is also shown.
													<br></br>
													</p>

													<p className="mx-4 mt-4" style={{ color:"yellow",fontSize:"34px"}}>
													*** SCREENSHOT HERE - GAME IN PROGRESS ***
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													Once a new game has started, on the Spot The Ball page a fresh image is loaded within which the ball has been digitally removed.<br></br>

													Each game participant can click on the image and create a ticket with the generated coordinates.<br></br>

													Each ticket has a cost of 1 axlUSD and the user can play one or multiple tickets per time.<br></br>

													Each time the user clicks on the image they should then click the "play" button to generate a ticket with these selected coordinates.<br></br>

													When they are ready they can click "submit" to submit their tickets. The total cost in axlUSD is shown next to the submit button.
													<br></br>
													</p>

													<p className="mx-4 mt-4" style={{ color:"yellow",fontSize:"34px"}}>
													*** SCREENSHOT HERE - PLAY TICKETS ***
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													The Pot Size shows the total axlUSD that have been deposited for the current game.<br></br>

													The Payout is 80% of the Pot Size and the Fees (20%) goes to the owner of the game.
													<br></br>
													</p>

													<p className="mx-4 mt-4" style={{ color:"yellow",fontSize:"34px"}}>
													*** SCREENSHOT HERE - POT SIZE ***
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													Back on the Tickets Page, when the game expires the number of tickets played in the current game is shown underneath the Start button.<br></br>

													The winner of the game along with previous winners are shown. The bottom of the screen shows previous winners in a  "Hall of Fame" with all their relevant details e.g. owener of the ticket winning coordinates, competition id, number of players (account addresses), number of tickets and the Prize Money won.

													<br></br>
													</p>

													<p className="mx-4 mt-4" style={{ color:"yellow",fontSize:"34px"}}>
													*** SCREENSHOT HERE - GAME ENDED TICKETS HALL OF FAME ***
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													When the competition completes on the SpotTheBall page we can see the solution: "Wisdom of the Crowd Answer" and the winning ticket coordinates.<br></br>

													The wisdom of the crowd dictates that the more tickets played, the closer the average prediction of the coordinates is to the real position of the ball.<br></br>

													Therefore the winning ticket is the one with the smallest distance to the Wisdom of the Crowd Answer.

													<br></br>
													</p>

													<p className="mx-4 mt-4" style={{ color:"yellow",fontSize:"34px"}}>
													*** SCREENSHOT HERE - WISDOM WINNER ***
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													<h2 className="">Detailed Walkthrough</h2>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													Three solidity smart contracts are deployed on Moonbeam which are the acting headquarters of the game financials and three almost identical solidity smart contract are deployed in Binance Smart Chain as well.<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													These smart contracts are called AxelarGameManager.sol, GameDeposits.sol and GamePlayers.sol<br></br>

													- A player residing in Binance Smart Chain deposits 1 axlUSDC per ticket in the GameDeposits.sol smart contract which is then forwarded to the Binance residing AxelarGameMananger.<br></br>
													- A player residing in Interlay or Astar, has the equivalent of 1 axlUSDC in INTR or ASTR being transferred from Interlay or Axelar to the Moonbeam based GameDeposits.sol which as soon as it arrives is swapped for axlUSDC.<br></br>
													- A player in Moonbeam pays 1 axlUSDC per ticket by depositing into the Moonbeam based GameDeposits.sol and together with any previous INTR or ASTR (swapped to axlUSDC) are transferred to the Moonbean based AxelarGameManager.<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													Note: When a player submits a ticket and pays the equivalent of 1 axlUSC whether after an INTR or ASTR swap or natively axlUSDC his details are registered in the GamePlayers.sol<br></br>
													The players EVM address and if applicable Substrate address is recorded in the Moonbeam based GamePlayers.sol<br></br>
													These details will be used in the final phase of the game to tranfer all winning to the winner's native wallet e.g. transfer winnngs in ASTR to winner Astar Substrate address, or if the winner is Moonbeam based, to his Moonbeam EVM account.<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													At this point the finances of the Game are held in 2 different AxelarGameManager smart contracts deployed in Moonbeam and Binance Smart Chain.<br></br>

													All Axelar GMP messages between the 2 AxelarGameManagers at this point are about:<br></br>

													1. Registering a new game that is is now ready for the player's tickets.<br></br>
													2. Unregistering an existing game to state that the game has now expired and cannot acccept new deposits.<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													Following the Phat contract calculations that result in establishing the winner of the game our game moves to its next phase.<br></br>

													Axelar GMP messages spread the word about the winner's address and their ecosystem (Moonbeam or Binance) side in the AxelarGameManager smart contracts.<br></br>

													In the Moonbeam AxelarGameManager headquarters a record of the winner's address is kept as it is read by all satellite AxelarGameManager contracts (in our case here Binance Smart Chain Satelite AxelarGameManager smart contract).<br></br>

													Now that all parties (AxelarGameManager smart contract) in both Moonbeam and Binance are in sync regarding the winning address and which ecosystem it resides on. <br></br>

													We are now ready for the final phase of the Game.<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													In the final phase if the winner's address:<br></br>
													- Resides on the Binance Smart chain then an Axelar GMP message transferring all axlUSD balance of the Game in Moonbeam is tranferred to the Binance Smart chain address.<br></br>

													- Resides on the Moonbeam chain then the reverse occurs, i.e. Any axlUSDC balace held for the game in the AxelarGameManager in Binance Smart Chain is transferred over Axelar GMP messages to the Moonbeam based AxelarGameManager.<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													The last thing remaining is the final payment of the prize pool to the winner.<br></br>
													- In the case that the winners address is on Binance Smart Chain all axlUSDC balance from the Binance based AxelarGameManager is trasferred to the GamePlayers.sol and from there to the winner's address.<br></br>

													- In the case that the winners address is on Moonbeam natively then a identical route is followed.<br></br>

													- In the case that the winners address is from Astar or Interlay then there is an added step where axlUSDC winnings transferred from Moonbeam based AxelarGameManager to the Moonbeam based GamePlayers.sol are ***swapped for ASTR or INTR tokens*** and then transferred natively to Astar and Interlay respectively.<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													At this point the game ends and the winner enjoys his winnings in their origin wallet on Moonbeam, Binance, Astar or Interlay.<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													Note:<br></br>
													Several game automations such as the expiry of a game, Axelar GMP messages and Axelar GMP token transfers require the use of an environment based EVM account pre-financed to support the above automations.<br></br>
													For the purpose of the hackathon we are financing these accounts with a small balance to showcase our submission.<br></br>
													In terms of business logic, such cost can be recouped from the game winnings commision retained for supporting the game.
													<br></br>
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													<h2 className="">Repos</h2>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													Phat contracts repo<br></br>
													https://github.com/Entity54/Phat-Games-STB<br></br>

													Front End repo<br></br>

													https://github.com/Entity54/SpotTheBall-Web3athon

													<br></br>
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													<h2 className="">Installation</h2>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													The Phat contracs were written in the ink! Version 4. In the Phat contract repo the user can either build these from scratch using:<br></br>

														$cargo contract build<br></br>

													or can find the ABI(metadata) phala_games_STB.json and the phala_games_STB.contract in the Phat_contracts folder here<br></br>

													For the front end, the user can:<br></br>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
														$yarn<br></br>
														$npm start<br></br>
													</p>
													and can see in http://localhost:3000/ the front end application connected to this Phat contract

													<br></br>
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													<h2 className="">Phat Contract</h2>
													</p>
													<p className="mx-4 mt-4" style={{ color:"yellow",fontSize:"34px"}}>
													*** SCREENSHOT HERE - PHAT CONTRACT CB UI 1 ***
													<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>

													By clicking the Start button in the front end in essence we call config_game function passing the imagehash (to be loaded from 4everland in next relase), the start and end time of the game, the ticket cost and fees percentage. The default ticket cost is 1 axlUSD and the default fees percentage is 20 for 20%.<br></br>

													Soon after the check_game function is called every 2 blocks in the front end.<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													Note: Please be aware that sometimes on the testnet, the block interval can be as high as 2mins, so please be patient to wait a few blocks after transaction submission. After a couple of blocks the transactions are mined and the front end updates.<br></br>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													The check_game function is responsible for:<br></br>

													1. Starting the game if the block timestmap is greater than the game start time. It also resets certain storage variables to default so that the game can be played repeatedly.<br></br>

													2. Ending the game when the block timestamp has surpassed the end time for the game. It first turns the state of the game to false and then calls calculate_distances, find_winners, set the winner halloffame struct and add it to the hall_of_fame_vec and finally transfer the Pot axlUSD funds to the winner (80% of the Pot) and the game owner (20% of the Pot after ensuring there is enough existential deposit for the phat contract).<br></br>

													The get_game_stat can be called at any time to see the game specifications.<br></br>

													The get_players shows us the unique account address that have played the game.<br></br>

													The get_players_mapping map a game particpant account address to the vector of all tickets he has played.<br></br>

													The get_all_tickets retireves all the ticket coordiantes played and the get_ordered_ticket_ids retrieves the unique ticket ids.<br></br>

													Note: Bearing in mind the above a lot of analytic dash boards can be created to show the most frequest and biggest players for possibly allocating motivational rewards in futures games.<br></br>

													The get_sums query retrieves the running sum for x and y coordinates that is calcualted everytime a new ticket is played.
													<br></br>
													</p>
													<p className="mx-4 mt-4" style={{ color:"yellow",fontSize:"34px"}}>
													*** SCREENSHOT HERE - PHAT CONTRACT CB UI 2 ***
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													calculate_wisdom_of_crowd_coordinates calculates the average of x and y coordiantes of all tickets and it is viewable by calling get_wisdom_of_crowd_coordinates.<br></br>

													submit_tickets is used to submit one or more ticket coordinates. It ensures that the required amount of axlUSD has also been paid and it updates the total_pot, total_net_pot and total_fees.<br></br>

													calculate_distances uses the Pythagorean Square theorem to calculate the distance of every played ticket from the Wisdom of The Crowd (x,y) coordinates. Finally it sorts the tickets based on the minimum distance and stores the relevant ticket ids in ordered_ticket_ids.<br></br>
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													Note: The amount of computation makes Phat contracts the perfect medium to operate the game.<br></br>

													Now the find_winners can be called.<br></br>

													Note: in the current version we are using the case of a single winnner, but this function shows how easy it is to switch to a game version with multiple winners and variable winning prizes.<br></br>

													get_winning_tickets allows us to view the winning tickets.<br></br>
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													The make_payments functions is called privately from the check_game to make the payments to the winning account address and the administrator address (owner of the game).<br></br>

													Finally the get_hall_of_fame query allows us to retreive the vector with all hall of fame structs. Now we have a list of all past winners.<br></br>
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													Note: By having the list of past winners, in a future version we could allocate NFTs enabling exclusive game competions with much higher prizes for previous winners holding the NFTs.
													<br></br>
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													<h2 className="">Appendix</h2>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													<h3 className="">Addresses Of Deployed Contracts</h3>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													<h3 className="">Moonbase Alpha Testnet</h3>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>

													axelar_game_manager_moonbase_address = "0x264D7022404bD7AE3ca3CE817347DC1cDD036368";<br></br>

													game_players_moonbase_address = "0xe34dc382EAf965fDbBEFC267c59ed399fBCD1Dd6";<br></br>

													game_deposits_moonbase_address = "0x20a9C9dAFef8D9BDaC2de110FD13443fB5679913";
													<br></br>
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													<h3 className="">Binance Testnet</h3>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													axelar_game_manager_binanceTestNet_address = "0xe295348aC14AdC064273d71A21f6520b2B634884";<br></br>
													game_players_binanceTestNet_address = "0x78ae32d083606fdf12630A9f8A20bF0FEDcbcFdD";<br></br>
													game_deposits_binanceTestNet_address = "0xA7ceeB7D789f68d197A3181156B69372c8eE6a5F";
													<br></br>
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													<h3 className="">Phala Closed Beta Testnet</h3>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													phat_games_STB_contractId = "0xe1302a8db9ead738c2de1f483a6c01d4b4e3595ca271aa291cc7ecdbbd2b42ab"<br></br>

													CODE HASH 0x6f6dc3a36a2dc00c2fa56f9b6f8f6814e7d92403e1909d98058909fdb4b57215<br></br>

													LANGUAGE ink! 4.2.0<br></br>

													COMPILER rustc 1.68.2<br></br>

													DEVELOPER 464inykovjdRPhMhW2zbJ47iA8qYSmPWqKLkaEgH2xc6SQ4c<br></br>

													CLUSTERID 0x0000000000000000000000000000000000000000000000000000000000000001<br></br>

													STAKES 0.01<br></br>
													</p>
													<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
													<h3 className="">Mainnet StellaSwap</h3>
													</p>
													<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
													StellaSwap = 0x24aA375Ba88cC6751c2998fA24B007C48d0bA6a4<br></br>
													</p>
												</Link>
											</li>
										</ul>
									</PerfectScrollbar>
								</div>
							</div>
						</div>
>>>>>>> a9fc2a48ad80c08f4a12b910414ec81e165f2912
					</div>
				</div>
			</div>	
		</>
	)
}
export default ReadMe;