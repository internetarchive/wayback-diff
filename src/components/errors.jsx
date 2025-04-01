import PropTypes from 'prop-types';
import React from 'react';

/**
 * Display an error message depending on props
 */
const ErrorMessage = ({ code, url, timestamp }) => {
  let msg = 'We are sorry but there is a problem comparing these captures. Please try two different ones.';
  let simhash = false;
  let year = timestamp ? timestamp.substring(0, 4) : '';

  switch (code) {
  case '404':
    msg = `The Wayback Machine has not archived ${url}.`;
    break;
  case '422':
    // https://github.com/edgi-govdata-archiving/web-monitoring-diff/blob/be748a7f0bbdd4251f680e22d3e433d1be93f858/web_monitoring_diff/server/server.py#L568
    msg = `The captures of ${url} cannot be compared because we support only HTML comparison.`;
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
    break;
  case 'NO_DIFFERENT_CAPTURES':
    msg = `There aren't any different captures for ${url} for year ${year} to display their similarity.`;
    break;
  // Occurs when AJAX fetch for CDX is canceled.
  case '_this4.errorHandled is not a function': // Chrome
  case 'NetworkError when attempting to fetch resource.': // FF
  case 'Load failed': // Safari
    msg = `The capture of ${url} at ${timestamp} cannot be used for comparisons. Its possible it is a redirect.`;
    break;
  }

  const changesUrl = `/web/changes/${url}`;

  return (
    <>
      <div className='alert alert-warning' role='alert'>{ msg }</div>
      <div className="btn-group">
        <button className="btn btn-sm" onClick={() => window.history.back()}>&laquo; Go back</button>
        { simhash &&
          <>
            <span>&nbsp;</span>
            <a href={changesUrl} className="btn btn-default btn-sm" id="calcButton">Visit Wayback Changes to calculate now</a>
          </>
        }
      </div>
    </>
  );
};

ErrorMessage.propTypes = {
  code: PropTypes.string,
  url: PropTypes.string,
  timestamp: PropTypes.string
};

export default ErrorMessage;
