import React from 'react';

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
  constructor (props) {
    super(props);
    this._frame = null;
  }


  shouldComponentUpdate(){
    this.addLoaderImg();
    return true;
  }

  componentDidMount () {
    this._updateContent();
    this.addLoaderImg();
  }

  componentDidUpdate () {
    this._updateContent();
  }

  render () {
    return <iframe height={window.innerHeight} onLoad={()=>{this.handleHeight();
      this.removeLoaderImg();}}
    sandbox="allow-same-origin allow-forms allow-scripts"
    ref={frame => this._frame = frame}
    />;
  }

  _updateContent () {
    let source = transformSource(this.props.html, document => {
      if (this.props.transform) {
        document = this.props.transform(document) || document;
      }
      return setDocumentBase(document, this.props.baseUrl);
    });

    this._frame.setAttribute('srcdoc', source);
  }

  handleHeight () {
    let offsetHeight = this._frame.contentDocument.documentElement.scrollHeight;
    let offsetWidth = this._frame.contentDocument.documentElement.scrollWidth;
    if (offsetHeight > 0.1 * this._frame.height) {
      this._frame.height = offsetHeight + (offsetHeight * 0.01);
    } else {
      this._frame.height = 0.5 * this._frame.height;
    }
    if (offsetWidth > this._frame.clientWidth) {
      this._frame.width = offsetWidth;
    }
  }

  removeLoaderImg () {
    this._frame.loaderImage.parentNode.removeChild(this._frame.loaderImage);
  }

  addLoaderImg () {
    let width = this._frame.contentDocument.scrollingElement.offsetWidth;

    let centerX = this._frame.offsetLeft + width / 2;

    var elem = document.createElement('img');
    elem.className = 'waybackDiffIframeLoader';
    var cssText = 'position:absolute;left:'+centerX+'px;top:50%;';
    elem.setAttribute('style', cssText);
    elem.src = this.props.iframeLoader;
    document.body.appendChild(elem);
    this._frame.loaderImage = elem;
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
    const base = document.querySelector('base')
      || document.createElement('base');
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
    }
    else {
      document.head.appendChild(base);
    }
  }

  return document;
}
