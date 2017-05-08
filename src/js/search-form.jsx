import React from 'react';
import SearchImg from '../images/search.svg';
import LoadingImg from '../images/search.svg';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.queryFunc = props.queryFunc;
    this.loading = props.loading;

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
          placeholder="search for tweets..."
          value={this.state.value} 
          onChange={this.handleChange} />
        <input 
          type="submit"
          value=" " 
          style={{ backgroundImage: `url(${this.loading ? LoadingImg : SearchImg})` }} />
      </form>
    );
  }
}

export default SearchForm;