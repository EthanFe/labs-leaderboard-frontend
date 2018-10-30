import React, { Component } from 'react';

export default class RefreshButton extends Component {
  render() {
    if (this.props.progress === null)
      return <button onClick={this.props.onClick}>Refresh</button>
    else
      return <button disabled={true} onClick={this.props.onClick}>Refreshing: {Math.floor(this.props.progress * 10000) / 100}%</button>
  }
}