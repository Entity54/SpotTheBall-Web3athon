import React,{Fragment,useContext, useState, useEffect} from 'react';
import { ThemeContext } from "../../../context/ThemeContext";
import "react-datepicker/dist/react-datepicker.css";

import golf from "../../../images/golf.jpg";
import crossCursor from "../../../images/cross_100185.png";
import blueCross from "../../../images/blueCross.png";
import redCross from "../../../images/redCross.png";
import stbtitle from "../../../images/stbtitle.png"; 

import { 
	get_wisdom_of_crowd_coordinates,
	get_total_net_pot,
	get_total_fees,
	submit_tickets,
	getwinning_tickets,
	getUserBalance,
	get_game_stats,
	getPotBalances,
	getUserChain,
	pickEngineMessage,

} from "../../../Setup";

const SpotTheBall = ({ api,  blockHeader }) => {
	const { background } = useContext(ThemeContext);
	const [coordinates, setCoordinates] = useState({x: "", y: ""});
	const [phala_account_balance, setPhala_account_balance] = useState("");
	const [phala_game_stats, setPhala_game_stats] = useState({state: false, imageHash:"", startTime: "", endTime: "", ticketPrice: "", feesPerccent: ""});
	const [tickets, setTickets] = useState([]);
	const [potSize, setPotSize] = useState("");
	const [fees, setFees] = useState("");
	const [payout, setPayout] = useState("");

	const [ticket1, setTicket1] = useState("");
	const [ticket2, setTicket2] = useState("");
	const [ticket3, setTicket3] = useState("");
	const [ticket4, setTicket4] = useState("");

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
		console.log(`|||>>> showResults END `);
	}

	const phala_get_game_stats = async () => {
		const output_ = await get_game_stats();
		const output = output_.out_put;

		const current_time = Date.now();
		let startTime = Number(output.Ok[2].split(",").join(''));
		let endTime = Number((output.Ok[3].split(",")).join(''));
		const timeLeft = Math.round((endTime - current_time) / 60000);
		setPhala_game_stats({state: output.Ok[0], imageHash: output.Ok[1], startTime: new Date(startTime).toISOString(), endTime: new Date(endTime).toISOString(), ticketPrice: output.Ok[4], feesPerccent: output.Ok[5], timeLeft: timeLeft>0?timeLeft:0 });

		setGameState(output.Ok[0]);
		return output.Ok[0];
	}

	const phala_get_account_balance = async () => {

		const balance = await getUserBalance();
		console.log(`user balance: ${balance}`);
		setPhala_account_balance(Number(balance).toFixed(5));
	}


	const phala_get_wisdom_of_crowd_coordinates = async () => {
		const output = await get_wisdom_of_crowd_coordinates();
		setWisdomOfCrowd(`x: ${output.Ok[0]} y: ${output.Ok[1]}`);
	}

	const phala_get_winning_tickets = async () => {
		const output = await getwinning_tickets();
		
		if (output.Ok && output.Ok.length >  0)
			setWinningTicket(`x: ${output.Ok[0].ticketsCoordinates[0]} y: ${output.Ok[0].ticketsCoordinates[1]}`);
	}

	const phala_get_total_pot = async () => {

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
		phala_play_ticket(coordinates.x, coordinates.y)
	}

	const phala_play_ticket =  (newTicket_X,newTicket_Y) => {
		let newTicket = [newTicket_X,newTicket_Y];
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
		if (tickets.length > 0)
		{
			await submit_tickets(tickets);
			setTickets([]);
			setTicket1("");
			setTicket2("");
			setTicket3("");
			setTicket4("");
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

				<div class="rect" id="rect" style={{alignItems:"center", display:"flex", justifyContent:"center", margin: "0px", cursor:"crosshair", zIndex:`${1+zInd}`, position:"absolute",  left:`${40+x}px`, top:`${180+y}px`   }}> 
					<img alt="images" width={25} height={25} src={colr==="blue"?blueCross: (colr==="red"?redCross:crossCursor)} 
					/> 
				</div>

		)
	}

	const getPosition = (e) => {
			var rect = e.target.getBoundingClientRect();
			var x = e.clientX - rect.left;
			var y = e.clientY - rect.top;
		    setCoordinates({x: parseInt(x), y: parseInt(y) });
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
				await phala_get_game_stats();
				await phala_get_total_pot();
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
					<div className="card-header">
						<div className="col-xl-6 col-lg-6"style={{alignItems:"center", justifyContent:"center", marginLeft:"15px"}}>
							<img alt="images" width={1100} src={stbtitle} ></img>
						</div>
						<div className="col-xl-3 col-lg-6"style={{alignItems:"center", display:"flex", justifyContent:"center"}}>
							<div className="row mb-4">
								<div className="col-md-4 text-white text-center fs-18"style={{backgroundColor:""}}>
									<label>Start Time</label>
									<input
										type="textarea"
										className="form-control fs-18 text-center"
										placeholder=""
										value={gameState?phala_game_stats.startTime:""}
									/>
								</div>
								<div className="col-md-4 text-white text-center fs-18"style={{backgroundColor:""}}>
									<label>End Time</label>
									<input
										type="textarea"
										className="form-control fs-18 text-center"
										placeholder=""
										value={gameState?phala_game_stats.endTime:""}
									/>
								</div>
								<div className="col-md-4 text-white text-center fs-18"style={{backgroundColor:""}}>
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
					</div>
					<div className="card-body" style={{backgroundColor:""}}>
						<div className="row">
							<div className="col-xl-7 col-lg-8" style={{backgroundColor:""}}>
								<div class="rect" id="rect" style={{alignItems:"center", display:"flex", justifyContent:"center", margin: "10px", cursor:"crosshair", zIndex:"1", position:"absolute",  left:"40px", top:"180px"  }} onMouseEnter={() => mathsHover()} onMouseLeave={() => mathsUnhover()}> 
									<img alt="images" width={1100} height={715} src={golf} border= '5px solid rgba(42,46,71,0.3)' style={{zIndex:"1" }}
										onClick = { (e) => getPosition(e)}
									/> 
								</div>

								{ticketsZ.map((data,index)=>(	
												showCursorCross(data[0],data[1],data[2],"white")
								))}

								{shouldShowResults?showCursorCross(Number(wisdomOfCrowd.x),Number(wisdomOfCrowd.y),3,"red"):""}
								{shouldShowResults?showCursorCross(Number(winningTicket.x),Number(winningTicket.y),4,"blue"):""}
								<div className="row" style={{position:"absolute", zIndex:"1", marginTop:"730px"}}>
									<div className="col-xl-11 col-lg-6"style={{backgroundColor:""}}>
										<div className="col-xl-12 col-lg-6"style={{backgroundColor:""}}>
											<div className="row" style={{marginLeft:"20px"}}>
												<div className="col-xl-4 col-lg-6"style={{backgroundColor:""}}
																onClick = { () => phala_get_total_pot()}
												>
													<div  className="coin-holding" style={{height:"70px", marginTop:"10px",paddingRight:"10px", border:"2px solid grey", backgroundColor:"#2a2e47"}}>
														<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
															<div className="mb-2">
																<div className="align-items-center">
																	<div className="ms-1 pt-2">
																		<p className="mb-0 op-6 fs-24 text-white" >Pot Size</p>
																	</div>
																</div>
															</div>
														</div>
														<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
															<div className="" style={{backgroundColor:""}}> 
																<div className="align-items-center"  style={{backgroundColor:""}}>
																	<div className="" style={{backgroundColor:"",paddingLeft:"10px", width:"100%"}}>
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
													<div  className="coin-holding" style={{height:"70px", marginTop:"10px", paddingRight:"10px", border:"2px solid grey", backgroundColor:"#2a2e47"}}>
														<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
															<div className="mb-2">
																<div className="align-items-center">
																	<div className="ms-1 pt-2">
																		<p className="mb-0 op-6 fs-24 text-white" >Moonbeam</p>
																	</div>
																</div>
															</div>
														</div>
														<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
															<div className="" style={{backgroundColor:""}}> 
																<div className="align-items-center"  style={{backgroundColor:""}}>
																	<div className="" style={{backgroundColor:"", paddingLeft:"10px", width:"100%"}}>
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
													<div  className="coin-holding" style={{height:"70px", marginTop:"10px", paddingRight:"10px", border:"2px solid grey", backgroundColor:"#2a2e47"}}>
														<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
															<div className="mb-2">
																<div className="align-items-center">
																	<div className="ms-1 pt-2">
																		<p className="mb-0 op-6 fs-24 text-white" >Binance</p>
																	</div>
																</div>
															</div>
														</div>
														<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
															<div className="" style={{backgroundColor:""}}> 
																<div className="align-items-center"  style={{backgroundColor:""}}>
																	<div className="" style={{backgroundColor:"", paddingLeft:"10px", width:"100%"}}>
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
									<div className="col-xl-3 col-lg-5"style={{backgroundColor:""}}></div>
									<div className="col-xl-5 col-lg-5"style={{backgroundColor:""}}
												onClick = { () => phala_get_account_balance()}

									>
										<div className="">
											<p className="mb-0 mt-2 fs-18"style={{display:"flex", justifyContent:"right", marginRight:"60px"}} >{balanceCurrncy}</p>
										</div>
										<div  className="coin-holding pt-3" style={{height:"60px", marginBottom:"", backgroundColor:"#2a2e47", color:"white",border:"2px solid grey"}}>
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
										<button type="submit" className="btn btn-primary text-center mx-0"style={{backgroundColor:`${gameState?"green":"grey"}`, marginTop:"32px", width:"50%"}} disabled={!gameState}

									           onClick = { () => phala_submit_tickets()}
										>
											Submit
										</button>
									</div>
									<div className="form-group col-md-3 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										<button type="submit" className="btn btn-warning text-center mx-4"style={{marginTop:"32px", width:"100%"}}  
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
				<div className="row">
					<div className="col-xl-3"style={{backgroundColor:""}}></div>
					<div className="col-xl-6"style={{ fontSize:"22px", color: "yellow"}}>
						<div className="card bg-gradient-2" style={{backgroundColor:"", width:"100%"}}>
							<div className="card-body text-center py-2">
								{engineMessage}
							</div>
						</div>
					</div>
					<div className="col-xl-3"></div>
				</div>
			</div>
		</Fragment>
	)
}		
export default SpotTheBall;