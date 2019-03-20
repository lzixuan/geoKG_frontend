import React, { Component } from 'react';
import Button from 'antd/lib/button';
import './App.css';
import { Layout, Menu, Card, Divider, Radio, Slider, Select, Cascader, Table, Row, Col } from 'antd';
import * as d3 from 'd3';
import BMap from 'BMap';
import $ from 'jquery';

const Option = Select.Option;

const {
  Header, Sider, Content,
} = Layout;

var means, transfer, stop, selectedTopics;
const resColumns = [{
  title: '区域',
  dataIndex: 'place',
}, {
  title: '城区',
  dataIndex: 'cityRegion',
}, {
  title: '推荐排序',
  dataIndex: 'rank',
}, {
  title: '距离',
  dataIndex: 'distance',
}];
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
const places = [{
  value: 'haidian',
  label: '海淀区',
  children: [{
    value: 'wudaokou',
    label: '五道口',
  }],
}, {
  value: 'chaoyang',
  label: '朝阳区',
  children: [{
    value: 'sanyuanqiao',
    label: '三元桥',
  }],
}];
//list of topics
const topics = ['美食', '购物'];

function onMeansChange(e) {
  //console.log(`radio checked:${e.target.value}`);
  means = e.target.value;
}
function onTransferChange(value) {
  //console.log('onTransferChange: ', value);
  transfer = value;
};
function onStopChange(value) {
  //console.log('onTransferChange: ', value);
  stop = value;
};


class App extends Component {
  state = {
    text: '点击右边链接',
    selectedItems:[],
    selectedRowKeys:[],
    tableData:[],
  };

  onPlaceChange = (value, selectedOptions) => {
    this.setState({
      text: selectedOptions.map(o => o.label).join(', '),
    });
  }
  onTopicChange = (selectedItems) => {
    this.setState({selectedItems});
    selectedTopics = selectedItems;
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
  onClickSubmit = (event) => {
    var _this = this;
    $.post("http://localhost:5000/getSearch", function(data, status){
      console.log(status);
      console.log(data);
      if (!data || data.length == 0)
        return;
      console.log(data);
      _this.setState({ tableData: resData });
    }, "json");
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
    //for table
    const { selectedRowKeys } = this.state;
    /*const rowSelection = {
      type:'radio',
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };*/
    return (
      <Layout>
        <Header className="header">
          <div className="logo">知行</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">地点推荐</Menu.Item>
            <Menu.Item key="2">地点概览</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={300} height={800} style={{ background: '#fff' }}>
            <Card style={{ width: 300, height:800}}>
              <Divider>Controls</Divider>
              <div>
                交通方式：
                <Radio.Group defaultValue="a" buttonStyle="solid" onChange={onMeansChange}>
                  <Radio.Button value="a">公共汽车</Radio.Button>
                  <Radio.Button value="b">地铁</Radio.Button>
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
                  最大中转次数（0-3）：
                  <Slider defaultValue={0} onChange={onTransferChange} max={3}>
                  </Slider>
                </span>
              </div>
              <div id="stopSlider">
                <span>
                  最大站数（0-20）：
                  <Slider defaultValue={0} onChange={onStopChange} max={20}>
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
                  onRow={(record) => ({
                    onClick: () => {
                      this.selectRow(record);
                    },
                  })}
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
