import React, { Component } from 'react';
import MainView  from './components/MainView';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <MainView></MainView>
        </header>
      </div>
    );
  }
}

export default App;
