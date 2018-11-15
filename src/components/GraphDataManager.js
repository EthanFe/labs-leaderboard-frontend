import React, { Component } from 'react';
import Graph from './Graph';
import { modules } from '../data';

export default class GraphDataManager extends Component {
  render() {
    return <Graph labsData={this.parseLabData(this.props.labsData)}
                  crazy={this.props.crazy}
                  crazySpeed={this.props.crazySpeed}/>
  }

  parseLabData = (labsData) => {
    const {firstDay, lastDay} = this.getBoundingDays(this.props.moduleFilter)
    const dayBeforeFirst = new Date(firstDay.getTime())
    dayBeforeFirst.setDate(dayBeforeFirst.getDate() - 1)

    const labsByUser = {}
    const labsSkippedByUser = {}
    const labsByDay = {}
    const currentDay = firstDay
    while (currentDay < lastDay) { // iterate through days
      for (const user of labsData) { // iterate through users
        labsByUser[user.name] = labsByUser[user.name] || 0
        labsSkippedByUser[user.name] = labsSkippedByUser[user.name] || 0
        for (let i = labsSkippedByUser[user.name]; i < user.labs.length; i++) { // iterate through labs of user
          if (new Date(user.labs[i].occurred_at) > dayBeforeFirst) { // ignore labs done before start of search period
            labsByDay[currentDay] = labsByDay[currentDay] || {}
            labsByDay[currentDay][user.name] = labsByDay[currentDay][user.name] || (this.props.displayCumulative ? labsByUser[user.name] : 0)
            if (new Date(user.labs[i].occurred_at) < currentDay) {
              labsByDay[currentDay][user.name]++
              labsByUser[user.name]++
              labsSkippedByUser[user.name]++
            } else {
              break
            }
          } else {
            labsSkippedByUser[user.name]++
          }
        }
      }
      currentDay.setDate(currentDay.getDate() + 1)
    }

    const daysArray = []
    for (const day in labsByDay) {
      daysArray.push({date: day, labs: labsByDay[day]})
    }
    daysArray.sort((day1, day2) => day1.date < day2.date)
    return {users: labsData.map(user => user.name), labs: daysArray}
  }

  getBoundingDays = (moduleID) => {
    let firstDay = null
    let lastDay = null
    if (moduleID === null) {
      firstDay = new Date()
      firstDay.setFullYear(2018)
      firstDay.setMonth(7)
      firstDay.setDate(27)
      firstDay.setHours(0,0,0,0)
      lastDay = new Date()
    } else {
      // create copies of the date objects so we dont accidentally modify the modules data
      const module = modules.find(module => module.id === parseInt(moduleID))
      firstDay = new Date(module.start.getTime())
      lastDay = new Date(module.end.getTime())
    }
    return {firstDay, lastDay}
  }
}