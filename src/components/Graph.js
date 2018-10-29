import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';


export default class Graph extends Component {
  componentDidMount() {
    
  }
  
  render() {
    const sortedData = this.props.labsData.sort((user1, user2) => {
      return user1.score - user2.score
    })
    // const maxLabs = this.getMaxLabs(this.props.labsData)
    const users = sortedData.map(user => user.name)
    const scores = sortedData.map(user => user.score)
    const dataTable = {
      labels: users,
      datasets: [{
        label: "Labs Completed",
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: scores,
      }]
    }

    return (
      < Bar data={dataTable} />
      // "ヤッタァ"
    )
  }

  getMaxLabs(userData) {
    let max = 0
    for (const user of userData) {
      if (max < user.labs)
        max = user.labs
    }
    return max
  }
}