import React from 'react';
import {Sunburst} from 'react-vis';
var sjs = require('simhash-js');


/**
 * Display a d3 Sunburst diagram
 *
 * @class D3Sunburst
 * @extends {React.Component}
 */
export default class D3Sunburst extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      simhashData: ''
    };
  }

  render () {
    // if (this.state.simhashData) {
    return (
      <Sunburst
        hideRootNode
        colorType="literal"
        data={this._getMockData()}
        height={300}
        width={350}/>
    );
    // }
    // const Loader = () => this.props.loader;
    // return (<div>
    //   {this._getMockData()}
    //   <Loader/>
    // </div>
    // );
  }

  _fetchSimhashData () {
    let test = require('./d3/testsmall');
    var json = this._decodeJson(test);

    var timestamp = [['20171027121206','31392249196406395000']];

    let data = this._calcDistance(json, timestamp);
    console.log(data);
    this._createLevels(json, timestamp);
  }


  _decodeJson(json){
    var Base64 = (function () {

      var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

      var Base64 = function () {};

      var _decode = function (value) {

        var result = 0;
        for (var i = 0, len = value.length; i < len; i++) {
          result *= 64;
          result += ALPHA.indexOf(value[i]);
        }

        return result;
      };

      Base64.prototype = {
        constructor: Base64,
        decode: _decode
      };

      return Base64;

    })();
    let base64 = new Base64();
    for(var i=0; i<json.length; i++) {
      json[i][1] = json[i][1].replace(/=/, '');
      json[i][1] = base64.decode(json[i][1]);
    }
    return json;
  }

  _calcDistance(json, timestamp){

    for (var i = 0; i<json.length; i++){
      json[i][1] = sjs.Comparator.similarity(timestamp[0][1], json[i][1]);
    }
    return json;
  }

  _createLevels(json, timestamp) {
    var data = [{'title':timestamp[0][0], 'children':{}}];
    var firstLevel = [];
    var secondLevel = [];
    var thirdLevel = [];
    var fourthLevel = [];
    var fifthLevel = [];

    for (var i = 0; i<json.length; i++){
      if(json[i][1] == 0) {
        firstLevel.push({'title':json[i][0], 'size':json[i][1]});
      } else if (json[i][1] == 0.2){
        secondLevel.push({'title':json[i][0], 'size':json[i][1]});
      } else if (json[i][1] == 0.25){
        thirdLevel.push({'title':json[i][0], 'size':json[i][1]});
      } else if (json[i][1] == 0.5){
        fourthLevel.push({'title':json[i][0], 'size':json[i][1]});
      } else {
        fifthLevel.push({'title':json[i][0], 'size':json[i][1]});
      }
    }

    console.log(firstLevel);

    var newfirstLevel = [];
    var newsecondLevel = [];
    var newthirdLevel = [];
    var newfourthLevel = [];
    var newfifthLevel = [];

    if (fifthLevel.length > fourthLevel.length) {
      let count = Math.floor(fifthLevel / fourthLevel);
      for (i = 0; i<fourthLevel.length; i++) {
        for (var j = i; j < i+count; j++) {
          newfourthLevel[i].push();
        }
      }

    }

  }

  _getMockData () {
    let data = {
      'children': [
        [{
          'title': '20170817013828',
          'size': 0,
          'children': [{
            'title': '20171008025436',
            'size': 0.2,
            'children': [{
              'title': '20170602224808',
              'size': 0.25,
              'children': [{
                'title': '20170918073734',
                'size': 0.5
              },
              {
                'title': '20170302134800',
                'size': 0.5
              }
              ]
            }]
          },
          {
            'title': '20170202102225',
            'size': 0.25,
            'children': [{
              'title': '20170419011844',
              'size': 0.5
            },
            {
              'title': '20170917122814',
              'size': 0.5
            }
            ]
          },
          {
            'title': '20171010050636',
            'size': 0.25,
            'children': [{
              'title': '20170901063352',
              'size': 0.5
            },
            {
              'title': '20171206111518',
              'size': 0.5
            }
            ]
          },
          {
            'title': '20170622130627',
            'size': 0.25,
            'children': {
              'title': '20170509073214',
              'size': 0.5
            }

          }, {
            'title': '20170317165456',
            'size': 0.25,
            'children': {
              'title': '20170916130658',
              'size': 0.5
            }
          },
          {
            'title': '20170104150847',
            'size': 0.25,
            'children': {
              'title': '20170916130658',
              'size': 0.5
            }
          },
          {
            'title': '20170513055819',
            'size': 0.25,
            'children': {
              'title': '20171024231430',
              'size': 0.5
            }
          },
          {
            'title': '20170709005534',
            'size': 0.25,
            'children': {
              'title': '20170502093516',
              'size': 0.5
            }
          }
          ]
        },
        {
          'title': '20170212011333',
          'size': 0,
          'children': [{
            'title': '20170416102735',
            'size': 0.2,
            'children': [{
              'title': '20170112053927',
              'size': 0.25
            },
            {
              'title': '20170628124309',
              'size': 0.25
            },
            {
              'title': '20170215003108',
              'size': 0.25
            },
            {
              'title': '20170517031440',
              'size': 0.25
            },
            {
              'title': '20171113025031',
              'size': 0.25
            },
            {
              'title': '20170712000741',
              'size': 0.25
            },
            {
              'title': '20170909100648',
              'size': 0.25
            }
            ]
          }]
        },
        {
          'title': '20170119095244',
          'size': 0,
          'children': ''
        },
        {
          'title': '20170218042602',
          'size': 0,
          'children': ''
        },
        {
          'title': '20170510095030',
          'size': 0,
          'children': ''
        },
        {
          'title': '20170117223644',
          'size': 0,
          'children': ''
        },
        {
          'title': '20170913132238',
          'size': 0,
          'children': ''
        },
        {
          'title': '20171128095312',
          'size': 0,
          'children': ''
        }
        ]
      ]};
    // this.setState({simhashData: data});
    return data;
  }
}