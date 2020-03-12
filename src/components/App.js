import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import useInterval from '../hooks/use-interval.hook';
import { GameContext } from './GameContext'

import GlobalStyles from './GlobalStyles';
import Home from './Home';
import Game from './Game';


const App = (props) => {


  const { numCookies, setNumCookies, cookiesPerSecond } = React.useContext(GameContext);

  useInterval(() => {
    setNumCookies(numCookies + cookiesPerSecond);
  }, 1000);


  return (
    <>

      <GlobalStyles />
      <Router>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/game">
          <Game />
        </Route>
      </Router>

    </>
  );
}

export default App;
