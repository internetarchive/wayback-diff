import PropTypes from 'prop-types';
import React from 'react';
import SandboxedHtml from './sandboxed-html.jsx';

/**
 * @typedef {Object} SideBySideRawVersionsProps
 * @property {DiffData} diffData Object containing diff to render and its metadata
 * @property {Page} page The page this diff pertains to
 * @property {Version} a
 * @property {Version} b
 */

/**
 * Display two versions of a page, side-by-side.
 *
 * @class SideBySideRawVersions
 * @extends {React.Component}
 * @param {SideBySideRawVersionsProps} props
 */
export default class SideBySideRawVersions extends React.Component {
  static propTypes = {
    page: PropTypes.object,
    diffData: PropTypes.object,
    a: PropTypes.string,
    b: PropTypes.string
  };

  render () {
    return (
      <div className="side-by-side-render">
        {renderVersion(this.props.page, this.props.a, this.props.diffData.rawA)}
        {renderVersion(this.props.page, this.props.b, this.props.diffData.rawB)}
      </div>
    );
  }
}

function renderVersion (page, version, content) {
  if (content && /^[\s\n\r]*</.test(content)) {
    return <SandboxedHtml html={content} baseUrl={page.url} />;
  }

  return <iframe src={version} />;
}
