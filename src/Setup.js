import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { options } from '@astar-network/astar-api';
import { DispatchError, WeightV2 } from '@polkadot/types/interfaces'
import { numberToHex, u8aToString, stringToU8a, u8aToHex, hexToString, hexToU8a, BN, hexToBn, hexToNumber, } from '@polkadot/util'; // Some helper functions used here
import { ContractPromise, Abi } from '@polkadot/api-contract';

import { evmToAddress, addressToEvm } from '@polkadot/util-crypto';
import { ethers, BigNumber } from 'ethers';  
import {Wallet} from 'ethers';  

import IERC20_raw from './Abis/IERC20';  
import Xtokens_raw from './Abis/Xtokens';  

// import test1_raw from './Abis/test1';  
import axelarGameManager_Moonbeam_raw from './Abis/Moonbeam/AxelarGameManager';  
import gameDeposits_Moonbeam_raw from './Abis/Moonbeam/GameDeposits';  
import gamePlayers_Moonbeam_raw from './Abis/Moonbeam/GamePlayers';  

import axelarGameManager_Binance_raw from './Abis/BinanceSmartChain/AxelarGameManager';  
import gameDeposits_Binance_raw from './Abis/BinanceSmartChain/GameDeposits';  
import gamePlayers_Binance_raw from './Abis/BinanceSmartChain/GamePlayers';  
import IBEP20_raw from './Abis/BinanceSmartChain/IBEP20';  


import { init } from '@moonbeam-network/xcm-sdk';
import { AssetSymbol, ChainKey, MOONBEAM_ASSETS } from '@moonbeam-network/xcm-config';
import { toDecimal } from '@moonbeam-network/xcm-utils';


// ***** Phala sdk beta!! *****
// install with `yarn add @phala/sdk@beta`
// tested and working with @phala/sdk@0.4.0-nightly-20230318
import { PinkContractPromise, OnChainRegistry, types } from '@phala/sdk'
import { typeDefinitions } from '@polkadot/types'
// import { types} from "@phala/sdk"; { nonce: -1 }

// ***** Phala *****
import phala_games_STB_metadata from './Abis/phala_games_STB.json';  


const { moonbeam } = init()


// ************************** //
// *** Create a .env file and insert the private key for a Moonbase EVM account
// *** Example 
// *** REACT_APP_PRIVATE_KEY= "YOUR PRIVATE KEY"; 
// *** This account needs to be finance with a singifacnt amount of DEV tokens the currency of Moonbae ALpha Testnet
// *** Bear in mind that for each Axelar GMP Message we pay 8 DEV for fees upfront to ensure not only the message does reach the Satelite smart contracts e.g. Binance Test Net but also comes back with a callback answer to update the Head Quarters Satelite smart contract in Moonbase Alpha that the all Satelites are in sync of the information these hold
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
// ************************** //


const axelar_game_manager_moonbase_address = "0x264D7022404bD7AE3ca3CE817347DC1cDD036368";
const game_players_moonbase_address = "0xe34dc382EAf965fDbBEFC267c59ed399fBCD1Dd6";
// OLD const game_players_moonbase_address = "0x98dC5F3c528D2DC5f18861Fc4185409aB366d03a";

const game_deposits_moonbase_address = "0x20a9C9dAFef8D9BDaC2de110FD13443fB5679913";
// OLD const game_deposits_moonbase_address = "0x3E0f3B2c623647D4fBed423c1bd7E8f0F429f983";


const axelar_game_manager_binanceTestNet_address = "0xe295348aC14AdC064273d71A21f6520b2B634884";

const game_players_binanceTestNet_address = "0x78ae32d083606fdf12630A9f8A20bF0FEDcbcFdD";
// old 0x0A12E76D20CA59E852e3b15583B4812A9d590ffA

const game_deposits_binanceTestNet_address = "0xA7ceeB7D789f68d197A3181156B69372c8eE6a5F";
// old 0x77A4fD5fe32F6DCE9b254a25c37758fDd2E187a0


const WDEV_Moonbase = "0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715";
const WDEV_BinanceTestNet = "0xa893Fd868c3159B294f6416F512203be53315fd8";
const axlUSDC_Moonbeam = "0xCa01a1D0993565291051daFF390892518ACfAD3A";
const axlUSDC_Binance = "0x4268B8F0B87b6Eae5d897996E6b845ddbD99Adf3";

const XtokensAddress    = "0x0000000000000000000000000000000000000804";    
const precompile_xcINTR = "0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab";
const precompile_xcASTR = "0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf";
const precompile_xcUSDT = "0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d";


// // *** Setup Wallets For server start REMOVE LINE BELOW
// const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

// Create a new Wallet instance with the private key
const moonbeam_signer = new Wallet(PRIVATE_KEY);
const binance_signer = new Wallet(PRIVATE_KEY);
//RPC POINTS
const Binance_SmartChain_Testnet = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const MoonbaseAlphaTestnet = "https://rpc.api.moonbase.moonbeam.network";
const BinanceSmartChain = "https://bsc-dataseed.binance.org/";
const Moonbeam = "https://rpc.api.moonbeam.network";
// Connect the Wallet instance to a provider
const Moonbase_provider = new ethers.providers.JsonRpcProvider(MoonbaseAlphaTestnet);
const moonbeam_wallet = moonbeam_signer.connect(Moonbase_provider);
const binanceTestNet_provider = new ethers.providers.JsonRpcProvider(Binance_SmartChain_Testnet);
const binance_wallet = binance_signer.connect(binanceTestNet_provider);
//Set up contracts
const axelarGameManager_Moonbase =  new ethers.Contract( axelar_game_manager_moonbase_address, axelarGameManager_Moonbeam_raw.abi, moonbeam_wallet);
const gameDeposits_Moonbase =  new ethers.Contract( game_deposits_moonbase_address, gameDeposits_Moonbeam_raw.abi, moonbeam_wallet);
const gamePlayers_Moonbase =  new ethers.Contract( game_players_moonbase_address, gamePlayers_Moonbeam_raw.abi, moonbeam_wallet);
const erc20WDEV_Moonbase =  new ethers.Contract( WDEV_Moonbase, IERC20_raw.abi, moonbeam_wallet);



const axelarGameManager_BinanceTestNet =  new ethers.Contract( axelar_game_manager_binanceTestNet_address, axelarGameManager_Binance_raw.abi, binance_wallet);
const gameDeposits_BinanceTestNet =  new ethers.Contract( game_deposits_binanceTestNet_address, gameDeposits_Binance_raw.abi, binance_wallet);
const gamePlayers_BinanceTestNet =  new ethers.Contract( game_players_binanceTestNet_address, gamePlayers_Binance_raw.abi, binance_wallet);
const erc20WDEV_BinanceTestNet =  new ethers.Contract( WDEV_BinanceTestNet, IBEP20_raw.abi, binance_wallet);


// const mantissa15 = new BN("1000000000000000");
const mantissa12 = new BN("1000000000000");
const mantissa10 = new BN("10000000000");
const mantissa8 = new BN("100000000");
const mantissa9 = new BN("1000000000");


let engineMessage = "Welcome to the game Spot The Ball";

// ***** Phala *****
const phat_games_STB_contractId = "0xe1302a8db9ead738c2de1f483a6c01d4b4e3595ca271aa291cc7ecdbbd2b42ab"



console.log(" ********** phat_contractId ********** : ",phat_games_STB_contractId);
let phala_api, phat_games_STB, phat_contract_boiler_plate;
let polkadot_test_account;

let userChain; //possible values Moonbeam,Binance,Interlay,Astar,Moonbase,BinanceTestNet
const setChainOfUser = (_userChain) => {
	userChain = _userChain;       // MOONBASE,BINANCETESTNET,MOONBEAM,BINANCE,ASTAR,INTERLAY
	console.log(`userChain: ${userChain}`);
}
const getUserChain = () => {
	return userChain;
}

let wallet, Xtokens, mm_chainId, mm_account;
const setWallet = (_wallet=null, _mm_chainId=null, _mm_account=null) => { 
	if (_wallet) {
		wallet = _wallet;
		mm_chainId = _mm_chainId;
		mm_account = _mm_account;
		console.log("New wallet : ",wallet,` ***** mm_chainId: ${mm_chainId}`); //Moonbeam=1284 , Moonriver=1285, MoonbaseAlpha=1287
		if (mm_chainId==1284) Xtokens =  new ethers.Contract( XtokensAddress, Xtokens_raw.abi, wallet);
	}
}


// ****
let last_EVM_TransactionMined = true;
// ****



//Call Game Functions
const getPotBalances = async () => {
	const phat_response = await get_game_stats();
	const moonbasePot = await getMoonbasePot(phat_response.gameHash);
	const binanceTestNetPot = await getBinaceTestNetPot(phat_response.gameHash);
	// const totalPot = Number(moonbasePot) + Number(binanceTestNetPot);
	const totalPot = ((Number(moonbasePot)*10000) + (Number(binanceTestNetPot)*10000) ) / 10000;

    return {total: totalPot, moonbeamPot: moonbasePot, binancePot: binanceTestNetPot };
}

const getMoonbasePot = async (gameHash) => {
	const gameBalanceWEI =  await axelarGameManager_Moonbase.gameBalance(gameHash);
	const gameBalance = Number((ethers.utils.formatUnits(`${gameBalanceWEI}`, 18)).toString()).toFixed(5);
	// console.log(`gameBalance_Moonbase: ${gameBalance}`);
	return gameBalance;
}
const getBinaceTestNetPot = async (gameHash) => {
	const gameBalanceWEI =  await axelarGameManager_BinanceTestNet.gameBalance(gameHash);
	const gameBalance = Number((ethers.utils.formatUnits(`${gameBalanceWEI}`, 18)).toString()).toFixed(5);
	// console.log(`gameBalance_BinanceTestNet: ${gameBalance}`);
	return gameBalance;
}

const getEVMGameState = async (gameHash) => {
	const gameState_Moonbeam =  await axelarGameManager_Moonbase.games(gameHash);
	// console.log(`gameState_Moonbeam: ${gameState_Moonbeam}`);
	return gameState_Moonbeam;
}

const registerGame_Moonbase = async (gameHash) => {
	// console.log(`registerGame_Moonbase is run`);
	last_EVM_TransactionMined = false;

	const tx_local =  await axelarGameManager_Moonbase.sendMessageToLocalSatelite(1,gameHash,true,0,0);
	tx_local.wait().then( async reslveMsg => {
		 console.log(`tx_local registerGame_Moonbase is mined resolveMsg : `,reslveMsg);
		 
		 const tx_satelite =  await axelarGameManager_Moonbase.sendMessageToSatelites(0,1,gameHash,true,0,0,{ value: ethers.utils.parseUnits("8", "ether") });
		 tx_satelite.wait().then( async reslveMsg => {
			  console.log(`tx_satelite registerGame_Moonbeam is mined resolveMsg : `,reslveMsg);
			  last_EVM_TransactionMined = true;
		 });
	});
};

//TO TEST
const unregisterGame_Moonbase = async (gameHash) => {
	// console.log(`unregisterGame_Moonbase is run`);
	last_EVM_TransactionMined = false;

	const tx_local =  await axelarGameManager_Moonbase.sendMessageToLocalSatelite(1,gameHash,false,0,0);
	tx_local.wait().then( async reslveMsg => {
		 console.log(`tx_local unregisterGame_Moonbase is mined resolveMsg : `,reslveMsg);
		 
		 const tx_satelite =  await axelarGameManager_Moonbase.sendMessageToSatelites(0,1,gameHash,false,0,0,{ value: ethers.utils.parseUnits("8", "ether") });
		 tx_satelite.wait().then( async reslveMsg => {
			  console.log(`tx_satelite unregisterGame_Moonbase is mined resolveMsg : `,reslveMsg);
			  last_EVM_TransactionMined = true;
		 });
	});
};

const isGameGloballyRegistered = async (gameHash) => {
	// console.log(`isGameGloabllyRegistered is run`);
    let gameIsGloballyRegistered = false;
	const gameState_Moonbeam =  await axelarGameManager_Moonbase.games(gameHash);
	const globalGameState_Binance =  await axelarGameManager_Moonbase.globalGameState(gameHash,"binance"); //Satelite
    if (gameState_Moonbeam && globalGameState_Binance) gameIsGloballyRegistered = true;
	// console.log(`isGameGloballyRegistered gameState_Moonbeam: ${gameState_Moonbeam} globalGameState_Binance: ${globalGameState_Binance} gameIsGloballyRegistered: ${gameIsGloballyRegistered}`);
	return gameIsGloballyRegistered;
}
const isGameGloballyUnRegistered = async (gameHash) => {
	// console.log(`isGameGloballyUnRegistered is run`);
    let gameIsGloballyUnRegistered = false;
	const gameState_Moonbeam =  await axelarGameManager_Moonbase.games(gameHash);
	const globalGameState_Binance =  await axelarGameManager_Moonbase.globalGameState(gameHash,"binance"); //Satelite
    if (!gameState_Moonbeam && !globalGameState_Binance) gameIsGloballyUnRegistered = true;
	// console.log(`isGameGloballyUnRegistered gameState_Moonbeam: ${gameState_Moonbeam} globalGameState_Binance: ${globalGameState_Binance} gameIsGloballyUnRegistered: ${gameIsGloballyUnRegistered}`);
	return gameIsGloballyUnRegistered;
}

// console.log(` ====> playGame_FromMoonbeam is run userChain: ${userChain} mm_account: ${mm_account} wallet: `,wallet);
const playGame_FromMoonbase = async (gameHash="", amount="0.01122334455") => {
	console.log(`playGame_FromMoonbeam is run`);

	const user_gamePlayers_Moonbase =  new ethers.Contract( game_players_moonbase_address, gamePlayers_Moonbeam_raw.abi, wallet);

	const tx_registerPlayer =  await user_gamePlayers_Moonbase.registerPlayer(mm_account,mm_account,userChain,"","");
	tx_registerPlayer.wait().then( async reslveMsg => {
		 console.log(`tx_registerPlayer playGame_FromMoonbase  is mined resolveMsg : `,reslveMsg);

		 // APPROVE GAME CURRENCY FOR GameDeposits.sol
		 const approvaleResults = await approve(WDEV_Moonbase,game_deposits_moonbase_address,amount);
		 console.log(`playGame_FromMoonbase approvaleResults: `,approvaleResults);

		 const user_gameDeposits_Moonbase =  new ethers.Contract( game_deposits_moonbase_address, gameDeposits_Moonbeam_raw.abi, wallet);

		 const tx_local_allocateDeposits=  await user_gameDeposits_Moonbase.allocateDeposits("WDEV",gameHash, (ethers.utils.parseUnits(amount, "ether") ) );
		 tx_local_allocateDeposits.wait().then( async reslveMsg => {
			  	console.log(`tx_local_allocateDeposits playGame_FromMoonbase is mined resolveMsg : `,reslveMsg);

				const tx_local_depositFundsToGame=  await gameDeposits_Moonbase.depositFundsToGame(gameHash);
				tx_local_depositFundsToGame.wait().then( async reslveMsg => {
					console.log(`tx_local_depositFundsToGame playGame_FromMoonbase is mined resolveMsg : `,reslveMsg);
				});
		 });
	});
};

const playGame_FromBinanceTestNet = async (gameHash="", amount="0.000000778899") => {
	console.log(`playGame_FromBinanceTestNet is run`);

	const user_gamePlayers_BinanceTestNet =  new ethers.Contract( game_players_binanceTestNet_address, gamePlayers_Binance_raw.abi, wallet);

	const tx_registerPlayer =  await user_gamePlayers_BinanceTestNet.registerPlayer(mm_account,mm_account,userChain,"","");
	tx_registerPlayer.wait().then( async reslveMsg => {
		 console.log(`tx_registerPlayer playGame_FromBinanceTestNet  is mined resolveMsg : `,reslveMsg);

		 // APPROVE GAME CURRENCY FOR GameDeposits.sol
		 const approvaleResults = await approve(WDEV_BinanceTestNet,game_deposits_binanceTestNet_address,amount);
		 console.log(`playGame_FromBinanceTestNet approvaleResults: `,approvaleResults);

		 const user_gameDeposits_BinanceTestNet =  new ethers.Contract( game_deposits_binanceTestNet_address, gameDeposits_Binance_raw.abi, wallet);

		 const tx_local_allocateDeposits=  await user_gameDeposits_BinanceTestNet.allocateDeposits("WDEV",gameHash, (ethers.utils.parseUnits(amount, "ether") ) );
		 tx_local_allocateDeposits.wait().then( async reslveMsg => {
			  	console.log(`tx_local_allocateDeposits playGame_FromBinanceTestNet is mined resolveMsg : `,reslveMsg);

				const tx_local_depositFundsToGame=  await gameDeposits_BinanceTestNet.depositFundsToGame(gameHash);
				tx_local_depositFundsToGame.wait().then( async reslveMsg => {
					console.log(`tx_local_depositFundsToGame playGame_FromBinanceTestNet is mined resolveMsg : `,reslveMsg);
				});
		 });
	});
};

// const playGame_FromAstar = async (playerEVMadddress="0xa95b7843825449DC588EC06018B48019D1111000", playerChain="MOONBEAM",playerSubstrateAddressString="5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb",playerParacChain="2032") => {
// 	console.log(`playGame_FromAstar is run`);
//     // const playerHex = getMultiLocationMoonbeam(playerSubstrateAddressString,playerParacChain);
// 	// console.log(`playGame_Moonbeam is playerHex: ${playerHex}`);
// 	// playerChain can bea MOONBEAM_ASSETS, ASTAR, INTERLAY //2006,2032
  
// 	const tx_registerPlayer =  await axelarGameManager_Moonbeam.registerPlayer(playerEVMadddress,playerEVMadddress,playerChain,playerSubstrateAddressString,playerHex);
// 	tx_registerPlayer.wait().then( async reslveMsg => {
// 		 console.log(`tx_registerPlayer playGame_FromAstar  is mined resolveMsg : `,reslveMsg);

// 		 // APPROVE GAME CURRENCY FOR GaemDeposits.sol
		 
// 		//  const tx_satelite =  await axelarGameManager_Moonbeam.sendMessageToSatelites(0,1,val,true,0,0,{ value: ethers.utils.parseUnits("8", "ether") });
// 		//  tx_satelite.wait().then( async reslveMsg => {
// 		// 	  console.log(`tx_satelite registerGame_Moonbeam is mined resolveMsg : `,reslveMsg);
// 		//  });
// 	});
// };

// const playGame_FromInterlay = async (playerEVMadddress="0xa95b7843825449DC588EC06018B48019D1111000", playerChain="MOONBEAM",playerSubstrateAddressString="5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb",playerParacChain="2032") => {
// };


// winnersEcosystem="Moonbeam" or winnersEcosystem="binance" from ther funds will be sent to parachains if needed
const submitWinner_Moonbase = async (gameHash, winnersEcosystem="Moonbeam",winnerEVMaddress="0xa95b7843825449DC588EC06018B48019D1111000") => { 
	console.log(`submitWinner_Moonbase is run`);
	last_EVM_TransactionMined = false;


	// const gasPrice = wallet.gasPrice();
	const gasEstimate =  await axelarGameManager_Moonbase.estimateGas.sendMessageToLocalSatelite(2,gameHash,false,winnersEcosystem,winnerEVMaddress);
	const tx_local =  await axelarGameManager_Moonbase.sendMessageToLocalSatelite(2,gameHash,false,winnersEcosystem,winnerEVMaddress,{gasLimit: increaseGasLimit(gasEstimate)});
	tx_local.wait().then( async reslveMsg => {
		 console.log(`tx_local submitWinner_Moonbase is mined resolveMsg : `,reslveMsg);
		 
		 // o denotes Satelite is Binance
		//  const gasPrice = wallet.gasPrice();
		 const gasEstimate =  await axelarGameManager_Moonbase.estimateGas.sendMessageToSatelites(0,2,gameHash,false,winnersEcosystem,winnerEVMaddress,{ value: ethers.utils.parseUnits("8", "ether") });

		 const tx_satelite =  await axelarGameManager_Moonbase.sendMessageToSatelites(0,2,gameHash,false,winnersEcosystem,winnerEVMaddress,{ value: ethers.utils.parseUnits("8", "ether"), gasLimit: increaseGasLimit(gasEstimate)  });
		 tx_satelite.wait().then( async reslveMsg => {
			console.log(`tx_satelite submitWinner_Moonbase is mined resolveMsg : `,reslveMsg);
			last_EVM_TransactionMined = true;
		 });
	});
};

const isWinnerGloballyRegistered = async (gameHash) => {
	// console.log(`isWinnerGloballyRegistered is run`);
    let winnerIsGloballyRegistered = false;
	const gameWinnerInfo_Moonbeam =  await axelarGameManager_Moonbase.gameWinnerInfo(gameHash);
	const globalGameWinner_Binance =  await axelarGameManager_Moonbase.globalGameWinner(gameHash,"binance"); //Satelite
	// console.log(`gameWinnerInfo_Moonbeam: `,gameWinnerInfo_Moonbeam);
	// console.log(`gameWinnerInfo_Moonbeam WinnerAddress: `,gameWinnerInfo_Moonbeam[0]);
	// console.log(`gameWinnerInfo_Moonbeam WinnerEcosystem: `,gameWinnerInfo_Moonbeam[1]);
	// ['0xa95b7843825449DC588EC06018B48019D1111000', 'Moonbeam', playerAddressString: '0xa95b7843825449DC588EC06018B48019D1111000', playerChain: 'Moonbeam']playerChain: 'Moonbeam']
	// console.log(`globalGameWinner_Binance: `,globalGameWinner_Binance);
	// console.log(`globalGameWinner_Binance WinnerAddress: `,globalGameWinner_Binance[0]);
	// console.log(`globalGameWinner_Binance WinnerEcosystem: `,globalGameWinner_Binance[1]);

    if ( (gameWinnerInfo_Moonbeam[0]===globalGameWinner_Binance[0]) && (gameWinnerInfo_Moonbeam[1]===globalGameWinner_Binance[1]) && gameWinnerInfo_Moonbeam[1]!=="") winnerIsGloballyRegistered = true;
	// console.log(`winnerIsGloballyRegistered ${winnerIsGloballyRegistered}`);
	return winnerIsGloballyRegistered;
}


const increaseGasLimit = (estimatedGasLimit) => {
	return estimatedGasLimit.mul(130).div(100) // increase by 30%
}

const transferSateliteFundsToWinnersEcosystem_Moonbase = async (gameHash) => { 
	console.log(`transferSateliteFundsToWinnersEcosystem_Moonbase is run`);
	last_EVM_TransactionMined = false;

	const gameWinnerInfo_Moonbeam =  await axelarGameManager_Moonbase.gameWinnerInfo(gameHash);
	const ecosystem = gameWinnerInfo_Moonbeam[1];
	console.log(` *** transferSateliteFundsToWinnersEcosystem_Moonbase is run ecosystem: ${ecosystem} ***`);

	if (ecosystem==="Moonbeam")
	{
		console.log(`|||>>> Winner is in Moonbeam ecosystem`);
		const gasEstimate =  await axelarGameManager_Moonbase.estimateGas.sendMessageToLocalSatelite(3,gameHash,false,0,0);
		const tx_local =  await axelarGameManager_Moonbase.sendMessageToLocalSatelite(3,gameHash,false,0,0,{gasLimit: increaseGasLimit(gasEstimate)});
		tx_local.wait().then( async reslveMsg => {
			 console.log(`tx_local payWinner_Moonbase is mined resolveMsg : `,reslveMsg);
			 
			 // o denotes Satelite is Binance
			//  const gasPrice = wallet.gasPrice();
			 const gasEstimate =  await axelarGameManager_Moonbase.estimateGas.sendMessageToSatelites(0,3,gameHash,false,0,0,{ value: ethers.utils.parseUnits("8", "ether") });
	
			 const tx_satelite =  await axelarGameManager_Moonbase.sendMessageToSatelites(0,3,gameHash,false,0,0,{ value: ethers.utils.parseUnits("8", "ether"), gasLimit: increaseGasLimit(gasEstimate) });
			 tx_satelite.wait().then( async reslveMsg => {
				  console.log(`tx_satelite payWinner_Moonbase is mined resolveMsg : `,reslveMsg);
				  last_EVM_TransactionMined = true;
			 });
		});

	}
	else if (ecosystem==="binance")
	{
		console.log(`|||>>> Winner is in binance ecosystem`);
		last_EVM_TransactionMined = true;

		let gasEstimate;
		try {
		    	console.log(`1000|||>>> Winner is in binance ecosystem gasEstimate: ${gasEstimate}`);
				gasEstimate =  await axelarGameManager_Moonbase.estimateGas.sendMessageToLocalSatelite(3,gameHash,false,0,0,{ value: ethers.utils.parseUnits("8", "ether") });
				console.log(`1001|||>>> Winner is in binance ecosystem gasEstimate: ${gasEstimate}`);
		}
		catch (e) {
			console.log(`1002|||>>> Winner is in binance ecosystem gasEstimate: ${gasEstimate}`);
			console.log(`Error 1 transferSateliteFundsToWinnersEcosystem_Moonbase gasEstimate errored with: `,JSON.stringify(e));
			gasEstimate = ethers.BigNumber.from( "170000" );
			console.log(`1003|||>>> Winner is in binance ecosystem gasEstimate: ${gasEstimate}`);
		}

		console.log(`1|||>>> Winner is in binance ecosystem gasEstimate: ${gasEstimate}`);

		try {
			const tx_local =  await axelarGameManager_Moonbase.sendMessageToLocalSatelite(3,gameHash,false,0,0,{ value: ethers.utils.parseUnits("8", "ether"), gasLimit: increaseGasLimit(gasEstimate) });

			// const tx_local =  await axelarGameManager_Moonbase.sendMessageToLocalSatelite(3,gameHash,false,0,0,{ value: ethers.utils.parseUnits("8", "ether")});


		    console.log(`2|||>>> Winner is in binance ecosystem axelarGameManager_Moonbase.sendMessageToLocalSatelite gasEstimate: ${gasEstimate}`);

			tx_local.wait().then( async reslveMsg => {
				 console.log(`tx_local payWinner_binance is mined resolveMsg : `,reslveMsg);
				 
				// 0 denotes Satelite is Binance
				const gasEstimate =  await axelarGameManager_Moonbase.estimateGas.sendMessageToSatelites(0,3,gameHash,false,0,0,{ value: ethers.utils.parseUnits("8", "ether") });
	
				console.log(`3|||>>> Winner is in binance ecosystem gasEstimate: ${gasEstimate}`);
		        
				try {
					const tx_satelite =  await axelarGameManager_Moonbase.sendMessageToSatelites(0,3,gameHash,false,0,0,{ value: ethers.utils.parseUnits("8", "ether"), gasLimit: increaseGasLimit(gasEstimate) });
					console.log(`4|||>>> Winner is in binance ecosystem gasEstimate: ${gasEstimate}`);
					tx_satelite.wait().then( async reslveMsg => {
						console.log(`tx_satelite payWinner_binance is mined resolveMsg : `,reslveMsg);
						last_EVM_TransactionMined = true;
					});
				}
				catch (e) {
					console.log(`Error 3 transferSateliteFundsToWinnersEcosystem_Moonbase gasEstimate errored with: `,JSON.stringify(e));
					last_EVM_TransactionMined = true;
				}
			});
		}
		catch (e) {
			console.log(`Error 2 transferSateliteFundsToWinnersEcosystem_Moonbase gasEstimate errored with: `,JSON.stringify(e));
			last_EVM_TransactionMined = true;
		}
		
	}







	// const gasPrice = wallet.gasPrice();
	const gasEstimate =  await axelarGameManager_Moonbase.estimateGas.sendMessageToLocalSatelite(3,gameHash,false,0,0);

	const tx_local =  await axelarGameManager_Moonbase.sendMessageToLocalSatelite(3,gameHash,false,0,0,{gasLimit: increaseGasLimit(gasEstimate)});
	tx_local.wait().then( async reslveMsg => {
		 console.log(`tx_local payWinner_Moonbase is mined resolveMsg : `,reslveMsg);
		 
		 // o denotes Satelite is Binance
		//  const gasPrice = wallet.gasPrice();
		 const gasEstimate =  await axelarGameManager_Moonbase.estimateGas.sendMessageToSatelites(0,3,gameHash,false,0,0,{ value: ethers.utils.parseUnits("8", "ether") });

		 const tx_satelite =  await axelarGameManager_Moonbase.sendMessageToSatelites(0,3,gameHash,false,0,0,{ value: ethers.utils.parseUnits("8", "ether"), gasLimit: increaseGasLimit(gasEstimate) });
		 tx_satelite.wait().then( async reslveMsg => {
			  console.log(`tx_satelite payWinner_Moonbase is mined resolveMsg : `,reslveMsg);
	          last_EVM_TransactionMined = true;
		 });
	});

};


const isGlobalGameWinningsReceived = async (gameHash) => {
	// console.log(`isGlobalGameWinningsReceived is run`);
    let globalGameWinningsISReceived = false;

	const gameWinnerInfo_Moonbeam =  await axelarGameManager_Moonbase.gameWinnerInfo(gameHash);
	const ecosystem = gameWinnerInfo_Moonbeam[1];
	if (ecosystem==="Moonbeam")
	{
		const globalGameWinningsReceived_Moonbeam =  await axelarGameManager_Moonbase.globalGameWinningsReceived(gameHash,"Moonbeam");
		const globalGameWinningsReceived_Binance =  await axelarGameManager_Moonbase.globalGameWinningsReceived(gameHash,"binance");
		if (globalGameWinningsReceived_Moonbeam && globalGameWinningsReceived_Binance) globalGameWinningsISReceived = true;
		// console.log(`isGlobalGameWinningsReceived globalGameWinningsReceived_Moonbeam: ${globalGameWinningsReceived_Moonbeam} globalGameWinningsReceived_Binance: ${globalGameWinningsReceived_Binance} globalGameWinningsISReceived: ${globalGameWinningsISReceived}`);
	}
	else if (ecosystem==="binance")
	{
		const globalGameWinningsReceived_Moonbeam =  await axelarGameManager_BinanceTestNet.globalGameWinningsReceived(gameHash,"Moonbeam");
		const globalGameWinningsReceived_Binance =  await axelarGameManager_BinanceTestNet.globalGameWinningsReceived(gameHash,"binance");
		if (globalGameWinningsReceived_Moonbeam && globalGameWinningsReceived_Binance) globalGameWinningsISReceived = true;
	}

	return globalGameWinningsISReceived;
}

const transferWinningsToGamePlayersContract = async (gameHash) => {
	console.log(`transferWinningsToGamePlayersContract is run`);
	last_EVM_TransactionMined = false;

	const gameWinnerInfo_Moonbeam =  await axelarGameManager_Moonbase.gameWinnerInfo(gameHash);
	const ecosystem = gameWinnerInfo_Moonbeam[1];
	if (ecosystem==="Moonbeam")
	{
		const gasEstimate = await axelarGameManager_Moonbase.estimateGas.transferWinningsToRouter(gameHash);  // 352324
		console.log(` |> transferWinningsToGamePlayersContract Moonbeam gasEstimate: ${gasEstimate.toString() }  |||||||||||||`);

		const tx = await axelarGameManager_Moonbase.transferWinningsToRouter(gameHash,{gasLimit: increaseGasLimit(gasEstimate)});
		tx.wait().then( async reslveMsg => {
			console.log(`transferWinningsToGamePlayersContract is mined resolveMsg : `,reslveMsg);
			console.log(`transferWinningsToGamePlayersContract Winnigs are sent to gamePlayers_Moonbase`);
			last_EVM_TransactionMined = true;
	   	});

	}
	else if (ecosystem==="binance")
	{
		const gasEstimate = await axelarGameManager_BinanceTestNet.estimateGas.transferWinningsToRouter(gameHash);
		console.log(` ||||||| transferWinningsToGamePlayersContract binance gasEstimate: ${gasEstimate}  |||||||||||||`);

		const tx = await axelarGameManager_BinanceTestNet.transferWinningsToRouter(gameHash,{gasLimit: increaseGasLimit(gasEstimate)});
		tx.wait().then( async reslveMsg => {
			console.log(`transferWinningsToGamePlayersContract binance is mined resolveMsg : `,reslveMsg);
			console.log(`transferWinningsToGamePlayersContract Winnigs are sent to gamePlayers_BinanceTestNet`);
			last_EVM_TransactionMined = true;
	   	});
	     
	}
}

const haveFundsArrivedAtGamePlayersContract = async (gameHash) => {
	// console.log(`haveFundsArrivedAtGamePlayersContract is run`);
	let fundsArrivedAtGamePlayersContract = false;

	const gameWinnerInfo_Moonbeam =  await axelarGameManager_Moonbase.gameWinnerInfo(gameHash);
	const ecosystem = gameWinnerInfo_Moonbeam[1];
	if (ecosystem==="Moonbeam")
	{
		const funds = await gamePlayers_Moonbase.gameWinningsAXLUSD(gameHash);
	    const balanceWEI = await erc20WDEV_Moonbase.balanceOf(game_players_moonbase_address);
	    console.log(`haveFundsArrivedAtGamePlayersContract Moonbeam funds: ${funds} balanceWEI: ${balanceWEI}`);
		if (funds>0 && balanceWEI>=funds) fundsArrivedAtGamePlayersContract=true;
	}
	else if (ecosystem==="binance")
	{
		const funds = await gamePlayers_BinanceTestNet.gameWinningsAXLUSD(gameHash);
	    const balanceWEI = await erc20WDEV_BinanceTestNet.balanceOf(game_players_binanceTestNet_address);
	    console.log(`haveFundsArrivedAtGamePlayersContract binance funds: ${funds} balanceWEI: ${balanceWEI}`);
		if (funds>0  && balanceWEI>=funds) fundsArrivedAtGamePlayersContract=true;
	}

	return fundsArrivedAtGamePlayersContract;
}

// FAILS TEST AGAIN
const payWinner = async (gameHash) => {
	console.log(`payWinner is run`);
	last_EVM_TransactionMined = false;

	const gameWinnerInfo_Moonbeam =  await axelarGameManager_Moonbase.gameWinnerInfo(gameHash);
	const ecosystem = gameWinnerInfo_Moonbeam[1];
	if (ecosystem==="Moonbeam")
	{
		const gasEstimate =  await gamePlayers_Moonbase.estimateGas.payWinner(gameHash);
		const tx = await gamePlayers_Moonbase.payWinner(gameHash,{gasLimit: increaseGasLimit(gasEstimate)});
		tx.wait().then( async reslveMsg => {
			console.log(`payWinner Moonbeam  is mined resolveMsg : `,reslveMsg);
			last_EVM_TransactionMined = true;
	   	});
	}
	else if (ecosystem==="binance")
	{
		const gasEstimate =  await gamePlayers_BinanceTestNet.estimateGas.payWinner(gameHash);
		const tx = await gamePlayers_BinanceTestNet.payWinner(gameHash,{gasLimit: increaseGasLimit(gasEstimate)});
		tx.wait().then( async reslveMsg => {
			console.log(`payWinner binance  is mined resolveMsg : `,reslveMsg);
			last_EVM_TransactionMined = true;
	   	});
	}
}

// ***  





let polkadotInjector = null, polkadotInjectorAddress=null;
const setPolkadotInjector = (injector, injectorAddress) => { 
    polkadotInjector = injector;
    polkadotInjectorAddress = injectorAddress;
    console.log(`Setup New Polkadot Signer/Injector polkadotInjectorAddress: ${polkadotInjectorAddress} polkadotInjector: `,polkadotInjector);

	// Setup New Polkadot Signer/Injector polkadotInjectorAddress: 5DAqjjBN3CJteqrmps95HUmo325xDBuErC8BoNd88ud6Cxgo polkadotInjector: ...
}

let KusamaApi, KaruraApi, MoonriverApi, KintsugiApi, PhalaApi, BasiliskApi, ShidenApi, StatemineApi,
	PolkadotApi, AcalaApi, MoonbeamApi, AstarApi, HydraDXApi, pPhalaApi, StatemintApi, ParallelApi
;

let phalaApi, moonbemaApi, astarApi, interlayApi;
//#region ***** Setup Substrate Chain //*****
const setup_SubstrateChain = async (wsURL = 'Shibuya') => {
	console.log("setup_SubstrateChain is RUN for wsURL: ",wsURL);

	let WS_URL, api;

	// ***** Phala *****
	if (wsURL === 'PhalaTestNet') 	WS_URL = 'wss://phat-beta-node.phala.network/khala/ws'
	// https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fphat-beta-node.phala.network%2Fkhala%2Fws#/explorer

	else if (wsURL === 'Phala')    	WS_URL = 'wss://khala.api.onfinality.io/public-ws'; 
	else if (wsURL === 'Moonbeam')  WS_URL = 'wss://moonbeam.api.onfinality.io/public-ws'; 
	else if (wsURL === 'Astar')    	WS_URL = 'wss://astar.api.onfinality.io/public-ws'; 
	else if (wsURL === 'Interlay')  WS_URL = 'wss://interlay.api.onfinality.io/public-ws'; 
	else if (wsURL === 'Moonbase')  WS_URL = 'wss://moonbeam-alpha.api.onfinality.io/public-ws'; 


	const wsProvider = new WsProvider(WS_URL);

	// ***** Phala *****
	// Wait for Provider
	if (wsURL === 'PhalaTestNet') {
		api = await ApiPromise.create({ 
			provider: wsProvider,
			types: { ...types, ...typeDefinitions }
			});
			
			// ***** Phala *****
			//1
			// console.log(" ********** phatRegistry ********** ");
			// const phatRegistry = await OnChainRegistry.create(api)
			const phatRegistry = await OnChainRegistry.create(api, { pruntimeURL: 'https://phat-fr.01.do/node-1/' })

			//2
			// console.log(" ********** phat_abi ********** ");
			const phat_abi_games_STB = phala_games_STB_metadata;
			//3
			// console.log(" ********** phat_contractKey ********** ");
			// const phat_contractKey = await phatRegistry.getContractKey(phat_contractId)
			const phat_games_STB_contractKey = await phatRegistry.getContractKey(phat_games_STB_contractId)
			// console.log("phat_games_STB_contractKey: ",phat_games_STB_contractKey);
			//4
			// console.log(" ********** Phala contract ********** ");
			const contract_games_STB = new PinkContractPromise(api, phatRegistry, phat_abi_games_STB, phat_games_STB_contractId, phat_games_STB_contractKey);
		
			phat_games_STB = contract_games_STB;
			// phat_contract_boiler_plate = contract;
			// console.log("contract:",contract.abi.messages.map((e)=>{return e.method}))
			// console.log("contract:",contract_games_STB.abi.messages.map((e)=>{return e.method}))
		
			//contract: ['getEthBalance', 'setMyMessage', 'getMyMessage', 'setMyNumber', 'getMyNumber']
	}
	else {
		api = await ApiPromise.create({ provider: wsProvider });
	}

	await api.isReady;
	// console.log(`api => : `,api);
	// console.log(" ********** API PROPERTIES ********** ");
	// console.log((await api.rpc.system.properties()).toHuman());
	// console.log(" ********** API PROPERTIES ********** ");
  
  	getAccountIdtoHex();   //USED FOR TESTING AND TO BE REPLACED BY POLKADOT EXTENSION

	if (wsURL === 'PhalaTestNet') 	phala_api = api;
	else if (wsURL === 'Phala')     phalaApi = api; 
	else if (wsURL === 'Moonbeam')  moonbemaApi = api;
	else if (wsURL === 'Astar')     astarApi = api; 
	else if (wsURL === 'Interlay')  interlayApi = api; 

  return {api};
};
//#endregion 


/// **************** MOONBEAM ****************
// console.log(" **************** **************** **************** ");
// console.log(`moonbeam.symbols: `,moonbeam.symbols);  
//['ACA', 'ASTR', 'AUSD', 'BNC', 'EQ', 'EQD', 'DOT', 'GLMR', 'IBTC', 'INTR', 'PARA', 'PHA', 'RING', 'USDT']
// console.log(`moonbeam.assets: `,moonbeam.assets);
// INTR: {id: '101170542313601871197860408087030232491', erc20Id: '0xffffffff4c1cbcd97597339702436d4f18a375ab', originSymbol: 'INTR'}
// ASTR: {id: '224077081838586484055667086558292981199', erc20Id: '0xffffffffa893ad19e540e172c10d78d4d479b5cf', originSymbol: 'ASTR'}
// console.log(`moonbeam.moonAsset: `,moonbeam.moonAsset);
// console.log(`moonbeam.moonChain: `,moonbeam.moonChain);
// console.log(`ChainKey.Interlay: `, ChainKey.Interlay);
// console.log(`ChainKey.Astar: `, ChainKey.Astar);

const getUserBalance = async () => {
	//possible values Moonbeam,Binance,Interlay,Astar,Moonbase,BinanceTestNet
	let balance;
	if (userChain==="INTERLAY") 
	{
		balance = moonbeam_GetPolkadotBalance("INTR",polkadotInjectorAddress);
	}
	else if (userChain==="ASTAR") 
	{
		balance = moonbeam_GetPolkadotBalance("ASTR",polkadotInjectorAddress);
	}
	else if (userChain==="MOONBEAM") 
	{
		balance = await getBalance(axlUSDC_Moonbeam, mm_account);
	}
	else if (userChain==="BINANCE") 
	{
		balance = await getBalance(axlUSDC_Binance, mm_account);
	}
	else if (userChain==="MOONBASE") 
	{
		balance = await getBalance(WDEV_Moonbase, mm_account);
	}
	else if (userChain==="BINANCETESTNET") 
	{
		balance = await getBalance(WDEV_BinanceTestNet, mm_account);
	}
    

	// console.log(` userChain: ${userChain} polkadotInjectorAddress: ${polkadotInjectorAddress} metamaskAccount: ${mm_account} `);

	return balance;

}

const moonbeam_GetPolkadotBalance = async (symbol="ASTR", account = "5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb") => {
	let chain, assetSymbl;
	if (symbol.toLowerCase()==="intr")
	{
		chain = ChainKey.Interlay;
		assetSymbl = AssetSymbol.INTR;
	}
	else if (symbol.toLowerCase()==="astr")
	{
		chain = ChainKey.Astar;
		assetSymbl = AssetSymbol.ASTR;
	}

	const { chains, to} = moonbeam.withdraw(assetSymbl);

	console.log(
		`\nYou can withdraw ${symbol} to these chains: `,
		chains.map((chain) => chain.name),
	);

	const { asset, destination, destinationBalance, min, send } = await to(
		chain,
	  ).get(account, {
		ethersSigner: wallet, 
	});
     
	let balance;
	if (symbol.toLowerCase()==="intr") balance = Number((new BN( Number(`${destinationBalance}`) / mantissa8)).toString())/100;
	else if (symbol.toLowerCase()==="astr") balance = Number((ethers.utils.formatUnits(`${destinationBalance}`, 18)).toString()).toFixed(2);


	console.log(` ===============> symbol: ${symbol} account: ${account} destinationBalance: ${destinationBalance} balance: ${balance} `);
	return balance
}

const moonbeam_Withdraw = async (symbol="ASTR", accountToSendTo = "5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb",  _amountToSend = "1") => {
	let mantissa, amountToSend, chain, assetSymbl;
	if (symbol.toLowerCase()==="intr")
	{
		mantissa = mantissa10;
		amountToSend = (new BN( Number(_amountToSend) * mantissa)).toString();
		chain = ChainKey.Interlay;
		assetSymbl = AssetSymbol.INTR;
	}
	else if (symbol.toLowerCase()==="astr")
	{
		amountToSend = (ethers.utils.parseUnits(_amountToSend, 18)).toString();
		chain = ChainKey.Astar;
		assetSymbl = AssetSymbol.ASTR;
	}

	const { chains, to} = moonbeam.withdraw(assetSymbl);

	console.log(
		`\nYou can withdraw ${symbol} to these chains: `,
		chains.map((chain) => chain.name),
	);

	const { asset, destination, destinationBalance, min, send } = await to(
		chain,
	  ).get(accountToSendTo, {
		ethersSigner: wallet, 
	});

	console.log(
		`Your ${asset.originSymbol} balance in ${destination.name}: ${toDecimal(
		  destinationBalance,
		  asset.decimals,
		).toFixed()}. Minimum transferable amount is: ${toDecimal(min, asset.decimals).toFixed()}`,
	);


	await send(amountToSend, (event) => console.log(event));
	//{status: 'Sent', txHash: '0x08267819fa3a14ce9ce6082697c1663a78e9d71cb71b943e3aeef35388ab2be2'}
	// {status: 'Success', blockHash: '0xae2abc62da776a4c2f083dcf404a715653d9caf3716fbbab38930acb114647f0', txHash: '0x08267819fa3a14ce9ce6082697c1663a78e9d71cb71b943e3aeef35388ab2be2'}

	
	// const intr = AssetSymbol.INTR;
	// const interlay = ChainKey.Interlay;
	// const { chains, to } = moonbeam.withdraw(intr);
	// console.log(
	//   `\nYou can withdraw ${intr} to these chains: `,
	//   chains.map((chain) => chain.name),
	// );
	// const { asset, destination, destinationBalance, min, send } = await to(
	//   interlay,
	// ).get(accountToSendTo, {
	//   ethersSigner: wallet, //signer, // Only required if you didn't pass the signer in on initialization
	// });
	// console.log(
	//   `Your ${asset.originSymbol} balance in ${destination.name}: ${toDecimal(
	// 	destinationBalance,
	// 	asset.decimals,
	//   ).toFixed()}. Minimum transferable amount is: ${toDecimal(min, asset.decimals).toFixed()}`,
	// );
	// await send(amountToSend, (event) => console.log(event));
}

console.log(" **************** **************** **************** ");
/// ****************



//#region ***** Get balance for ERC20 token //*****
const getBalance = async (tokenAddress, client) => {
	const erc20 =  new ethers.Contract( tokenAddress, IERC20_raw.abi, wallet);
	const balanceWEI = await erc20.balanceOf(client);
	const balance = ethers.utils.formatUnits(balanceWEI,18);
	// console.log(`Balnance of ${client} for ${tokenAddress} is: `,balance);
	return balance;
};
//#endregion
//#region *****  Approve ERC20  //*****
const approve = async (tokenAddress, spender, amountin_unitsEth="0.001") => {  
    const erc20 =  new ethers.Contract( tokenAddress, IERC20_raw.abi, wallet);

    const amountWEI =  ethers.BigNumber.from( ethers.utils.parseUnits(amountin_unitsEth,12) );
    // console.log(`Client wants to transfer ${amountWEI} Tokens WEI. NEED TO APPROVE TRANSFER OF THIS TOKEN FROM CLIENT ACCOUNT TO SPENDER`);

    return new Promise (async (resolve,reject) => {
        const tx2 = await erc20.approve(spender, amountWEI );
        tx2.wait().then( async reslveMsg => {
            //  console.log(`tx2 fro approval is mined resolveMsg : `,reslveMsg);
			 resolve(reslveMsg)
        });

    })
};
//#endregion
//#region ***** Simple ERC20 Transfer //*****
const simpleERC20Transfer = async (wallet, tokenAddress, receipient, amountin_unitsEth="0.001") => {
	const erc20 =  new ethers.Contract( tokenAddress, IERC20_raw.abi, wallet);
  
	const amountWEI =  ethers.BigNumber.from( ethers.utils.parseUnits(amountin_unitsEth,12) );
	const tx3 = await erc20.transfer(receipient, amountWEI);
	tx3.wait().then( async reslveMsg => {
	//   console.log(`tx3 for transfer is mined resolveMsg : `,reslveMsg);
	 });
  };
  //#endregion



const convertEVMtoSubstrate = (account20="") => {
	const substrate_Address = evmToAddress(account20);
	return substrate_Address;
}
const convertSubstratetoEVM = (account32="") => {
	const u8Array = addressToEvm(account32);
	const evm_Address = u8aToHex(u8Array);
	// console.log(`***** account32:${account32} evm_Address:${evm_Address}`);
	return evm_Address;
}
//#region getAccountFormatsforAccountI32 getAccountFormatsforAccountId20
const getAccountFormatsforAccountI32 = (accountId32="") => {
	const keyring = new Keyring({ type: 'sr25519' });
	const publicKeyU8 = keyring.decodeAddress(accountId32)
	// const hexvalue = u8aToHex(publicKeyU8);
	const substrate_Address = keyring.encodeAddress(publicKeyU8, 42);
	const phala_Address = keyring.encodeAddress(publicKeyU8, 30);
	const astar_Address = keyring.encodeAddress(publicKeyU8, 5);
	const interlay_Address = keyring.encodeAddress(publicKeyU8, 2032);

	const evmDAddress = convertSubstratetoEVM(accountId32)
	const moonbeam_Address  = evmDAddress;
	const result = { substrate_Address, phala_Address, moonbeam_Address, astar_Address, interlay_Address}
	// console.log(` ************>>>>>> getAccountFormatsforAccountI32 Received accountId32: ${accountId32} result: `,result);
  
	return result
}




//#region transfer_fromMoonbeam
const getMultiLocationMoonbeam = async (destinationAccount="5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb",  destParachainId="2032") => {
		// multilocation 
		const hexvalue = getAccountId_to_Hex(destinationAccount)
		const nakedhexvalue = hexvalue.substring(2);
		
	    const destParachainHex = `0000${numberToHex(Number(destParachainId)).substring(2)}`;
	    const multilocation = [`0x00${destParachainHex}`,`0x01${nakedhexvalue}00`];
		// const destination = [1,multilocation];
		return multilocation;
}
//#endregion


//#region transfer_fromMoonbeam
const transfer_fromMoonbeam = async (symbol="ASTR", _amount=1, destinationAccount="5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb",  destParachainId="2032") => {
	return new Promise (async (resolve, reject) => {
        let precompile, amount;
		if (symbol.toLowerCase()=="intr")
		{
			precompile = precompile_xcINTR;
		    amount = (new BN(Number(_amount) * mantissa10)).toString();
		}
		else if (symbol.toLowerCase()=="astr")
		{
			precompile = precompile_xcASTR;
			amount = (ethers.utils.parseUnits(_amount, 18)).toString();
		}
		else return;

		// multilocation 
		const hexvalue = getAccountId_to_Hex(destinationAccount)
		const nakedhexvalue = hexvalue.substring(2);
		
	    const destParachainHex = `0000${numberToHex(Number(destParachainId)).substring(2)}`;
	    const multilocation = [`0x00${destParachainHex}`,`0x01${nakedhexvalue}00`];
	    
		const destination = [1,multilocation];
	    // console.log(`Transfer_multiasset amount: ${amount} nakedhexvalue: ${nakedhexvalue} Multilocation: `,multilocation,` should be 0x0160c4d758184d11761943be32f71ae877974e0fa4cad523e1c3ba6c5ed340545c00 for qVA946xk9bGQ8A4m4EP3q1A1LJwvyi3QBzTRsAr68VvqeEo   destination: `,destination);
  
		// fees
		const weight = 4000000000;
  
		const tx = await Xtokens.transfer(precompile, amount, destination , weight);
		tx.wait().then( async reslveMsg => {
			// console.log(`tx  is mined resolveMsg : `,reslveMsg);
			// console.log(`TX ===> transactionHash: ${reslveMsg.transactionHash} from: ${reslveMsg.from} to: ${reslveMsg.to} gasUsed: ${reslveMsg.gasUsed} blockNumber: ${reslveMsg.blockNumber}`);
			const txSend = 
			[
			  `Moonbeam Transaction hash: ${reslveMsg.transactionHash}`,
			  `Finalised at Block Number: ${reslveMsg.blockNumber}`,
			  `Tranferred From: ${reslveMsg.from} Amount: ${_amount} To: ${reslveMsg.to} gasUsed: ${reslveMsg.gasUsed}`,
			];  
			resolve(txSend);
		});
  
	})
}
//#endregion
 

/// *** INTERLAY
//#region ***** Transfer INTR from Parachain to Parachain //*****   
const transfer_INTR_FromParachainToParachain = async (originChain="Interlay", parachainID=2004, EVMaccount="0xa95b7843825449DC588EC06018B48019D1111000", amount="1") => {
	return new Promise (async (resolve, reject) => {
  
	
		  if (!polkadotInjector || !polkadotInjectorAddress) {
			// console.log(`transfer_INTR_FromParachainToParachain polkadotInjector and/or polkadotInjectorAddress are null. Cannot proceed!!!`);
			resolve("Polkadot Extension Error Please Refresh Dapp");
			return;
		  }
  
		  let api;
		  if (originChain==="Interlay") 
		  {
			api = interlayApi;
			// console.log(`transfer_INTR_FromParachainToParachain api is  found`);
		  }
		  else console.log(`transfer_INTR_FromParachainToParachain  api is not found`);
		  
		//   const networkFee = 0.0115;    //0.01146744
		//   const corssChainFee = 0.353; // 0.3529278897;
		//   const amount = `${Number(_amount) + networkFee + corssChainFee}`;
  
		  const txAssetINTRParachainToParachain = await api.tx.xTokens
		  .transferMultiasset(
			  { V1: 
						{ 
							id:  { 
								  Concrete: { 
												parents: 1, 
												interior:  
														  {
															x2: [
																  { 
																	Parachain: "2032",
																  },
																  {
																	Generalkey: "0x0002"  
																  }
																]
														  }                                        
											  } 
								  },
							fun: { Fungible: (ethers.utils.parseUnits(amount, 10)).toString() }
						}
			  },
			  { V1: {
							  parents: new BN(1),
							  interior: {
								  x2: [
										{ 
										  Parachain: 2004,
										},
										{
										  accountKey20: {
														  network: "Any",
														  key: EVMaccount
														}
										}
									  ]
							  }
					  } 
			  },
			  {
				Limited: new BN(1000000000)
			  }
			//   (new BN(1000000000) )
		  )      
		  .signAndSend(polkadotInjectorAddress, { signer: polkadotInjector.signer }, async ({ status, events=[], dispatchError }) => {
			  // console.log(`Current status: `,status,` Current status is ${status.type}`);
			  // events.forEach(({ phase, event: { data, method, section } }) => {
			  //   console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
			  // });   
			  // const _token = "MOVR";
  
			  let errorInfo;
			  if (dispatchError) {
				if (dispatchError.isModule) {
				  // for module errors, we have the section indexed, lookup
				  const decoded = api.registry.findMetaError(dispatchError.asModule);
				  const { docs, name, section } = decoded;
				  errorInfo = `${section}.${name}`;
				//   console.log(`transfer_INTR_FromParachainToParachain dispatchError1 ${section}.${name}: ${docs.join(' ')}`);
				} else {
				  // Other, CannotLookup, BadOrigin, no extra info
				  errorInfo = dispatchError.toString();
				//   console.log(`transfer_INTR_FromParachainToParachain dispatchError2: `,dispatchError.toString(),"errorInfo: ",errorInfo);
				}
			  }
			  // else console.log(`txAssetMOVRParachainToParachain ***** NO DISAPTCHEERROR *****: `);
  
			  if (status.isFinalized) {
				// let txResult="", extrinsicBlockHash = status.asFinalized, extrinsicIndexinBlock;
				let ExtrinsicResult, extrinsicHash, originFees, tranferredAmount, treasuryFees, XcmpMessageSent;
  
				// Loop through all events
				events.forEach(async ({ phase, event: { data, method, section } }) => {
					const extrinsicIndexinBlock = phase.asApplyExtrinsic;
					// console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
					if (method==="ExtrinsicSuccess") 
					{
					  // txResult +=` Extrisnic Succeeded with Fees: ${data[0].weight}`;
					  ExtrinsicResult = "Succeeded"; 
					  const extrinsicBlockHash = status.asFinalized;
					  const signedBlock = await api.rpc.chain.getBlock(extrinsicBlockHash);
					  signedBlock.block.extrinsics.forEach(({ hash, method: { method, section } }, index) => {
						if (index===Number(extrinsicIndexinBlock)) extrinsicHash = `${hash.toString()}`
					  });
	
					  const txSendMsg = 
										  [
											`Extrinsic hash: ${extrinsicHash}`,
											`Finalised at Block Hash: ${extrinsicBlockHash}`,
											`Treasury Fees: ${treasuryFees} Total Origin Fees: ${originFees}`,
											`Xcmp Message Sent: ${XcmpMessageSent}`,
										  ];  
					  resolve(txSendMsg);
					}
					else if (method==="ExtrinsicFailed") resolve(["Extrinsic Failed"]);
					else if (method==="Withdrawn" && section==="currencies") originFees = `${ethers.utils.formatUnits(ethers.BigNumber.from(`${data[2]}`),12)}`;   
					else if (method==="Deposit" && section==="treasury") treasuryFees = `${ethers.utils.formatUnits(ethers.BigNumber.from(`${data[0]}`),12)}`;  
					else if (method==="XcmpMessageSent" && section==="xcmpQueue") XcmpMessageSent = `${data[0]}`;
					// else if (method==="Deposited"  && section==="currencies")  txResult +=` Deposited ${JSON.parse(data[0]).token} to ${data[1]}  ${_token}:${ethers.utils.formatUnits(ethers.BigNumber.from(`${data[2]}`),12)}`;
				});
				
				txAssetINTRParachainToParachain();
			  }
			  
		  });
  
	})
  
  }
  //#endregion 


/// *** ASTAR
//#region ***** Transfer ASTR from Parachain to Parachain //*****   
const transfer_ASTR_FromParachainToParachain = async (originChain="Astar", parachainID=2004, EVMaccount="0xa95b7843825449DC588EC06018B48019D1111000", amount="1") => {
	return new Promise (async (resolve, reject) => {
  
	
		  if (!polkadotInjector || !polkadotInjectorAddress) {
			// console.log(`transfer_INTR_FromParachainToParachain polkadotInjector and/or polkadotInjectorAddress are null. Cannot proceed!!!`);
			resolve("Polkadot Extension Error Please Refresh Dapp");
			return;
		  }
  
		  let api;
		  if (originChain==="Astar") 
		  {
			api = astarApi;
			// console.log(`transfer_ASTR_FromParachainToParachain api is  found`);
		  }
		  else console.log(`transfer_ASTR_FromParachainToParachain  api is not found`);
		  

		//   const networkFee = 0.0063;    //0.006284975983269096
		//   const corssChainFee = 0.32; // 0.032;
		//   const amount = `${Number(_amount) + networkFee + corssChainFee}`;
  
		  const txAssetASTRParachainToParachain = await api.tx.polkadotXcm
		  .reserveTransferAssets(
			  { V1: {
						parents: 1, 
						interior: {
							x1: 
								{ 
								  Parachain: 2004,
								},
							}
					} 
			  },
			  { V1: {
						parents: 0,  
						interior: {
							x1: 
								{
									accountKey20: {
													network: "Any",
													key: EVMaccount
												}
								}
						}
					} 
			  },
			  { V1: 
					[
						{ 
							id:  { 
								Concrete: { 
												parents: 0, 
												interior:  "Here"
											} 
								},
							fun: { Fungible: (ethers.utils.parseUnits(amount, 18)).toString() }
						}
					]
	  		  },
			  (new BN(0) )
		  )      
		  .signAndSend(polkadotInjectorAddress, { signer: polkadotInjector.signer }, async ({ status, events=[], dispatchError }) => {
			  // console.log(`Current status: `,status,` Current status is ${status.type}`);
			  // events.forEach(({ phase, event: { data, method, section } }) => {
			  //   console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
			  // });   
			  // const _token = "MOVR";
  
			  let errorInfo;
			  if (dispatchError) {
				if (dispatchError.isModule) {
				  // for module errors, we have the section indexed, lookup
				  const decoded = api.registry.findMetaError(dispatchError.asModule);
				  const { docs, name, section } = decoded;
				  errorInfo = `${section}.${name}`;
				//   console.log(`transfer_ASTR_FromParachainToParachain dispatchError1 ${section}.${name}: ${docs.join(' ')}`);
				} else {
				  // Other, CannotLookup, BadOrigin, no extra info
				  errorInfo = dispatchError.toString();
				//   console.log(`transfer_ASTR_FromParachainToParachain dispatchError2: `,dispatchError.toString(),"errorInfo: ",errorInfo);
				}
			  }
			  // else console.log(`txAssetMOVRParachainToParachain ***** NO DISAPTCHEERROR *****: `);
  
			  if (status.isFinalized) {
				// let txResult="", extrinsicBlockHash = status.asFinalized, extrinsicIndexinBlock;
				let ExtrinsicResult, extrinsicHash, originFees, tranferredAmount, treasuryFees, XcmpMessageSent;
  
				// Loop through all events
				events.forEach(async ({ phase, event: { data, method, section } }) => {
					const extrinsicIndexinBlock = phase.asApplyExtrinsic;
					// console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
					if (method==="ExtrinsicSuccess") 
					{
					  // txResult +=` Extrisnic Succeeded with Fees: ${data[0].weight}`;
					  ExtrinsicResult = "Succeeded"; 
					  const extrinsicBlockHash = status.asFinalized;
					  const signedBlock = await api.rpc.chain.getBlock(extrinsicBlockHash);
					  signedBlock.block.extrinsics.forEach(({ hash, method: { method, section } }, index) => {
						if (index===Number(extrinsicIndexinBlock)) extrinsicHash = `${hash.toString()}`
					  });
	
					  const txSendMsg = 
										  [
											`Extrinsic hash: ${extrinsicHash}`,
											`Finalised at Block Hash: ${extrinsicBlockHash}`,
											`Treasury Fees: ${treasuryFees} Total Origin Fees: ${originFees}`,
											`Xcmp Message Sent: ${XcmpMessageSent}`,
										  ];  
					  resolve(txSendMsg);
					}
					else if (method==="ExtrinsicFailed") resolve(["Extrinsic Failed"]);
					else if (method==="Withdrawn" && section==="currencies") originFees = `${ethers.utils.formatUnits(ethers.BigNumber.from(`${data[2]}`),12)}`;   
					else if (method==="Deposit" && section==="treasury") treasuryFees = `${ethers.utils.formatUnits(ethers.BigNumber.from(`${data[0]}`),12)}`;  
					else if (method==="XcmpMessageSent" && section==="xcmpQueue") XcmpMessageSent = `${data[0]}`;
					// else if (method==="Deposited"  && section==="currencies")  txResult +=` Deposited ${JSON.parse(data[0]).token} to ${data[1]}  ${_token}:${ethers.utils.formatUnits(ethers.BigNumber.from(`${data[2]}`),12)}`;
				});
				
				txAssetASTRParachainToParachain();
			  }
			  
		  });
  
	})
  
  }
  //#endregion 
/// *** ASTAR




//#region getAvailableBalance POLKADOT
const getAvailableBalancePOLKADOT = async (account, token=null, metamaskAccount, network=null) => {
	if (!token || !account || !metamaskAccount) { console.log("No token or account or metamaskAccount has been provided for getAvailableBalance"); return null }

	if ( !PolkadotApi || !AcalaApi || !MoonbeamApi )
	{ 
	  console.log("Some of the APIs are not set up. Please Refresh Dapp");
	  //TODO APIManagement 
	  return null; 
	}

	const moonbeamAddress = metamaskAccount;
	const accounts = getAccountFormatsforAccountI32(account);
	const {substrate_Address, polkadot_Address, acala_Address, moonbeam_Address} = accounts;
	// console.log(`POLKADOT ACCOUNT FORMATS substrate_Address:${substrate_Address} polkadot_Address:${polkadot_Address} acala_Address:${acala_Address} moonbeamAddress:${moonbeamAddress}`);

	
	if (token.toLowerCase()==="dot")
	{
	  const timestamp = await PolkadotApi.query.timestamp.now();   

	  //Polkado
	  const { nonce, data: balancePolkadot } = await PolkadotApi.query.system.account(polkadot_Address);   // Retrieve the account balance & nonce via the system module
	  let PolkadotBalance = null;
	  if (balancePolkadot) 
	  PolkadotBalance = Number( ethers.utils.formatUnits( (balancePolkadot.free).toString(), 10) ).toFixed(4)
	  // console.log(`DOT Polkadot Now => ${timestamp}: For account:${polkadot_Address} Polkadot ${token} balance Free: ${PolkadotBalance} `);

	  //Acala
	  const {free: free1 , reserved: reserved1, frozen: frozen1} = await AcalaApi.query.tokens.accounts(acala_Address, {Token: token.toLowerCase() }); 
	  const AcalaBalance = Number(ethers.utils.formatUnits( free1.toString(), 10)).toFixed(4);
	  // console.log(`Acala For account:${acala_Address}  Token: ${token} => ${timestamp}: balance free: ${AcalaBalance} reserved: ${reserved1} frozen: ${frozen1}`);

	  //Moonbeam
	  const balanceMoonbeam = await MoonbeamApi.query.assets.account("42259045809535163221576417993425387648", moonbeamAddress );  
	  let MoonbeamBalance = null;
	  if (balanceMoonbeam.toJSON()) 
	  MoonbeamBalance = Number( ethers.utils.formatUnits( balanceMoonbeam.toJSON().balance, 10) ).toFixed(4);
	  // console.log(`Moonbeam  For account:${moonbeamAddress} Token: ${token} => ${timestamp}: balance free: ${MoonbeamBalance} `);

	  const balances = { token, timestamp: new Date(timestamp).toISOString, Polkadot: PolkadotBalance,  Acala: AcalaBalance, Moonbeam: MoonbeamBalance };
	  return {accounts, balances};
	}
	else  if (token.toLowerCase()==="aca") 
	{
	  const timestamp = await PolkadotApi.query.timestamp.now();   

	  //Acala
	  const { nonce, data: balance } = await AcalaApi.query.system.account(acala_Address);   // Retrieve the account balance & nonce via the system module
	  let AcalaBalance = null;
	  if (balance) 
	  AcalaBalance = Number( ethers.utils.formatUnits( (balance.free).toString(), 12) ).toFixed(4)
	  // console.log(`Now => ${timestamp}: Acala  For account:${acala_Address}   ${token} balance Free: ${AcalaBalance} reserved: ${balance.reserved} frozen: ${balance.frozen} and nonce: ${nonce}`);
	
	  //Moonbeam
	  // 224821240862170613278369189818311486111    110021739665376159354538090254163045594
	  const balanceMoonbeam = await MoonbeamApi.query.assets.account("224821240862170613278369189818311486111", moonbeamAddress );  
	  let MoonbeamBalance = null;
	  if (balanceMoonbeam.toJSON()) 
	  MoonbeamBalance = Number( ethers.utils.formatUnits( (balanceMoonbeam.toJSON()).balance, 12) ).toFixed(4);
	  // console.log(`Moonbeam For account:${moonbeamAddress} Token: ${token} => ${timestamp}: balance free: ${MoonbeamBalance} `);
	  
	  const balances = { token, timestamp: new Date(timestamp).toISOString, Polkadot: null,  Acala: AcalaBalance, Moonbeam: MoonbeamBalance };
	  return {accounts, balances};
	}
	else  if (token.toLowerCase()==="glmr") 
	{
	  const timestamp = await PolkadotApi.query.timestamp.now();   

	  //Acala
	  const {free: free1 , reserved: reserved1, frozen: frozen1} = await AcalaApi.query.tokens.accounts(acala_Address, {ForeignAsset: 0 }); 
	  const AcalaBalance = Number(ethers.utils.formatUnits( free1.toString(), 18)).toFixed(4);
	  // console.log(`Acala For account: ${acala_Address} Token: ${token} => ${timestamp}: balance free: ${AcalaBalance} reserved: ${reserved1} frozen: ${frozen1}`);

	  //Moonbeam
	  const { nonce, data: balance } = await MoonbeamApi.query.system.account(moonbeamAddress);   // Retrieve the account balance & nonce via the system module
	  // console.log(`Moonriver MOVR balance: `,balance.toJSON())
	  let MoonbeamBalance = null;
	  if (balance) 
	  MoonbeamBalance = Number( ethers.utils.formatUnits( (balance.toJSON()).free, 18) ).toFixed(4);
	  // console.log(`Moonbeam For account:${moonbeamAddress} Token: ${token} => ${timestamp}: balance free: ${MoonbeamBalance} `);

	  const balances = { token, timestamp: new Date(timestamp).toISOString, Polkadot: null,  Acala: AcalaBalance, Moonbeam: MoonbeamBalance };
	  return {accounts, balances};
	}
	else  if (token.toLowerCase()==="ausd")  
	{

	  const timestamp = await PolkadotApi.query.timestamp.now();   

	  //Acala
	  const {free: free1 , reserved: reserved1, frozen: frozen1} = await AcalaApi.query.tokens.accounts(acala_Address, {Token: "ausd" }); 
	  const AcalaBalance = Number(ethers.utils.formatUnits( free1.toString(), 12)).toFixed(4);
	  // console.log(`***** Acala For account: ${acala_Address} Token: ${token} => ${timestamp}: balance free: ${AcalaBalance} reserved: ${reserved1} frozen: ${frozen1}`);

	  //Moonbeam
	  const balanceMoonbeam = await MoonbeamApi.query.assets.account("110021739665376159354538090254163045594", moonbeamAddress );  
	  let MoonbeamBalance = null;
	  if (balanceMoonbeam.toJSON()) 
	  MoonbeamBalance = Number( ethers.utils.formatUnits( balanceMoonbeam.toJSON().balance, 12) ).toFixed(4);
	  // console.log(`Moonbeam For account:${moonbeamAddress} Token: ${token} => ${timestamp}: balance free: ${MoonbeamBalance} `);

	  const balances = { token, timestamp: new Date(timestamp).toISOString, Polkadot: null,  Acala: AcalaBalance, Moonbeam: MoonbeamBalance };
	  return {accounts, balances};
	}
	else  if (token.toLowerCase()==="astr") 
	{
	  console.log("Work In Progresss");
	}
	else  if (token.toLowerCase()==="para") 
	{
	  console.log("Work In Progresss");
	}

}
//#endregion 


//#region getAccountId_to_Hex
const getAccountId_to_Hex = (accountI32="") => {
	const keyring = new Keyring({ type: 'sr25519' });
	const publicKeyU8 = keyring.decodeAddress(accountI32)
	const hexvalue = u8aToHex(publicKeyU8);
	// console.log(`getAccountIdtoHex Received accountI32: ${accountI32} publicKeyU8:${publicKeyU8} hexvalue: ${hexvalue}`);
	return hexvalue;
  }
  //#endregion


// FOR TESTING
//#region getAccountIdtoHex SET UP polkadot_test_account
const getAccountIdtoHex = (accountI32="") => {
  const keyring = new Keyring({ type: 'sr25519' });
  const PHRASE = 'mean decade kidney strategy surround tilt friend quote kangaroo spice board silver'; //USAGI2 for server
  //ADDRESS   5EZwpfeoyhWbEhmfuSAv8ekL8BWfAc94pvRYJUFK6ASnbg4w

  const Alecia = keyring.addFromUri(PHRASE);
  polkadot_test_account = Alecia;
  //   console.log(`polkadot_test_account ADDRESS: ${polkadot_test_account.address}`); //5FP8MMBmPdBCMgG5AspTHVNWXXSEoR4vgJwSrehUj1qJAKxN

}
//#endregion



// R E A D
//#region PHALA get_account_balance  
const get_account_balance = async () => {

	if (phala_api) 
	{
      // Phala
	//   const { nonce, data: balance } = await phala_api.query.system.account(khala_Address);   // Retrieve the account balance & nonce via the system module
	  const { nonce, data: balance } = await phala_api.query.system.account(polkadotInjectorAddress);   // Retrieve the account balance & nonce via the system module

	//   console.log(`=======> balance: ${balance} (balance.free).toString(): ${(balance.free).toString()}`);
	  //   =======> balance: {"free":"0x00000000000000000022fe607717a5e1","reserved":0,"miscFrozen":0,"feeFrozen":0} (balance.free).toString(): 9849839476516321

	  const freeBalance = new BN((balance.free).toString());
	  const formatted_PHABalance_3decimals =  new BN( `${freeBalance.div(mantissa9)}` );
	  const balance3decimals = Number(`${formatted_PHABalance_3decimals}`) / 1000;

	//   console.log(`balance: ${balance} freeBalance: ${freeBalance} formatted_PHABalance_3decimals: ${formatted_PHABalance_3decimals} balance3decimals" ${balance3decimals}`);
	  return balance3decimals;
	} else return 0

}
//#endregion
//#region get_game_stats
const get_game_stats = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getGameStats(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			// state True/False , image_hash, startTime, endTime, ticketCost, competionNumber
			const out_put = output.toHuman();
			const state = out_put.Ok[0];
			const imageHash = out_put.Ok[1];
			// console.log(`state: ${state} imageHash: ${imageHash}`);   
			// return  output.toHuman()
			return {out_put, state, gameHash: imageHash};
		} else {
			console.error('Error', result.asErr);
			// return result.asErr
			return {out_put: null, state: null, gameHash: null};
		}

	}
	// else { console.log(`PHALA API IS NOT SET UP YET`); return null }
	else { console.log(`PHALA API IS NOT SET UP YET`); return {state: null, gameHash: null}; }
}
//#endregion

//#region get_players 
const get_players = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getPlayers(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion

//#region get_players_mapping 
const get_players_mapping = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getPlayersMapping(polkadot_test_account,polkadotInjectorAddress);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion

//#region get_playeget_tickets_mappingrs_mapping 
const get_tickets_mapping = async (ticket_id) => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getTicketsMapping(polkadot_test_account,ticket_id);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion

//#region get_all_tickets 
const get_all_tickets = async (ticket_id) => {

	// console.log(`get_all_tickets get_all_tickets get_all_tickets get_all_tickets`);

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getAllTickets(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion
//#region get_ordered_tickets 
const get_ordered_tickets = async (ticket_id) => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getOrderedTicketIds(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion
//#region get_wisdom_of_crowd_coordinates 
const get_wisdom_of_crowd_coordinates = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getWisdomOfCrowdCoordinates(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion
//#region getwinning_tickets
const getwinning_tickets = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getWinningTickets(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
			// return  output.toString();

		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion
//#region get_total_pot 
const get_total_pot = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getTotalPot(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			const _result = JSON.parse(output.toString()).ok;
			// console.log(`result ${_result} result: `,_result);
			const alpha = new BN(`${_result}`);
			// console.log(`alpha ${alpha}`);
			const beta =  new BN( `${alpha.div(mantissa9)}` );
			// console.log(`beta ${beta}`);
			const gamma = Number(`${beta}`) / 1000;
			// console.log(`gamma ${gamma}`);
			return gamma.toFixed(3)
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion
//#region get_total_net_pot 
const get_total_net_pot = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getTotalNetPot(polkadot_test_account);

		if (result.isOk) {
			const _result = JSON.parse(output.toString()).ok;
			const alpha = new BN(`${_result}`);
			// console.log(`alpha ${alpha}`);
			const beta =  new BN( `${alpha.div(mantissa9)}` );
			// console.log(`beta ${beta}`);
			const gamma = Number(`${beta}`) / 1000;
			// console.log(`gamma ${gamma}`);
			return gamma.toFixed(3)
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion
//#region get_total_fees 
const get_total_fees = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getTotalFees(polkadot_test_account);

		if (result.isOk) {
			const _result = JSON.parse(output.toString()).ok;
			const alpha = new BN(`${_result}`);
			// console.log(`alpha ${alpha}`);
			const beta =  new BN( `${alpha.div(mantissa9)}` );
			// console.log(`beta ${beta}`);
			const gamma = Number(`${beta}`) / 1000;
			// console.log(`gamma ${gamma}`);
			return gamma.toFixed(3)
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion
//#region get_hall_of_fame 
const get_hall_of_fame = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getHallOfFame(polkadot_test_account);

		if (result.isOk) {
			// output the return value

			// console.log('Success', output.toHuman().Ok);  
			const human_result = output.toHuman().Ok;
			
			let resultArray = []
			const _result = JSON.parse(output.toString()).ok;
			// console.log(`_result: `,_result);

			for (let i=0; i<_result.length; i++)
			{
				let elem = _result[i];
				let elemHuman = human_result[i];

				const alpha = new BN(`${elem.prizeMoney}`);
				const beta =  new BN( `${alpha.div(mantissa9)}` );
				const gamma = Number(`${beta}`) / 1000;

				let formattedElement = { 
					distanceFromTarget: `${Number(elem.distanceFromTarget)}`,
					startTime: new Date(elem.startTime).toISOString(),
					endTime: new Date(elem.endTime).toISOString(),
					timestamp: new Date(elem.timestamp).toISOString(),
					prizeMoney:  gamma,

					playerId: elemHuman.playerId,
					playerChain: elemHuman.playerChain,
				}
				formattedElement = Object.assign(elem, formattedElement)
				// console.log("formattedElement: ",formattedElement);
				resultArray.push(formattedElement);
			}

			return resultArray
			// return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion


// W R I T E Phala
//#region start_new_game DONE
const start_new_game = async (image_hash="someimagehash", start_time=0, end_time=0, ticket_cost=1000000000000, fees_percent=20 ) => {
	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		// console.log(`image_hash: ${image_hash} start_time: ${start_time} end_time: ${end_time} ticket_cost: ${ticket_cost} fees_percent: ${fees_percent} polkadot_test_account.address: `,polkadot_test_account.address);

		//DRY RUN
		const { gasRequired, storageDeposit } = await contract.query.configGame(polkadot_test_account, image_hash, Number(start_time), Number(end_time), ticket_cost, fees_percent);
		// console.log("gasRequired & storageDeposit: ",gasRequired.toHuman(),storageDeposit.toHuman());

		const options = {
			gasLimit: gasRequired.refTime,
			storageDepositLimit: storageDeposit.isCharge ? storageDeposit.asCharge : null,
		}

		const tx = await contract.tx
		.configGame(options,  image_hash, start_time, end_time, ticket_cost, fees_percent)
		.signAndSend(polkadot_test_account, { nonce: -1 }, async result => {
		// .signAndSend(polkadotInjectorAddress, { signer:  polkadotInjector.signer }, result => {

			if (result.status.isInBlock) {
				// console.log(' =====>>> in a block');
			} else if (result.status.isFinalized) {
				console.log(` =====>>> start_new_game finalized image_hash: ${image_hash}`);
				// console.log('result: ',JSON.stringify(result,null,"\t"));

			}
		})
  
	}
	else console.log(`PHALA API IS NOT SET UP YET`);
  
}
//#endregion

let ready_to_check_game = true;
//#region check_game THIS IS THE SERVER ENGINE
const check_game = async () => {
	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;

		console.log(`CHECKING GAME`);

		//DRY RUN
		const { gasRequired, storageDeposit } = await contract.query.checkGame(polkadot_test_account);
		// console.log("gasRequired & storageDeposit: ",gasRequired.toHuman(),storageDeposit.toHuman());

		const options = {
			gasLimit: gasRequired.refTime,
			storageDepositLimit: storageDeposit.isCharge ? storageDeposit.asCharge : null,
		}

		const tx = await contract.tx
		.checkGame(options)
		.signAndSend(polkadot_test_account, { nonce: -1 }, async result => {
		// .signAndSend(polkadot_test_account.address, { signer:  polkadotInjector.signer }, result => {

			if (result.status.isInBlock) {
				// console.log(' =====>>> in a block');
			} else if (result.status.isFinalized) {
				// console.log(' =====>>> finalized');
				// console.log('result: ',JSON.stringify(result,null,"\t"));

				// EVM REGISTER / UNREGISTER GAME
				const current_update_time = new Date(Date.now()).toISOString()
				const phat_response = await get_game_stats();
                

				const evmGameState = await getEVMGameState(phat_response.gameHash);
				const moonbasePot = await getMoonbasePot(phat_response.gameHash);
				const binanceTestNetPot = await getBinaceTestNetPot(phat_response.gameHash);
				const totalPot = Number(moonbasePot) + Number(binanceTestNetPot);
				const gameIsGloballyRegistered = await isGameGloballyRegistered(phat_response.gameHash)
				const gameIsGloballyUnRegistered = await isGameGloballyUnRegistered(phat_response.gameHash)
				const winnerIsGloballyRegistered = await isWinnerGloballyRegistered(phat_response.gameHash)
				const globalGameWinningsISReceived = await isGlobalGameWinningsReceived(phat_response.gameHash)
				const fundsArrivedAtGamePlayersContract = await haveFundsArrivedAtGamePlayersContract(phat_response.gameHash)
				const gameWinnerInfo_Moonbeam =  await axelarGameManager_Moonbase.gameWinnerInfo(phat_response.gameHash);
				let gamerWinnerMoonbeamRegistered = true;
				if (gameWinnerInfo_Moonbeam[1]==="") gamerWinnerMoonbeamRegistered = false;
				const globalGameWinningsReceived_Moonbeam =  await axelarGameManager_Moonbase.globalGameWinningsReceived(phat_response.gameHash,"Moonbeam");

  
				//KEEP THIS AS THIS IS INFO INN BROWSER TERMINAL TO CHECK 
				console.log(`
				***** ${current_update_time} *** ready_to_check_game: ${ready_to_check_game} ***** \n
				***** phat_response.gameHash: ${phat_response.gameHash}  \n
				***** phat_response.state: ${phat_response.state}  \n
				***** evmGameState: ${evmGameState}   \n
				***** gameIsGloballyRegistered: ${gameIsGloballyRegistered}   \n
				***** gameIsGloballyUnRegistered: ${gameIsGloballyUnRegistered}   \n
				***** gamerWinnerMoonbeamRegistered: ${gamerWinnerMoonbeamRegistered}  \n
				***** gameWinnerInfo_Moonbeam[1]: ${gameWinnerInfo_Moonbeam[1]}   \n
				***** winnerIsGloballyRegistered: ${winnerIsGloballyRegistered}   \n
				***** globalGameWinningsISReceived: ${globalGameWinningsISReceived}   \n
				***** globalGameWinningsReceived_Moonbeam: ${globalGameWinningsReceived_Moonbeam}  \n
				***** fundsArrivedAtGamePlayersContract: ${fundsArrivedAtGamePlayersContract}  \n
				***** moonbasePot: ${moonbasePot} binanceTestNetPot: ${binanceTestNetPot} totalPot: ${totalPot}  \n
				 ***** *****`);


				if (ready_to_check_game)
				{
						ready_to_check_game = false;
						 
						//Game is active on Phala but unregistered yet on Moonbeam => register game globally
						if (phat_response.state && !evmGameState) 
						{
							if (last_EVM_TransactionMined)	
							{
								await registerGame_Moonbase(phat_response.gameHash);
								set_EngineMessage("New Game is now registering. Please wait");
							}
							ready_to_check_game = true;
							console.log(`1 Free To check again at ${new Date(Date.now()).toISOString()}`);
						}
						//Game is not active on Phala but is registered on Moonbeam => unregister the game globally
						else if (!phat_response.state && evmGameState) 
						{
							if (last_EVM_TransactionMined)	
							{
								await unregisterGame_Moonbase(phat_response.gameHash);
								set_EngineMessage("Game is now unregistering. No more entries please");
							}
								ready_to_check_game = true;
								console.log(`2 Free To check again at ${new Date(Date.now()).toISOString()}`);
						}
						//Game is Finished in Phala and is Unregistered Globally and there are still funds in satelites => Transfer funds to Winning Satelite 
						else if (!phat_response.state && gameIsGloballyUnRegistered && totalPot>0)
						{
							//Winner is not rgistered globally gamerWinnerMoonbeamRegistered added for speed to avoid double send
							if (!winnerIsGloballyRegistered && !gamerWinnerMoonbeamRegistered)
							{
								console.log(`ANNOUNCE GAME WINNER `);
								const output = await getwinning_tickets();
								const winnerEVMaddress = `0x${output.Ok[0].playerId}`;
								const winnerChain = `${output.Ok[0].playerChain}`;
								let winnerEcosystem = "binance";
								if (winnerChain==="MOONBASE" || winnerChain==="MOONBEAM" || winnerChain==="INTERLAY" || winnerChain==="ASTAR") winnerEcosystem = "Moonbeam";
								console.log(` **** gameHash: ${phat_response.gameHash} winnerEVMaddress: ${winnerEVMaddress} winnerChain: ${winnerChain} winnerEcosystem: ${winnerEcosystem} *****`);

								if (last_EVM_TransactionMined)
								{
									await submitWinner_Moonbase(phat_response.gameHash, winnerEcosystem, winnerEVMaddress );
								    set_EngineMessage(`Winner is from ecosystem: ${winnerEcosystem} chain: ${winnerChain} with EVM address ${winnerEVMaddress} Details are passed to all satelite smart contracts. Please wait`);
								}	

								ready_to_check_game = true;
								console.log(`3 Free To check again at ${new Date(Date.now()).toISOString()}`);
							}
							else if (winnerIsGloballyRegistered && !globalGameWinningsISReceived && !globalGameWinningsReceived_Moonbeam)
							{
								ready_to_check_game = true;
								console.log(`4 Free To check again at ${new Date(Date.now()).toISOString()}`);
								//ready to transfer funds to winning satelite
								if (last_EVM_TransactionMined)
								{
									await transferSateliteFundsToWinnersEcosystem_Moonbase(phat_response.gameHash);
									set_EngineMessage(`Transferring funds from all satelite smart contract to the winning satelite smart contract at ${gameWinnerInfo_Moonbeam[1]} . Please wait`);
								}
							}
							else if ( winnerIsGloballyRegistered && globalGameWinningsISReceived)
							{
								//funds have been gathered in the winning satelite
								if (last_EVM_TransactionMined)
								{
									await transferWinningsToGamePlayersContract(phat_response.gameHash)
									set_EngineMessage("Transferring funds from winning satelite smart contract Router GamePlayers smart contract. Please wait");

								}
								ready_to_check_game = true;
								console.log(`5 Free To check again at ${new Date(Date.now()).toISOString()}`);
							}
							else 
							{
								ready_to_check_game = true;
								console.log(`6 Free To check again at ${new Date(Date.now()).toISOString()}`);
							}
						}
						//Game is Finished in Phala and is Unregistered Globally and the funds have been transferred to Router GamePlayers contract => Pay the Winner
						else if (!phat_response.state && gameIsGloballyUnRegistered && fundsArrivedAtGamePlayersContract)
						{
							console.log(`PAY WINNER `);
							if (last_EVM_TransactionMined)
							{
								await payWinner(phat_response.gameHash);
								set_EngineMessage("Paying the winner in his native wallet. *** End of Game ***");

							}
							ready_to_check_game = true;
							console.log(`7 Free To check again at ${new Date(Date.now()).toISOString()}`);
							console.log(`WINNER PAID `);
						}
						else 
						{
							ready_to_check_game = true;
							console.log(`8 Free To check again at ${new Date(Date.now()).toISOString()}`);

							if (phat_response.state && gameIsGloballyRegistered) set_EngineMessage("New Game is now Gloablly Registered. You can start playing now");
							else if (!phat_response.state && !gameIsGloballyRegistered) set_EngineMessage("Game is now Globally Unregistered. No more tickets please");
						}
							 
				}
				
			}
		})
  
	}
	else console.log(`PHALA API IS NOT SET UP YET`);
  
}
//#endregion


//#region WRITE 3 submit_tickets
// const evmPlayer = "0xa95b7843825449DC588EC06018B48019D1111000";
const submit_tickets = async (ticketsArrayOftuples) => {
	// console.log(`submit_tickets userChain: ${userChain} mm_account: ${mm_account}`);
	const evmPlayer = `${mm_account}`.substring(2);
	const chain = `${userChain}`;
	const phat_response = await get_game_stats();
	const gameHash = phat_response.gameHash;
	const gameIsGloballyRegistered = await isGameGloballyRegistered(gameHash);
	// console.log(`submit_tickets phat_response.state: ${phat_response.state} phat_response.gameHash: ${phat_response.gameHash} gameIsGloballyRegistered: ${gameIsGloballyRegistered}`);

	// if (gameIsGloballyRegistered && phala_api && phat_games_STB && ticketsArrayOftuples.length > 0) 

	if ( phala_api && phat_games_STB && ticketsArrayOftuples.length > 0) 
	{
		const contract = phat_games_STB;
		console.log(`ticketsArrayOftuples.length: ${ticketsArrayOftuples.length}`);
		
		//DRY RUN
		const { gasRequired, storageDeposit } = await contract.query.submitTickets(polkadot_test_account, ticketsArrayOftuples, evmPlayer,chain);
		// console.log("gasRequired & storageDeposit: ",gasRequired.toHuman(),storageDeposit.toHuman());

		const options = {
			gasLimit: gasRequired.refTime,
			storageDepositLimit: storageDeposit.isCharge ? storageDeposit.asCharge : null,
			value: `${ticketsArrayOftuples.length * 1000000000000}`
		}

		const tx = await contract.tx
		.submitTickets(options, ticketsArrayOftuples, evmPlayer,chain)
		.signAndSend(polkadot_test_account, { nonce: -1 }, async result => {
		// .signAndSend(polkadotInjectorAddress, { signer:  polkadotInjector.signer }, result => {

			if (result.status.isInBlock) {
				// console.log(' =====>>> in a block');
			} else if (result.status.isFinalized) {
				// console.log(' =====>>> finalized');
				// console.log('result: ',JSON.stringify(result,null,"\t"));

				// EVM submit ticket
				console.log(`submit_tickets2  ====> playGame_FromMoonbeam is run userChain: ${userChain} mm_account: ${mm_account}`);
				if (userChain==="MOONBASE")
				{
					await playGame_FromMoonbase(gameHash, `${ticketsArrayOftuples.length / 10000}`);
				}
				else if (userChain==="BINANCETESTNET")
				{
					await playGame_FromBinanceTestNet(gameHash, `${ticketsArrayOftuples.length / 10000}`);
				}

			}
		})
  
	}
	else console.log(`PHALA API IS NOT SET UP YET ticketsArrayOftuples.length(): ${ticketsArrayOftuples.length}`);
  
}
//#endregion

const set_EngineMessage = (message) => {
	engineMessage = message;
}
const pickEngineMessage = () => {
	return engineMessage;
}


//TESTS THIS WILL BE USED TO REGISTER PLAYERS COMING FROM ASTAR AND INTERLAY SO WE CAN SEND WINNING TO NATIVE CHAIN IF THEY WIN
// const someSubstrateAccount = "5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb";
// const substrateToHex = getAccountId_to_Hex(someSubstrateAccount);
// const substrateAccountToEvm = convertSubstratetoEVM(someSubstrateAccount);
// console.log(` ********** ********** ********** ********** **********`);
// console.log(`someSubstrateAccount: ${someSubstrateAccount} substrateToHex: ${substrateToHex} substrateAccountToEvm: ${substrateAccountToEvm}`);
// console.log(` ********** ********** ********** ********** **********`);
// someSubstrateAccount: 5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb 
// substrateToHex:        0xf0f4360fc5dbb8cd7107edf24fc3f3c9ef3914b32585062bfd7aa84e02f8b84e 
// substrateAccountToEvm: 0xf0f4360fc5dbb8cd7107edf24fc3f3c9ef3914b3 


export {

	setWallet,
	// setApi,
	// wallet,
	moonbeam_Withdraw,
	transfer_INTR_FromParachainToParachain,
	transfer_ASTR_FromParachainToParachain,
	simpleERC20Transfer,
	getBalance,
	approve,

	transfer_fromMoonbeam,

	// getAvailableBalance,
	getAccountFormatsforAccountI32,
	
          setPolkadotInjector,
          setup_SubstrateChain, 

		  get_account_balance,
		  get_game_stats,
		  get_players,
		  get_players_mapping,
		  get_tickets_mapping,
		  get_all_tickets,
		  get_wisdom_of_crowd_coordinates,
		  get_total_pot,
		  get_total_net_pot,
		  get_total_fees,
		  get_hall_of_fame,
		  start_new_game,
		  check_game,
		  submit_tickets,
		  get_ordered_tickets,
		  getwinning_tickets,

		  moonbeam_GetPolkadotBalance,
		  setChainOfUser,
		  getUserBalance,

		  registerGame_Moonbase,
		  unregisterGame_Moonbase,
		  playGame_FromMoonbase,
		  playGame_FromBinanceTestNet,
		  isGameGloballyRegistered,
		  isGameGloballyUnRegistered,
		  submitWinner_Moonbase,
		  isWinnerGloballyRegistered,
		  transferSateliteFundsToWinnersEcosystem_Moonbase,
		  isGlobalGameWinningsReceived,
		  transferWinningsToGamePlayersContract,
		  payWinner,

		  getMoonbasePot,
		  getBinaceTestNetPot,
		  getPotBalances,
		  getUserChain,
		  pickEngineMessage,

       };