import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
}from 'react-router-dom';
import './index.css';
import Button from 'antd/lib/button';
import { Layout, Row, Col } from 'antd';
import App from './App';
import Hello from './Hello';
import Overview from './Overview';
import * as serviceWorker from './serviceWorker';

ReactDOM.render((
    <Router>
        <div>
            <Route exact path="/" component={Hello} />  
            <Route exact path="/recommend" component={App} />
            <Route exact path="/overview" component={Overview} />                                                                                                                                                                                                                                                                                                                                                                                                                                 
        </div>
    </Router>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();