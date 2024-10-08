// Display a d3 Sunburst diagram
import PropTypes from 'prop-types';
import React from 'react';
import round from 'lodash/round';
import { select } from 'd3-selection';
import { hierarchy, partition } from 'd3-hierarchy';
import { arc } from 'd3-shape';
import { getSize } from './sunburst-container-utils.js';

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
    this.chartRef = React.createRef();
  }

  componentDidMount () {
    const { simhashData, urlPrefix, url } = this.props;
    const width = getSize();
    const height = getSize();
    const radius = Math.min(width, height) / 2;

    // Create primary <g> element
    const g = select(this.chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    // Data strucure
    const structure = partition().size([2 * Math.PI, radius]);

    // Find data root
    const root = hierarchy(simhashData).sum(function (d) { return 5; });
    // Size arcs
    structure(root);
    const myarc = arc()
      .startAngle(function (d) { return d.x0; })
      .endAngle(function (d) { return d.x1; })
      .innerRadius(function (d) { return d.y0; })
      .outerRadius(function (d) { return d.y1; });
    const component = this;

    // Put it all together
    g.selectAll('path')
      .data(root.descendants())
      .enter().append('path')
      .attr('display', function (d) { return d.depth ? null : 'none'; })
      .attr('d', myarc)
      .style('stroke', '#fff')
      .style('fill', function (d) { return d.data.clr; })
      .on('mouseover', function (e, d) {
        select(e.currentTarget).style('cursor', 'pointer').style('stroke', 'black');
        component.setState({ hint: getDistance(d.data) });
      })
      .on('mouseleave', function (e, d) {
        select(e.currentTarget).style('cursor', 'default').style('stroke', '');
        component.setState({ hint: '' });
      })
      .on('click', function (e, d) {
        if (d.data.timestamp !== simhashData.timestamp) {
          const captureUrl = urlPrefix + d.data.timestamp + '/' + simhashData.timestamp + '/' + url;
          window.open(captureUrl, '_blank');
        }
      });
  }

  render () {
    return (
      <>
        <p className="text-center" style={{ marginTop: '10px' }}>{ this.state.hint } &nbsp;</p>
        <div className="text-center">
          <svg ref={this.chartRef}></svg>
        </div>
      </>
    );
  }
}
