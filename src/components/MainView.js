import React, {Component} from 'react';
import Graph from './Graph';
import RefreshButton from './RefreshButton';
import CrazyButton from './CrazyButton';
import SpeedSlider from './SpeedSlider';
import "./styles.css"

export default class MainView extends Component {
  componentDidMount() {
    // this is good code.
    this.base_url = "https://labs-leaderboard.herokuapp.com/"
    // this.base_url = "http://localhost:3000/"

    this.setState({
      labsData: [],
      refreshing: false,
      crazy: false,
      crazySpeed: 100
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
    const users = [{username: "kapham2", id: "369995"},
                   {username: "nickluong", id: "286291"},
                   {username: "gwatson86", id: "367270"},
                   {username: "spraguesy", id: "304978"},
                   {username: "HeadyT0pper", id: "316733"},
                   {username: "V10LET", id: "371896"},
                   {username: "mwilliamszoe", id: "268776"},
                   {username: "NaebIis", id: "325649"},
                   {username: "sparkbold-git", id: "42003"},
                   {username: "chelsme", id: "360601"},
                   {username: "EthanFe", id: "318688"},
                   {username: "jordantredaniel", id: "288018"}]

    for (const user of users) {
      fetch(`${this.base_url}learnapidata/${user.id}`)
      .then(response => response.json())
      .then(data => this.drawChart(data, user.username))
    }
  }

  drawChart = (data, username) => {
    this.setState({labsData: 
      [...this.state.labsData].concat({name: username, labs: this.parseLabData(data)})
    })
    //   if (!this.interval)
    //     this.beginRefreshing()
  }

  parseLabData = (labsData) => {
    const firstDay = new Date()
    firstDay.setFullYear(2018)
    firstDay.setMonth(7)
    firstDay.setDate(27)
    firstDay.setHours(0,0,0,0)

    const labsByDay = {}
    const currentDay = new Date(firstDay.getTime())
    while (currentDay < new Date()) {
      for (let i = labsData.length - 1; i >= 0; i--) {
        labsByDay[currentDay] = labsByDay[currentDay] || 0
        if (new Date(labsData[i].occurred_at) < currentDay) {
          labsByDay[currentDay]++
        } else {
          break
        }
      }
      currentDay.setDate(currentDay.getDate() + 1)
    }

    const daysArray = []
    for (const day in labsByDay) {
      daysArray.push({date: day, labs: labsByDay[day]})
    }
    daysArray.sort((day1, day2) => day1.date < day2.date)
    console.log(daysArray)
    return daysArray
  }
  
  render() {
    if (this.state && this.state.labsData.length > 0) {
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
