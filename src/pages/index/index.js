// import React, { useState, useEffect } from "react";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { TabBar } from "antd-mobile";
import "./index.css";
import HomePage from "../home/";
import MePage from "../me/";
import OrderPage from "../order/";
import OfferPage from "../offer/";
import Request from "../../api/index";

const rootStyle = {
  position: "fixed",
  width: "100%",
  height: "100%",
  top: 0,
};

const meIcon = <span>IC</span>;

const IndexPage = function (props) {
  // const { selected = 0, onSelectedChange = () => {}, newOffer = 0 } = props;
  const {
    selected = 0,
    onSelectedChange = () => {},
    updateOfferBadge = () => {},
  } = props;

  const [newOffer, setNewOffer] = useState(props.newOffer);

  useEffect(() => {
    function handleStatusChange(newOffer) {
      setNewOffer(newOffer);
    }

    Request.getNewPrice().then((rsp) => {
      handleStatusChange(rsp.data.result);
      updateOfferBadge(rsp.data.result);
    });
    //   //   // 组件卸载的时候执行清除操作,但这里似乎不需要
    //   //   // ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    //   //   // Specify how to clean up after this effect:
    //   //   // return function cleanup() {
    //   //   //   ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    //   //   // };
  }, [newOffer]); //仅在 newOffer 更改时更新

  // const memoizedCallback = useCallback(() => {
  //   console.log(newOffer);
  // }, [newOffer]);

  // useEffect(() => {
  //   memoizedCallback();
  // }, [newOffer]);

  return (
    <div className="tab-bar" style={rootStyle}>
      <TabBar
        tabBarPosition="bottom"
        tintColor="#ff6633"
        unselectedTintColor="#333"
        prerenderingSiblingsNumber={0}
      >
        <TabBar.Item
          title="快修"
          icon={meIcon}
          selectedIcon={meIcon}
          selected={0 === selected}
          onPress={() => onSelectedChange(0)}
        >
          <HomePage />
        </TabBar.Item>
        <TabBar.Item
          title="报价"
          icon={meIcon}
          selectedIcon={meIcon}
          selected={1 === selected}
          badge={newOffer > 0 ? newOffer : ""}
          onPress={() => onSelectedChange(1)}
        >
          <OfferPage />
        </TabBar.Item>
        <TabBar.Item
          title="订单"
          icon={meIcon}
          selectedIcon={meIcon}
          selected={2 === selected}
          onPress={() => onSelectedChange(2)}
        >
          <OrderPage />
        </TabBar.Item>
        <TabBar.Item
          title="我的"
          icon={meIcon}
          selectedIcon={meIcon}
          selected={3 === selected}
          onPress={() => onSelectedChange(3)}
        >
          <MePage />
        </TabBar.Item>
      </TabBar>
    </div>
  );
};

IndexPage.propTypes = {
  selected: PropTypes.number,
  onSelectedChange: PropTypes.func,
  newOffer: PropTypes.number,
  updateOfferBadge: PropTypes.func,
};

const mapStateToProps = (state) => ({
  selected: state.navIndex,
  newOffer: state.offer.new,
});
const mapDispatchToProps = (dispatch) => ({
  onSelectedChange: (index) => dispatch({ type: "toggleNavIndex", index }),
  updateOfferBadge: (newOffer) =>
    dispatch({ type: "updateOfferBadge", newOffer}),
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);
