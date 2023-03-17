import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { checkResponse, fetchWithTimeout } from '../js/utils';

/**
 * Display an error message depending on props
 */
const ErrorMessage = ({ code, url, timestamp, conf, errorHandledCallback }) => {

  let msg = 'We are sorry but there is a problem comparing these captures. Please try two different ones.';
  let simhash = false;
  let year = '';
  if (timestamp !== undefined) {
    year = timestamp.substring(0, 4);
  }

  const calculateSimhash = useCallback(() => {
    const targetUrl = `${conf.waybackDiscoverDiff}/calculate-simhash?url=${encodeURIComponent(url)}&year=${timestamp.substring(0, 4)}`;
    fetchWithTimeout(targetUrl).then(checkResponse)
      .then(() => { setTimeout(function () { window.location.reload(true); }, 10000); })
      .catch(error => { errorHandledCallback(error.message); });
  }, [conf, url, timestamp]);

  switch (code) {
  case '404':
    msg = `The Wayback Machine has not archived ${url}.`;
    simhash = false;
    break;
  case '422':
    // https://github.com/edgi-govdata-archiving/web-monitoring-diff/blob/be748a7f0bbdd4251f680e22d3e433d1be93f858/web_monitoring_diff/server/server.py#L568
    msg = `The captures of ${url} cannot be compared. Note that we support only HTML capture comparison.`;
    simhash = false;
    break;
  case 'CAPTURE_NOT_FOUND':
    msg = `There are no data available for ${url} at ${timestamp}.`;
    simhash = true;
    break;
  case 'NOT_CAPTURED':
    msg = `The Wayback Machine has no similarity data for ${url} and year ${year}.`;
    simhash = true;
    break;
  case 'NO_CAPTURES':
    msg = `The Wayback Machine has not archived ${url} for year ${year}.`;
    simhash = false;
    break;
  case 'NO_DIFFERENT_CAPTURES':
    msg = `There aren't any different captures for ${url} for year ${year} to display their similarity.`;
    simhash = false;
    break;
  // Occurs when AJAX fetch for CDX is canceled.
  case '_this4.errorHandled is not a function': // Chrome
  case 'NetworkError when attempting to fetch resource.': // FF
  case 'Load failed': // Safari
    msg = `The capture of ${url} at ${timestamp} cannot be used for comparisons. Its possible it is a redirect.`;
    simhash = false;
    break;
  }

  return (
    <>
      <div className='alert alert-warning' role='alert'>{ msg }</div>
      { simhash &&
        <button className="btn btn-sm" id="calcButton"
          onClick={ calculateSimhash }>Calculate now</button>
      }
      <button className="btn btn-sm" onClick={() => window.history.back()}>&laquo; Go back</button>
    </>
  );
};

ErrorMessage.propTypes = {
  code: PropTypes.string,
  url: PropTypes.string,
  timestamp: PropTypes.string,
  conf: PropTypes.object,
  errorHandledCallback: PropTypes.func
};

export default ErrorMessage;
