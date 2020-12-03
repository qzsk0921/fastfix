import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Flex, Modal, Toast } from "antd-mobile";
import Request from "../../api/index";
import Config from "../../business/config";
import { Link } from "react-router-dom";
import "./index.css";

const cancelOrder = function (order) {
  Modal.alert("取消订单", "确定取消订单？", [
    {
      text: "确定",
      onPress: () => {
        Request.abolishFix(order.id)
          .then((rsp) => {
            if (rsp.data && rsp.data.code === 20000) {
              Toast.success("订单取消成功!", 2, null, false);
              Object.assign(order, {
                fixOrderStatus: 0,
              });

              this.props.updateOrders(this.props.order.data);
            } else {
              throw rsp;
            }
          })
          .catch(() => {
            Toast.fail("订单取消失败!", 2, null, false);
          });
      },
    },
    {
      text: "不取消",
      style: "default",
      onPress: () => {},
    },
  ]);
};
const toInfos = function (data) {
  console.log(data, 888888888888);
  localStorage.setItem("orderId", data.id);
};
const priceWx = function (data) {
  let _this = this;
  Request.payPrice(data.id).then((res) => {
    if (res.data.code === 20000) {
      _this.props.wxSdk
        .then((wxSdk) => {
          console.log(wxSdk, "可以");
          let data = res.data.result;
          wxSdk.chooseWXPay({
            appId: data.appId,
            nonceStr: data.nonceStr,
            package: data.packageValue,
            signType: data.signType,
            paySign: data.paySign,
            timestamp: data.timeStamp,
            success: function (res) {
              console.log(res.errorMsg);
              Toast.success("支付成功", 3, null, false);
            },
            fail: function (res) {
              console.log(res.errorMsg);
              Toast.fail("支付失败", 3, null, false);
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    console.log(res);
  });
};

function renderOfferTitle(order) {
  // const car = order.car || {};
  return (
    <div className="qf-order-title">
      <Flex
        justify="between"
        className="qf-order-item-row qf-order-item-header"
      >
        {/* <div className="qf-order-item-model">{car.brandName}&nbsp;{car.model}</div> */}
        <div className="qf-order-item-model">
          {order.brandName}&nbsp;{order.model}
        </div>
        <div className="qf-order-item-status">{order.statusDesc}</div>
      </Flex>
      <div className="qf-order-item-content-1">{order.discription}</div>
      <Flex
        justify="between"
        className="qf-order-item-row qf-order-item-content-1"
      >
        {/* <div>{order.fixWayName}-{order.fixTypeName}</div> */}
        <div className="qf-order-item-model">&nbsp;</div>
        <div className="qf-order-item-expired">
          剩余{order.lastDay ? order.lastDay : 1}天有效期
        </div>
      </Flex>
    </div>
  );
}

function renderOfferPrice(order) {
  const { quotations = [] } = order;
  const quotation = quotations[0];

  if (quotation) {
    return (
      <Flex
        className="qf-order-item-row qf-order-item-content-2"
        justify="between"
      >
        <div className="qf-order-item-desc">
          {quotation.fullName || quotation.storeName}
        </div>
        <div className="qf-order-item-cost">￥{quotation.price / 100}</div>
      </Flex>
    );
  }
}

function renderOfferOperate(order, index) {
  switch (order.fixOrderStatus) {
    case 1:
      return (
        <Flex justify="between">
          <Button
            className="qf-order-item-button"
            size="small"
            type="warning"
            onClick={(e) => {
              e && e.preventDefault();
              cancelOrder.call(this, order, index);
            }}
          >
            取消订单
          </Button>
          <Button
            className="qf-order-item-button"
            size="small"
            type="primary"
            onClick={(e) => {
              e && e.preventDefault();
              this.props.navigateToPrice(order);
            }}
          >
            查看报价
          </Button>
          {/* <Link to="/orderInfo" className="orderInfo">
            <Button
              className="qf-order-item-button"
              size="small"
              onClick={() => {
                toInfos.call(this, order);
              }}
            >
              详情
            </Button>
          </Link> */}
        </Flex>
      );
    case 2:
      return (
        <Flex justify="between">
          <Button
            className="qf-order-item-button"
            size="small"
            type="warning"
            onClick={(e) => {
              e && e.preventDefault();
              cancelOrder.call(this, order, index);
            }}
          >
            取消订单
          </Button>
          <Button
            className="qf-order-item-button"
            size="small"
            type="primary"
            onClick={(e) => {
              e && e.preventDefault();
              priceWx.call(this, order);
            }}
          >
            支付订单
          </Button>
          {/* <Link to="/orderInfo" className="orderInfo">
            <Button
              className="qf-order-item-button"
              size="small"
              onClick={() => {
                toInfos.call(this, order);
              }}
            >
              详情
            </Button>
          </Link> */}
        </Flex>
      );
    case 3:
      return (
        <div>
          <Button
            className="qf-order-item-button"
            size="small"
            type="warning"
            onClick={(e) => {
              e && e.preventDefault();
              cancelOrder.call(this, order, index);
            }}
          >
            取消订单
          </Button>
          {/* <Link to="/orderInfo" className="orderInfo">
            <Button
              className="qf-order-item-button"
              size="small"
              onClick={() => {
                toInfos.call(this, order);
              }}
            >
              详情
            </Button>
          </Link> */}
        </div>
      );
    case 4:
      return (
        <div>
          <Button className="qf-order-item-button" size="small" type="primary">
            评价
          </Button>
          {/* <Link to="/orderInfo" className="orderInfo">
            <Button
              className="qf-order-item-button"
              size="small"
              onClick={() => {
                toInfos.call(this, order);
              }}
            >
              详情
            </Button>
          </Link> */}
        </div>
      );
    default:
      return "";
  }
}

function renderOrder(order, index) {
  // console.log(order);
  if ([1, 2, 3, 4, 5, 6].includes(order.fixOrderStatus) && order.lastDay >= 0) {
    return (
      <Link
        to="/orderInfo"
        onClick={() => {
          toInfos.call(this, order);
        }}
      >
        <Flex direction="column" key={order.id} className="qf-order-item">
          {renderOfferTitle(order)}
          {order.fixOrderStatus >= 2 ? renderOfferPrice(order) : ""}
          <Flex
            className="qf-order-item-row  qf-order-item-footer"
            justify="between"
            align="center"
          >
            <div className="qf-order-item-date">{order.createTimeStr}</div>
            {renderOfferOperate.call(this, order, index)}
          </Flex>
        </Flex>
      </Link>
    );
  }
}

class OrderPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let query = {
      pageNum: 1,
      pageSize: 10000,
    };
    Request.getFixList(query).then(({ data: rsp }) => {
      let { result } = rsp || {};
      this.props.updateOrders(result);
    });
  }

  render() {
    const { data = [] } = this.props.order;

    return (
      <Flex direction="column" className="qf-order">
        {data.map(renderOrder.bind(this))}
      </Flex>
    );
  }

  shouldComponentUpdate() {
    return true;
  }
}
OrderPage.propTypes = {
  order: PropTypes.object,
  price: PropTypes.object,
  updateOrders: PropTypes.func,
  navigateToPrice: PropTypes.func,
  wxSdk: PropTypes.object,
};

const mapStateToProps = (state) => ({
  order: state.order,
  wxSdk: state.wxSdk,
  price: state.result,
});

const mapDispatchToProps = (dispatch) => ({
  updateOrders: (list) => {
    let orders = [];

    if (Array.isArray(list)) {
      list.forEach((order) => {
        Object.assign(order, {
          statusDesc: Config.escapeTraffic(order.fixOrderStatus, "status"),
          createTimeStr: new Date(order.createTime)
            .toLocaleDateString()
            .replace(/\//g, "-"),
          fixWayName: Config.escapeTraffic(order.fixWay, "way"),
          fixTypeName: Config.escapeTraffic(order.fixType, "type"),
        });

        orders.push(order);
      });

      dispatch({ type: "updateOrders", list: orders });
    }
  },
  navigateToPrice: (order) =>
    dispatch({ type: "toggleNavIndex", index: 1, targetId: order.id }),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderPage);
