import PropTypes from 'prop-types';
import React from 'react';
import '../css/diff.css';
import { diffTypes } from '../js/constants/diff-types';

import HighlightedTextDiff from './highlighted-text-diff.jsx';
import InlineRenderedDiff from './inline-rendered-diff.jsx';
import SideBySideRenderedDiff from './side-by-side-rendered-diff.jsx';
import ChangesOnlyDiff from './changes-only-diff.jsx';
import RawVersion from './raw-version.jsx';
import SideBySideRawVersions from './side-by-side-raw-versions.jsx';
import { checkResponse, fetchWithTimeout } from '../js/utils.js';
import Loading from './loading.jsx';
import isNil from 'lodash/isNil';

/**
 * @typedef DiffViewProps
 * @property {Page} page
 * @property {string} diffType
 * @property {Version} a
 * @property {Version} b
 */

/**
 * Fetches and renders all sorts of diffs between two versions (props a and b)
 *
 * @class DiffView
 * @extends {React.Component}
 * @param {DiffViewProps} props
 */

export default class DiffView extends React.Component {
  isMountedNow = false;

  static propTypes = {
    a: PropTypes.object, // TODO check this, potential optimization.
    b: PropTypes.object,
    diffType: PropTypes.string,
    loader: PropTypes.object,
    webMonitoringProcessingURL: PropTypes.string,
    errorHandledCallback: PropTypes.func,
    page: PropTypes.object
  };

  constructor (props) {
    super(props);

    this._abortController = new window.AbortController();

    this.state = { diffData: null };
  }

  componentDidMount () {
    this.isMountedNow = true;
    const { props } = this;
    if (this._canFetch(props)) {
      this._loadDiffData(props.page, props.a, props.b, props.diffType);
    }
  }

  componentWillUnmount () {
    this.isMountedNow = false;
    this._abortController.abort();
  }

  componentDidUpdate (prevProps) {
    const { props } = this;
    if (this._canFetch(props) && !this._propsSpecifySameDiff(props, prevProps)) {
      this._loadDiffData(props.page, props.a, props.b, props.diffType);
    }
  }

  render () {
    if (!this.state.diffData) {
      const Loader = () => isNil(this.props.loader) ? <Loading/> : this.props.loader;
      return <div className="loading"><Loader/></div>;
    }
    return (
      <div className="diff-view">
        {this.renderNoChangeMessage() || this.renderUndiffableMessage()}
        {this.renderDiff()}
      </div>
    );
  }

  renderNoChangeMessage () {
    const className = 'diff-view__alert alert alert-warning';
    if (this.state.diffData.change_count === 0) {
      return <div className={className}>
              There were <strong>no changes for this diff type</strong>. (Other diff
              types may show changes.)
      </div>;
    }
    return null;
  }

  renderUndiffableMessage () {
    if (this.state.diffData.raw) {
      return (
        <div className="diff-view__alert alert alert-info">
          We can’t compare the selected versions of page; you are viewing the
          content without deletions and insertions highlighted.
        </div>
      );
    }
    return null;
  }

  renderDiff () {
    // TODO: if we have multiple ways to render content from a single service
    // in the future (e.g. inline vs. side-by-side text), we need a better
    // way to ensure we use the correct rendering and avoid race conditions
    switch (this.props.diffType) {
    case diffTypes.RAW_SIDE_BY_SIDE.value:
      return (
        <SideBySideRawVersions page={this.props.page} a={this.props.a} b={this.props.b} diffData={this.state.diffData} />
      );
    case diffTypes.RAW_FROM_CONTENT.value:
      return (
        <RawVersion page={this.props.page} version={this.props.a} content={this.state.diffData.rawA} />
      );
    case diffTypes.RAW_TO_CONTENT.value:
      return (
        <RawVersion page={this.props.page} version={this.props.b} content={this.state.diffData.rawB} />
      );
    case diffTypes.HIGHLIGHTED_RENDERED.value:
      return (
        <InlineRenderedDiff diffData={this.state.diffData} page={this.props.page} />
      );
    case diffTypes.SIDE_BY_SIDE_RENDERED.value:
      return (
        <SideBySideRenderedDiff diffData={this.state.diffData} page={this.props.page}
          loader={this.props.loader}/>
      );
    case diffTypes.OUTGOING_LINKS.value:
      return (
        <InlineRenderedDiff diffData={this.state.diffData} page={this.props.page} />
      );
    case diffTypes.HIGHLIGHTED_TEXT.value:
      return (
        <HighlightedTextDiff diffData={this.state.diffData} className='diff-text-inline' />
      );
    case diffTypes.HIGHLIGHTED_SOURCE.value:
      return (
        <HighlightedTextDiff diffData={this.state.diffData} className='diff-source-inline' />
      );
    case diffTypes.CHANGES_ONLY_TEXT.value:
      return (
        <ChangesOnlyDiff diffData={this.state.diffData} className='diff-text-inline' />
      );
    case diffTypes.CHANGES_ONLY_SOURCE.value:
      return (
        <ChangesOnlyDiff diffData={this.state.diffData} className='diff-source-inline' />
      );
    default:
      return null;
    }
  }

  /**
   * Determine whether a set of props specifies the same diff as another set of
   * props (or the current props, if omitted).
   *
   * @private
   * @param {DiffViewProps} newProps The new props to check
   * @param {DiffViewProps} [props=this.props] The current props to compare to
   * @returns {boolean}
   */
  _propsSpecifySameDiff (newProps, props) {
    props = props || this.props;
    return props.a === newProps.a && props.b === newProps.b &&
      props.diffType === newProps.diffType;
  }

  /**
   * Check whether this props object has everything needed to perform a fetch
   * @private
   * @param {DiffViewProps} props
   * @returns  {boolean}
   */
  _canFetch (props) {
    return (props.diffType && props.a && props.b);
  }

  _loadDiffData (page, a, b, diffType) {
    // TODO - this seems to be some sort of caching mechanism, would be smart to have this for diffs
    // const fromList = this.props.pages && this.props.pages.find(
    //     (page: Page) => page.uuid === pageId);
    // Promise.resolve(fromList || this.context.api.getDiff(pageId, aId, bId, changeDiffTypes[diffType]))
    this.setState({ diffData: null });
    if (!diffTypes[diffType].diffService) {
      return Promise.all([
        fetchWithTimeout(a.uri, { mode: 'cors' }),
        fetchWithTimeout(b.uri, { mode: 'cors' })
      ])
        .then(([rawA, rawB]) => {
          return { raw: true, rawA, rawB };
        })
        .catch(error => error)
        .then(data => this.setState({ diffData: data }));
    }
    const url = new URL(this.props.webMonitoringProcessingURL + '/' + diffTypes[diffType].diffService);
    url.searchParams.append('strict_urls', 'WBM');
    url.searchParams.append('format', 'json');
    url.searchParams.append('pass_headers', 'cookie');
    url.searchParams.append('include', 'all');
    url.searchParams.append('a', a);
    url.searchParams.append('b', b);
    fetchWithTimeout(url, { credentials: 'include' })
      .then(checkResponse)
      .then(response => response.json())
      .then((data) => {
        this.setState({
          diffData: data
        });
      })
      .catch(error => { this._errorHandled(error.message); });
  }

  _errorHandled (error) {
    if (this.isMountedNow) {
      this.props.errorHandledCallback(error);
      this.setState({ showError: true });
    }
  }
}
