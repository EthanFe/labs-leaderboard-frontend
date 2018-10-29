import React, { Component } from 'react';

export default class Name extends Component {
  render() {
    console.log("help")
    return <p onClick={this.props.onClick}>{this.props.name}</p>
  }
}