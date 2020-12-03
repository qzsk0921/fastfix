import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const mapStateToProps = state => ({ 
    session: state.offer.new
})
const mapDispatchToProps = dispatch => ({
    onUserLogin: userInfo => dispatch({ type: 'initUserInfo', userInfo}) 
})
  
export default connect(mapStateToProps, mapDispatchToProps)(InitBusiness)