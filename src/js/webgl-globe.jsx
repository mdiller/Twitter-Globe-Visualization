import ReactDOM from 'react-dom';
import json_data from '../json/population909500.json';
import React from 'react';
import Detector from '../third-party/Detector.js';
import DAT from './globe.js';
import SearchForm  from './search-form.jsx';
import LoadingImg from '../images/loading.gif';
var request = require('request');


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
    let url = 'http://web.engr.oregonstate.edu/~dillerm/globe/globe_query.php';
    let queryparams = { precision: 0 };
    if(value && value !== "") {
      queryparams["q"] = value;
    }

    request({ url: url, qs: queryparams }, (err, resp, body) => {
      if(err) { throw err; }
      var data = JSON.parse(body);

      var joined_data = [];

      let max_count = Math.max(...data.map(l => l.count));

      data.forEach(location => {
        joined_data = joined_data.concat([location.lat, location.long, location.count / max_count]);
      })

      this.globe.replaceData(joined_data, {format: 'magnitude', name: 'replaced', animated: true});
      this.globe.createPoints();
      this.globe.time = 0; // renders
    });
  }
  componentDidMount() {
    document.body.style.background = `#000000 url(${LoadingImg}) center center no-repeat`;
    var _this = this;
    setTimeout(function () {
      var container = ReactDOM.findDOMNode(_this.refs['globeBox']);
      if(!Detector.webgl){
        Detector.addGetWebGLMessage();
      } else {
        var opts = {imgDir: 'assets/', animated: false};
        _this.globe = new DAT.Globe(container, opts);

        _this.doQuery(null);
        _this.globe.animate();
        document.body.style.backgroundImage = 'none'; // remove loading img
        console.log("globe setup done!"); // DO THIS WHEN WE'RE LOADIN
      }
    }, 0);
  }
};

export default WebGLGlobe;
