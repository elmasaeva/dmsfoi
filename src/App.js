import React, { Component } from 'react';
import {MapData} from './MapData';
import {HashRouter as Router, Route} from "react-router-dom";

class App extends Component {
  render() {
    return (<Router>
      <div className="map">
        <h1>Immigration statistics by region (May 2018)</h1>
        <Route exact path="/" component={MapData} />
        <Route path="/:iso/" component={MapData} />
      </div>
    </Router>);
  }
}

export default App;
