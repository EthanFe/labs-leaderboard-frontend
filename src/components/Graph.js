import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';


export default class Graph extends Component {
  componentDidMount() {
    if (this.props.crazy)
      this.startCraziness()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.crazy && (!prevProps.crazy || 
                             this.props.crazySpeed !== prevProps.crazySpeed)) {
      this.startCraziness()
    } else if (!this.props.crazy && prevProps.crazy) {
      clearInterval(this.interval)
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  startCraziness = () => {
    clearInterval(this.interval)
    const frameTime = 1000 / 60
    const framesPerInterval = (101 - this.props.crazySpeed) * 60 / 100
    this.interval = setInterval(this.doCrazyShit, frameTime * framesPerInterval)
  }

  doCrazyShit = () => {
    this.forceUpdate();
  }
  
  render() {
    const chartData = {
      labels: this.props.labsData[0].data.map(entry => entry.date),
      datasets: []
    }
    for (const user of this.props.labsData) {
      const color = this.getRandomColor()
      if (!this.props.crazy) {
        chartData.datasets.push({
          data: user.data.map(entry => entry.score),
          label: user.username,
          // borderColor: "#3e95cd",
          borderColor: color,
          fill: false
        })
      } else {
        const labelString = "BOOLEAN ICING"
        chartData.datasets.push({
          data: user.data.map(entry => entry.score),
          label: labelString[this.props.labsData.indexOf(user)],
          borderColor: color,
          borderWidth: Math.random() * 10,
          // borderDash: [Math.random() * 50, 15],
          lineTension: Math.random(),
          backgroundColor: color + "10",
          // steppedLine: true;
          fill: Math.random() > 0.5
        })
      }
    }

    return (
      < Line data={chartData} options={
        {
          legend: {
            labels: {
              fontSize: this.props.crazy ? 45 : 20,
              fontStyle: "bold",
              fontColor: "#fff"
            }
          },
        }} />
    )
  }

  getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}