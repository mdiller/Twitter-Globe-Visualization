import React from 'react';
import WebGLGlobe from './globe/webgl-globe.jsx';

class App extends React.Component {
  render() {
    return (<WebGLGlobe />);
  }
}

export default App;


// (function () {

//   var React = require('react');
//   var WebGLGlobe = require('./globe/webgl-globe.jsx');
//   //Needed for React Developer Tools
//   window.React = React;

//	 //Render the main app component
//	 var App = React.createClass({
//	   render: function() {
//	     return <WebGLGlobe />;
//	   }
//	 });

//   //Render the main app component
//   React.render(<App/>, document.body);

// })();
