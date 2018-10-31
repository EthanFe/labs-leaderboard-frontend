import React, { Component } from 'react';

export default class CrazyButton extends Component {
  render() {
    return <button className="crazyButton" onClick={this.props.onClick}>
      {this.props.crazy ? "Retract the Icing" : "Ice the Booleans"}
    </button>
  }
}