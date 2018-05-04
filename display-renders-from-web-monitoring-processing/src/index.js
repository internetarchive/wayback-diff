import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DiffContainer from './components/diff-container';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<DiffContainer />, document.getElementById('root'));
registerServiceWorker();
