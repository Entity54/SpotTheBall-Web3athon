import React, { useEffect, useState, useCallback } from 'react'    
import { Dropdown } from "react-bootstrap";
import {Link} from 'react-router-dom';

const Header = ({ walletConnected, polakdotSignerfunction, polkadtoAccountList, changeChain, setupSpecs, getUserChain }) => {

	const [dropdowncolor, setDropdowncolor] = useState("#DE5106");
	const [dropdownDisabled, setDropdownDisabled] = useState(true);		
	const [polkadotAccount, setPolkadotAccount] = useState("");
	const [polkadotAccountsDropDown, setPolkadotAccountsDropDown] = useState("");

  const [activeEcosystem, setActiveEcosystem] = useState("EVM");
  const [mmChainName, setMMChainName] = useState("Select Chain");


  const handleChainChange = (val) => {
    if (val==="1")
    {
      setMMChainName("Moonbeam");
      changeChain("0x504"); //1284
      setActiveEcosystem("EVM");
      getUserChain("MOONBEAM");
    }
    else if (val==="2")
    {
      setMMChainName("Binance");
      changeChain("0x38"); //56
      setActiveEcosystem("EVM");
      getUserChain("BINANCE");
    }
    else if (val==="3")
    {
      setMMChainName("Interlay");
      setActiveEcosystem("Polkadot");
      getUserChain("INTERLAY");
    }
    else if (val==="4")
    {
      setMMChainName("Astar");
      setActiveEcosystem("Polkadot");
      getUserChain("ASTAR");
    }
    else if (val==="5")
    {
      setMMChainName("Moonbase"); //1287
      changeChain("0x507");
      setActiveEcosystem("EVM");
      getUserChain("MOONBASE");
    }
    else if (val==="6")
    {
      setMMChainName("BinanceTestNet");
      changeChain("0x61");
      setActiveEcosystem("EVM");
      getUserChain("BINANCETESTNET");
    }
    
  };

  // const _setupSpecs = { wallet: mm_wallet, provider, pair:"", connected: "C", walletAddress: await mm_wallet.getAddress(), mm_chainId, };

  useEffect(() => {
    if(setupSpecs.walletAddress)
    {
      console.log(` ********************* ********************* ********************* *********************`);
      console.log(`ACCOUTN SELECTED walletAddress: ${setupSpecs.walletAddress} mm_chainId: ${setupSpecs.mm_chainId}`);
      
      if (setupSpecs.mm_chainId==="0x504") setMMChainName("Moonbeam");
      else if (setupSpecs.mm_chainId==="0x38") setMMChainName("Binance");
      else if (setupSpecs.mm_chainId==="0x507") setMMChainName("Moonbase");
      else if (setupSpecs.mm_chainId==="0x61") setMMChainName("BinanceTestNet");

    } 
},[setupSpecs])


  useEffect(() => {
      if(walletConnected)
      {
        // setDropdowncolor("white");
        setDropdowncolor("#DE5106");
        setDropdownDisabled(false);
      } else {
        // setDropdowncolor("#DE5106");
        setDropdowncolor("white");
        setDropdownDisabled(true);
      }
  },[walletConnected])


  //#region Polkadot Accounts Drop List
  const refreshPolkadotAccountsList = useCallback ( (tokens) => {
    if (tokens)
    {
      return tokens.map((token, index) => {
        return (
          <Dropdown.Item key={index}  onClick={() => { 
            setPolkadotAccount(token);
            polakdotSignerfunction(token);
            console.log(`Polkadot Account is: ${token}`);
        } }>{token}</Dropdown.Item>
        )
      });
    }
    else return <>Loading data...</> 
  },[polakdotSignerfunction,activeEcosystem]);

  useEffect(() => {
    setPolkadotAccountsDropDown( refreshPolkadotAccountsList(polkadtoAccountList) );
    // console.log("Header polkadtoAccountList=> ",polkadtoAccountList);
    if (polkadtoAccountList.length > 0)
    {
      setPolkadotAccount(polkadtoAccountList[0]);
      polakdotSignerfunction(polkadtoAccountList[0]);
    }

  },[polkadtoAccountList, polakdotSignerfunction, refreshPolkadotAccountsList,activeEcosystem])


  const metamaskSelectedAccount =   (		
    <div className="form-group">
      <div className="input-group input-group-lg">
        <div className="input-group-prepend">
          <Dropdown className="btn-sm rounded py-1" style={{backgroundColor:"#171622", marginTop:"0px"}}>
            <Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer" style={{width:"550px", fontSize:"12px",   backgroundColor:"#171622"}}>
              <span className="fs-16 font-w650 d-flex" style={{backgroundColor:"#171622", marginRight:"10px"}}>{setupSpecs.walletAddress? setupSpecs.walletAddress : "Sign in to Metamask Extension"}</span>
            </Dropdown.Toggle>
            {/* <Dropdown.Menu style={{height:"200px", width:"550px", overflowY: "scroll", fontSize:"14px"}}>{polkadotAccountsDropDown}</Dropdown.Menu> */}
          </Dropdown>
        </div>
      </div>
    </div>
          )

  const polokadotAccountMenu =   (		
    	
    <div className="form-group">
      <div className="input-group input-group-lg">
        <div className="input-group-prepend">
          <Dropdown className="btn-sm rounded py-1" style={{backgroundColor:"#171622", marginTop:"0px"}}>
            <Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer" style={{width:"550px", fontSize:"12px",   backgroundColor:"#171622"}}>
              <span className="fs-16 font-w650 d-flex" style={{backgroundColor:"#171622", marginRight:"10px"}}>{polkadotAccount? polkadotAccount : "Sign in to Polkadot Extension"}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{height:"200px", width:"550px", overflowY: "scroll", fontSize:"14px"}}>{polkadotAccountsDropDown}</Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
          )
 
  return (
    <div className="header">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
            <li className="nav-item">
              <div  style={{ width: "50vw"}}> 
                <div style={{ width: "100v%" }}> 
                </div> 
              </div>
            </li>
            </div>
            <div className="basic-dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="" className="" style={{backgroundColor:"#171622"}}>
                    {mmChainName}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item value="1"  href="#" onClick={() => handleChainChange("1")} >Moonbeam</Dropdown.Item >
                    <Dropdown.Item value="2" href="#" onClick={() => handleChainChange("2")} >Binance Smart Chain</Dropdown.Item >
                    <Dropdown.Item value="3" href="#" onClick={() => handleChainChange("3")} >Interlay</Dropdown.Item >
                    <Dropdown.Item value="4" href="#" onClick={() => handleChainChange("4")} >Astar</Dropdown.Item >
                    <Dropdown.Item value="5"  href="#" onClick={() => handleChainChange("5")} >Moonbase</Dropdown.Item >
                    <Dropdown.Item value="6"  href="#" onClick={() => handleChainChange("6")} >BinanceTestnet</Dropdown.Item >
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            <ul className="" style={{backgroundColor:""}}>
              {activeEcosystem==="EVM"? metamaskSelectedAccount : polokadotAccountMenu}
                   {/* {polokadotAccountMenu} */}
            </ul>
          </div>
        </nav>
      </div>
    </div>
    
  );
};

export default Header;
