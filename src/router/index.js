import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import IndexPage from "../pages/index/";
import RepairPage from "../pages/repair";
import carPage from "../pages/car";
import iphonePage from "../pages/iphone";
import detailPage from "../pages/details";
import orderInfoPage from "../pages/orderInfo";
import offerPage from "../pages/offer";
import orderPage from "../pages/order";

const App = () => (
  <div>
    <Router>
      <Route exact path="/" component={IndexPage} />
      <Route path="/repair" component={RepairPage} />
      <Route path="/car" component={carPage} />
      <Route path="/detail" component={detailPage} />
      <Route path="/iphone" component={iphonePage} />
      <Route path="/orderInfo" component={orderInfoPage} />
      <Route path="/offer" component={offerPage} />
      <Route path="/order" component={orderPage} />
    </Router>
  </div>
);

export default App;
