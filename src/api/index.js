import axios from "axios";
import cookie from "react-cookies";
import Config from "../business/config";

const base_uri = "";

console.log(process.env);
const axiosApi = axios.create({
  baseURL: process.env.API_BASE_URL,
});
axiosApi.interceptors.request.use(
  requestConfig => {
    if(cookie.load('token')) {
      requestConfig.headers['x-token'] = cookie.load('token')
    }
    return requestConfig
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
axiosApi.interceptors.response.use(
  (response) => {
    // token验证失败
    if (response.data.code === 40007) {
      if(cookie.load('token')) {
        cookie.remove('token')
      }
      return (location.href = Config.weixinUri());
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
let userTokenPro;

export default {
  setToken(token) {
      token = token || cookie.load("token");
      // axiosApi.defaults.headers.common["x-token"] = token;
      cookie.save("token", token);
  },
  getUserToken(code) {
    userTokenPro = axiosApi
      .get(`${base_uri}/auth/login/${code}`)
      .then(({ data: rsp }) => {
        if (rsp.code === 20000) {
          cookie.save("token", rsp.token);
          // axiosApi.defaults.headers.common["x-token"] = rsp.token;
        }

        return rsp;
      });

    return userTokenPro;
  },
  getUserInfo() {
    if (userTokenPro) {
      return userTokenPro.then(() => {
        return axiosApi.get(`${base_uri}/user`).then(setUserId);
      });
    } else {
      axiosApi.defaults.headers.common["x-token"] = cookie.load("token");
      return axiosApi.get(`${base_uri}/user`).then(setUserId);
    }

    function setUserId({ data: rsp }) {
      if (rsp.result) {
        cookie.save("userId", rsp.result.id);
      }

      return rsp;
    }
  },
  getCOde(data) {
    return axiosApi.get(`${base_uri}/user/code/${data}`);
  },
  setIphone(data) {
    return axiosApi.post(`${base_uri}/user/tel/`, data);
  },
  getCarsList() {
    axiosApi.defaults.headers.common["x-token"] = cookie.load("token");
    return axiosApi.get(`${base_uri}/user/car/`);
  },
  getUploadToken() {
    return axiosApi.get(`${base_uri}/auth/uptoken/`);
  },
  createFixOrder(data) {
    return axiosApi.post(`${base_uri}/fix`, data);
  },
  getFixList(query) {
    return axiosApi.get(
      `${base_uri}/fix?pageNum=${query.pageNum}&pageSize=${query.pageSize}`
    );
  },
  abolishFix(id) {
    return axiosApi.delete(`${base_uri}/fix/${id}`);
  },
  getFixInfo(id) {
    return axiosApi.get(`${base_uri}/fix/${id}`);
  },
  getBrands() {
    return axiosApi.get(`${base_uri}/user/brand`);
  },
  getPriceList(id) {
    return axiosApi.get(`${base_uri}/fix/price/${id}`);
  },
  putPrice(query) {
    return axiosApi.put(`${base_uri}/fix/price/${query.priceId}`);
  },
  payPrice(id) {
    return axiosApi.put(`${base_uri}/fix/pay/${id}`);
  },
  getWaitFix() {
    return axiosApi.get(`${base_uri}/fix/wait`);
  },
  addCar(query) {
    return axiosApi.post(`${base_uri}/user/car/`, query);
  },
  getWxSignature() {
    let url = location.href.split("#")[0];
    // console.log(url)
    return axiosApi.get(
      `${base_uri}/auth/jsapi?url=${encodeURIComponent(url)}`
    );
  },
  /**
   * 经纬度转地名
   * https://lbs.qq.com/service/webService/webServiceGuide/webServiceGcoder
   * @param lon 经度
   * @param lat 纬度
   */
  getAddress(query) {
    return axiosApi.get(`${base_uri}/fix/geocoder?lat=${query.lat}&lon=${query.lon}`)
  },
  /**
   * 新报价数量
   */
  getNewPrice() {
    return axiosApi.get(`${base_uri}/user/newprice`)
  }
};
