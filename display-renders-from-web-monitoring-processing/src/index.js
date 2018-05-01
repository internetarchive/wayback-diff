import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DiffView from './components/diff-view';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<DiffView />, document.getElementById('root'));
registerServiceWorker();
