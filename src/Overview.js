import React, { Component } from 'react';
import Button from 'antd/lib/button';
import './overview.css';
import { Layout, Menu, Card, Divider, Radio, Slider, Select, Cascader, Table, Row, Col, Form } from 'antd';
import * as d3 from 'd3';
import BMap from 'BMap';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import cascaderData from './cascaderData'

const {
    Header, Sider, Content,
  } = Layout;

var places = [];

var means;
function onMeansChange(e) {
    //console.log(`radio checked:${e.target.value}`);
    means = e.target.value;
}

export default class Overview extends Component{
    //load the json data
    componentWillMount(){
        const qus = Object.keys(cascaderData);
        for (let i in qus){
        const key = qus[i];
        const placeList = [];
        if (cascaderData[key].length > 0){
            for (let j in cascaderData[key]){
            const obj = {
                'value':cascaderData[key][j],
                'label':cascaderData[key][j]
            }
            placeList.push(obj);
            }
        }
        const obj = {
            'value':key,
            'label':key,
            'children':placeList
        }
        places.push(obj);
        }
    }

    render(){
        return(
            <Layout>
                <Header className="header">
                    <div className="logo">城市概览</div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item><Link to="/">回到主页</Link></Menu.Item>
                    </Menu>
                </Header>
                <Layout>
                <Sider width={350} height={800} style={{ background: '#fff' }}>
                    <Card style={{ width: 350, height:800}}>
                        <Divider>公共交通邻居</Divider>
                        <div id="ViewNeighbours">
                            <span>
                                所在地点：
                                <Cascader 
                                    options={places} 
                                    onChange={this.onPlaceChange}
                                    placeholder="请选择"
                                >
                                </Cascader>
                            </span>
                        </div>
                        <br></br>
                        <div>
                            交通方式：
                            <Radio.Group defaultValue="a" buttonStyle="solid" onChange={onMeansChange}>
                            <Radio.Button value="a">公共汽车</Radio.Button>
                            <Radio.Button value="b">地铁</Radio.Button>
                            <Radio.Button value='c'>不限</Radio.Button>
                            </Radio.Group> 
                        </div>
                        <br></br>
                        <Button type="primary" icon="search">查看公交直达区域</Button>
                        <br></br>
                        <Divider>公共交通路径</Divider>
                        <Form>
                            <Form.Item>
                                两地选择：
                                <Row>
                                    <Col span={12}>
                                        <Cascader 
                                            options={places}
                                            placeholder="地点1"
                                        >
                                        </Cascader>
                                    </Col>
                                    <Col span={12}>
                                        <Cascader 
                                            options={places}
                                            placeholder="地点2"
                                        >
                                        </Cascader>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" icon="search">查看两地公交路径</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Sider>
            </Layout>
      </Layout>
        );
    }
}