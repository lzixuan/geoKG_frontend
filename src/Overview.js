import React, { Component } from 'react';
import Button from 'antd/lib/button';
import './Overview.css';
import { Layout, Menu, Card, Divider, Radio, Slider, Select, Cascader, Table, Row, Col, Form, Progress } from 'antd';
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
//list of topics
const topics = ['居民区', '美食', '旅游', '娱乐', '运动', '酒店', '学校', '培训机构',
  '医院', '工作', '购物', '交通', '生活保障'];

var means = 'bus', topic = '居民区', place;
function onMeansChange(e) {
    //console.log(`radio checked:${e.target.value}`);
    means = e.target.value;
}
function onTopicChange(value) {
    topic = value;
}
const backup = () => {
    return (
        <div>
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
        </div>
    );
}
export default class Overview extends Component {
    state = {
        display_sider: 'none',
        display_table: 'none',
        tableData: [],
        sortedInfo: null,
        currentPlace: [],
        currentDistance: [],
        currentQu: [],
        currentTopic: [],
        currentPosRate: [],
        currentCount: [],
    };
    tableChange = (pagination, filters, sorter) => {
        this.setState({
            sortedInfo: sorter,
        });
    }
    onPlaceChange = (value, selectedOptions) => {
        place = selectedOptions[1].label;
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
            _this.setState({ display_sider: 'none' })
            _this.setState({ display_table: 'block' })
            _this.setState({ tableData: data['places'] });
        }, "json");
    }
    onSubmitPlace = (event) => {
        var _this = this;
        if (typeof (place) == "undefined") {
            alert("请选择地点！");
            return;
        }
        var params = {
            "place": place,
            "means": means
        };
        $.post("http://localhost:5000/neighbor", params, function (data, status) {
            //console.log(status);
            console.log(data);
            if (!data || data.length == 0)
                return;
            _this.setState({ display_sider: 'block' })
            _this.setState({ display_table: 'none' })
            d3.select('#nodeLinkSVG')
                .remove();
            var width = 800,
                height = 600;
            var svg = d3.select('#nodeLink')
                .append('svg')
                .attr('id', 'nodeLinkSVG')
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", "0 0 800 600");
            var simulation = d3.forceSimulation(data['node'])
                .force("link", d3.forceLink(data['link']).id(function (d) { return d.id }).distance(200))
                .force("charge", d3.forceManyBody().strength(-500))
                .force("center", d3.forceCenter(width / 2, height / 2));
            var svg_links = svg.selectAll(".links")
                .data(data['link'])
                .enter()
                .append("line")
                .style("stroke", "black")
                .style("stroke-width", 0.5);
            var svg_nodes = svg.selectAll(".nodes")
                .data(data['node'])
                .enter()
                .append("circle")
                .attr("r", 20)
                .style("fill", "steelblue")
                .on("click", function (d, i) {
                    _this.setState({ currentPlace: d.name });
                    _this.setState({
                        currentDistance: [],
                        currentQu: [],
                        currentTopic: [],
                        currentPosRate: [],
                        currentCount: [],
                    });
                    var params = {
                        "place": d.name,
                    };
                    var outerData = data;
                    $.post("http://localhost:5000/detail", params, function (data, status) {
                        if (!data || data.length == 0)
                            return;
                        var tempTopic = [], tempPosRate = [], tempDistance, tempCount;
                        for (var i = 0; i < 13; i++){
                            tempTopic.push(data['topic'+String(i+1)]);
                            tempPosRate.push(data['posRate'+String(i+1)]);
                        }
                        for (let i in outerData['link']){
                            if(outerData['link'][i]['target']['id'] == d.id){
                                tempDistance = outerData['link'][i]['time'];
                                tempCount = outerData['link'][i]['count'];
                            }
                            else if (outerData['link'][i]['source']['id'] == d.id){
                                tempDistance = 0;
                                tempCount = 0;
                            }
                        }
                        _this.setState({ 
                            currentQu: data['qu'],
                            currentDistance: tempDistance,
                            currentCount: tempCount,
                            currentTopic: tempTopic,
                            currentPosRate: tempPosRate,
                        });
                    }, "json");
                });
            var svg_text = svg.selectAll(".nodes")
                .data(data['node'])
                .enter()
                .append("text")
                .style("fill", "#000")
                .style("font-size", 8)
                .style("cursor", "default")
                .style("pointer-events", "none")
                .attr("dominant-baseline", "middle")
                .attr("text-anchor", "middle")//在圆圈中加上数据
                .text(function (d) { return d.name; });
            simulation.on("tick", function () {
                svg_nodes.attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; });
                svg_text
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    })
                svg_links
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    })
            })

            /*function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }
            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }
            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }*/
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
                                <Radio.Group defaultValue="bus" buttonStyle="solid" onChange={onMeansChange}>
                                    <Radio.Button value="bus">公共汽车</Radio.Button>
                                    <Radio.Button value="subway">地铁</Radio.Button>
                                    <Radio.Button value='any'>不限</Radio.Button>
                                </Radio.Group>
                            </div>
                            <br></br>
                            <Button type="primary" onClick={this.onSubmitPlace}>查看公交直达区域</Button>
                            <br></br>
                        </Card>
                    </Sider>
                    <Content style={{
                        background: '#fff', padding: 24, margin: 0, minHeight: 800,
                    }}>
                        <div style={{ display: this.state.display_table }}>
                            {'各区域' + '"' + topic + '"' + '显著度/好评率概览：'}
                            <Table
                                //rowSelection={rowSelection}
                                columns={resColumns}
                                dataSource={this.state.tableData}
                                onChange={this.tableChange}
                            />
                        </div>
                        <div id="nodeLink" style={{ display: this.state.display_sider }}>
                        </div>
                    </Content>
                    <Sider width={350} height={800} style={{ background: '#fff', display: this.state.display_sider }}>
                        <Card style={{ width: 350, height: 800 }}>
                            <Divider>详细信息</Divider>
                            <p>{"选中地点：" + this.state.currentPlace}</p>
                            <p>{"所在城区：" + this.state.currentQu}</p>
                            <p>{"预计路程：" + this.state.currentDistance + "分钟"}</p>
                            <p>{"直达路线数量：" + this.state.currentCount}</p>
                            {this.state.currentTopic.map((item, index) => (
                                <Row key={'topicScore' + String(index)}>
                                    {topics[index] + "显著度评分：" + String((item * 10000).toFixed(2))}
                                    &nbsp;&nbsp;
                                    好评度：
                                    <Progress
                                        type="circle"
                                        percent={Math.round(this.state.currentPosRate[index] * 100)}
                                        width={40}
                                    >
                                    </Progress>
                                </Row>
                            ))}
                        </Card>
                    </Sider>
                </Layout>
            </Layout>
        );
    }
}