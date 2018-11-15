import React, {Component} from 'react';
import RefreshButton from './RefreshButton';
import CrazyButton from './CrazyButton';
import SpeedSlider from './SpeedSlider';
import {users} from "../data.js"
import "./styles.css"
import ModuleFilter from './ModuleFilter';
import GraphDataManager from './GraphDataManager';

export default class MainView extends Component {
  componentDidMount() {
    // this is good code.
    // this.base_url = "https://labs-leaderboard.herokuapp.com/"
    this.base_url = "http://localhost:3000/"

    this.setState({
      labsData: [],
      refreshing: false,
      crazy: false,
      crazySpeed: 100,
      moduleFilter: null
    })
    this.fetchData()
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  beginRefreshing = () => {
    // immediately refresh and then do so every 15 minutes afterward
    this.refreshButtonClicked()
    this.interval = setInterval(this.refreshButtonClicked, 1000 * 60 * 15)
  }

  fetchData = () => {
    for (const user of users) {
      fetch(`${this.base_url}learnapidata/${user.id}`)
      .then(response => response.json())
      .then(data => this.drawChart(data, user.username))
    }
  }

  drawChart = (data, username) => {
    this.setState({labsData: 
      [...this.state.labsData, {name: username, labs: data.reverse()}]
    })
    //   if (!this.interval)
    //     this.beginRefreshing()
  }
  
  render() {
    if (this.state && this.state.labsData.length > 0) {
      return (
        [
          <div className="buttonsContainer">
            <CrazyButton onClick={this.toggleCrazyMode} crazy={this.state.crazy}></CrazyButton>
            <RefreshButton progress={this.refreshProgress()} onClick={() => this.refreshButtonClicked()}></RefreshButton>
            <ModuleFilter onChange={this.setModuleFilter} moduleFilter={this.state.moduleFilter}></ModuleFilter>
            <input type="checkbox" checked={this.state.displayCumulative} onChange={this.setDisplayCumulative} />
          </div>,
          this.state.crazy ? <SpeedSlider onChange={this.speedChanged}></SpeedSlider> : null,
          <GraphDataManager labsData={this.state.labsData}
                            crazy={this.state.crazy}
                            crazySpeed={this.state.crazySpeed}
                            moduleFilter={this.state.moduleFilter}
                            displayCumulative={this.state.displayCumulative}/>
        ]
      )
    } else {
      return <h1>Loading...</h1>
    }
  }

  setDisplayCumulative = (event) => {
    this.setState({displayCumulative: event.target.checked})
  }

  setModuleFilter = (event) => {
    this.setState({moduleFilter: event.target.value})
  }

  speedChanged = (event) => {
    this.setState({crazySpeed: event.target.value})
  }

  toggleCrazyMode = () => {
    this.setState({crazy: !this.state.crazy})
  }

  refreshButtonClicked = () => {
    // this.setState({refreshData: [], refreshing: true})
    // for (const user of this.state.usersToSearch) {
    //   fetch(`${this.base_url}users/${user}`)
    //   .then(response => response.json())
    //   .then(this.addToUserData)
    // }
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

    const url = this.base_url + "saveData"

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
