import React, { Component } from 'react';

export default class SpeedSlider extends Component {
  render() {
    return <input type="range" min="1" max="100" onChange={this.props.onChange}></input>
  }
}