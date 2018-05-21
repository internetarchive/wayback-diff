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

    constructor(props) {
        super(props);

        let pr = process.env;
        let diffMethodsSupported = [];

        Object.keys(pr).map(function(key) {
            if (key.startsWith("REACT_APP_DIFFING_METHOD")) {
                diffMethodsSupported.push(pr[key]);
            }
        });

        this.state = {diffMethods: diffMethodsSupported,
            selectedMethod:diffMethodsSupported[0]};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({selectedMethod: event.target.value});
    }

  render () {

    return (
        <div>
            <select className="diff-select" onChange={this.handleChange}>
                {this.state.diffMethods.map(function (val) {
                    return <option value = {val}>{val}</option>
                })}</select>
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
                              Diffing Method:
                          {this.exportQueryParams(history.location.search, match.params)}
                    </div>
                    }
                    />
                </switch>
            </Router>
        </div>
    );
  }

  exportParams(path){

      if (/[0-9]{14}\/[0-9]{14}\/.+/.test(path)) {

          let site = path.substring(36);
          let urlA = 'https://web.archive.org/web/' + path.substring(6,20) + '/' + site;
          let urlB = 'https://web.archive.org/web/' + path.substring(21,35) + '/' + site;

          return <DiffView page = {{url: site}}
                           diffType={this.state.selectedMethod} a={urlA} b={urlB} />
      }
  }

  exportQueryParams(query, matchP){
        query = query.substring(1);
        var qParams=qs.parse(query);
        return <DiffView page = {{url: qParams["url"]}} diffType={matchP.diffType} a={qParams["a"]} b={qParams["b"]} />
  }
}