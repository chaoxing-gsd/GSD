/**
 * Created by Aaron on 2018/6/20.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
class PlaceHolder extends Component {
    static propTypes = {
        height: PropTypes.number,
        width: PropTypes.number,
        background: PropTypes.string

    }


    render() {
        const {height,width,background}=this.props;
        return (
            <div height={height} width={width} style={{backgroundColor:background||"#e0e0e0",display:'block'}}>加载中....</div>

        );
    }
}

export default PlaceHolder