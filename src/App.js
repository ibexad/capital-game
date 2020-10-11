import React from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Game from './pages/game' 
import Help from './pages/help'

const App = () => {

  return(   
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Game} /> 
          <Route path="/help" component={Help} /> 
        </Switch>
      </BrowserRouter>
  )  
};
 
export default App;

