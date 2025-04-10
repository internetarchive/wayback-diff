import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import round from 'lodash/round';
import { select } from 'd3-selection';
import { hierarchy, partition } from 'd3-hierarchy';
import { arc } from 'd3-shape';
import { getSize } from './sunburst-container-utils.js';

function getDistance(capture) {
  if (capture.similarity !== -1) {
    return `${capture.name} - Differences: ${round(capture.similarity, 2)}%`;
  }
}

export default function D3Sunburst({ simhashData, urlPrefix, url }) {
  const chartRef = useRef(null);
  const [hint, setHint] = useState('');

  useEffect(() => {
    const width = getSize();
    const height = getSize();
    const radius = Math.min(width, height) / 2;

    const svg = select(chartRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const structure = partition().size([2 * Math.PI, radius]);

    const root = hierarchy(simhashData).sum(() => 5);
    structure(root);

    const myArc = arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

    g.selectAll('path')
      .data(root.descendants())
      .enter().append('path')
      .attr('display', d => (d.depth ? null : 'none'))
      .attr('d', myArc)
      .style('stroke', '#fff')
      .style('fill', d => d.data.clr)
      .on('mouseover', function (e, d) {
        select(e.currentTarget).style('cursor', 'pointer').style('stroke', 'black');
        setHint(getDistance(d.data));
      })
      .on('mouseleave', function (e) {
        select(e.currentTarget).style('cursor', 'default').style('stroke', '');
        setHint('');
      })
      .on('click', function (e, d) {
        if (d.data.timestamp !== simhashData.timestamp) {
          const captureUrl = `${urlPrefix}${d.data.timestamp}/${simhashData.timestamp}/${url}`;
          window.open(captureUrl, '_blank');
        }
      });
  }, [simhashData, urlPrefix, url]);

  return (
    <>
      <p className="text-center" style={{ marginTop: '10px' }}>{hint}&nbsp;</p>
      <div className="text-center">
        <svg ref={chartRef}></svg>
      </div>
    </>
  );
}

D3Sunburst.propTypes = {
  simhashData: PropTypes.object,
  url: PropTypes.string,
  urlPrefix: PropTypes.string
};
