import Request from '../api/index'
// import wx from 'weixin-js-sdk'

export default {
    appid: 'wxe9760d83354a0fdf',
    weixinUri: function() {
        return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appid}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
    },
    deliveryData: [
        { label: '到店维修', value: 0 },
        { label: '上门提车', value: 1 },
        // { label: '拖车', value: 2 },
    ],
    // fixTypeData: [
    //     { label: '剐蹭', value: 0 },
    //     { label: '修理 ', value: 1 },
    //     { label: '美容', value: 2 }, 
    //     { label: '保养', value: 3 }, 
    // ],
    fixOrderStatus: {
        0: { label: '订单取消', value: 0 },
        1: { label: '等待报价', value: 1 },
        2: { label: '等待支付', value: 2 },
        3: { label: '等待维修', value: 3 },
        4: { label: '订单完成', value: 4 },
        5: { label: '订单异常', value: 5 },
        6: { label: '等待确认', value: 6 },
    },
    fixOrderExpire: [
      { label: '1天', value: 1 },
      { label: '7天', value: 7 },
      { label: '30天', value: 30 }, 
    ],
    mileage: [
      { label: '1万公里以内', value: '1万公里以内' },
      { label: '1~2万公里', value: '1~2万公里' },
      { label: '2~3万公里', value: '2~3万公里' },
      { label: '3~5万公里', value: '3~5万公里' },
      { label: '5~10万公里', value: '5~10万公里' },
      { label: '10~15万公里', value: '10~15万公里' },
      { label: '15~20万公里', value: '15~20万公里' }
    ],
    factoryTime: [
      { label: '1天', value: 0 },
      { label: '7天', value: 1 },
      { label: '30天', value: 2 }, 
    ],
    escapeTraffic(code, type) {
        let map;

        if (type === 'way') {
          map = this.deliveryData;
        } else if (type === 'type'){
          map = this.fixTypeData;
        } else {
          map = this.fixOrderStatus;
        }
      
        if (Array.isArray(map)) {
          for(let each of map) {
            if (each.value == code) {
              return each.label;
            }
          }
        } else if (typeof map === 'object') {
          return map[code] ? map[code].label : ''; 
        }
      
        return '';
    },
    initWxsdk() {
      return new Promise((resolve, reject) => {
        Request.getWxSignature().then(rsp => {
          const result = rsp.data.result;
          try {
            window.wx.config({
              debug: false,
              appId:result.appId, // 必填，公众号的唯一标识
              timestamp: result.timestamp, // 必填，生成签名的时间戳
              nonceStr:result.nonceStr, // 必填，生成签名的随机串
              signature: result.signature,// 必填，签名
              jsApiList: ['getLocation','chooseWXPay'] // 必填，需要使用的JS接口列表
            });
            window.wx.ready(function(){
              console.log('wx sdk success');
              resolve(window.wx);
            });
      
            window.wx.error((err) => {
              console.log('wx sdk error');
              reject(err);
            })
          } catch (ex) {
            reject(ex);
          }
        })
      })
    }
};