import React, { Component } from 'react';
import {MapData} from './MapData';

class App extends Component {
  render() {
    return (
      <div className="map">
        <h1>Immigration statistics by region (May 2018)</h1>
        <MapData />
      </div>
    );
  }
}

export default App;
