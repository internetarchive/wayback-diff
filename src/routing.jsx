/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import { useParams, useLocation } from 'react-router-dom';
import DiffContainer from './components/diff-container.jsx';
import SunburstContainer from './components/sunburst/sunburst-container.jsx';
import conf from './conf.json';

export function DiffRoute () {
  const { '*': rest } = useParams();
  const { search } = useLocation();

  const m2 = rest.match(/^([0-9]{14})\/([0-9]{14})\/(.+)$/);
  if (m2) {
    return <DiffContainer url={m2[3] + search} timestampA={m2[1]} timestampB={m2[2]} loader={null} conf={conf} />;
  }

  const mA = rest.match(/^([0-9]{14})\/\/(.+)$/);
  if (mA) {
    return <DiffContainer url={mA[2] + search} timestampA={mA[1]} loader={null} conf={conf} />;
  }

  const mB = rest.match(/^\/([0-9]{14})\/(.+)$/);
  if (mB) {
    return <DiffContainer url={mB[2] + search} timestampB={mB[1]} loader={null} conf={conf} />;
  }

  const mNoTs = rest.match(/^\/\/(.+)$/);
  if (mNoTs) {
    return <DiffContainer url={mNoTs[1] + search} conf={conf} noTimestamps={true} loader={null} />;
  }

  return <DiffContainer url={rest + search} loader={null} conf={conf} />;
}

export function DiffGraphRoute () {
  const { '*': rest } = useParams();
  const { search } = useLocation();
  const m = rest.match(/^([0-9]{14})\/(.+)$/);
  if (!m) return null;
  return <SunburstContainer url={m[2] + search} timestamp={m[1]} loader={null} conf={conf} />;
}
