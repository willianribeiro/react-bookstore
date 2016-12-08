import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './App';
import AuthorBox from './Author';
import Home from './Home';
import './index.css';

ReactDOM.render(
  (<Router history={ browserHistory }>
    <Route path="/" component={ App }>
      <IndexRoute component={ Home } />
      <Route path="/autor" component={ AuthorBox }/>
      <Route path="/livro" />
    </Route>
  </Router>),
  document.getElementById('root')
);
