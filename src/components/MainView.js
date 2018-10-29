import React, {Component} from 'react';
import Graph  from './Graph';

export class MainView extends Component {
  componentDidMount() {
    console.log("fetchin")
    fetch("http://localhost:3000/getData")
    .then(response => response.json())
    .then((data => this.setState({labsData: data})))
  }
  
  render() {
    if (this.state)
      return (
        <Graph labsData={this.state.labsData}></Graph>
        // this.state.games.map((game, index) => {
        //   return <button key={index} onClick={() => this.props.gameClicked(game.id)}>{game.name}</button>
        // })
      )
    else
      return null
  }
}

export default MainView
