import React,{Fragment,useContext, useState, useEffect} from 'react';
// import loadable from "@loadable/component";
// import pMinDelay from "p-min-delay";
import { ThemeContext } from "../../../context/ThemeContext";
// import DatePicker  from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import golf from "../../../images/golf.jpg";
import crossCursor from "../../../images/cross_100185.png";
import blueCross from "../../../images/blueCross.png";
import redCross from "../../../images/redCross.png";
// import phalalogo from "../../../images/phalalogo.png";
import stbtitle from "../../../images/stbtitle.png";

//TODO load image from AWS-S3 4everland
 

import { 
	// get_account_balance,
	get_wisdom_of_crowd_coordinates,
	// get_total_pot,
	get_total_net_pot,
	get_total_fees,
	submit_tickets,
	getwinning_tickets,

	// transfer_INTR_FromParachainToParachain,
	// transfer_ASTR_FromParachainToParachain,
	
	// transfer_fromMoonbeam,

	// getBalance,
	// approve,
	// moonbeam_Withdraw,

	// moonbeam_GetPolkadotBalance,
	getUserBalance,

	// registerGame_Moonbeam,
	// unregisterGame_Moonbeam,
	// playGame_FromMoonbeam,

	get_game_stats,

	// registerGame_Moonbase,
	// unregisterGame_Moonbase,
	// playGame_FromMoonbase,
	// playGame_FromBinanceTestNet,
	// isGameGloballyRegistered,
	// isGameGloballyUnRegistered,
	// submitWinner_Moonbase,
	// isWinnerGloballyRegistered,
	// transferSateliteFundsToWinnersEcosystem_Moonbase,
	// isGlobalGameWinningsReceived,
	// transferWinningsToGamePlayersContract,
	// payWinner,
	getPotBalances,
	getUserChain,
	pickEngineMessage,

} from "../../../Setup";

const SpotTheBall = ({ api,  blockHeader }) => {
	const { background } = useContext(ThemeContext);
	const [coordinates, setCoordinates] = useState({x: "", y: ""});
	const [phala_account_balance, setPhala_account_balance] = useState("");
	const [phala_game_stats, setPhala_game_stats] = useState({state: false, imageHash:"", startTime: "", endTime: "", ticketPrice: "", feesPerccent: ""});
	// const [coordinatesX, setCoordinatesX] = useState("");
	// const [coordinatesY, setCoordinatesY] = useState("");
	const [tickets, setTickets] = useState([]);
	const [potSize, setPotSize] = useState("");
	const [fees, setFees] = useState("");
	const [payout, setPayout] = useState("");

	const [ticket1, setTicket1] = useState("");
	const [ticket2, setTicket2] = useState("");
	const [ticket3, setTicket3] = useState("");
	const [ticket4, setTicket4] = useState("");
	// const [ticket5, setTicket5] = useState("");

	const [totalCost, setTotalCost] = useState("");

	const [wisdomOfCrowd, setWisdomOfCrowd] = useState("");
	const [winningTicket, setWinningTicket] = useState("");

	const [gameState, setGameState] = useState(false);

	const [balanceCurrncy, setBalanceCurrncy] = useState("");

	const [engineMessage, setEngineMessage] = useState("Welcome to Spot The Ball");

	const [ticketsZ, setTicketsZ] = useState([]);
	const [shouldShowResults, setShouldShowResults] = useState(false);
	const z = 2;

	 

	const showResults = async () => {
		if (!gameState) setShouldShowResults(!shouldShowResults);


		console.log(`|||>>> showResults START`);
    
		//TO DELETE START
		// await transfer_INTR_FromParachainToParachain();
		// await transfer_ASTR_FromParachainToParachain();
		
		// await transfer_fromMoonbeam("INTR","1.1","5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb","2032");
		// await transfer_fromMoonbeam("ASTR","1.1","5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb","2006");

		// await moonbeam_Withdraw();

		// await moonbeam_GetPolkadotBalance("ASTR","5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb");
		// await moonbeam_GetPolkadotBalance("INTR","5HWdttFeYE89GQDGNRYspsJouxZ56xwm6bzKxSPtbDjwpQbb");

		// await registerGame_Moonbase("sample_01");
		// await isGameGloballyRegistered("sample_01")
		// await unregisterGame_Moonbase("sample_01");
		// await playGame_FromMoonbase("sample_01","0.01122334455");
		// await playGame_FromBinanceTestNet("sample_01","0.000000778899")
		// await isGameGloballyUnRegistered("sample_01");
		// await submitWinner_Moonbase("sample_01","Moonbeam","0xa95b7843825449DC588EC06018B48019D1111000");
		// await submitWinner_Moonbase("sample_01","binance","0xa95b7843825449DC588EC06018B48019D1111000");

		// await isWinnerGloballyRegistered("sample_01");
		// await transferSateliteFundsToWinnersEcosystem_Moonbase("sample_01");
		// await isGlobalGameWinningsReceived("sample_01");
		// await transferWinningsToGamePlayersContract("sample_01");
		// await payWinner("sample_01")
		//TO DELETE END


		console.log(`|||>>> showResults END `);
	}

	const phala_get_game_stats = async () => {
		const output_ = await get_game_stats();
		const output = output_.out_put;
		// console.log(`|||>>> Tickets phala_get_game_stats for output: ${output.Ok[0]}`);  //state


		const current_time = Date.now();
		let startTime = Number(output.Ok[2].split(",").join(''));
		let endTime = Number((output.Ok[3].split(",")).join(''));
		const timeLeft = Math.round((endTime - current_time) / 60000);
		// console.log(`current_time: ${current_time} timeLeft: ${timeLeft}  output.Ok[0]: ${output.Ok[0]} Number(output.Ok[3]: ${Number(output.Ok[3])}`);
		setPhala_game_stats({state: output.Ok[0], imageHash: output.Ok[1], startTime: new Date(startTime).toISOString(), endTime: new Date(endTime).toISOString(), ticketPrice: output.Ok[4], feesPerccent: output.Ok[5], timeLeft: timeLeft>0?timeLeft:0 });


		setGameState(output.Ok[0]);
		return output.Ok[0];
	}

	const phala_get_account_balance = async () => {
		// const balance = await get_account_balance();
		// console.log(`phala_get_account_balance: ${balance}`);
		// setPhala_account_balance(balance);

		const balance = await getUserBalance();
		console.log(`user balance: ${balance}`);
		setPhala_account_balance(Number(balance).toFixed(5));
	}


	const phala_get_wisdom_of_crowd_coordinates = async () => {
		const output = await get_wisdom_of_crowd_coordinates();
		// console.log(`|||>>> phala_get_wisdom_of_crowd_coordinates for output: ${output}`);
		setWisdomOfCrowd(`x: ${output.Ok[0]} y: ${output.Ok[1]}`);
	}

	const phala_get_winning_tickets = async () => {
		const output = await getwinning_tickets();
		// console.log(`|||>>> phala_get_wisdom_of_crowd_coordinates for output: ${output}`);
		// console.log(`|||>>> phala_get_wisdom_of_crowd_coordinates |||>>>`,output.Ok[0]);
		// {ticketId: '5', owner: '464inykovjdRPhMhW2zbJ47iA8qYSmPWqKLkaEgH2xc6SQ4c', ticketsCoordinates: Array(2), distanceFromTarget: '149,164,338,901,000,000,000'}
		// console.log(`|||>>> ${output.Ok[0].ticketId} ${output.Ok[0].owner} x: ${output.Ok[0].ticketsCoordinates[0]} y: ${output.Ok[0].ticketsCoordinates[1]}  ${output.Ok[0].distanceFromTarget}  playerId: 0x${output.Ok[0].playerId}  playerChain: ${output.Ok[0].playerChain}`);
		// |||>>> 1 4382im9yND1sMzv733cdbqZENMo8WQapZdmxvGXhXuJwDkr1 x: 829 y: 158  81,688,432,473,000,000,000  a95b7843825449dc588ec06018b48019d1111000
		
		if (output.Ok && output.Ok.length >  0)
			setWinningTicket(`x: ${output.Ok[0].ticketsCoordinates[0]} y: ${output.Ok[0].ticketsCoordinates[1]}`);
	}

	const phala_get_total_pot = async () => {
		// const output = await get_total_pot();
		// console.log(`|||>>> phala_get_total_pot for output: ${output}`);

		const output = await getPotBalances();
		setPotSize(output.total);
		setPayout(output.binancePot);
		setFees(output.moonbeamPot);
	}

	const phala_get_total_net_pot = async () => {
		const output = await get_total_net_pot();
		setPayout(output);
	}

	const phala_get_total_fees = async () => {
		const output = await get_total_fees();
		setFees(output);
	}

	const play_coordinates = (whichTicket) => {

		const ticket_value = `x:  ${coordinates.x}    y:  ${coordinates.y}`;
		if (whichTicket===1)
		{
			setTicket1(ticket_value)
		}
		else if (whichTicket===2)
		{
			setTicket2(ticket_value)
		}
		else if (whichTicket===3)
		{
			setTicket3(ticket_value)
		}
		else if (whichTicket===4)
		{
			setTicket4(ticket_value)
		}
		// else if (whichTicket===5)
		// {
		// 	setTicket5(ticket_value)
		// }
		phala_play_ticket(coordinates.x, coordinates.y)
	}

	const phala_play_ticket =  (newTicket_X,newTicket_Y) => {
		let newTicket = [newTicket_X,newTicket_Y];
		// console.log(`|||>>> phala_play_ticket newTicket: `,newTicket);
		setTickets([...tickets,newTicket]);
		setTotalCost((tickets.length + 1) * 1);

		let temp_ticketsZ=[];
		if (ticketsZ.length===0) temp_ticketsZ.push([newTicket_X,newTicket_Y,z+1]);
		else{
			let newTicketZ = [newTicket_X,newTicket_Y,ticketsZ[ticketsZ.length-1][2]+1];
			temp_ticketsZ = [...ticketsZ,newTicketZ];
		}
		setTicketsZ(temp_ticketsZ);

	}

	const phala_submit_tickets = async () => {
		// console.log(`|||>>> phala_submit_tickets tickets: `,tickets);
		if (tickets.length > 0)
		{
			await submit_tickets(tickets);
			setTickets([]);
			setTicket1("");
			setTicket2("");
			setTicket3("");
			setTicket4("");
			// setTicket5("");
			setTicketsZ([]);
			setTotalCost("");
			setCoordinates({x: "", y: ""});
		}
	}

	const clearTickets = () => {
		if (tickets.length > 0)
		{
			setTickets([]);
			setTicket1("");
			setTicket2("");
			setTicket3("");
			setTicket4("");
			// setTicket5("");
			setTicketsZ([]);
			setTotalCost("");
			setCoordinates({x: "", y: ""});
		}
	}

	const mathsHover = () => {
		console.log("mathsHover");
		console.log("mathsHover");
		console.log("mathsHover");
		console.log("mathsHover");


		if (ticketsZ.length>0)
		{
			let temp_ticketsZ = ticketsZ.map((elem) => [elem[0],elem[1],elem[2] - 1000]);
			console.log(`temp_ticketsZ: `,temp_ticketsZ);
			setTicketsZ(temp_ticketsZ);
		}
	}

	const mathsUnhover = () =>  {
		console.log("mathsUnhover");
		console.log("mathsUnhover");
		console.log("mathsUnhover");
		console.log("mathsUnhover");

		if (ticketsZ.length>0)
		{
			let temp_ticketsZ = ticketsZ.map((elem) => [elem[0],elem[1],elem[2] + 1000]);
			console.log(`temp_ticketsZ: `,temp_ticketsZ);
			setTicketsZ(temp_ticketsZ);
		}
	}

	const showCursorCross = (x,y,zInd,colr="white") => {
		console.log(`***** >>>>>>> x: ${x} y: ${y} zIndex : ${zInd}`)
		return (

				<div class="rect" id="rect" style={{alignItems:"center", display:"flex", justifyContent:"center", margin: "0px", cursor:"crosshair", zIndex:`${1+zInd}`, position:"absolute",  left:`${10+x}px`, top:`${200+y}px`   }}> 
					<img alt="images" width={25} height={25} src={colr==="blue"?blueCross: (colr==="red"?redCross:crossCursor)} 
					/> 
				</div>

		)
	}

	const getPosition = (e) => {
			var rect = e.target.getBoundingClientRect();
			var x = e.clientX - rect.left;
			var y = e.clientY - rect.top;
			// console.log(`=========> X: ${x} . Y: ${y}`);
		    setCoordinates({x: parseInt(x), y: parseInt(y) });
			// setCoordinatesX(parseInt(x));
			// setCoordinatesY(parseInt(y));
	}

	const defineBalanceCurrency = () => {
		const chain = getUserChain();
		let currency = "";
		if (chain==="MOONBEAM" || chain==="BINANCE") currency="axlUSDC";
		else if (chain==="MOONBASE" || chain==="BINANCETESTNET") currency="WDEV";
        setBalanceCurrncy(currency);
	}

	const pick_Engine_Message = () => {
		setEngineMessage( pickEngineMessage() );
	}

	useEffect(() => {
		const getSnapShot = async () => {
			if (blockHeader && blockHeader.number && ((Number(blockHeader.number)%2) ===0) )
			{
				// console.log(`updating Tickets at Block Number: ${blockHeader.number}`);
				await phala_get_game_stats();
				await phala_get_total_pot();
				// await phala_get_total_net_pot();
				// await phala_get_total_fees();
				await phala_get_account_balance();
				if (!gameState) 
				{
					await phala_get_wisdom_of_crowd_coordinates();
					await phala_get_winning_tickets();
				}
				defineBalanceCurrency();
				pick_Engine_Message();
			}
		}
		getSnapShot();
	},[blockHeader,gameState])

	useEffect(() => {
		const init = async () => {
			await phala_get_game_stats();
			await phala_get_total_pot();
			// await phala_get_total_net_pot();
			// await phala_get_total_fees();
			await phala_get_account_balance();
			if (!gameState) 
			{
				await phala_get_wisdom_of_crowd_coordinates();
				await phala_get_winning_tickets();
			}
			defineBalanceCurrency();
			pick_Engine_Message();
		}

		if (api) init();
	},[api,gameState]) 
 

	return(
		<Fragment>
			<div className="col-xl-12 col-lg-12">
				<div className="card bg-gradient-2" style={{backgroundColor:""}}>
					<div className="card-header mt-4">
						<div className="col-xl-7 col-lg-6"style={{alignItems:"center", display:"flex", justifyContent:"center"}}>
							<img alt="images" width={1100} src={stbtitle} ></img>
						</div>


						<div className="col-xl-3 col-lg-6"style={{alignItems:"center", display:"flex", justifyContent:"center"}}>
								<div className="row mb-4">

										<div className="col-md-4 text-white fs-18"style={{backgroundColor:""}}>
											<label>Start Time</label>
											<input
												type="textarea"
												className="form-control fs-18 text-center"
												placeholder=""
												value={gameState?phala_game_stats.startTime:""}
											/>
										</div>
										<div className="col-md-4 text-white fs-18"style={{backgroundColor:""}}>
											<label>End Time</label>
											<input
												type="textarea"
												className="form-control fs-18 text-center"
												placeholder=""
												value={gameState?phala_game_stats.endTime:""}
											/>
										</div>
										<div className="col-md-4 text-white fs-18"style={{backgroundColor:""}}>
											<label>Remaining</label>
											<input
												type="textarea"
												className="form-control fs-18 text-center"
												placeholder=""
												value={phala_game_stats.timeLeft}
											/>
										</div>

								</div>
						</div>




						<div className="col-xl-2 col-lg-6"style={{backgroundColor:""}}
									onClick = { () => phala_get_account_balance()}

						>
							<div className="">
								{/* <p className="mb-0 fs-18"style={{display:"flex", justifyContent:"right", marginRight:"60px"}} >axlUSDC</p> */}
								<p className="mb-0 fs-18"style={{display:"flex", justifyContent:"right", marginRight:"60px"}} >{balanceCurrncy}</p>
								{/* <p className="mb-0 fs-18"style={{display:"flex", justifyContent:"right", marginRight:"60px"}} >INTR</p>
								<p className="mb-0 fs-18"style={{display:"flex", justifyContent:"right", marginRight:"60px"}} >ASTR</p> */}

							</div>
								<div  className="coin-holding" style={{height:"70px", marginBottom:"15px", backgroundColor:"#2a2e47", color:"white",border:"2px solid grey"}}>
									<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
										<div className="mb-2">
											<div className="align-items-center">
												<div className="ms-3 pt-2">
													<p className="mb-0 op-6 fs-24" >Balance</p>
												</div>
											</div>
										</div>
									</div>
									<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
										<div className="mb-2" style={{backgroundColor:""}}> 
											<div className="align-items-center"  style={{backgroundColor:""}}>
												<div className="ms-0 pt-2" style={{backgroundColor:"", width:"100%"}}>
													<input type="text" disabled readOnly value = {phala_account_balance} placeholder="" className="form-control fs-16" style={{color:"white",  textAlign:"center",  }} />
												</div>
											</div>
										</div>
									</div>
								</div>
						</div>
					</div>
					<div className="card-body" style={{backgroundColor:""}}>
						<div className="row">
							<div className="col-xl-7 col-lg-8" style={{backgroundColor:""}}>

								{/* <div class="rect" id="rect" style={{alignItems:"center", display:"flex", justifyContent:"center", margin: "10px", cursor:"crosshair"  }}> 
									<img alt="images" width={1100} height={715} src={golf} border= '5px solid rgba(42,46,71,0.3)'
										onClick = { (e) => getPosition(e)}
									/> 
								</div> */}
								<div class="rect" id="rect" style={{alignItems:"center", display:"flex", justifyContent:"center", margin: "10px", cursor:"crosshair", zIndex:"1", position:"absolute",  left:"10px", top:"200px"  }} onMouseEnter={() => mathsHover()} onMouseLeave={() => mathsUnhover()}> 
									<img alt="images" width={1100} height={715} src={golf} border= '5px solid rgba(42,46,71,0.3)' style={{zIndex:"1" }}
										onClick = { (e) => getPosition(e)}
									/> 
								</div>

								{ticketsZ.map((data,index)=>(	
												showCursorCross(data[0],data[1],data[2],"white")
								))}

								{shouldShowResults?showCursorCross(Number(wisdomOfCrowd.x),Number(wisdomOfCrowd.y),3,"red"):""}
								{shouldShowResults?showCursorCross(Number(winningTicket.x),Number(winningTicket.y),4,"blue"):""}


								{/* <div className="row"> */}
								<div className="row" style={{position:"absolute", zIndex:"1", marginTop:"730px"}}>
									<div className="col-xl-1 col-lg-6"style={{backgroundColor:""}}></div>
									<div className="col-xl-10 col-lg-6"style={{backgroundColor:""}}>
										<div className="col-xl-12 col-lg-6"style={{backgroundColor:""}}>
											<div className="row">
												<div className="col-xl-4 col-lg-6"style={{backgroundColor:""}}
																onClick = { () => phala_get_total_pot()}
												>
													<div  className="coin-holding" style={{height:"70px", marginTop:"10px", border:"2px solid grey", backgroundColor:"#2a2e47"}}>
														<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
															<div className="mb-2">
																<div className="align-items-center">
																	<div className="ms-3 pt-2">
																		<p className="mb-0 op-6 fs-24 text-white" >Pot Size</p>
																	</div>
																</div>
															</div>
														</div>
														<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
															<div className="" style={{backgroundColor:""}}> 
																<div className="align-items-center"  style={{backgroundColor:""}}>
																	<div className="" style={{backgroundColor:"",width:"100%"}}>
																		<input type="text" disabled readOnly value = {potSize} placeholder="" className="form-control fs-16" style={{color:"white", textAlign:"center", backgroundColor:"" }} />
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div className="col-xl-4 col-lg-6"style={{backgroundColor:""}}
																onClick = { () => phala_get_total_fees()}
												>
													<div  className="coin-holding" style={{height:"70px", marginTop:"10px", border:"2px solid grey", backgroundColor:"#2a2e47"}}>
														<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
															<div className="mb-2">
																<div className="align-items-center">
																	<div className="ms-3 pt-2">
																		<p className="mb-0 op-6 fs-24 text-white" >Moonbeam</p>
																	</div>
																</div>
															</div>
														</div>
														<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
															<div className="" style={{backgroundColor:""}}> 
																<div className="align-items-center"  style={{backgroundColor:""}}>
																	<div className="" style={{backgroundColor:"", width:"100%"}}>
																		<input type="text" disabled readOnly value = {fees} placeholder="" className="form-control fs-16" style={{color:"white",  textAlign:"center",  }} />
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div className="col-xl-4 col-lg-6"style={{backgroundColor:""}}
																onClick = { () => phala_get_total_net_pot()}
												
												>
													<div  className="coin-holding" style={{height:"70px", marginTop:"10px", border:"2px solid grey", backgroundColor:"#2a2e47"}}>
														<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
															<div className="mb-2">
																<div className="align-items-center">
																	<div className="ms-3 pt-2">
																		<p className="mb-0 op-6 fs-24 text-white" >Binance</p>
																	</div>
																</div>
															</div>
														</div>
														<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
															<div className="" style={{backgroundColor:""}}> 
																<div className="align-items-center"  style={{backgroundColor:""}}>
																	<div className="" style={{backgroundColor:"", width:"100%"}}>
																		<input type="text" disabled readOnly value = {payout} placeholder="" className="form-control fs-16" style={{color:"white",  textAlign:"center",  }} />
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="col-xl-1 col-lg-6"style={{backgroundColor:""}}></div>
								</div>
							</div>
							<div className="col-xl-5 col-lg-3" style={{backgroundColor:""}}>
								<div className="row">
									<div className="form-group mx-4 my-2 col-md-3 text-white fs-18">
										<label>Current Coordinates</label>
										<input
											type="textarea"
											id="area"
											className="form-control fs-18 text-center"
											placeholder="Current Coordinates"
											value={`x:  ${coordinates.x}    y:  ${coordinates.y}`}
											style={{backgroundColor:"#2a2e47"}}
											// onChange={(event) => (event.target.value)}
										/>
									</div>
									{/* <div className="form-group col-md-2 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										<button type="submit" className="btn btn-primary text-center mx-0"style={{marginTop:"32px"}}>
											Play
										</button>
									</div> */}
								</div>

								<div className="row"style={{marginTop:"80px"}}>
									<div className="form-group mx-4 col-md-3 text-white fs-18">
										<label>Ticket 1</label>
										<input
											type="textarea"
											className="form-control fs-18 text-center"
											placeholder=""
											value={ticket1}
										/>
									</div>
									<div className="form-group col-md-2 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										<button type="submit" className="btn btn-primary text-center mx-0 mt-4"style={{marginTop:""}} 
									           onClick = { () => play_coordinates(1)}
										>
											Play
										</button>
									</div>
									<div className="form-group mx-4 col-md-3 text-white fs-18">
										<label>Ticket 2</label>
										<input
											type="textarea"
											className="form-control fs-18 text-center"
											placeholder=""
											value={ticket2}
										/>
									</div>
									<div className="form-group col-md-2 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										<button type="submit" className="btn btn-primary text-center mx-0 mt-4"style={{marginTop:""}}
									           onClick = { () => play_coordinates(2)}
										>
											Play
										</button>
									</div>
								</div>
								<div className="row">
									<div className="form-group mx-4 my-2 col-md-3 text-white fs-18">
										<label>Ticket 3</label>
										<input
											type="textarea"
											className="form-control fs-18 text-center"
											placeholder=""
											value={ticket3}
										/>
									</div>
									<div className="form-group col-md-2 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										<button type="submit" className="btn btn-primary text-center mx-0"style={{marginTop:"32px"}}
									           onClick = { () => play_coordinates(3)}
										
										>
											Play
										</button>
									</div>
									<div className="form-group mx-4 my-2 col-md-3 text-white fs-18">
										<label>Ticket 4</label>
										<input
											type="textarea"
											className="form-control fs-18 text-center"
											placeholder=""
											value={ticket4}
										/>
									</div>
									<div className="form-group col-md-2 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										<button type="submit" className="btn btn-primary text-center mx-0"style={{marginTop:"32px"}}
									           onClick = { () => play_coordinates(4)}
										
										>
											Play
										</button>
									</div>
								</div>
								<div className="row">
									<div className="form-group mx-4 my-2 col-md-4 text-white fs-18">
										<label>Total Cost ( 1 USD = 1 Ticket )</label>
										<input
											type="textarea"
											className="form-control fs-18 text-center"
											placeholder=""
											value={totalCost}
										/>
									</div>
									<div className="form-group col-md-4 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										{/* <button type="submit" className="btn btn-primary text-center mx-0"style={{marginTop:"32px", width:"50%"}} */}
										<button type="submit" className="btn btn-primary text-center mx-0"style={{backgroundColor:`${gameState?"green":"grey"}`, marginTop:"32px", width:"50%"}} disabled={!gameState}

									           onClick = { () => phala_submit_tickets()}
										>
											Submit
										</button>
									</div>

									<div className="form-group col-md-3 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										<button type="submit" className="btn btn-warning text-center mx-0"style={{marginTop:"32px", width:"50%"}}  
									           onClick = { () => clearTickets()}
										>
											Clear Tickets
										</button>
									</div>

								</div>
								<div className="col-xl-12 col-xxl-12">
									<div className="card"style={{backgroundColor:"#2a2e47", marginTop:"50px"}}>
										<div className="card-body" style={{height:"", backgroundColor:""}}>
											<div className="row">
												<div className="form-group col-md-6 text-white fs-18 text-center"style={{marginTop:""}}>
													<label>Wisdom Of The Crowd Answer</label>
													<input
														type="textarea"
														id="area"
														className="form-control fs-18 text-center"
														placeholder="Wait For Competition End"
														value={wisdomOfCrowd}
													/>
												</div>
												<div className="form-group col-md-6 text-white fs-18 text-center"style={{marginTop:""}}>
													<label>Winning Entry</label>
													<input
														type="textarea"
														id="area"
														className="form-control fs-18 text-center"
														placeholder="Wait For Competition End"
														value={winningTicket}
													/>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-12 d-flex align-items-center p-0"style={{backgroundColor:""}}>
													{/* <button type="submit" className="btn btn-warning text-center px-3 mx-auto"style={{marginTop:"20px"}} */}
													<button type="submit" className="btn btn-warning text-center px-3 mx-auto" style={{ marginTop:"20px", backgroundColor:`${gameState?"green":"grey"}`, width:"50%"}} disabled={!gameState}

									          			 onClick = { () => showResults()}
													>
														Show All Results On Screen
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<br/>
				<br/>
				<br/>
				<br/>
				<br/>


				<div className="card bg-gradient-2" style={{backgroundColor:"", height: "100px"}}>
					<div className="card-header mt-4">
							<div className="col-xl-2 col-lg-6"style={{alignItems:"center", display:"flex", justifyContent:"center"}}>
							</div>

							<div className="col-xl-8 col-lg-6"style={{ fontSize:"18px", color: "yellow", alignItems:"center", display:"flex", justifyContent:"center"}}>
								{engineMessage}
							</div>
							<div className="col-xl-2 col-lg-6"style={{alignItems:"center", display:"flex", justifyContent:"center"}}>
							</div>
					</div>
				</div>

			</div>
		</Fragment>
	)
}		
export default SpotTheBall;