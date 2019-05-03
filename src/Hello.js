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
                        title="地点推荐模式"
                    >
                        <ul>
                            <li>基于地理语义知识图谱的地点推荐</li>
                            <li>支持公共汽车/地铁交通方式选择</li>
                            <li>支持行程耗费时间限制</li>
                            <li>可以方便地查看一个地点关于所需主题的信息</li>
                        </ul>
                        <br></br>
                        <Button type="primary"><Link to="/recommend">进入</Link></Button>
                    </Card>
                    <br></br>
                    <Card 
                        style={{ width: 800, height:300}}
                        title="地点概览模式"
                    >
                        <ul>
                            <li>便于城市管理者查看特定地点的地理语义</li>
                            <li>支持查看两个地点关系或查看一个地点的相邻地点</li>
                            <li>可以方便地查看一个地点全部主题显著度/好评度</li>
                        </ul>
                        <br></br>
                        <Button type="primary"><Link to="/overview">进入</Link></Button>
                    </Card>
                </Content>
            </Layout>
            
        )
    }
}