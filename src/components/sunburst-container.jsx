import React from 'react';
import {getRandomInt} from '../js/utils';
import D3Sunburst from './d3-sunburst';
var sjs = require('simhash-js');

/**
 * Container of d3 Sunburst diagram
 *
 * @class SunburstContainer
 * @extends {React.Component}
 */

export default class SunburstContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      simhashData: null
    };
  }

  render () {
    if (this.state.simhashData) {
      return <D3Sunburst simhashData={this.state.simhashData}/>;
    }
    const Loader = () => this.props.loader;
    return (<div>
      {this._fetchTimestampSimhashData()}
      <Loader/>
    </div>
    );
  }

  _fetchTimestampSimhashData () {
    const url = `${this.props.wdd}/simhash?url=${this.props.site}&timestamp=${this.props.timestamp}`;

    fetch(url)
      .then(response => response.json())
      .then((jsonResponse) => {
        var json = this._decodeJson(jsonResponse);
        this._fetchSimhashData(json);
      });
  }

  _fetchSimhashData (timestamp) {
    const url = `${this.props.wdd}/simhash?url=${this.props.site}&year=${this.props.year}`;

    fetch(url)
      .then(response => response.json())
      .then((jsonResponse) => {
        var json = this._decodeJson(jsonResponse);
        let data = this._calcDistance(json, timestamp);
        this._createLevels(data, timestamp);
      });
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
    if(json.length) {
      for (var i = 0; i < json.length; i++) {
        json[i][1] = json[i][1].toString().replace(/=/, '');
        json[i][1] = base64.decode(json[i][1]);
      }
      return json;
    }

    json.simhash = json.simhash.toString().replace(/=/, '');
    json.simhash = base64.decode(json.simhash);

    return [this.props.timestamp, json.simhash];
  }

  _calcDistance(json, timestamp){
    this._minDistance = sjs.Comparator.hammingDistance(timestamp[0][1], json[0][1]);
    for (var i = 0; i<json.length; i++){
      json[i][1] = sjs.Comparator.hammingDistance(timestamp[0][1], json[i][1]);
      if (this._minDistance > json[i][1]) {
        this._minDistance = json[i][1];
      }
    }
    return json;
  }

  _createLevels(json, timestamp) {
    var firstLevel = [];
    var secondLevel = [];
    var thirdLevel = [];
    var fourthLevel = [];
    var fifthLevel = [];

    const colors = ['#D5B01A', '#ABD5AA', '#5162ED', '#391A60', '#BC9D24', '#EF9A0B', '#5B7211', '#D63381', '#1BB261', '#31DCF0', '#0EFA8F', '#5EBC0C', '#EE211B', '#336E6D', '#09ED5D', '#E6BD04', '#D62833', '#411733', '#26694C', '#64642B', '#102DE3', '#1CA35D', '#6AE811', '#B481DD', '#E31484', '#0A5374', '#6800C6', '#E30CB2', '#E76784', '#4786C0', '#BCA0F2', '#46A567', '#B4AC16', '#E0D586', '#9CE13A', '#1E6CE6', '#E3C983', '#148C0A', '#2FB044', '#6D04F3', '#F115E0', '#CC396C', '#D70631', '#060C64', '#0D2121', '#513771', '#83EBD4', '#8AC900', '#A16AED', '#FFA10D', '#36E6D5', '#859616', '#AA1732', '#7D4E82', '#B826A3', '#3E9147', '#7DD13E', '#7D995C', '#BCA0A3', '#26B5C5', '#803128', '#9956A8', '#526ECB', '#A78573', '#8A93F5', '#986CA8', '#531B9C', '#3EFACB', '#673FCB', '#246B86', '#11E7E8', '#F4B1F5', '#D34CE1', '#848B35', '#659C12', '#3241A3', '#A975A6', '#B8AF58', '#0DD981', '#EF78C8', '#AFBE15', '#1BE919', '#0C2AB7', '#3C405D', '#13D8B9', '#169C4A', '#2651F6', '#AF3CAF', '#4DB8E1', '#604390', '#CA667B', '#0926A1', '#D5102C', '#069BF8', '#D58181', '#25C9B3', '#4CD738', '#90DA10', '#7160D6', '#9AB1C3', '#3F8F84', '#2D0043', '#8D4586', '#6F8D06', '#391EBD', '#1EDAD5', '#E03F07', '#3858EE', '#E4D71E', '#D58E33', '#C5190E', '#EFF2EF', '#A28FA7', '#D8CBFE', '#AD32B6', '#57B60B', '#5FA519', '#4BBDB5', '#49E04E', '#EEB106', '#86E4DE', '#F2EA80', '#4CBFA7', '#5E03F4', '#2E3D04', '#48A2C7', '#1CAF72', '#FBFBA9', '#2F8238', '#766A36', '#E8F8AC', '#0C8ACF', '#CBAC75', '#595EC8', '#63ECD2', '#3CA355', '#F528FE', '#7C9281', '#7EADC6', '#52A4F8', '#734269', '#85EADE', '#85A272', '#3F0DCD', '#42FF7F', '#7F2B18', '#59E34B', '#2C1CE9', '#F190F5', '#D48C30', '#CAFE61', '#6BB4FF', '#01B1E9', '#BDB4DA', '#ABE281', '#34C322', '#48EFDE', '#EDF9FE', '#3ABEE9', '#9847BC', '#9E0512', '#76B658', '#4464D5', '#21FD0E', '#796B02', '#8918F3', '#B796DE', '#E13450', '#A72952', '#7CBE8C', '#006195', '#44CEAA', '#D9B0E1', '#18932F', '#6AC294', '#E954BE', '#A027FD', '#1C7DC5', '#EDE711', '#77B394', '#78EDDA', '#B7BEFA', '#B063D2', '#9C0742', '#8B94E3', '#86C739', '#2E1DD0', '#791DCE', '#05B1DF', '#35AD99', '#12FDA2', '#6C189E', '#8179F4', '#809316', '#25CD36', '#649513', '#78090A', '#79BF2A', '#3AADEC', '#4020D5', '#64909B', '#4134A4', '#E2D920', '#46BF39', '#C8AE88', '#3FCDF5', '#836C81', '#064D06', '#D5C840', '#218CF1', '#4210F1', '#684D4D', '#E43224', '#90A69F', '#6B0F7F', '#1C22D1', '#33980E', '#6E2A15', '#EA580E', '#87A872', '#78E9BB', '#BFF58F', '#3EE68F', '#B7A00B', '#F82A0A', '#C82B1E', '#7DD636', '#5644CD', '#384D94', '#99DB3D', '#5F58B7', '#725598', '#BFFF3C', '#C7415D', '#6E639A', '#0FA685', '#EF8441', '#C01B04', '#7DCCE1', '#A4F179', '#B895F1', '#BD1316', '#5E67A6', '#C138E2', '#98689E', '#246BA5', '#C53D95', '#4F4A6E', '#1204AE', '#646DD0', '#BF52AF', '#865C4F', '#18E635', '#447492', '#306AD3', '#A82FBD', '#F335F8', '#411374', '#8C8012', '#2429EF', '#D98094', '#D971E6', '#938A6F', '#FFC8FD', '#A21DC0', '#DAA5B4', '#98D1AC', '#84F0F6', '#0E5C64', '#917BE3', '#CBD618', '#BB18CC', '#45045F', '#A5DF14', '#4A6B64', '#F20D91', '#64D7D9', '#41E454', '#3091FB', '#646C0C', '#10F1D9', '#33D0BA', '#AFC941', '#D72792', '#2069C7', '#5E75F4', '#E28B24', '#6D3267', '#43F6B9', '#9D9F76', '#6C4D23', '#206BC9', '#F3626C', '#AB092B', '#3B9CA0', '#21D6FF', '#A101CD', '#AB01E6', '#E91E23', '#A6E429', '#55A2C9', '#27B388', '#034043', '#62C80F', '#BB5AF8', '#35ED7A', '#7A13DA', '#CDD1E1', '#4531D4', '#090630', '#F65D4D', '#7C79F5', '#4C31D2', '#327634', '#B4EBA1', '#B9806C', '#DE9589', '#BC5ED3', '#005879', '#C3DAE8', '#CA24B9', '#197AE0', '#3AC99A', '#CAB223', '#BF68A4', '#16F3BA', '#CC3472', '#4AC145', '#C0F722', '#AE106B', '#5824BD', '#E8A2D1', '#42C030', '#6F1674', '#812929', '#5818CD', '#6B50D2', '#215F28', '#0882FF', '#671814', '#27C3F9', '#054662', '#994E86', '#78FFAE', '#F161A7', '#6CF30E', '#C1417A', '#4148FC', '#E75E7F', '#C7138B', '#AF7927', '#8F8D10', '#852CD2', '#8B9D90', '#D67E90', '#A401E2', '#972243', '#3C8585', '#7110FB', '#1D29CB', '#960A7F', '#C16F3A', '#267BB0', '#032241', '#D5FFEB', '#B81C39', '#B0A2FD', '#D144D0', '#5D4708', '#9DD8DC', '#395469', '#E19838', '#60AB57', '#BA5F25', '#8B2640', '#37A9C0', '#2A2B35', '#396D4C', '#506A09', '#F852E9', '#311DBE', '#ED908C', '#6B6C9B', '#8ECF9C', '#985EB4', '#8E69B1', '#79E096', '#D024CB', '#F5AB53', '#8FCED7', '#2559F1', '#A6B875', '#F55192', '#D9784D', '#CDC8BA', '#FE057F', '#6161AE', '#6A3BCC', '#D9652A', '#3E8073', '#A71BC8', '#A3A044', '#EBE26A', '#F445A7', '#0D68DD', '#C84D31', '#6D40E8', '#5D44FA', '#FFF349', '#B461C4', '#F8C460', '#5DD9DC', '#23A679', '#1681AD', '#A5117E', '#5672AE', '#20B099', '#DCC734', '#05A965', '#61B832', '#689EB3', '#CE47ED', '#0BAD3E', '#143CDA', '#14BCDE', '#F37823', '#CE1060', '#E7C95F', '#763B21', '#546003', '#F07789', '#A58C6F', '#D469EB', '#952C04', '#E59469', '#76AEE2', '#89805E', '#F236C1', '#257417', '#90D244', '#CCA6A9', '#922237', '#03A3A6', '#5CCC1E', '#4BE1D2', '#6AE019', '#ABCCD0', '#4D3F1D', '#57A23B', '#086E94', '#0FFF00', '#9AC579', '#5B69A8', '#70F123', '#D2B315', '#825716', '#8B1408', '#D634FE', '#D6FD81', '#154C95', '#218799', '#E14F65', '#74CB9B', '#A6294A', '#B50029', '#64AEC3', '#8A5D9C', '#210EC9', '#A60DF4', '#7BA8BC', '#111CFD', '#078541', '#27226F', '#C05DD5', '#251CDC', '#8FD9BD', '#7B4F19', '#130366', '#336804', '#E2A0E7', '#C77A12', '#79DB8F', '#4935D9', '#B0C29D', '#78F18E', '#9460E7', '#360129', '#0723C0', '#D809B9', '#72264A', '#5DFBEE', '#314426', '#E3D16A', '#1321DE', '#B40EB5', '#8138D1', '#603B55', '#138F5F', '#A63C81', '#A46B21', '#1B3430', '#6A1956', '#F7A87F', '#816BDE', '#C83245', '#4617A4', '#71E9A4', '#0ABA32', '#AB3171', '#F4A37F', '#8C5A4F', '#EC1D5C', '#156D0A', '#0B63CD', '#5C2FF9', '#F8642A', '#4065EB', '#1008E1', '#2EC828', '#674874', '#26C8BE', '#2FF95D', '#47E5FC', '#62A3AC', '#B1409C', '#4C304E', '#F7EE03', '#C5ABBA', '#71C247', '#F08412', '#05E363', '#25A03B', '#401FBC', '#93D652', '#E53694', '#99A7D0', '#BF5609', '#24A345', '#FE9D4E', '#02339D', '#8262A4', '#2538C3', '#2E8D1C', '#30ACDF', '#BE2F1B', '#CAE3C8', '#7FEB8A', '#FB888A', '#4CBF88', '#F37139', '#CF3A20', '#3A0268', '#C545DD', '#029B22', '#415B28', '#4F87AB', '#7D57FB', '#0C142F', '#221BD4', '#D153C8', '#C07482', '#F00570', '#18D2DF', '#1F13AF', '#780DCD', '#58EDC6', '#0C702E', '#037D64', '#D73FBE', '#E37F03', '#D6BB38', '#235947', '#84BF21', '#4F98F4', '#7D7EC8', '#29ED52', '#676C1A', '#3AFFA1', '#0E1960', '#DDE5CB', '#DE5CCA', '#E324F3', '#E3EE28', '#0261BD', '#29B1F7', '#CD5192', '#B85EC4', '#2B809A', '#8ADFB9', '#CE27F2', '#EBF4D8', '#690B7D', '#099893', '#32D019', '#9D8C57', '#F33E80', '#7E98A1', '#5BAF34', '#376078', '#A162EB', '#9DFDC7', '#E368B1', '#91C30F', '#837F4F', '#7E0E0F', '#9AD889', '#06C6E8', '#7893CA', '#34EA42', '#AC1AA2', '#A3D7C5', '#1CCE3B', '#6A30E0', '#A249D9', '#C75D2F', '#0C2D4F', '#36B04E', '#BB9FB8', '#F6A4F7', '#EBF391', '#29E573', '#4A9FBE', '#E79865', '#06BABB', '#2971D0', '#3FA241', '#69CF97', '#E7E8F5', '#DFC9A7', '#5D1CEE', '#C2E653', '#8BC4B5', '#C9DA2D', '#0FDC98', '#4E55A4', '#4762EC', '#6672B2', '#87C62E', '#42E1E7', '#A26F81', '#3D9A07', '#66EE9A', '#012D84', '#BC7AE5', '#288871', '#AAE35F', '#BB59AE', '#4A0688', '#A441E2', '#70A092', '#23D172', '#02E5C8', '#40346B', '#C1F13E', '#4BFFB8', '#1ECEF4', '#106F53', '#8A4BEA', '#7BC7DF', '#61A506', '#D25A14', '#E2452A', '#8A4C63', '#7EE46B', '#4CDF1E', '#5F0BA1', '#F844E7', '#F62438', '#7B76FD', '#23AF2B', '#E8BE35', '#03E58C', '#C83EC7', '#742FA2', '#CD67D8', '#2B1EA5', '#4B9302', '#0DA3B7', '#A3BD26', '#0F3660', '#F9C186', '#6C10F2', '#2FFD3B', '#4EF0C1', '#6C1A28', '#B2273A', '#EA70A7', '#2D71BA', '#DF9C05', '#E62F05', '#8C7A3A', '#424C2F', '#34DA68', '#537EF8', '#4DE6DF', '#C5B3FF', '#E42304', '#238FEF', '#732F22', '#87F6DD', '#6A22D2', '#2C64F7', '#82B119', '#09D39F', '#516484', '#1FE41C', '#648D87', '#40A02B', '#93566F', '#6B1D0A', '#22916B', '#EDF6B7', '#EF88FA', '#49DA04', '#A7FB4F', '#572F88', '#A669D1', '#0B1941', '#39A13B', '#5D2596', '#4FE7E6', '#F8D61A', '#7269BB', '#AF4508', '#0662BF', '#90E77C', '#E75BE6', '#568CF3', '#793BE3', '#4EAA16', '#9A782E', '#506AB5', '#10B9CA', '#D430F2', '#431FE2', '#58CC0E', '#B6E20A', '#71B2B8', '#C9C0AC', '#2F03EE', '#646206', '#1CD0ED', '#A5F58B', '#D45A5F', '#68F6CD', '#421A52', '#16EE7C', '#C22C8A', '#85FD05', '#D6DCC9', '#A1CCC1', '#FD8DC0', '#A92D6A', '#7E07C0', '#CA6A73', '#4140E1', '#2DFAAB', '#A55D2C', '#7AA717', '#8E1E98', '#2DA7E8', '#8057B0', '#366938', '#5B2024', '#7B399C', '#1CAC48', '#4C9A45', '#B8B12F', '#97AC8D', '#008392', '#0BFA73', '#2C0C65', '#12ED30', '#DD7890', '#6A0FE9', '#1E518C', '#4B957F', '#B91975', '#9421CC', '#127115', '#B3305B', '#D976FF', '#6A883F', '#ED41E0', '#DF3415', '#AD8DEE', '#9C7037', '#F92826', '#803C11', '#CF1043', '#5E0ECF', '#C5B46E', '#C68EFA', '#47B83C', '#A0CC01', '#F6005C', '#F22A68', '#93F11E', '#B666F9', '#39A05B', '#251257', '#F591F0', '#A939A5', '#85BECA', '#803209', '#D2EF54', '#749058', '#0013AC', '#82241E', '#FAF3CF', '#CA2BA8', '#F1C812', '#12226C', '#FFF131', '#F2BF58', '#F221DD', '#ACE640', '#952B89', '#87889B', '#A9E684', '#E77194', '#E31DA5', '#E3B1F4', '#A8C205', '#EBED16', '#1FE817', '#DFAED4', '#4B70C6', '#46E19F', '#67A54B', '#C6BAEC', '#1BCBA9', '#0E47E1', '#E37C41', '#CA870D', '#3C3E61', '#B8D737', '#1366B4', '#798F6C', '#0369A7', '#6D39CA', '#B729F6', '#11A775', '#CFF4E5', '#0F8793', '#EF029D', '#C45FD4', '#5E5F6D', '#43C37B', '#98B204', '#5F362C', '#3F18EF', '#D3D334', '#087DCF', '#967488', '#9E8D4A', '#989B17', '#AEB82F', '#C37403', '#3A9BE2', '#370C45', '#6EDFAF', '#64D2C0', '#1938D4', '#C1E6CD', '#9059CA', '#F29C23', '#B879B4', '#ACDD5B', '#22C098', '#E293C5', '#DB868A', '#9431EE', '#58B261', '#E83A9C', '#27FCAB', '#187AEF', '#483892', '#7EA210', '#3087A1', '#3D9293', '#EBB55A', '#4A283C', '#AAB5CD', '#50DE77', '#0B49DE', '#CC981F', '#26A5FD', '#1A7CF4', '#94463C', '#E372C5', '#082A13', '#93A399', '#0A3872', '#C1717A', '#E5E68A', '#B93D34', '#1D8B11', '#42C8A3', '#B7438C', '#E62CCB', '#684968', '#D86537', '#78A314', '#7CBCF4', '#9EBBA8', '#701CA7', '#57FBD3', '#34BD8D', '#109DC9', '#257D12', '#59275C', '#FA4E52', '#297E6F', '#B8F55C', '#E72653', '#8BCB22', '#81CD02', '#F2B611', '#6C961F', '#20747C', '#8084BB', '#64C31D', '#500071', '#1DEB40', '#B602A8', '#F28874', '#3E8029', '#D7AE72', '#F90E54', '#E0AF35', '#7380B0', '#4EFDF1', '#7C81B0', '#4AA490', '#871374', '#8F81F3', '#142011', '#18EAA9', '#BE452E', '#6B57ED', '#B7C38C', '#790AA2', '#BBAA65', '#413976', '#7D1D40', '#A0764F', '#3C9363', '#62F1C6', '#617AAF', '#01C2E1', '#381AF6', '#A22368', '#7CA7D7', '#D485E3', '#4F4022', '#25B3FA', '#AADCE3', '#5500DE', '#7A20F1', '#340743', '#A786B8', '#052E10', '#276274', '#1EE3FE', '#4225A7', '#85E1B9', '#9CECA0', '#DC83FF', '#80E64D', '#4907FB', '#E70C9C', '#6285E3', '#6B0EFF', '#D70BE5', '#93FAAE', '#59666F', '#2C1A20', '#D8CE6C', '#D43E02', '#495330', '#1998FF', '#71C9CE', '#9A768D', '#262552', '#89CDC0', '#DE9768', '#7EA477', '#21197A', '#7909F6', '#C7F85B', '#83A1A0', '#A2E566', '#C97E2E', '#8A8947', '#F0FF84', '#A08523', '#5C542B', '#AE51C8', '#0529F7', '#1F70E0', '#580DE3', '#130682', '#22174E', '#F532E3', '#9F20F0', '#159237', '#54A6A2', '#8D595A', '#74FB7D', '#E0D01D', '#022945', '#1AAB05', '#E82427', '#EACE64', '#B44956', '#66980D', '#E189C8', '#EB1003', '#8EE5C4', '#989E2E', '#484E14', '#B05492', '#C7ED8E', '#11D06A', '#403DE5', '#C3D01E', '#5DFB18', '#DE0CC8', '#AD98D0', '#22050F', '#BC28D4', '#7216D3', '#EB1E8D', '#72B1B9', '#1DB23B', '#1E8475', '#8E7A55', '#D40F38', '#DAB8B7', '#1D5D09', '#91716F', '#6FED93', '#27837B', '#C458C1', '#FEF4BF', '#D51567', '#5C63A0', '#7D7F1E', '#AD3060', '#26E1BA', '#09F1E6', '#942F7C', '#0FA7EB', '#699A9F', '#AC59D0', '#3EA309', '#99DC95', '#994313', '#E8C726', '#7C2D50', '#E9E8DE', '#178E31', '#3DA80C', '#BF4866', '#EE31B9', '#192010', '#E2761B', '#8583D8', '#F9731E', '#A0CE27', '#731A32', '#A25186', '#D1B549', '#D32574', '#3150F7', '#87A91E', '#CC01E9', '#7BA30E', '#DD1038', '#47A97A', '#101B93', '#A5FA6D', '#4E8E28', '#DF6EFA', '#7412E8', '#CF9EB2', '#15810F', '#E4E720', '#FF06E0', '#065193', '#A5334E', '#664E74', '#E59CCC', '#CCCD3B', '#E4136A', '#710A44', '#9BBEA2', '#288C45', '#8124F5', '#FDA100', '#C71C26', '#1B1C9C', '#FC4788', '#C1AE69', '#466E76', '#E3E000', '#61C8E5', '#4D295B', '#21CC02', '#549C30', '#214124', '#196E25', '#362607', '#129EE9', '#04EA01', '#A33F45', '#36FA51', '#F881F8', '#90A3E9', '#CFEB9E', '#C42037', '#66E503', '#6FBE1B', '#7BB1E9', '#BB9962', '#837A3A', '#1A1FF1', '#361E43', '#ABE5DD', '#F9882F', '#BB2266', '#D70E70', '#0A619B', '#537495', '#18EA11', '#9DCCF2', '#3CA4B2', '#4BDBD7', '#72BE74', '#38D22F', '#3CC08C', '#3C9D04', '#04FD0D', '#57F066', '#5AF3C2', '#20FE08', '#B44414', '#929909', '#651667', '#CC2CFF', '#F1FE00', '#6C4A06', '#EA9739', '#19F2F5', '#AC2C91', '#C83B64', '#CC0160', '#75A0DE', '#AE7917', '#FC419D', '#35561B', '#AD8AEE', '#B64671', '#510CB2', '#4BE8D7', '#51DA7E', '#62BEDA', '#D90108', '#35A425', '#6715FF', '#D50AF8', '#86A448', '#E22F32', '#7781CA', '#721981', '#8568F6', '#08CBC1', '#4A36A7', '#91E13A', '#CADE45', '#FCA65A', '#C5291E', '#A59DC3', '#455368', '#E33B17', '#014B79', '#54F8D0', '#686052', '#4A7ADE', '#2B1673', '#E8433B', '#C90B1D', '#C8539B', '#6D6D73', '#CAFE17', '#1FF523', '#1FC1BE', '#F865BF', '#11D7F4', '#BCFBA0', '#2B0113', '#43315F', '#F576A3', '#6C4334', '#8F08AB', '#9C79E9', '#D3C141', '#0467A1', '#A0EF42', '#4C154C', '#0D9877', '#15BE70', '#0747FF', '#8A07A4', '#9E1A36', '#7440DC', '#7E13C9', '#3C074F', '#7DA744', '#CD2E86', '#4FB8F8', '#5767A3', '#0D0054', '#0C1A46', '#F031EC', '#83B3CB', '#B1328E', '#68C791', '#CAEE42', '#443861', '#4E5021', '#BE2E1A', '#D739FC', '#AB699B', '#BDFF55', '#194696', '#754945', '#41D7AC', '#457AE0', '#6AE593', '#BADF07', '#58C911', '#F63CDD', '#8230C1', '#02CE85', '#230F21', '#78942B', '#5118EF', '#67197E'];

    for (var i = 0; i<json.length; i++){
      if(json[i][1] <= this._minDistance) {
        firstLevel.push({name:json[i][0], bigness:json[i][1], clr: colors[getRandomInt(1250)], children : []});
      } else if (json[i][1] <= this._minDistance + 2){
        secondLevel.push({name:json[i][0], bigness:json[i][1], clr: colors[getRandomInt(1250)], children : []});
      } else if (json[i][1] <= this._minDistance + 4){
        thirdLevel.push({name:json[i][0], bigness:json[i][1], clr: colors[getRandomInt(1250)], children : []});
      } else if (json[i][1] <= this._minDistance + 6){
        fourthLevel.push({name:json[i][0], bigness:json[i][1], clr: colors[getRandomInt(1250)], children : []});
      } else {
        fifthLevel.push({name:json[i][0], bigness:json[i][1], clr: colors[getRandomInt(1250)], children : []});
      }
    }

    for (i = 0; i<fifthLevel.length; i++) {
      let mod = i % fourthLevel.length;
      fourthLevel[mod].children.push(fifthLevel[i]);
    }
    for (i = 0; i<fourthLevel.length; i++) {
      let mod = i%thirdLevel.length;
      thirdLevel[mod].children.push(fourthLevel[i]);
    }
    for (i = 0; i<thirdLevel.length; i++) {
      let mod = i%secondLevel.length;
      secondLevel[mod].children.push(thirdLevel[i]);
    }
    for (i = 0; i<secondLevel.length; i++) {
      let mod = i%firstLevel.length;
      firstLevel[mod].children.push(secondLevel[i]);
    }

    var data = {'name':timestamp[0][0], 'children':firstLevel};
    this.setState({'simhashData': data});
  }

}
