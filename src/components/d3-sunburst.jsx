import React from 'react';
import {Sunburst, Hint} from 'react-vis';
import '../../node_modules/react-vis/dist/style.css';

/**
 * Display a d3 Sunburst diagram
 *
 * @class D3Sunburst
 * @extends {React.Component}
 */

const tipStyle = {
  display: 'flex',
  color: '#fff',
  background: '#000',
  alignItems: 'center',
  padding: '5px'
};

const boxStyle = {height: '10px', width: '10px'};

export default class D3Sunburst extends React.Component {

  state = {
    hoveredCell: false
  };

  render () {
    const {hoveredCell} = this.state;

    return (
      <Sunburst
        style={{stroke: '#fff'}}
        onValueMouseOver={v => this.setState({hoveredCell: (v.x && v.y) ? v : false})}
        onValueMouseOut={() => this.setState({hoveredCell: false})}
        onValueClick={node => {let url = this.props.urlPrefix + node.name + '/' + this.props.simhashData.name + '/' + this.props.url;
          window.open(url,'_blank');}}
        data={this.props.simhashData}
        padAngle={() => 0.02}
        width={this._getSize()}
        height={this._getSize()}
        getSize={d => d.bigness}
        getColor={d => d.clr}>
        {hoveredCell ? <Hint value={this._buildValue(hoveredCell)}>
          <div style={tipStyle}>
            <div style={{...boxStyle, background: hoveredCell.clr}}/>
            {this.getDistance(hoveredCell)}
            {' Timestamp: ' + hoveredCell.name}
          </div>
        </ Hint> : null}
      </Sunburst>
    );
  }

  _buildValue(hoveredCell) {
    const {radius, angle, angle0} = hoveredCell;
    const truedAngle = (angle + angle0) / 2;
    const temp = {
      x: radius * Math.cos(truedAngle),
      y: radius * Math.sin(truedAngle)
    };

    return temp;
  }

  _getSize () {
    var w = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    var h = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    if (h<w){
      return h*0.45;
    }
    return w*0.45;
  }

  getDistance (hoveredCell) {
    if (hoveredCell.similarity !== -1){
      return (`Differences: ${Math.round(hoveredCell.similarity * 100)}%`);
    }
  }
}
