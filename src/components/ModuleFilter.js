import React, { Component } from 'react';
import { modules } from '../data';

export default class ModuleFilter extends Component {
  render() {
    return (
      <form>
        <select value={this.props.moduleFilter} onChange={this.props.onChange}>
          {modules.map(module => <option value={module.id}>{module.name}</option>)}
        </select>
      </form>
    )
  }
}