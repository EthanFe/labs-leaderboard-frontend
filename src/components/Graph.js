import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import {colors} from "../data.js"

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
    const userData = this.props.labsData

    const chartData = {
      labels: userData[0].labs.map(day => day.date),
      datasets: []
    }
    console.log(userData, chartData)

    for (const user of userData) {
      if (!this.props.crazy) {
        const color = colors[userData.indexOf(user)]
        chartData.datasets.push({
          data: user.labs.map(day => day.labs),
          label: user.name,
          // borderColor: "#3e95cd",
          borderColor: color,
          fill: false
        })
        
      } else {
        const color = this.getRandomColor()
        const labelString = "BOOLEANICING"
        chartData.datasets.push({
          data: user.labs.map(day => day.labs),
          label: labelString[userData.indexOf(user)],
          borderColor: color,
          borderWidth: Math.random() * 10,
          borderDash: [Math.random() * 50, 15],
          lineTension: Math.random(),
          backgroundColor: color + "10",
          // steppedLine: true;
          // fill: Math.random() > 0.5
          fill: false
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
          scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day'
                }
            }]
          }
        }} />
    )
  }

  getRandomColor = () => {
    // const letters = '0123456789ABCDEF';
    // let color = '#';
    // for (let i = 0; i < 6; i++) {
    //   color += letters[Math.floor(Math.random() * 16)];
    // }
    // return color;
    return colors[Math.floor(Math.random() * colors.length)]
  }
}