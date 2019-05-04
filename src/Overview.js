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

var means, topic = '居民区';
function onMeansChange(e) {
    //console.log(`radio checked:${e.target.value}`);
    means = e.target.value;
}
function onTopicChange(value) {
    topic = value;
}
export default class Overview extends Component {
    state = {
        display_sider: 'none',
        display_table: 'none',
        tableData:[],
        sortedInfo: null,
    };
    tableChange = (pagination, filters, sorter) => {
        this.setState({
          sortedInfo: sorter,
        });
    }
    //load the json data
    componentWillMount() {
        const qus = Object.keys(cascaderData);
        for (let i in qus) {
            const key = qus[i];
            const placeList = [];
            if (cascaderData[key].length > 0) {
                for (let j in cascaderData[key]) {
                    const obj = {
                        'value': cascaderData[key][j],
                        'label': cascaderData[key][j]
                    }
                    placeList.push(obj);
                }
            }
            const obj = {
                'value': key,
                'label': key,
                'children': placeList
            }
            places.push(obj);
        }
    }
    onSubmitTopic = (event) => {
        var _this = this;
        var params = {
            "topic": topic
          };
          $.post("http://localhost:5000/viewbytopic", params, function (data, status) {
            //console.log(status);
            //console.log(data);
            if (!data || data.length == 0)
              return;
            _this.setState({display_sider: 'none'})
            _this.setState({display_table: 'block'})
            _this.setState({ tableData: data['places'] });
          }, "json");
    }
    render() {
        let { sortedInfo } = this.state;
        sortedInfo = sortedInfo || {};
        const resColumns = [{
            title: '区域',
            dataIndex: 'name',
          }, {
            title: '城区',
            dataIndex: 'qu',
          }, {
            title: '主题显著度评分',
            dataIndex: 'topic',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.topic - b.topic,
            sortOrder: sortedInfo.columnKey === 'topic' && sortedInfo.order,
          }, {
            title: '好评率',
            dataIndex: 'posRate',
            sorter: (a, b) => a.posRate - b.posRate,
            sortOrder: sortedInfo.columnKey === 'posRate' && sortedInfo.order,
          }];
        return (
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
                        <Card style={{ width: 350, height: 800 }}>
                            <Divider>地点功能</Divider>
                            <div>
                                <span>
                                    功能：
                                    <Select defaultValue="居民区" style={{ width: 100 }} onChange={onTopicChange}>
                                        <Option value="居民区">居民区</Option>
                                        <Option value="美食">美食</Option>
                                        <Option value="旅游">旅游</Option>
                                        <Option value="娱乐">娱乐</Option>
                                        <Option value="运动">运动</Option>
                                        <Option value="酒店">酒店</Option>
                                        <Option value="学校">学校</Option>
                                        <Option value="培训机构">培训机构</Option>
                                        <Option value="医院">医院</Option>
                                        <Option value="工作">工作</Option>
                                        <Option value="购物">购物</Option>
                                        <Option value="交通">交通</Option>
                                        <Option value="生活保障">生活保障</Option>
                                    </Select>
                                    &nbsp;&nbsp;
                                    <Button type="primary" onClick={this.onSubmitTopic}>查看各地显著度</Button>
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
                        <div style={{display: this.state.display_table}}>
                            {'各区域'+'"'+topic+'"'+'显著度/好评率概览：'}
                            <Table
                                //rowSelection={rowSelection}
                                columns={resColumns}
                                dataSource={this.state.tableData}
                                onChange={this.tableChange}
                                onRow={(record) => ({
                                onClick: () => {
                                    this.selectRow(record);
                                },
                                })}
                            />
                        </div>
                    </Content>
                    <Sider width={350} height={800} style={{ background: '#fff', display: 'none' }}>
                        <Card style={{ width: 350, height: 800 }}>
                            <Divider>主题</Divider>
                        </Card>
                    </Sider>
                </Layout>
            </Layout>
        );
    }
}