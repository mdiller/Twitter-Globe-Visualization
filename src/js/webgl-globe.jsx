import ReactDOM from 'react-dom';
import json_data from '../json/population909500.json';
import React from 'react';
import Detector from '../third-party/Detector.js';
import TWEEN from '../third-party/Tween.js';
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
            <span ref="year1990" className="year">1990</span>
            <span ref="year1995" className="year">1995</span>
            <span ref="year2000" className="year">2000</span>
          </div>
        </div>
        <div id="globeBox" ref="globeBox">
        </div>
      </div>
    );
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  doQuery(value) {
    var magnitude = parseFloat(value) || 0.1;

    this.globe.replaceData(json_data[0][1].map((n, index) => index % 3 == 2 ? magnitude : n), {format: 'magnitude', name: 'replaced', animated: true});
    this.globe.createPoints();
    new TWEEN.Tween(this.globe).to({time: 0}, 500).easing(TWEEN.Easing.Cubic.EaseOut).start();
  }
  componentDidMount() {
    var _this = this;
    var container = ReactDOM.findDOMNode(this.refs['globeBox']);
    if(!Detector.webgl){
      Detector.addGetWebGLMessage();
    } else {
      var years = ['1990','1995','2000'];

      var opts = {imgDir: 'assets/', animated: false};
      this.globe = new DAT.Globe(container, opts);
      var globe = this.globe;
      var i, tweens = [];

      var settime = function(globe, t) {
        return function() {
          new TWEEN.Tween(globe).to({time: t / years.length}, 500).easing(TWEEN.Easing.Cubic.EaseOut).start();
          var y = ReactDOM.findDOMNode(_this.refs[('year'+years[t])]);
          if (y.getAttribute('class') === 'year active') {
            return;
          }
          var yy = document.getElementsByClassName('year');
          for(i=0; i<yy.length; i++) {
            yy[i].setAttribute('class','year');
          }
          y.setAttribute('class', 'year active');
        };
      };
      TWEEN.start();

      for(i = 0; i<years.length; i++) {
        var y = ReactDOM.findDOMNode(this.refs[('year'+years[i])]);
        y.addEventListener('mouseover', settime(globe,i), false);
      }

      globe.replaceData(json_data[0][1].map((n, index) => index % 3 == 2 ? 0.1 : n), {format: 'magnitude', name: 'replaced', animated: true});
      globe.createPoints();
      settime(globe, 0).bind(this)();
      globe.animate();
      document.body.style.backgroundImage = 'none'; // remove loading
    }

  }

};

export default WebGLGlobe;
