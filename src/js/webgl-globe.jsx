import ReactDOM from 'react-dom';
import React from 'react';
import Detector from '../third-party/Detector.js';
import DAT from './globe.js';
import SearchImg from '../images/search.svg';
import LoadingImg from '../images/loading.gif';
import GithubImg from '../images/github.png';
var request = require('request');


class WebGLGlobe extends React.Component {
  constructor(props) {
    super(props);
    this.searchChanged = this.searchChanged.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.state = {
      loading: false,
      searchInfo: null,
      searchQuery: ""
    };
  }
  render() {
    return (
      <div>
        <div>
          <div id="title">
            Twitter Location Search
          </div>

          <div id="currentInfo">
            <form onSubmit={this.searchSubmit}>
              <input 
                type="text" 
                placeholder="search for tweets..."
                onChange={this.searchChanged} />
              <input 
                type="submit"
                value=" " 
                style={{ backgroundImage: `url(${this.state.loading ? LoadingImg : SearchImg})` }} />
            </form>
            <div>
              {this.state.searchInfo ? this.state.searchInfo : ""}
            </div>
            <span id="sourceLink">
              <a href="https://github.com/mdiller/Twitter-Globe-Visualization">
                <img src={GithubImg} alt='Github repository'></img>
                Source on GitHub
              </a>
            </span>
          </div>
        </div>
        <div id="globeBox" ref="globeBox"></div>
      </div>
    );
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.loading !== nextState.loading || this.state.searchInfo !== nextState.searchInfo;
  }
  searchChanged(event) {
    this.setState({searchQuery: event.target.value});
  }
  searchSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    let url = 'http://web.engr.oregonstate.edu/~dillerm/globe/globe_query.php';
    let queryparams = { precision: 0 };
    if(this.state.searchQuery && this.state.searchQuery !== "") {
      queryparams["q"] = this.state.searchQuery;
    }
    this.setState({loading: true});

    request({ url: url, qs: queryparams }, (err, resp, body) => {
      if(err) { throw err; }
      var data = JSON.parse(body);

      var joined_data = [];

      let counts = data.map(l => l.count);
      let max_count = Math.max(...counts);

      data.forEach(location => {
        joined_data = joined_data.concat([location.lat, location.long, location.count / max_count]);
      })

      this.globe.replaceData(joined_data, {format: 'magnitude', name: 'replaced', animated: true});
      this.globe.createPoints();
      this.globe.time = 0; // renders

      this.setState({
        searchInfo: `${counts.reduce((a, b) => a + b, 0)} tweets from ${data.length} locations`,
        loading: false
      });
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

        _this.searchSubmit(null);
        _this.globe.animate();
        document.body.style.backgroundImage = 'none'; // remove loading img
        console.log("globe setup done!"); // DO THIS WHEN WE'RE LOADIN
      }
    }, 0);
  }
};

export default WebGLGlobe;
