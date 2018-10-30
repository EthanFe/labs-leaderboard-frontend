import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';


export default class Graph extends Component {
  componentDidMount() {
    
  }
  
  render() {
    const chartData = {
      labels: this.props.labsData[0].data.map(entry => entry.date),
      datasets: []
    }
    for (const user of this.props.labsData) {
      chartData.datasets.push({
        data: user.data.map(entry => entry.score),
        label: user.username,
        borderColor: "#3e95cd",
        fill: false
      })
    }

    return (
      < Line data={chartData} />
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