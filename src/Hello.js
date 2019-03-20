import React, {Component} from 'react';
import Button from 'antd/lib/button';
import { Layout, Row, Col, Card } from 'antd';
import { Link, Router, NavLink } from 'react-router-dom';

const {
    Header, Content,
  } = Layout;

export default class Hello extends Component{
    render(){
        return (
            <Layout className="layout">
                <Header>
                    <div className="logo">知行</div>
                </Header>
                <Content style={{
                    background: '#fff', padding: 24, margin: 0, minHeight: 800,
                }}>
                    <Card 
                        style={{ width: 800, height:300}}
                        title="区域推荐模式"
                    >
                        <p>description1</p>
                        <Button type="primary"><Link to="/resident">进入</Link></Button>
                    </Card>
                    <br></br>
                    <Card 
                        style={{ width: 800, height:300}}
                        title="城市概览模式"
                    >
                        <p>description2</p>
                        <Button type="primary"><Link to="/overview">进入</Link></Button>
                    </Card>
                </Content>
            </Layout>
            
        )
    }
}