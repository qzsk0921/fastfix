import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
  Button,
  List, 
  Picker, 
  DatePicker, 
  InputItem, 
  Modal, 
  Toast
} from 'antd-mobile'
import cookie from 'react-cookies'
import Request from '../../api/index'
import './index.css'

const Item = List.Item

const brandsMap = {};

const submitCar = function(data) {
  Modal.alert('提交车辆信息', '确定提交？', [
    { text: '确定', style: 'default', onPress: () => {
      let info = Object.assign({}, data, {
        userId: cookie.load('userId'),
        createTime: new Date().toJSON(),
        brandName: brandsMap[data.brandId]
      });

      Request.addCar(info).then((rsp) => {
        if (rsp.data && rsp.data.code === 20000) {
          const query = this.props.location && this.props.location.query;

          if (query && query.back) {
            history.back();
          }

          Toast.success('车辆信息提交成功', 3, null, false)
        } else {
          throw rsp.code;
        }
      }).catch(() => {
        Toast.fail('车辆信息提交失败!', 3, null, false)
      });
    }
  },
    { text: '取消', onPress: () => setTimeout(Toast.success, 300, '车辆信息已取消') }
  ]) 
}

const formatPickerNum = (val) => {
  if (val && val.length) {
    return val[0];
  }
}

const formatNumToArray = (val) => {
  return [val];
}

class carPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      brandId: 0,
      brandName: '',
      createTime: 0,
      carStatus: 0,
      mileage: 0,
      model: '',
      plateNum: '',
      purchaseDate: '',
      updateTime: '',
    }
  }
  
  render () {
    const state = this.state
    const props = this.props
    return (
      <div className="qf-repair">
        <List className="qf-repair-list">
          <Picker value={formatNumToArray(state.brandId)} data={props.brands} cols={1}
            onChange={val => this.setState({ brandId: formatPickerNum(val) })}>
            <Item arrow="horizontal">车辆品牌</Item>
          </Picker>
          <InputItem value={state.model} placeholder="型号" type="text"
            onChange={val => this.setState({ model: val })}
          >车辆型号</InputItem>
          <InputItem value={state.mileage} placeholder="里程" type="number"
            onChange={val => this.setState({ mileage: val })}
          >里程</InputItem>
          <InputItem value={state.plateNum} placeholder="请填写" type="text"
            onChange={val => this.setState({ plateNum: val })}
          >车牌号码</InputItem>
          <DatePicker value={state.purchaseDate} mode="month" 
            onChange={val => this.setState({ purchaseDate: val })}
            ><Item arrow="horizontal">购买时间</Item>
          </DatePicker>
          <DatePicker value={state.updateTime} mode="month" 
            onChange={val => this.setState({ updateTime: val })}
            ><Item arrow="horizontal">最近修理时间</Item>
          </DatePicker>
        </List>

        <Button className="qf-repair-submit-button" type="primary" onClick={() => { submitCar.call(this, state) }}>提交信息</Button>
      </div>
    )
  }

  componentDidMount () {
    Request.getBrands().then(({ data: rsp }) => {
      let { result } = rsp || {};

      this.props.updateBrands(result);
    })
  }
}

carPage.propTypes = {
  user: PropTypes.object,
  brands: PropTypes.array,
  updateBrands: PropTypes.func,
}

const mapStateToProps = state => ({
  user: state.userInfo,
  brands: state.brands,
})

const mapDispatchToProps = dispatch => ({
  updateBrands: list => {
    let brands = [];

    list.forEach((brand) => {
      brands.push({ label: brand.brandName, value: brand.id })
      brandsMap[brand.id] = brand.brandName;
    })
  
    dispatch({ type: 'updateBrands', list: brands});
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(carPage)