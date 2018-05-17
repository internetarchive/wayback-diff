import React from 'react';
import DiffView from './diff-view';
import {
    BrowserRouter as Router,
    Route
  } from 'react-router-dom'
import qs from 'qs'

/**
 * Display a change between two versions of a page.
 *
 * @class DiffContainer
 * @extends {React.Component}
 * @param {DiffContainerProps} props
 */
export default class DiffContainer extends React.Component {

  render () {

    return (
        <Router>
            <switch>
                <Route path = '/diff/:timestampA/:timestampB/:site' render={({location}) =>
                    <div className="diffcontainer-view">
                        {this.exportParams(location.pathname)}
                    </div>
                }
                />
                <Route exact path = '/:diffType' render={({match, history}) =>
                  <div className="diffcontainer-view">
                      {this.exportQueryParams(history.location.search, match.params)}
                </div>
                }
                />
            </switch>
        </Router>
    );
  }

  exportParams(path){

      if (/[0-9]{14}\/[0-9]{14}\/.+/.test(path)) {

          let site = path.substring(36);
          let urlA = 'https://web.archive.org/web/' + path.substring(6,20) + '/' + site;
          let urlB = 'https://web.archive.org/web/' + path.substring(21,35) + '/' + site;

          return <DiffView page = {{url: site}}
                           diffType='SIDE_BY_SIDE_RENDERED' a={urlA} b={urlB} />
      }
  }

  exportQueryParams(query, matchP){
        query = query.substring(1);
        var qParams=qs.parse(query);
        return <DiffView page = {{url: qParams["url"]}} diffType={matchP.diffType} a={qParams["a"]} b={qParams["b"]} />
  }
}