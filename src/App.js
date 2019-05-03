import React, { Component } from 'react';
import Button from 'antd/lib/button';
import './App.css';
import cascaderData from './cascaderData';
import { Layout, Menu, Card, Divider, Radio, Slider, Select, Cascader, Table, Row, Col, Pagination } from 'antd';
import * as d3 from 'd3';
import BMap from 'BMap';
import $ from 'jquery';
import { Link, Router, NavLink } from 'react-router-dom';

const Option = Select.Option;

const {
  Header, Sider, Content,
} = Layout;

var means = "bus", transfer = 1, time = 15, selectedTopics, place;
var resData = [{
  key: '1',
  place: '五道口',
  cityRegion: '海淀区',
}, {
  key: '2',
  place: '中关村',
  cityRegion: '海淀区',
}, {
  key: '3',
  place: '魏公村',
  cityRegion: '海淀区',
}, {
  key: '4',
  place: '上地',
  cityRegion: '海淀区',
}];

//list of places
var places = [];

//list of topics
const topics = ['居民区','美食','旅游','娱乐','运动','酒店','学校','培训机构',
  '医院', '工作','购物','交通','生活保障'];

function onMeansChange(e) {
  //console.log(`radio checked:${e.target.value}`);
  means = e.target.value;
}
function onTransferChange(e) {
  //console.log('onTransferChange: ', value);
  transfer = e.target.value;
  //console.log(transfer);
};
function onTimeChange(value) {
  //console.log('onTransferChange: ', value);
  time = value;
  //console.log(value);
};


class App extends Component {
  state = {
    text: '点击右边链接',
    selectedItems:[],
    selectedRowKeys:[],
    tableData:[],
    sortedInfo:null,
  };

  onPlaceChange = (value, selectedOptions) => {
    this.setState({
      text: selectedOptions.map(o => o.label).join(', '),
    });
    place = selectedOptions[1].label;
  }
  onTopicChange = (selectedItems) => {
    console.log(selectedItems);
    if (selectedItems.length <= 3){
      this.setState({selectedItems});
      selectedTopics = selectedItems;
    }
    else{
      alert("至多选择三个需求！");
    }
    //console.log(selectedTopics);
  };
  selectRow = (record) => {
    /*const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    this.setState({ selectedRowKeys });*/
    console.log(record);
    d3.select('#pieSVG')
      .remove();
    var dataset = [30, 10, 43, 55, 13];
    var width = 300;
    var height = 300;
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var pie = d3.pie();
    var pieData = pie(dataset);
    var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(150);
    var svg = d3.select('#topicChart')
      .append('svg')
      .attr('id', 'pieSVG')
      .attr('height', height)
      .attr('width', width);
    var arcs = svg.selectAll("g")
                  .data(pieData)
                  .enter()
                  .append('g')
                  .attr("transform","translate("+ (width/2) +","+ (width/2) +")");
    arcs.append('path')
        .attr("fill", function(d, i){
          return color(i);
        })
        .attr("d", arc);
  }
  onSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  tableChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter,
    });
  }
  onClickSubmit = (event) => {
    var _this = this;
    //juege whether parameters are legal
    if (typeof(place) == "undefined"){
      alert("请选择地点！");
      return;
    }
    if (this.state.selectedItems.length == 0){
      alert("请选择需求！");
      return;
    }
    var params = {
      "means": means,
      "place": place,
      "transfer": transfer,
      "time": time,
      "topics": JSON.stringify(this.state.selectedItems)
    };
    $.post("http://localhost:5000/getSearch", params, function(data, status){
      //console.log(status);
      console.log(data);
      if (!data || data.length == 0)
        return;
      _this.setState({ tableData: data['places'] });
    }, "json");
  }

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

  //for baiduMap Test
  componentDidMount () {
    var map = new BMap.Map("resultMap"); // 创建Map实例
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
    map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
    map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
  }

  render() {
    const { selectedItems } = this.state;
    const filteredTopics = topics.filter(o => !selectedItems.includes(o));
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    //for table
    const { selectedRowKeys } = this.state;
    /*const rowSelection = {
      type:'radio',
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };*/
    const resColumns = [{
      title: '区域',
      dataIndex: 'name',
    }, {
      title: '城区',
      dataIndex: 'qu',
    }, {
      title: '推荐排序',
      dataIndex: 'rank',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.rank - b.rank,
      sortOrder: sortedInfo.columnKey === 'rank' && sortedInfo.order,
    }, {
      title: '行程时间',
      dataIndex: 'time',
      sorter: (a, b) => a.time - b.time,
      sortOrder: sortedInfo.columnKey === 'time' && sortedInfo.order,
    }];
    return (
      <Layout>
        <Header className="header">
          <div className="logo">地点推荐</div>
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
              <Divider>Controls</Divider>
              <div>
                交通方式：
                <Radio.Group defaultValue="bus" buttonStyle="solid" onChange={onMeansChange}>
                  <Radio.Button value="bus">公共汽车</Radio.Button>
                  <Radio.Button value="subway">地铁</Radio.Button>
                  <Radio.Button value='any'>不限</Radio.Button>
                </Radio.Group> 
              </div>
              <br></br>
              <div id="PlaceSelector">
                <span>
                  所在地点：
                  {this.state.text}
                  &nbsp;
                  <Cascader options={places} onChange={this.onPlaceChange}>
                    <a href="#">选择</a>
                  </Cascader>
                </span>
              </div>
              <br></br>
              <div id="transferSlider">
                <span>
                  是否允许中转：
                  <Radio.Group defaultValue={1} buttonStyle="solid" onChange={onTransferChange}>
                    <Radio.Button value={1}>否</Radio.Button>
                    <Radio.Button value={2}>是</Radio.Button>
                  </Radio.Group>
                </span>
              </div>
              <br></br>
              <div id="stopSlider">
                <span>
                  可接受的路程耗费时间（15-60分钟）：
                  <Slider defaultValue={15} onChange={onTimeChange} min={15} max={60}>
                  </Slider>
                </span>
              </div>
              <br></br>
              <div id="topicSelector">
                <span>
                  需求：
                  <Select
                    mode="multiple"
                    placeholder="您想搜索具有哪些功能的区域？"
                    value={selectedItems}
                    onChange={this.onTopicChange}
                    style={{ width: '100%' }}
                  >
                    {filteredTopics.map(item => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                </span>
              </div>
              <br></br>
              <div>
                <Button type="primary" icon="search" onClick={this.onClickSubmit}>提交检索</Button>
              </div>
            </Card>
          </Sider>
          <Content style={{
            background: '#fff', padding: 24, margin: 0, minHeight: 800,
          }}
          >
            <div>
              <Row>
                <Col span={12}>
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
                  size={'middle'}
                  />
                </Col>
                <Col span={12}>
                  <div id="resultMap">
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col span={12}>
                  <div id="topicChart">
                  </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;
