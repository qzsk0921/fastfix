import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Button,
  List,
  Picker,
  InputItem,
  ImagePicker,
  TextareaItem,
  Switch,
  Modal,
  Toast,
  DatePicker,
} from "antd-mobile";
import cookie from "react-cookies";
// import { Link } from "react-router-dom";
import Request from "../../api/index";
import Config from "../../business/config";
import * as qiniu from "qiniu-js";
import "./index.css";
import { withRouter } from "react-router-dom";
// import car from "../car";
// const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// var qqmapsdk;

const Item = List.Item;
const whiteList = [
  "effectiveTime",
  "fixWay",
  "isRescue",
  "longitude",
  "latitude",
  "addr",
];

const submitRepair = (data, props) => {
  Modal.alert("提交订单", "确定提交订单？", [
    {
      text: "确定",
      style: "default",
      onPress: () => {
        for (let i in data) {
          if (!whiteList.includes(i)) {
            if (data[i] instanceof Array && !data[i].length) {
              Toast.info("请填写完整", 1);
              return false;
            } else if (!data[i]) {
              // console.log(i)
              Toast.info("请填写完整", 1);
              return false;
            }
          }
        }

        let info = Object.assign({}, data, {
          userId: cookie.load("userId"),
          imageFiles: null,
          tel: data.tel.replace(/\s/g, ""),
        });
        console.log(info, 888888);

        Request.createFixOrder(info)
          .then((rsp) => {
            if (rsp.data && rsp.data.code === 20000) {
              Toast.success("订单提交成功", 3, null, false);
              props.history.push("/");
              props.toggleNavOrder();
            } else {
              Toast.fail("订单提交失败", 3, null, false);
            }
          })
          .catch(() => {
            Toast.fail("订单提交失败!", 3, null, false);
          });
      },
    },
    {
      text: "取消",
      onPress: () => setTimeout(Toast.success, 300, "订单已取消"),
    },
  ]);
};

const formatPickerNum = (val) => {
  if (val && val.length) {
    return val[0];
  }
};

const formatNumToArray = (val) => {
  return [val];
};

function dataURLtoFile(dataurl, filename) {
  //将base64转换为文件
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function createImageKey(name) {
  return name.replace(/\./, `-${Date.now()}.`);
}
class RepairPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRescue: false,
      // carId: "",
      // car: {
      brandName: null,
      model: null,
      mileage: null,
      purchaseDate: "",
      plateNum: null,
      // },
      name: "",
      tel: "",
      longitude: null,
      latitude: null,
      addr: null,
      // model: "",
      imageFiles: [],
      imgUrls: [],
      discription: "",
      // fixType: 0,
      fixWay: 0,
      effectiveTime: 7,
      // showAddCar: false,
    };
  }

  uploadImage(files, operationType, index) {
    const imgUrls = this.state.imgUrls;
    console.log("file", files, operationType, index);
    switch (operationType) {
      case "add":
        files.forEach((upload, index) => {
          if (!imgUrls[index]) {
            imgUrls[index] = "wait";
            console.log("上传");
            let UpToken = this.props.uploadToken.UpToken;
            qiniu
              .upload(
                dataURLtoFile(upload.url, upload.file.name),
                createImageKey(upload.file.name),
                UpToken
              )
              .subscribe(
                () => {
                  console.log("next");
                },
                (...agrs) => {
                  imgUrls[index] = null;
                  console.log("error", agrs);
                },
                (rsp) => {
                  imgUrls[index] = `http://cdn2.xiaobotech.com/${
                    rsp.key || rsp.hash
                  }`;
                  console.log("success", rsp);
                  this.setState({
                    imgUrls: imgUrls,
                  });
                }
              );
          }
        });
        break;
      case "remove":
        imgUrls.splice(index, 1);

        console.log(imgUrls);
        this.setState({
          imgUrls: imgUrls,
        });
        break;
    }

    this.setState({
      imageFiles: files,
    });
  }

  render() {
    const state = this.state;
    const props = this.props;
    return (
      <div className="qf-repair">
        <List className="qf-repair-list">
          {/* {state.showAddCar ? (
            <Item>
              <Link
                to={{ pathname: "/car", query: { back: 1 }, state: "back" }}
              >
                <Button
                  type="primary"
                  className="qf-add-car-entry"
                  inline
                  size="small"
                >
                  新加车辆
                </Button>
              </Link>
            </Item>
          ) : (
            ""
          )} */}
          <Item
            extra={
              <Switch
                checked={state.isRescue}
                onClick={(checked) => this.setState({ isRescue: checked })}
              />
            }
          >
            道路救援
          </Item>
        </List>

        <List className="qf-repair-list">
          {/* <Picker
            value={formatNumToArray(state.carId)}
            data={props.mineCars}
            cols={1}
            onChange={(val) => this.setState({ carId: formatPickerNum(val) })}
            onVisibleChange={(val) => this.setState({ showAddCar: val })}
          >
            <Item arrow="horizontal">车辆选择</Item>
          </Picker> */}
          {/* <InputItem value={state.longitude} placeholder="请填写" type="digit"
            onChange={val => this.setState({ longitude: val })}
          >经度</InputItem>
          <InputItem value={state.latitude} placeholder="请填写" type="digit"
            onChange={val => this.setState({ latitude: val })}
          >纬度</InputItem> */}
          <InputItem
            value={state.brandName}
            placeholder="保时捷、大众、本田"
            onChange={(val) => {
              // let car = state.car
              // car.brandName = val
              // this.setState({ car })
              this.setState({ brandName: val });
            }}
          >
            车辆品牌
          </InputItem>
          <InputItem
            value={state.model}
            placeholder="朗逸1.6手自一体2013版"
            onChange={(val) => {
              this.setState({ model: val });
            }}
          >
            车辆型号
          </InputItem>
          <Picker
            value={formatNumToArray(state.mileage)}
            // data={props.mineCars}
            data={Config.mileage}
            cols={1}
            onChange={(val) => {
              // let car = state.car
              // car.mileage = formatPickerNum(val)
              // this.setState({ car })
              this.setState({ mileage: formatPickerNum(val) });
            }}
            // onVisibleChange={(val) => this.setState({ showAddCar: val })}
          >
            <Item arrow="horizontal">行驶里程</Item>
          </Picker>
          <DatePicker
            value={state.purchaseDate}
            mode="month"
            format="YYYY-MM-DD"
            maxDate={new Date()}
            onChange={(val) => {
              this.setState({
                purchaseDate: val,
              });
            }}
          >
            <Item arrow="horizontal">出厂时间</Item>
          </DatePicker>
        </List>

        <div className="qf-repair-list qf-repair-image">
          <div className="qf-repair-list-header">车损照片</div>
          <div className="qf-repair-list-subheader">最多八张</div>
          <ImagePicker
            className="qf-repair-image-picker"
            files={state.imageFiles}
            multiple
            onChange={this.uploadImage.bind(this)}
          ></ImagePicker>
        </div>

        <div className="qf-repair-list qf-repair-description">
          <div className="qf-repair-list-header">情况描述及维修要求</div>
          <TextareaItem
            placeholder="最多2000字，例如：车头保险杠剐蹭，需要重新上漆"
            onChange={(val) => this.setState({ discription: val })}
            autoHeight
          />
        </div>

        <List className="qf-repair-list">
          <InputItem
            value={state.name}
            placeholder="请填写"
            onChange={(val) => this.setState({ name: val })}
          >
            联系人
          </InputItem>
          <InputItem
            value={state.tel}
            placeholder="手机号码"
            type="phone"
            onChange={(val) => this.setState({ tel: val })}
          >
            联系电话
          </InputItem>
          <InputItem
            value={state.plateNum}
            placeholder="闽D00000"
            onChange={(val) => {
              this.setState({ plateNum: val });
            }}
          >
            车牌号码
          </InputItem>
          <div className="qf-repair-private-tip">
            以上信息仅在您接受报价后，显示给报价方！
          </div>
        </List>

        <List className="qf-repair-list">
          {/* <Picker
            value={formatNumToArray(state.fixType)}
            data={Config.fixTypeData}
            cols={1}
            onChange={(val) => this.setState({ fixType: formatPickerNum(val) })}
          >
            <Item arrow="horizontal">修理方式</Item>
          </Picker> */}
          <Picker
            value={formatNumToArray(state.effectiveTime)}
            data={Config.fixOrderExpire}
            cols={1}
            onChange={(val) =>
              this.setState({ effectiveTime: formatPickerNum(val) })
            }
          >
            <Item arrow="horizontal">订单有效期</Item>
          </Picker>
          <Picker
            value={formatNumToArray(state.fixWay)}
            data={Config.deliveryData}
            cols={1}
            onChange={(val) => this.setState({ fixWay: formatPickerNum(val) })}
          >
            <Item arrow="horizontal">接送车方式</Item>
          </Picker>
          {state.fixWay === 1 ? (
            <InputItem
              value={state.addr}
              placeholder="请填写"
              onChange={(val) => this.setState({ addr: val })}
            >
              详细地址
            </InputItem>
          ) : (
            ""
          )}
        </List>

        <Button
          className="qf-repair-submit-button"
          type="primary"
          onClick={() => {
            submitRepair(state, props);
          }}
        >
          提交订单
        </Button>
      </div>
    );
  }

  componentDidMount() {
    Request.getCarsList().then(({ data: rsp }) => {
      let { result } = rsp || {};

      this.props.updateCars(result);
    });
    this.props.wxSdk.then((wxSdk) => {
      console.log(wxSdk, "可以");
      wxSdk.getLocation({
        type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: (res) => {
          this.setState({
            longitude: res.longitude,
            latitude: res.latitude,
          });
          // 经纬度转换
          Request.getAddress({ lon: res.longitude, lat: res.latitude }).then(
            ({ data: res }) => {
              const { result } = res || {};
              this.setState({
                addr: result.address,
              });
            }
          );
          // geocoder = new qq.maps.Geocoder({
          //   complete: function (result) {
          //     console.log(JSON.stringify(result.detail));
          //   },
          // });
          // var coord = new qq.maps.LatLng(lat, lng);
          // geocoder.getAddress(coord);

          // Request.getAddress({
          //   longitude: res.longitude,
          //   latitude: res.latitude,
          // }).then(({ data: res }) => {
          //   const { result } = res || {};
          //   this.setState({
          //     addr: result.address,
          //   });
          // });
        },
      });
    });
  }
  shouldComponentUpdate() {
    return true;
  }
}

RepairPage.propTypes = {
  wxSdk: PropTypes.object,
  user: PropTypes.object,
  mineCars: PropTypes.array,
  uploadToken: PropTypes.object,
  updateCars: PropTypes.func,
  toggleNavOrder: PropTypes.func,
};

const mapStateToProps = (state) => ({
  wxSdk: state.wxSdk,
  user: state.userInfo,
  uploadToken: state.uploadToken,
  mineCars: state.mineCars,
});

const mapDispatchToProps = (dispatch) => ({
  updateCars: (list) => {
    let cars = [];

    list.forEach((car) => {
      cars.push({
        label: `${car.brandName}-${car.model}-${car.plateNum}`,
        value: car.id,
      });
    });

    dispatch({ type: "updateCars", list: cars });
  },
  toggleNavOrder: () => dispatch({ type: "toggleNavIndex", index: 2 }),
});

// export default connect(mapStateToProps, mapDispatchToProps)(RepairPage);

const RRepairPage = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RepairPage)
);

export default RRepairPage;
