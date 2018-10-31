import React, {Component} from 'react';
import Graph from './Graph';
import RefreshButton from './RefreshButton';
import CrazyButton from './CrazyButton';
import SpeedSlider from './SpeedSlider';
import "./styles.css"

export default class MainView extends Component {
  componentDidMount() {
    this.drawChart()
  }

  drawChart = () => {
    fetch("https://labs-leaderboard.herokuapp.com/getData")
    // fetch("http://localhost:3000/getData")
    .then(response => response.json())
    .then(data => this.setState(
      {
        labsData: data,
        refreshing: false,
        usersToSearch: [
          "kapham2",
          "Richardojo86",
          "nickluong",
          "gwatson86",
          "spraguesy",
          "HeadyT0pper",
          "V10LET",
          "mwilliamszoe",
          "NaebIis",
          "sparkbold-git",
          "chelsme",
          "EthanFe",
          "jordantredaniel"
        ],
        crazy: false,
        crazySpeed: 100
      }
    ))
  }
  
  render() {
    if (this.state && this.state.labsData) {
      if (this.state.crazy) {
        return (
          [
            <div className="buttonsContainer">
              <CrazyButton onClick={this.toggleCrazyMode} crazy={this.state.crazy}></CrazyButton>
              <RefreshButton progress={this.refreshProgress()} onClick={() => this.refreshButtonClicked()}></RefreshButton>
            </div>,
            <SpeedSlider onChange={this.speedChanged}></SpeedSlider>,
            <Graph labsData={this.state.labsData} crazy={this.state.crazy} crazySpeed={this.state.crazySpeed}></Graph>
          ]
        )
      } else {
        return (
          [
            <div className="buttonsContainer">
              <CrazyButton onClick={this.toggleCrazyMode} crazy={this.state.crazy}></CrazyButton>
              <RefreshButton progress={this.refreshProgress()} onClick={() => this.refreshButtonClicked()}></RefreshButton>
            </div>,
            <Graph labsData={this.state.labsData} crazy={this.state.crazy} crazySpeed={this.state.crazySpeed}></Graph>
          ]
        )
      }
    } else {
      return <h1>Loading...</h1>
    }
  }

  speedChanged = (event) => {
    this.setState({crazySpeed: event.target.value})
  }

  toggleCrazyMode = () => {
    this.setState({crazy: !this.state.crazy})
  }

  refreshButtonClicked = () => {
    // this is good code.
    const base_url = "https://labs-leaderboard.herokuapp.com/"
    // const base_url = "http://localhost:3000/"

    this.setState({refreshData: [], refreshing: true})
    for (const user of this.state.usersToSearch) {
      fetch(`${base_url}users/${user}`)
      .then(response => response.json())
      .then(this.addToUserData)
    }
  }

  addToUserData = (data) => {
    this.setState({refreshData: [...this.state.refreshData, data]}, () => {
      this.checkRefreshCompletion()
    })
  }

  checkRefreshCompletion = () => {
    if (this.refreshProgress() === 1) {
      this.submitDataToDatabase()
    }
  }

  refreshProgress = () => {
    if (this.state && this.state.refreshing)
      return this.state.refreshData.length / this.state.usersToSearch.length
    else
      return null
  }

  submitDataToDatabase = () => {
    const dataTable = []
    for (const user of this.state.refreshData) {
      dataTable.push([user.name, user.labs])
    }

    const base_url = "https://labs-leaderboard.herokuapp.com/"
    let url = base_url + "saveData"

    let data = {}
    for (const user of dataTable) {
      data[user[0]] = user[1]
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({users: data}),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(this.drawChart)
  }
}
