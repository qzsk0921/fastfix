import React from "react";
import { connect } from "react-redux";
import { List } from "antd-mobile";
import Request from "../../api/index";
import "./index.css";
const Item = List.Item;
const priceStatus = function (data) {
  if (data === 1) {
    return "修理";
  } else if (data === 2) {
    return "美容";
  } else if (data === 3) {
    return "保养";
  } else {
    return "剐蹭";
  }
};
const fixWayStatus = function (data) {
  if (data === 1) {
    return "上门取车";
  } else if (data === 2) {
    return "拖车";
  } else {
    return "前往店面";
  }
};

class orderInfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priceInfo: {},
    };
  }

  getInfo() {
    let id = localStorage.getItem("orderId");
    Request.getFixInfo(id).then((res) => {
    //   console.log(res);
      priceStatus();
      if (res.data.code === 20000) {
        res.data.result.fixWay = fixWayStatus(res.data.result.fixWay);
        res.data.result.fixType = priceStatus(res.data.result.fixType);
        this.setState({
          priceInfo: res.data.result,
        });
      }
    });
  }

  renderOfferTitle() {
    let data = this.state.priceInfo.imgUrls;
    if (this.state.priceInfo.imgUrls) {
      return (
        <div className="img-box">
          {data.map(function (val) {
            return <img src={val.url} key={val.url} className="img-info" />;
          })}
        </div>
      );
    }
  }
  render() {
    return (
      <div className="qf-repair">
        <List className="my-list">
          <Item extra={this.state.priceInfo.name}>用户称呼</Item>
          <Item extra={this.state.priceInfo.tel}>联系电话</Item>
          <Item extra={this.state.priceInfo.fixType}>维修类型</Item>
          <Item extra={this.state.priceInfo.fixWay}>维修方式</Item>
          <Item extra={this.state.priceInfo.discription}>问题描述</Item>
          <Item extra={this.state.priceInfo.addr}>地址</Item>
          {this.renderOfferTitle()}
        </List>
      </div>
    );
  }
  componentDidMount() {
    this.getInfo();
  }
  shouldComponentUpdate() {
    return true;
  }
  componentWillUnmount() {
    console.log("销毁");
    localStorage.removeItem("orderId");
  }
}
const mapStateToProps = (state) => ({
  wxSdk: state.wxSdk,
});

export default connect(mapStateToProps)(orderInfoPage);
