import * as React from 'react';
import { BrowserRouter } from "react-router-dom";
import './App.css';

import Structure from './containers/Structure/Structure';

import 'codemirror/mode/markdown/markdown';

class App extends React.Component {

  public render() {
    return (
      <BrowserRouter>
        <Structure/>
      </BrowserRouter>
    );
  }
}

export default App;
