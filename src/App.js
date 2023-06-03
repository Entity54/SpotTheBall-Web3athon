import React, { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import Index from "./jsx";
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";

import { 
  setup_SubstrateChain, setPolkadotInjector,
	// get_game_stats,
	// get_wisdom_of_crowd_coordinates,
	// get_hall_of_fame,
	check_game,
  setWallet, 
  // setApi,
  setChainOfUser,
} from './Setup.js';    
import { web3Accounts, web3Enable, web3FromAddress, web3AccountsSubscribe, web3FromSource, web3ListRpcProviders, web3UseRpcProvider } from '@polkadot/extension-dapp';

import { ethers } from 'ethers';  
import detectEthereumProvider from '@metamask/detect-provider'; // FOR METAMASK TO BE USED This function detects most providers injected at window.ethereum



function App (props) {

  const [blockHeader, setBlockHeader] = useState({ number: undefined});
  const [parachainSpecs,setParachainSpecs]      = useState({ api: undefined, chainID: undefined, blockNumber: undefined });
  const [polkadtoAccountList, setPolkadtoAccountList] = useState([]);
  const [polakdotAccountSigner, setPolakdotAccountSigner] = useState({injector: null, address: null});
  const [walletConnected, setWalletConnected]   = useState(false);

  const [setupSpecs,setSetupSpecs]            = useState({ wallet: null, provider: null, pair: null, connected: "Not connected", walletAddress: null });
  const [evm_api_state,setEvm_Api_State] = useState(false);
  const [accountList, setAccountList] = useState();  //stores the list of accounts from the extensions

  const [userChain,setUserChain] = useState("");    ///possible values Moonbeam,Binance,Interlay,Astar,Moonbase,BinanceTestNet

 
  const getUserChain = async (user_chain) => {
    if (user_chain!=="") {
      setUserChain(user_chain)
      setChainOfUser(user_chain);
    }
    //possible values Moonbeam,Binance,Interlay,Astar,Moonbase,BinanceTestNet
    console.log(` getUserChain user_chain: ${user_chain} ********************* ********************* ********************* *********************`);
  }

  const changeChain = async (chainId) => {
    const _provider = await detectEthereumProvider();
    if (_provider) {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");   
      // Get the current chain from MetaMask.
      const currentChain = await _provider.request({ method: 'eth_chainId' });
      console.log(`currentChain:  ${currentChain}`);

      if (chainId === undefined) {
        return;
      }
    
      // If the current chain is the same as the one being requested, do nothing.
      if (currentChain === chainId) {
        return;
      }

      // Otherwise, prompt the user to change chains.
      const confirm = window.confirm(`Are you sure you want to change chains to ${chainId}?`);
    
      // If the user confirms, change the chain and reload the page.
      if (confirm) {
        // web3.eth.chainId = chainId;
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId, }], // chainId must be in hexadecimal numbers 97(0x61) Binance testnet
        });
        window.location.reload();
      }

    }

  }

  const whichEVMChain = (chainId) => {
    let chainName;
    if (chainId==="0x504") chainName="MOONBEAM";
    else if (chainId==="0x507") chainName="MOONBASE";
    else if (chainId==="0x38") chainName="BINANCE";
    else if (chainId==="0x61") chainName="BINANCETESTNET";
    return chainName;
  }


  //#region MetaMaskExtenionApp
  useEffect(() => {
      const enableMetamaskManagement = async () => {
            let provider, mm_wallet, mm_acounts, mm_account, mm_chainId ;
           
            const _provider = await detectEthereumProvider();
            if (_provider) {
                provider = new ethers.providers.Web3Provider(window.ethereum, "any");   
  
                mm_acounts = await _provider.request({ method: 'eth_requestAccounts' });
                mm_chainId = await _provider.request({ method: 'eth_chainId' });
                getUserChain( whichEVMChain(mm_chainId) );

                mm_account = mm_acounts[0];
                mm_wallet = provider.getSigner(); 
                console.log(`***** MetaMask Accounts *****: `,mm_acounts, ` CHAINID: ${mm_chainId} SELECTED ACOUNT: ${mm_account} mm_wallet: `,mm_wallet);
                
                setEvm_Api_State(true);
                setAccountList(mm_acounts);
                setWallet(mm_wallet, Number(mm_chainId),mm_account);
                const _setupSpecs = { wallet: mm_wallet, provider, pair:"", connected: "C", walletAddress: await mm_wallet.getAddress(), mm_chainId, };
                setSetupSpecs(_setupSpecs);
  
                _provider.on('chainChanged', async (chainId) => {
                  window.location.reload();
                  mm_acounts = await _provider.request({ method: 'eth_requestAccounts' });
                  mm_account = mm_acounts[0];
                  mm_chainId = await _provider.request({ method: 'eth_chainId' });
                  getUserChain( whichEVMChain(mm_chainId) );

                  setWallet(mm_wallet, Number(mm_chainId),mm_account);
                  console.log(`***** MetaMask Accounts *****:  CHAINID: ${mm_chainId}`);
                });
  
                _provider.on('accountsChanged', async (accounts) => {
                  // Handle the new accounts, or lack thereof. // "accounts" will always be an array, but it can be empty.
                  mm_account = accounts[0];
                  provider = new ethers.providers.Web3Provider(window.ethereum, "any");   
                  mm_wallet = provider.getSigner(); 
                  mm_chainId = await _provider.request({ method: 'eth_chainId' });
                  // console.log(`****** METAMASK ACCOUNT CHANGED EVENT KICKS IN *****  accounts: `,accounts,`  SELECTED ACOUNT: ${mm_account} mm_wallet.getAddress: ${await mm_wallet.getAddress()} mm_wallet: `,mm_wallet);
                  getUserChain( whichEVMChain(mm_chainId) );
                  
                  setEvm_Api_State(true);
                  setAccountList(accounts);
                  setWallet(mm_wallet, Number(mm_chainId),mm_account);
                  const _setupSpecs = { wallet: mm_wallet, provider, pair:"", connected: "C", walletAddress: await mm_wallet.getAddress(), mm_chainId, };
                  setSetupSpecs(_setupSpecs);
                });

            } 
            else { 
              console.log('Please install MetaMask!'); 
              // return { provider: null, wallet: null, account: null };
            }
      };
      enableMetamaskManagement();
  }, []);   
  //#endregion

  //#region PolkadotExtenionApp
      const polakdotSignerfunction = useCallback(async (SENDER) => {

        if (!SENDER) return null 
        else {
            const injector = await web3FromAddress(SENDER); // finds an injector for an address
            console.log(`polakdotSigner ===> injector: `,injector);
            // setPolakdotSigner(injector);
            setPolkadotInjector(injector,SENDER);
            setPolakdotAccountSigner({injector: injector, address: SENDER});
            return injector;    
        }
    },[]);

    useEffect( () => {
      const enbalePolakdotExt = async () => { 
          //this call fires up the authorization popup returns an array of all the injected sources (this needs to be called first, before other requests)
          const extensions = await web3Enable('ntt54 Dapp');
          if (extensions.length === 0) {
            console.log("no extension installed, or the user did not accept the authorization");
            // in this case we should inform the user and give a link to the extension
            return;
          }
  
          await web3AccountsSubscribe(( injectedAccounts ) => { 
              let substrateAccounts = []
              injectedAccounts.map(( account ) => substrateAccounts.push(account.address));
              setPolkadtoAccountList(substrateAccounts);
              
              setWalletConnected(true);
          });
  
      };
      enbalePolakdotExt();
  
    }, []);   
    //#endregion


  useEffect(() => {
    const runSetupSubstrate = async () => {
      console.log(" ***** runSetupSubstrate ***** ");
      const { api: apiMoonbeam } = await setup_SubstrateChain("Moonbeam");
      // console.log("apiMoonbeam: ",apiMoonbeam);
      // setApi("Moonbeam", apiMoonbeam);
      const { api: apiPhala } = await setup_SubstrateChain("Phala");
      const { api: apiAstar } = await setup_SubstrateChain("Astar");
      const { api: apiInterlay } = await setup_SubstrateChain("Interlay");
      console.log("apiInterlay: ",apiInterlay);
      const { api: apiMoonbase } = await setup_SubstrateChain("Moonbase");

      const { api: api_Phala } = await setup_SubstrateChain("PhalaTestNet");
      // console.log("api_Phala: ",api_Phala);
      setParachainSpecs({ api: api_Phala, chainID: undefined, blockNumber: undefined });
    }
    runSetupSubstrate();
  }, []);   
 
 
  //#region  parachain events setup
  useEffect(() => {

    const parachain = async (api) => {
        const chain = await api.rpc.system.chain();
        console.log(`App.js Parachain ${chain} is run at  Timestmap: ${new Date()}`);
        
        let count = 0;
        //Subscribe to the new headers on-chain.   
        const unsubHeads = await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
            console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
            setBlockHeader({number: `${lastHeader.number}`, hash: `lastHeader.hash`, size: "header.size"});

            //HERE ADD  CHECKS *******
            if (((lastHeader.number)%2) ===0) 
            {
              // console.log(` ********** updating ********** ||| Spot The Ball PROJECT START ||| at Block Number: ${lastHeader.number}`);
              await check_game();
              // console.log(` ********** updating ********** ||| Spot The Ball  PROJECT END ||| at Block Number: ${lastHeader.number}`);
            }
        });
    }

    if (parachainSpecs.api)
    {
      parachain(parachainSpecs.api).catch((er) => { console.log(`APP.JS parachain Error: `,er);  });
      console.log(`#Will be running a check here`);
    }
    else console.log(`App.js => setupSpecs.provider is undefined`);

  }, [parachainSpecs.api]);  
  //#endregion  parachain events setup

	return (
			<>
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>  
                   }
                >
                    <Index 
                          api={parachainSpecs.api}
                          blockHeader={blockHeader}   
                          polakdotSignerfunction={polakdotSignerfunction} 
                          polkadtoAccountList={polkadtoAccountList} 
                          walletConnected={walletConnected} 

                          changeChain={changeChain}
                          getUserChain={getUserChain}
                          setupSpecs={setupSpecs} 

                          // accountList={accountList}  
                          // polakdotAccountSigner={polakdotAccountSigner} evm_api_state={"evm_api_state"} 
                    />
                </Suspense>
            </>
    );
	
};


export default App;