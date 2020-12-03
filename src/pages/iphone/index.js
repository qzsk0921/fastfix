import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Button,
    List,
    InputItem,
    Toast
} from 'antd-mobile'
import Request from '../../api/index'
import './index.css'

class iphonePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            code: '',
            tel: '',
            time: 60,
            btnDisable: false,
            submitDisable:true,
            btnContent: '发送验证码'
        }
    }

    render() {
        const state = this.state
        // const props = this.props
        let timeChange;
        // let ti = this.state.time;
        //关键在于用ti取代time进行计算和判断，因为time在render里不断刷新，但在方法中不会进行刷新

        const sendCode = () => {
            Request.getCOde(this.state.tel).then(res => {
                console.log(res);
                if(res.data.code===20000){
                    Toast.success('发送成功', 3, null, false)
                    this.setState({
                        btnDisable: true,
                        time: 60,
                        btnContent: "60s",
                    });
                    timeChange = setInterval(clock,1000);
                }
                 //每隔一秒执行一次clock方法
            })
        };
        const submitIphone = ()=> {
            let query={}
            query.code=this.state.code
            query.tel=this.state.tel
            Request.setIphone(query).then(res => {
                if(res.data.code===20000){
                 Toast.success('设置成功', 3, null, false)
                 setTimeout(()=>{
                  history.back();
                 },4000)
                 this.setState({
                    time: 0,
                });
                timeChange = setInterval(clock,1000);
                }else{
                Toast.fail(res.data.details, 3, null, false)
                }
            })
        }
        const clock = () => {
            let ti =this.state.time
            if (ti > 0) {
                //当ti>0时执行更新方法
                ti = ti - 1;
                this.setState({
                    time: ti,
                    btnContent: ti + "s",
                });
            } else {
                //当ti=0时执行终止循环方法
                clearInterval(timeChange);
                this.setState({
                    btnDisable: false,
                    btnContent: "发送验证码",
                });
            }
        };
        return (
            <div className="qf-repair">
                <List className="qf-repair-list">
                    <InputItem value={state.tel} type="number"
                        onChange={val => this.setState({ tel: val })}
                    >手机号码</InputItem>
                    <InputItem value={state.code} placeholder="请填写" type="number"
                        onChange={val => this.setState({ code: val, submitDisable:false })}
                    >验证码</InputItem>
                    <Button className="qf-repair-submit-button  code-button" type="primary" onClick={sendCode} disabled={this.state.btnDisable}>{this.state.btnContent}</Button>
                    <Button className="qf-repair-submit-button" type="primary" onClick={submitIphone} disabled={this.state.submitDisable}>确认提交</Button>
                </List>

            </div>
        )
    }
    shouldComponentUpdate() {
        return true;
      }
}

iphonePage.propTypes = {
    user: PropTypes.object,
}

const mapStateToProps = state => ({
    user: state.userInfo,
})

const mapDispatchToProps = dispatch => ({
    updateBrands: list => {
        let brands = [];
        console.log(list);
        dispatch({ type: 'updateBrands', list: brands });
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(iphonePage)