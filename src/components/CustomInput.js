import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import $ from 'jquery';

class CustomInput extends Component {
  constructor() {
    super();
    this.state = { errorMsg : '' };
  }

  componentDidMount() {
    PubSub.subscribe('formValidator:error', function(topic, error) {
      if (!$.isEmptyObject(error)) {
        if (error.field === this.props.name) {
          this.setState({ errorMsg : error.defaultMessage });
        }
      } else {
        this.setState({ errorMsg: '' });
      }
    }.bind(this));
  }

  render() {
    return (
      <div className="pure-control-group">
        <label
          htmlFor={ this.props.id } >
            { this.props.label }
        </label>
        <input
          id={ this.props.id }
          type={ this.props.type }
          name={ this.props.name }
          value={ this.props.value }
          onChange={ this.props.onChange} />
        <span>
          { this.state.errorMsg }
        </span>
      </div>
    );
  }
}

export default CustomInput;
