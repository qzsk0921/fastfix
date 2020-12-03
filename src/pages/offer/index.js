import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { Flex, Modal, Toast, Button } from "antd-mobile";
import { Flex, Badge } from "antd-mobile";
import Request from "../../api/index";
// import cookie from "react-cookies";
import { Link } from "react-router-dom";
import "./index.css";

function createOrderId(orderId) {
  return `offer_location_${orderId}`;
}

// function selectPrice(offer, priceId, index) {
//   Modal.alert("提交订单", "确定选择该修理厂？", [
//     {
//       text: "确定",
//       style: "default",
//       onPress: () => {
//         Request.putPrice({
//           id: offer.id,
//           priceId: priceId,
//           userId: cookie.load("userId"),
//         })
//           .then((rsp) => {
//             if (rsp.data && rsp.data.code === 20000) {
//               const { offer } = this.props;
//               offer.data.splice(index, 1);
//               this.props.updatePrices(offer.data);
//               let data = rsp.data.result;
//               this.props.wxSdk.then((wxSdk) => {
//                 console.log(wxSdk, "可以");
//                 wxSdk.chooseWXPay({
//                   appId: data.appId,
//                   nonceStr: data.nonceStr,
//                   package: data.packageValue,
//                   signType: data.signType,
//                   paySign: data.paySign,
//                   timestamp: data.timeStamp,
//                   success: function (res) {
//                     Toast.success("支付成功", 3, null, false);
//                     console.log(res.errorMsg);
//                   },
//                   fail: function (res) {
//                     console.log(res.errorMsg);
//                     Toast.fail("支付失败", 3, null, false);
//                   },
//                 });
//               });
//             } else {
//               throw rsp;
//             }
//           })
//           .catch(() => {
//             Toast.fail("下发报修单失败", 3, null, false);
//           });
//       },
//     },
//     { text: "取消" },
//   ]);
// }
function toInfo(data) {
  console.log(data);
  localStorage.setItem("priceId", data);
}

class OfferPage extends React.Component {
  queryList() {
    return Request.getWaitFix().then(({ data: rsp }) => {
      let { result } = rsp || {};
      this.props.updatePrices(result);
    });
  }
  renderOfferList(offer) {
    const quotations = offer.quotations;
    if (quotations.length) {
      return quotations.map((item) => (
        <Link className="link" to="/detail" key={item.id}>
          <Badge
            className="qf-offer-item-badge"
            dot={!offer.quotations[0].isRead}
          ></Badge>
          <Flex
            className="qf-offer-item-item"
            onClick={() => {
              toInfo.call(this, item.id);
            }}
          >
            <div className="qf-offer-factory-avatar">
              <img src={item.store.stoneImg || item.store.stoneImgS} />
            </div>
            <Flex
              className="qf-offer-factory-info"
              direction="column"
              align="start"
              // onClick={() => {
              //   selectPrice.call(this, offer, item.id, index);
              // }}
            >
              <div className="qf-offer-factory-name">
                {item.store.fullName || item.store.storeName}
              </div>
              <Flex justify="between">
                <div className="qf-offer-factory-distance">
                  {item.store.distance || 0}km
                </div>
                <div className="qf-offer-factory-rate">
                  好评率{item.store.grade || 0}%
                </div>
              </Flex>
            </Flex>
            <div className="price">￥{item.price / 100}</div>
            {/* <Link to="/detail">
            <Button
              className="mini-botton"
              onClick={() => {
                toInfo.call(this, item.id);
              }}
              type="primary"
              size="small"
              inline
            >
              查看详情
            </Button>
          </Link> */}
          </Flex>
        </Link>
      ));
    }
  }
  renderOffer(data) {
    if (data.length) {
      return data.map((item, index) => (
        <Flex
          className="qf-offer-item"
          key={item.id}
          id={createOrderId(item.id)}
          direction="column"
        >
          <Flex className="qf-offer-item-header" justify="between">
            <div>
              {item.brandName}&nbsp;{item.model}
            </div>
            <div>No.{item.plateNum}</div>
          </Flex>
          <Flex className="qf-offer-item-list" direction="column">
            {this.renderOfferList(item, index)}
          </Flex>
        </Flex>
      ));
    } else {
      return (
        <Flex justify="center">
          <span>暂无报价</span>
        </Flex>
      );
    }
  }
  render() {
    const { offer } = this.props;
    const { data } = offer;

    return <div className="qf-offer">{this.renderOffer(data)}</div>;
  }

  componentDidMount() {
    this.queryList();
  }

  shouldComponentUpdate() {
    // if (this.props.offer.data !== nextProps.offer.data) {
    //   return true;
    // }
    // return false;
    return true;
  }
}
OfferPage.propTypes = {
  offer: PropTypes.object,
  orderId: PropTypes.number,
  // clearBadge: PropTypes.func,
  updatePrices: PropTypes.func,
  navigateToPrice: PropTypes.func,
  wxSdk: PropTypes.object,
};

const mapStateToProps = (state) => ({
  offer: state.offer,
  orderId: state.targetId,
  wxSdk: state.wxSdk,
});

const mapDispatchToProps = (dispatch) => ({
  // clearBadge: () => dispatch({ type: "clearOfferBadge" }),
  updatePrices: (list) => {
    dispatch({ type: "updatePrices", list: list });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OfferPage);