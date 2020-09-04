import React from 'react';
import { Sunburst, Hint } from 'react-vis';
import '../../../node_modules/react-vis/dist/style.css';
import { buildValue, getDistance, getSize } from './sunburst-container-utils.js';

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

const boxStyle = { height: '10px', width: '10px' };

export default class D3Sunburst extends React.Component {
  state = {
    hoveredCell: false
  };

  constructor (props) {
    super(props);

    this._cellClick = this._cellClick.bind(this);
  }

  render () {
    const { hoveredCell } = this.state;

    return (
      <Sunburst
        style={{ stroke: '#fff' }}
        onValueMouseOver={v => this.setState({ hoveredCell: (v.x && v.y) ? v : false })}
        onValueMouseOut={() => this.setState({ hoveredCell: false })}
        onValueClick={node => { this._cellClick(node); }}
        data={this.props.simhashData}
        padAngle={() => 0.02}
        width={getSize()}
        height={getSize()}
        getSize={d => d.bigness}
        getColor={d => d.clr}>
        {hoveredCell ? this._showInfoLabel(hoveredCell) : null}
      </Sunburst>
    );
  }

  _cellClick (node) {
    if (node.timestamp !== this.props.simhashData.timestamp) {
      let url = this.props.urlPrefix + node.timestamp + '/' + this.props.simhashData.timestamp + '/' + this.props.url;
      window.open(url, '_blank');
    }
  }

  _showInfoLabel (hoveredCell) {
    if (hoveredCell.timestamp !== this.props.simhashData.timestamp) {
      return <Hint value={buildValue(hoveredCell)}>
        <div style={tipStyle}>
          <div style={{ ...boxStyle, background: hoveredCell.clr }}/>
          {getDistance(hoveredCell)}
          <br/>
          {hoveredCell.name}
        </div>
      </ Hint>;
    }
    return null;
  }
}
