import "normalize.css/normalize.css";
import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import url from "url";
import cookie from "react-cookies";
import Request from "./api/index";
import Config from "./business/config";
import App from "./router/";

let httpUrl = window.location.search;
let weiXinCode = url.parse(httpUrl, true).query.code || "";
// let hasInitRequisite = 0;
let initialState = {
  navIndex: 0,
  weiXinCode: weiXinCode,
  session: {},
  wxSdk: null,
  uploadToken: {},
  userInfo: {
    userId: 0,
    nickname: "",
    realname: "",
    phoneNumber: "绑定手机号",
    avatar: "",
  },
  order: {
    data: [],
  },
  priceSdk: {
    appId: "",
    timestamp: "",
    nonceStr: "",
    signature: "",
  },
  mineCars: [],
  brands: [],
  targetId: null,
  offer: {
    new: 0,
    data: [],
  },
};
const reducers = function (state = initialState, action) {
  state.session.token =
    "eyJhbGciOiJIUzUxMiIsInppcCI6IkRFRiJ9.eNqqViotTi3KTFGyMtFRyi9IzQMxlfIrioOcy80jXLK9M3QDTExCnS3yHYMqCw1dSkKVdJSKk4EqlayiwXqVYnWUUisKlKwMzQyMLUxNTE1MagEAAAD__w.IFUCtrD1W4YYFRJRZhp0QnpZ9MOpi4m6mX04oLKTyeKijItZ4M-useueMs-y1eu8PxHlEFzWBNBxOYV44iAXrQ";
  cookie.save("token", state.session.token);
  if (!state.weiXinCode && !cookie.load("token")) {
    location.href = Config.weixinUri();
  }
  //设置token超时时间
  // let CTime = getTokenL(20000000000000000000000000000000000);
  if (!cookie.load("token")) {
    Request.getUserToken(state.weiXinCode).then((session) => {
      cookie.save("token", session.token);
      Object.assign(state, {
        session: session,
      });
      initRequisite();
    });
  } else {
    Object.assign(state, {
      session: Object.assign({}, state.session, {
        token: cookie.load("token"),
      }),
    });
    initRequisite();
  }
  // if (!hasInitRequisite) {
  //   initRequisite();
  // }
  if (action.type === "toggleNavIndex") {
    return Object.assign({}, state, {
      navIndex: action.index,
      // targetId: action.targetId,
    });
  }
  if (action.type === "clearOfferBadge") {
    return Object.assign({}, state, {
      offer: Object.assign({}, state.offer, { new: 0 }),
    });
  }
  if (action.type === "updateOfferBadge") {
    return Object.assign({}, state, {
      offer: Object.assign({}, state.offer, { new: action.newOffer }),
    });
  }
  if (action.type === "updateCars") {
    return Object.assign({}, state, {
      mineCars: action.list,
    });
  }

  if (action.type === "updateBrands") {
    return Object.assign({}, state, {
      brands: action.list,
    });
  }

  if (action.type === "updateOrders") {
    return Object.assign({}, state, {
      order: {
        data: action.list,
      },
    });
  }

  if (action.type === "updatePrices") {
    return Object.assign({}, state, {
      offer: Object.assign({}, state.offer, {
        data: action.list,
      }),
    });
  }

  function initRequisite() {
    if (state.session.token) {
      cookie.save("token", state.session.token);
      state.wxSdk = Config.initWxsdk();
      Request.getUserInfo().then((rsp = {}) => {
        let { result } = rsp;
        cookie.save("userId", result.id);
        Object.assign(state, {
          userInfo: Object.assign({}, state.userInfo, {
            nickname: result.nickname,
            avatar: result.headImgUrl,
            phoneNumber: result.tel,
          }),
        });
      });
      Request.getUploadToken().then((rsp = {}) => {
        Object.assign(state, {
          uploadToken: Object.assign({}, state.uploadToken, {
            UpToken: rsp.data.result,
          }),
        });
      });
      // Request.getNewPrice().then((rsp) => {
      //   Object.assign(state, {
      //     offer: Object.assign({}, state.offer, {
      //       new: rsp.data.result,
      //     }),
      //   });
      // });
    }
  }

  return state;
};

const root = document.getElementById("app");
const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  root
);

// const mapDispatchToProps = dispatch => ({
//   updateNewOffer: (initialState.offer.new) => {
//     dispatch({type: });
//   },
//  });

// export default connect(null, mapDispatchToProps)(MessageSending);
