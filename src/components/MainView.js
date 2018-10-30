import React, {Component} from 'react';
import Graph from './Graph';
import Name from './Name';

export default class MainView extends Component {
  componentDidMount() {
    console.log("fetchin")
    fetch("http://localhost:3000/getData")
    .then(response => response.json())
    .then((data => this.setState({labsData: data})))
  }

  
  render() {
    if (this.state) {
      return (
        [
          this.state.labsData.map((user, index) => {
            return <Name name={user.username} onClick={() => this.nameClicked(user.username)}></Name>
          }),
          <Graph labsData={this.state.labsData}></Graph>
        ]
      )
    } else {
      return null
    }
  }

  nameClicked = (name) => {
    console.log(name)
  }
}
