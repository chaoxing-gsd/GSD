/**
 * Created by Aaron on 2018/6/20.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Glyphicon} from 'react-bootstrap';
import {connect} from 'react-redux';
import {isLogined} from '../../actions'
import {browserHistory} from 'react-router'
import {getLocalUserInfo} from "../../utils/utils";
export default function requireAuthentication(Component) {

    class AuthenticatedComponent extends React.Component {



        componentDidMount(){
            var userInfo=getLocalUserInfo();
            if(!!userInfo&&!!userInfo.userid){

            }else{
                browserHistory.replace("login");
            }
        }




        render() {
            return (
                <Component {...this.props}/>
            )

        }
    }

    const mapStateToProps = (state) => {


        return {
            routing:state.routing,
            userInfos:state.userInfos
        }
    };

    const mapDispatchToProps = (dispatch, props) => {
      
        return {

        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);

}