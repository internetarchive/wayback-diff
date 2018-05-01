import React from 'react';
import SandboxedHtml from './sandboxed-html';

/**
 * @typedef {Object} RawVersionProps
 * @property {Page} page The page this diff pertains to
 * @property {Version} version
 * @property {string} content
 */

/**
 * Display the raw content of a version.
 *
 * @class RawVersion
 * @extends {React.Component}
 * @param {RawVersionProps} props
 */
export default class RawVersion extends React.Component {
  render () {
    if (this.props.content && /^[\s\n\r]*</.test(this.props.content)) {
      return (
        <div className="inline-render">
          <SandboxedHtml html={this.props.content} baseUrl={this.props.page.url} />
        </div>
      );
    }

    return (
      <div className="inline-render">
        <iframe src={this.props.version.uri} />
      </div>
    );
  }
}
