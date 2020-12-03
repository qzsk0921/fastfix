import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { List, Flex } from 'antd-mobile'
import Request from '../../api/index'
import './index.css'
// import { Link } from 'react-router-dom'

const Item = List.Item

class MePage extends React.Component {
  render () {
    const { user } = this.props

    return (
      <div className="qf-me">
      <Flex className="qf-me-header" align="center" justify="center">
        <div className="qf-me-avatar-container">
          <img src={user.avatar} alt="avatar" />
        </div>
        <div className="qf-me-nickname">
          {user.nickname}
        </div>
      </Flex>
      <List>
        <Item arrow="horizontal" >{user.nickname}</Item>
        {/* <Link to="/iphone" className="qf-home-nav-item"> 
         <Item arrow="horizontal">{user.phoneNumber}</Item>
        </Link> */}
        <Item>客户服务</Item>
        <Item>退出登录</Item>
      </List>
      <Flex className="qf-me-ad" justify="center" align="center">品牌宣传or广告</Flex>
    </div>
    )
  }

  componentDidMount () {
    Request.getUserInfo().then((rsp = {}) => {
      let { result } = rsp;

      this.props.updateUser({ 
        nickname: result.nickname,
        avatar: result.headImgUrl,
        phoneNumber:result.tel
      });
    })
  }
  shouldComponentUpdate() {
    return true;
  }
}

MePage.propTypes = {
  user: PropTypes.object,
  updateUser: PropTypes.func
}

const mapStateToProps = state => ({
  user: state.userInfo,
})

const mapDispatchToProps = dispatch => ({
  updateUser: user => dispatch({ type: 'updateUser', user}) 
})

export default connect(mapStateToProps, mapDispatchToProps)(MePage)