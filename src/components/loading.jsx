import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

library.add(faSpinner);


export default class Loading extends React.Component {
  render () {
    return (
      <div className="loading">
        <FontAwesomeIcon icon="spinner" size="3x" pulse/>
      </div>
    );
  }
}
