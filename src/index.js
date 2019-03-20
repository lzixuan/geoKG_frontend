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

const {
    Header, Content,
  } = Layout;

/*export default class entry extends Component{
    render(){
        return (
            <Layout className="layout">
                <Header>
                    <div className="logo">知行</div>
                </Header>
                <Content style={{
                    background: '#fff', padding: 24, margin: 0, minHeight: 800,
                }}>
                    <Row>
                        <Router>
                            <div>
                                <Route exact path="/" component={Hello} />  
                                <Route exact path="/resident" component={App} />                                                                                                                                                                                                                                                                                                                                                                                                                                  
                            </div>
                        </Router>
                        
                    </Row>
                </Content>
            </Layout>
            
        )
    }
}*/

ReactDOM.render((
    <Router>
        <div>
            <Route exact path="/" component={Hello} />  
            <Route exact path="/resident" component={App} />
            <Route exact path="/overview" component={Overview} />                                                                                                                                                                                                                                                                                                                                                                                                                                 
        </div>
    </Router>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();