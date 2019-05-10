import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import {withStyles} from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import {Glyphicon} from 'react-bootstrap';
import {Breadcrumb} from 'antd';
import Header  from "./header";
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {browserHistory} from 'react-router'

import { Tabs } from 'antd';

import MyProfileHome from "./sys/MyProfileHome"
import MyIndexs from './myIndexs'
import MySource from './mySource'
import HistoryList from './history/history'
import CompareTags from './compare'
import Account from "./sys/Account"

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        marginTop: "10px"
    },
    buttonInfo: {
        display: "inline-block",
        fontSize: "12px",
        minWidth: '30px',
        minHeight: "30px",
        color: "rgb(138, 135, 135)",
        '&:hover': {
            // backgroundColor: "#d45f5f",
            // color:"#ffffff"

        },
    },
    buttonEmail:{
        background: "#2196f3",
        display: "block",
        width:"100%",
        color: "#ffffff",
        border: "none",
        fontSize: "14px",
        '&:disabled': {
            backgroundColor: "#cccccc",
            // color:"#ffffff"

        },
        '&:hover': {
            backgroundColor: "#46a6f3",
            // color:"#ffffff"

        },
    },

});


const TabPane = Tabs.TabPane;

class MyProfile extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {isEditing: false, userFileNumData: {}, searchRankList: [], userFrequencyList: [],currentMyDataPage:1,myDataList:[],currentTabIndex:"0"}
        this.cxId;

    }




    componentDidMount() {
        document.title=this.props.intl.formatMessage({id: 'MY_PROFILE'})+"-"+this.props.intl.formatMessage({id: 'PROJECT_NAME'});
        var curentTabIndex=this.props.location.query.tabIndex||"0";
        this.setState({currentTabIndex:curentTabIndex});


    }


    componentWillReceiveProps(nextProps) {

    }

    handleTabKeyChange(key){
        this.setState({currentTabIndex:key})
        history.replaceState({data:111},"1222","/myProfile?tabIndex="+key);
    }


    render() {
        const {classes} = this.props;


        return (
            <div>
                <Header/>
                <Grid style={{marginTop:"30px"}}>
                    <Tabs style={{marginTop:"20px"}} className="gsd-tabs" defaultActiveKey="0" activeKey={this.state.currentTabIndex} onChange={(key)=>{this.handleTabKeyChange(key)}}>
                        <TabPane tab={<FormattedMessage
                            id="Account Management"/>} key="0"><Account/></TabPane>
                    </Tabs>
                </Grid>
            </div>
        );
    }

}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        myIndexs: state.myIndexs
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(MyProfile)))
