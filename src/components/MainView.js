import React, {Component} from 'react';
import Graph from './Graph';
import RefreshButton from './RefreshButton';

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
        ]
      }
    ))
  }
  
  render() {
    if (this.state && this.state.labsData) {
      return (
        [
          <RefreshButton progress={this.refreshProgress()} onClick={() => this.refreshButtonClicked()}></RefreshButton>,
          <Graph labsData={this.state.labsData}></Graph>
        ]
      )
    } else {
      return null
    }
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
      // renderChart()
    }
  }

  refreshProgress = () => {
    if (this.state && this.state.refreshing)
      return this.state.refreshData.length / this.state.usersToSearch.length
    else
      return null
  }

  // function renderChart() {
  //   if (finishedLoading()) {
  //     const loadingText = document.getElementById("loading-text")
  //     loadingText.classList.add("invisible")
  //     loadingText.textContent = "Done!"

  //     submitDataToDatabase(dataTable)
  //   }
  // }

  // function finishedLoading() {
  //   return userData.length === users.length
  // }

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
