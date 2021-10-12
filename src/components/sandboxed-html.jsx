import PropTypes from 'prop-types';
import React from 'react';
import IframeLoader from './iframe-loader.jsx';

/**
 * @typedef {Object} SandboxedHtmlProps
 * @property {string} html The HTML source or document to render
 * @property {string} [baseUrl] A base URL to set for the view
 * @property {(HTMLDocument) => HTMLDocument} [transform] An optional transform
 *           function to apply to the document before rendering.
 */

/**
 * Display HTML source code or document in a sandboxed frame.
 *
 * @class SandboxedHtml
 * @extends {React.Component}
 * @params {SandboxedHtmlProps} props
 */
export default class SandboxedHtml extends React.PureComponent {
  static propTypes = {
    loader: PropTypes.object,
    html: PropTypes.string,
    transform: PropTypes.func,
    baseUrl: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.loaderRef = React.createRef();
    this._frame = null;
  }

  componentDidMount () {
    this._updateContent();
    this.addLoaderImg();
  }

  componentDidUpdate () {
    this._updateContent();
  }

  render () {
    return <div>
      <iframe height={window.innerHeight} width={'100%'} onLoad={() => { this.handleHeight(); this.removeLoaderImg(); }}
        sandbox="allow-same-origin allow-forms allow-scripts"
        ref={(frame) => { this._frame = frame; }}
      />
      <IframeLoader ref={this.loaderRef} loader={this.props.loader}/>
    </div>;
  }

  _updateContent () {
    const source = transformSource(this.props.html, document => {
      if (this.props.transform) {
        document = this.props.transform(document) || document;
      }
      return setDocumentBase(document, this.props.baseUrl);
    });

    this._frame.setAttribute('srcdoc', source);
  }

  handleHeight () {
    const offsetHeight = this._frame.contentDocument.documentElement.scrollHeight;
    if (offsetHeight > 0.1 * this._frame.height) {
      this._frame.height = offsetHeight + (offsetHeight * 0.01);
    } else {
      this._frame.height = 0.5 * this._frame.height;
    }
  }

  removeLoaderImg () {
    this.loaderRef.current.setLoaderStyle(null);
  }

  addLoaderImg () {
    const width = this._frame.contentDocument.scrollingElement.offsetWidth;
    const centerX = this._frame.offsetLeft + width / 2;
    this.loaderRef.current.setLoaderStyle(
      { position: 'absolute', left: centerX + 'px', top: '50%' }
    );
  }
}

/**
 * Run a transform function against an HTML source code string or document and
 * return the resulting HTML source code.
 * @private
 *
 * @param {string} source
 * @param {(HTMLDocument) => HTMLDocument} transformer
 * @returns {string}
 */
function transformSource (source, transformer) {
  const parser = new DOMParser();
  let newDocument = parser.parseFromString(source, 'text/html');
  newDocument = transformer(newDocument);
  return `<!doctype html>\n${newDocument.documentElement.outerHTML}`;
}

/**
 * Set the `base` URL for a document, which alters where links, images, etc.
 * point to if they do not include a domain name.
 * @private
 *
 * @param {HTMLDocument} document
 * @param {string} baseUrl
 * @returns {HTMLDocument}
 */
function setDocumentBase (document, baseUrl) {
  if (baseUrl) {
    const base = document.querySelector('base') || document.createElement('base');
    base.href = baseUrl;

    // <meta charset> tags don't work unless they are first, so if one is
    // present, modify <head> content *after* it.
    const charsetElement = document.querySelector('meta[charset]');
    let beforeElement = document.head.firstChild;
    if (charsetElement) {
      beforeElement = charsetElement.nextSibling;
    }
    if (beforeElement) {
      beforeElement.parentNode.insertBefore(base, beforeElement);
    } else {
      document.head.appendChild(base);
    }
  }
  return document;
}
