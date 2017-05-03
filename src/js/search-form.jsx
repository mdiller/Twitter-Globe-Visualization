import React from 'react';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.queryFunc = props.queryFunc;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.queryFunc(this.state.value);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text" 
          value={this.state.value} 
          onChange={this.handleChange} />
        <input 
          type="submit"
          value=" " />
      </form>
    );
  }
}

export default SearchForm;