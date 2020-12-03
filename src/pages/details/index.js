import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { List, Button, Toast, Modal } from "antd-mobile";
import Request from "../../api/index";
import "./index.css";
const Item = List.Item;
const priceStatus = function (data) {
  console.log(data);
  if (data === 1) {
    return "等待确认";
  } else if (data === 2) {
    return "确认";
  } else if (data === 3) {
    return "失效";
  } else {
    return "取消";
  }
};

function selectPrice() {
  Modal.alert("提交订单", "确定选择该修理厂？", [
    {
      text: "确定",
      style: "default",
      onPress: () => {
        let id = localStorage.getItem("priceId");
        Request.putPrice({
          priceId: id,
        })
          .then((rsp) => {
            if (rsp.data && rsp.data.code === 20000) {
              let data = rsp.data.result;
              this.props.wxSdk.then((wxSdk) => {
                console.log(wxSdk, "可以");
                wxSdk.chooseWXPay({
                  appId: data.appId,
                  nonceStr: data.nonceStr,
                  package: data.packageValue,
                  signType: data.signType,
                  paySign: data.paySign,
                  timestamp: data.timeStamp,
                  success: function (res) {
                    Toast.success("支付成功", 3, null, false);
                    console.log(res.errorMsg);
                  },
                  fail: function (res) {
                    console.log(res.errorMsg);
                    Toast.fail("支付失败", 3, null, false);
                  },
                });
              });
            } else {
              throw rsp;
            }
          })
          .catch(() => {
            Toast.fail("下发报修单失败", 3, null, false);
          });
      },
    },
    { text: "取消" },
  ]);
}
class detailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priceInfo: {},
      storeInfo: {},
    };
  }

  getInfo() {
    let id = localStorage.getItem("priceId");
    Request.getPriceList(id).then((res) => {
      // console.log(res);
      if (res.data.code === 20000) {
        res.data.result.priceStatus = priceStatus(res.data.result.priceStatus);
        res.data.result.price = res.data.result.price / 100;
        res.data.result.store.addressA =
          res.data.result.store.province +
          res.data.result.store.city +
          res.data.result.store.district;
        // console.log(res.data.result.store,9999999);
        this.setState({
          priceInfo: res.data.result,
          storeInfo: res.data.result.store,
        });
      }
    });
  }

  getNewPrice() {
    Request.getNewPrice().then((res) => {
      this.props.updateOfferBadge(res.data.result);
    });
  }

  render() {
    return (
      <div className="qf-repair">
        <List className="my-list">
          <Item extra={this.state.priceInfo.discription}>描述</Item>
          <Item extra={this.state.priceInfo.price}>价格</Item>
          <Item extra={this.state.priceInfo.priceStatus}>状态</Item>
          <Item extra={this.state.priceInfo.price}>价格</Item>
          <Item extra={this.state.storeInfo.storeName}>店铺名称</Item>
          <Item extra={this.state.storeInfo.addressA}>城市</Item>
          <Item extra={this.state.storeInfo.address}>详细地址</Item>
          <Item extra={this.state.storeInfo.openTime}>营业时间</Item>
          <Item extra={this.state.storeInfo.tel}>联系电话</Item>
          {renderOfferOperate.call(this, this.state.priceInfo.priceStatus)}
        </List>
      </div>
    );
  }
  componentDidMount() {
    this.getInfo();
    this.getNewPrice(); //更新报价订单的未读数据
  }
  shouldComponentUpdate() {
    return true;
  }
  componentWillUnmount() {
    console.log("销毁");
    localStorage.removeItem("priceId");
  }
}

function renderOfferOperate(data) {
  switch (data) {
    case "等待确认":
      return (
        <Button
          className="qf-repair-submit-button"
          type="primary"
          onClick={() => {
            selectPrice.call(this);
          }}
        >
          确认报价
        </Button>
      );
    default:
      return "";
  }
}

detailPage.propTypes = {
  wxSdk: PropTypes.object,
  updateOfferBadge: PropTypes.func,
};

const mapStateToProps = (state) => ({
  wxSdk: state.wxSdk,
});

const mapDispatchToProps = (dispatch) => ({
  updateOfferBadge: (newOffer) =>
    dispatch({ type: "updateOfferBadge", newOffer }),
});

export default connect(mapStateToProps, mapDispatchToProps)(detailPage);
