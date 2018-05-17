import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SolarSystem from './SolarSystem';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { input: "10 10 20 50 10" };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.setState({ input: evt.target.value });
  }

  render() {
    let warnings = [];
    let planets = [];
    let counter = 0;
    for (let i of this.state.input.split(/\s+/)) {
      if (!i.trim())
        continue;

      i = parseInt(i, 10);
      if (isNaN(i) || i < 0) {
        warnings.push(`Wrong number for orbit ${counter + 1}, showing 0`);
        i = 0;
      } else if (i > 100) {
        warnings.push(`Too many planets on orbit ${counter + 1}, let's limit by 100`);
        i = 100;
      }
      for (let j = 0; j < i; j++) {
        planets.push({
          orbit: counter,
          hover: <span>{`orbit: ${counter + 1}, planet: ${j + 1}`}</span>,
        });
      }
      counter++;
    }

    if (warnings.length)
      warnings = warnings.map((item, index) => <p key={index}>{item}</p>);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p>
          How many planets? (number for each orbit, space separated)
          <br />
          <input type="text" value={this.state.input} onChange={this.handleChange} />
        </p>
        {warnings}
        <SolarSystem width={800} rings={counter} data={planets} sunHover={<span>This is the Sun</span>} />
      </div>
    );
  }
}

export default App;
