import React, { useContext } from "react";
import {  Switch, Route } from "react-router-dom";
import Header from "./layouts/nav/Header";
import NAV_NavHade from "./layouts/nav/NavHader";
import NAV_SideBar from "./layouts/nav/SideBar";
import Footer from "./layouts/Footer";
import SpotTheBall from "./components/Screens/SpotTheBall";
import Tickets from "./components/Screens/Tickets";
import ReadMe from "./components/Screens/ReadMe";
import { ThemeContext } from "../context/ThemeContext";  
  
const Markup = ( { api, blockHeader, polakdotSignerfunction, polkadtoAccountList, walletConnected, changeChain, setupSpecs, getUserChain,
}) => {

  const { menuToggle } = useContext(ThemeContext);

  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  let pagePath = path.split("-").includes("page");
  return (
    <>
      <div id={`${!pagePath ? "main-wrapper" : ""}`} className={`${!pagePath ? "show" : "mh100vh"}  ${menuToggle ? "menu-toggle" : ""}`}>

        {!pagePath && <Header 
            walletConnected={walletConnected}
            polakdotSignerfunction={polakdotSignerfunction} 
            polkadtoAccountList={polkadtoAccountList} 
            changeChain={changeChain}
            setupSpecs={setupSpecs}
            getUserChain={getUserChain}
          />}
        {!pagePath && <NAV_NavHade blockHeader={blockHeader} />}
        {!pagePath && <NAV_SideBar />}

        <div className={`${!pagePath ? "content-body" : ""}`} style={{marginBottom:"-50px"}}>
          <div
            className={`${!pagePath ? "container-fluid" : ""}`}
            style={{ minHeight: window.screen.height - 60 }}
          >
            <Switch>
              <Route exact path='/Tickets'> 
                  <Tickets 
                    api={api} blockHeader={blockHeader}
                  /> 
              </Route>
              <Route exact path='/SpotTheBall'> 
                  <SpotTheBall 
                      api={api} blockHeader={blockHeader}
                  /> 
              </Route>
              <Route exact path='/readme'> <ReadMe/> </Route>
              <Route exact path='/'> <ReadMe/> </Route>

            </Switch> 
          </div>
        </div>
        {!pagePath && <Footer />}
      </div>
    </>
  );
};

export default Markup;