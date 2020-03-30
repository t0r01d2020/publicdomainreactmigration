import React from 'react';
import logo from '../logo.svg';
import './App.scss';
import { Button, Badge } from 'reactstrap';

import DadJoke from './dadJoke/dadJoke';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <div>
          <Button color="info"> A Bootstrap Button </Button>
        </div>
        <br /><br />
       
        <div>
         <Button color="primary" outline> A Bootstrap Badge <Badge color="secondary">2</Badge></Button>
        </div>
        <br /><br />

        <div>
          <DadJoke/>
        </div>
        
      </header>
    </div>
  );
}

export default App;
