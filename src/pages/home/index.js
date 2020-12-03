import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Flex, Badge } from "antd-mobile";
// import { Flex } from "antd-mobile";
import { Link } from "react-router-dom";
import "./index.css";

// function HomePage ({newOffer = 0, navigateToOfferPage}) {
function HomePage(props) {
  
  const { newOffer = 0 } = props;

  return (
    <div className="qf-home">
      <Flex className="qf-home-ad" justify="center" align="center">
        品牌宣传or广告
      </Flex>
      <Flex className="qf-home-nav-list" direction="column" align="start">
        <Link to="/repair" className="qf-home-nav-item">
          我要修车
        </Link>
        {/* <div className="qf-home-nav-item" onClick={ navigateToOfferPage }>
          { 
            newOffer > 0 ? 
            <Badge dot><span>车行报价</span></Badge> :
            <span>车行报价</span>
          }
        </div> */}
        <Link to="/offer" className="qf-home-nav-item">
          车行报价
          <Badge
            className="qf-home-nav-item-badge"
            dot={newOffer > 0 ? newOffer : ""}
          ></Badge>
        </Link>
        <div className="qf-home-nav-item">使用说明</div>
      </Flex>
    </div>
  );
}

HomePage.propTypes = {
  newOffer: PropTypes.number,
  // navigateToOfferPage: PropTypes.func,
};

const mapStateToProps = (state) => ({
  newOffer: state.offer.new,
});

// const mapDispatchToProps = (dispatch) => ({
//   navigateToOfferPage: () => dispatch({ type: "toggleNavIndex", index: 1 }),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
export default connect(mapStateToProps)(HomePage);
