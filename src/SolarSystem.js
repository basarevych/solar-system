import React from 'react';
import PropTypes from 'prop-types';
import './SolarSystem.css';

class SolarSystem extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number.isRequired,
    rings: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    sun: PropTypes.object,
    orbit: PropTypes.object,
    planet: PropTypes.object,
    sunHover: PropTypes.node,
  };

  static defaultProps = {
    sun: { r: 30 },
    orbit: {},
    planet: { r: 20 },
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let state = {};

    // Coordinates of the center
    let centerX = nextProps.width / 2;
    if (prevState.centerX !== centerX)
      state.centerX = centerX;
    let centerY = centerX;
    if (prevState.centerY !== centerY)
      state.centerY = centerY;

    // Width of each orbit
    let minRing = 1.5 * nextProps.sun.r; 
    let maxRing = nextProps.width / 2;
    let orbitWidth = (maxRing - minRing) / (nextProps.rings + 1);

    // Radiuses of the orbits
    let orbits = [];
    for (let i = 0; i < nextProps.rings; i++) {
      let orbit = minRing + i * orbitWidth + orbitWidth / 2;
      orbits[i] = orbit;
      if (!prevState.orbits || prevState.orbits[i] !== orbit)
        state.orbits = orbits;
    }
    if (!prevState.orbits || prevState.orbits.length !== orbits.length)
      state.orbits = orbits;

    // Number of planets on each orbit
    let counts = [];
    for (let item of nextProps.data)
      counts[item.orbit] = (counts[item.orbit] || 0) + 1;
    if (!prevState.counts || !prevState.counts.length !== counts.length) {
      state.counts = counts;
    } else {
      for (let i = 0; i < counts.length; i++) {
        if (counts[i] !== prevState.counts[i]) {
          state.counts = counts;
          break;
        }
      }
    }

    return Object.keys(state).length > 0 ? state : null; // return if state has changed, otherwise null
  }

  constructor(props) {
    super(props);
    this.state = { popups: {} };
  }

  getPlanetAngle(orbit, counter) {
    let a = this.state.orbits[orbit];
    let r = this.props.planet.r;
    let angle = Math.min(Math.PI - 2 * Math.acos(r / a), 2 * Math.PI / this.state.counts[orbit]);
    return -Math.PI / 2 + orbit * orbit * angle / 2 + (counter - 1) * angle;
  }

  getPlanetX(orbit, angle) {
    return this.state.centerX + this.state.orbits[orbit] * Math.cos(angle);
  }

  getPlanetY(orbit, angle) {
    return this.state.centerY + this.state.orbits[orbit] * Math.sin(angle);
  }

  handleMouseOver(index, x, y) {
    if (this.state.popups[index])
      return;
    
    let popups = Object.assign({}, this.state.popups);
    popups[index] = { x, y };
    this.setState({ popups });
  }

  handleMouseOut(index, x, y) {
    if (this.state.popups[index]) {
      let popups = Object.assign({}, this.state.popups);
      delete popups[index];
      this.setState({ popups });
    }
  }
              
  render() {
    let orbits = [];
    for (let i = 0; i < this.state.orbits.length; i++) {
      orbits.push(
        <circle
          key={i}
          className="solar-system__orbit"
          cx={this.state.centerX}
          cy={this.state.centerY}
          r={this.state.orbits[i]}
          {...this.props.orbit}
        />
      );
    }

    let planets = [];
    let counters = [];
    for (let i = 0; i < this.props.data.length; i++) {
      counters[this.props.data[i].orbit] = (counters[this.props.data[i].orbit] || 0) + 1;
      let angle = this.getPlanetAngle(this.props.data[i].orbit, counters[this.props.data[i].orbit]);
      let x = this.getPlanetX(this.props.data[i].orbit, angle);
      let y = this.getPlanetY(this.props.data[i].orbit, angle);
      planets.push(
        <circle
          key={i}
          className="solar-system__planet"
          cx={x}
          cy={y}
          onMouseOver={() => this.handleMouseOver(i, x, y)}
          onMouseOut={() => this.handleMouseOut(i, x, y)}
          {...this.props.planet}
        />
      );
    }
    
    let popups = [];
    for (let index of Object.keys(this.state.popups)) {
      popups.push(
        <div
          key={index}
          className="solar-system__popup"
          style={{ left: this.state.popups[index].x, top: this.state.popups[index].y }}
        >
          {index === 'sun' ? this.props.sunHover : this.props.data[index].hover}
        </div>
      );
    }

    return (
      <div className="solar-system" style={{ width: this.props.width, height: this.props.width }}>
        <svg
          width={this.props.width}
          height={this.props.width}
          viewBox={`0 0 ${this.props.width} ${this.props.width}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="solar-system__sun"
            cx={this.state.centerX}
            cy={this.state.centerY}
            onMouseOver={() => this.handleMouseOver('sun', this.state.centerX, this.state.centerY)}
            onMouseOut={() => this.handleMouseOut('sun', this.state.centerX, this.state.centerY)}
            {...this.props.sun}
          />
          {orbits}
          {planets}
        </svg>
        {popups}
      </div>
    );
  }
}

export default SolarSystem;