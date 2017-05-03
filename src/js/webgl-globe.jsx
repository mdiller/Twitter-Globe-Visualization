import ReactDOM from 'react-dom';
import json_data from '../json/population909500.json';
import React from 'react';
import Detector from '../third-party/Detector.js';
import DAT from './globe.js';
import SearchForm  from './search-form.jsx';

class WebGLGlobe extends React.Component {
  constructor(props) {
    super(props);
    this.doQuery = this.doQuery.bind(this);
  }
  render() {
    return (
      <div>
        <div>
          <div id="title">
            Twitter Location Search
          </div>

          <div id="currentInfo">
            <SearchForm queryFunc={this.doQuery} />
          </div>
        </div>
        <div id="globeBox" ref="globeBox"></div>
      </div>
    );
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  doQuery(value) {
    var magnitude = parseFloat(value) || 0.1;

    this.globe.replaceData(json_data[0][1].map((n, index) => index % 3 === 2 ? magnitude : n), {format: 'magnitude', name: 'replaced', animated: true});
    this.globe.createPoints();
    this.globe.time = 0; // renders
  }
  componentDidMount() {
    var _this = this;
    var container = ReactDOM.findDOMNode(this.refs['globeBox']);
    if(!Detector.webgl){
      Detector.addGetWebGLMessage();
    } else {
      var opts = {imgDir: 'assets/', animated: false};
      this.globe = new DAT.Globe(container, opts);

      this.globe.replaceData(json_data[0][1].map((n, index) => index % 3 === 2 ? 0.1 : n), {format: 'magnitude', name: 'replaced', animated: true});
      this.globe.createPoints();
      this.globe.time = 0;
      this.globe.animate();
      document.body.style.backgroundImage = 'none'; // remove loading img
      console.log("globe setup done!");
    }
  }
};

export default WebGLGlobe;
