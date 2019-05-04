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
const Option = Select.Option;

var places = [];

var means, topic;
function onMeansChange(e) {
    //console.log(`radio checked:${e.target.value}`);
    means = e.target.value;
}
function onTopicChange(value) {
    topic = value;
}
export default class Overview extends Component{
    state = {
        display_sider:'none',
      };
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
                    <div className="logo">地点概览</div>
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
                        <Divider>地点功能</Divider>
                        <div>
                            <span>
                                功能：
                                <Select defaultValue="1" style={{ width: 100 }} onChange={onTopicChange}>
                                    <Option value="1">居民区</Option>
                                    <Option value="2">美食</Option>
                                    <Option value="3">旅游</Option>
                                    <Option value="4">娱乐</Option>
                                    <Option value="5">运动</Option>
                                    <Option value="6">酒店</Option>
                                    <Option value="7">学校</Option>
                                    <Option value="8">培训机构</Option>
                                    <Option value="9">医院</Option>
                                    <Option value="10">工作</Option>
                                    <Option value="11">购物</Option>
                                    <Option value="12">交通</Option>
                                    <Option value="13">生活保障</Option>
                                </Select>
                                &nbsp;&nbsp;
                                <Button type="primary">查看各地显著度</Button>
                            </span>
                        </div>
                        <Divider>公共交通邻居</Divider>
                        <div>
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
                        <Divider>两地关系</Divider>
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
                <Content style={{
                    background: '#fff', padding: 24, margin: 0, minHeight: 800,
                }}>
                </Content>
                <Sider width={350} height={800} style={{ background: '#fff', display: 'none' }}>
                    <Card style={{ width: 350, height:800}}>
                        <Divider>主题</Divider>
                    </Card>
                </Sider>
            </Layout>
      </Layout>
        );
    }
}