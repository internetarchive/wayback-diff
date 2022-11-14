import PropTypes from 'prop-types';
import React from 'react';
import round from 'lodash/round';
import { Sunburst } from 'react-vis';
import '../../../node_modules/react-vis/dist/style.css';
import { getSize } from './sunburst-container-utils.js';

/**
 * Display a d3 Sunburst diagram
 *
 * @class D3Sunburst
 * @extends {React.Component}
 */
function getDistance (capture) {
  if (capture.similarity !== -1) {
    return `${capture.name} - Differences: ${round(capture.similarity, 2)}%`;
  }
}

export default class D3Sunburst extends React.Component {
  static propTypes = {
    simhashData: PropTypes.object,
    url: PropTypes.string,
    urlPrefix: PropTypes.string
  };

  state = {
    hint: ''
  };

  constructor (props) {
    super(props);

    this._cellClick = this._cellClick.bind(this);
  }

  render () {
    return (
      <>
        <p className="text-center" style={{ marginTop: '10px' }}>{ this.state.hint } &nbsp;</p>
        <Sunburst
          style={{ stroke: '#fff' }}
          onValueMouseOver={v => this.setState({ hint: getDistance(v) })}
          onValueMouseOut={() => this.setState({ hint: '' })}
          onValueClick={node => { this._cellClick(node); }}
          data={this.props.simhashData}
          padAngle={() => 0.02}
          width={getSize()}
          height={getSize()}
          getSize={d => d.bigness}
          getColor={d => d.clr}>
        </Sunburst>
      </>
    );
  }

  _cellClick (node) {
    if (node.timestamp !== this.props.simhashData.timestamp) {
      const url = this.props.urlPrefix + node.timestamp + '/' + this.props.simhashData.timestamp + '/' + this.props.url;
      window.open(url, '_blank');
    }
  }
}
