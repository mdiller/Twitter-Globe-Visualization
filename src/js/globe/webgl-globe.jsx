import ReactDOM from 'react-dom';
import json_data from '../../www/assets/population909500.json';
import React from 'react';
import Detector from './third-party/Detector.js';
import TWEEN from './third-party/Tween.js';
import DAT from './globe.js';

// import SearchForm  from './search-form.jsx';

class WebGLGlobe extends React.Component {
  render() {
    return (
      <div>
        <div className="container" ref="container"></div>

        <div id="title">
          Twitter Location Search
        </div>

        <div id="currentInfo">
          <span ref="year1990" className="year">1990</span>
          <span ref="year1995" className="year">1995</span>
          <span ref="year2000" className="year">2000</span>
        </div>

      </div>
    );
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  componentDidMount() {
    var container = ReactDOM.findDOMNode(this);
    if(!Detector.webgl){
      Detector.addGetWebGLMessage();
    } else {
      var years = ['1990','1995','2000'];

      var opts = {imgDir: 'assets/'};
      var globe = new DAT.Globe(container, opts);
      var i, tweens = [];

      var settime = function(globe, t) {
        return function() {
          new TWEEN.Tween(globe).to({time: t/years.length},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
          var y = ReactDOM.findDOMNode(this.refs[('year'+years[t])]);
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

      for(i = 0; i<years.length; i++) {
        var y = ReactDOM.findDOMNode(this.refs[('year'+years[i])]);
        y.addEventListener('mouseover', settime(globe,i), false);
      }
      TWEEN.start();

      var data = json_data;
      window.data = data;
      for (i=0;i<data.length;i++) {
        globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
      }
      globe.createPoints();
      (settime(globe,0).bind(this))();
      globe.animate();
      document.body.style.backgroundImage = 'none'; // remove loading
    }

  }

};

export default WebGLGlobe;
