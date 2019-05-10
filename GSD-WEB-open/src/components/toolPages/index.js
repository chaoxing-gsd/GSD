/**
 * Created by Aaron on 2018/9/13.
 */
/**
 * Created by Aaron on 2018/7/22.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router';
import {Grid, Row, Col, Modal, Panel} from 'react-bootstrap';
import {browserHistory} from 'react-router'
import {getHistoryData, deleteSearchHistory} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {PreImage} from '../plugins'
import {Breadcrumb} from 'antd';
import ResultList from '../result/ResultList'
import FilterComp from "../result/filter"
import Paper from '@material-ui/core/Paper';
import Header from '../result/Header'
import {Timeline, Tag, Popover,Badge} from 'antd';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
const { CheckableTag } = Tag;
const styles = theme => ({
    rootPage: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        width: '100%',
        marginTop:'30px'
    },
    historyBtn: {
        color: "#ffffff",
        backgroundColor: "#d45f5f",
        border: "none",
        fontSize: '12px',
        padding: "0.4rem 1rem",
        '&:hover': {
            backgroundColor: "#ad2f2f",
            color: "#ffffff",
        },
        '&:disabled': {
            backgroundColor: "#cccccc",
            color: "#ffffff",
        },
    },
    recordBtn: {
        color: "#ffffff",
        border: "none",
        backgroundColor: "#d45f5f",
        fontSize: '12px',
        padding: "0.4rem 1rem",
        '&:hover': {
            backgroundColor: "#ad2f2f",
            color: "#ffffff",
        },
        '&:disabled': {
            backgroundColor: "#cccccc",
            color: "#ffffff",
        },
    },
});


class ToolPage extends Component {
    static propTypes = {
        intl: intlShape.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {selectedItem: {}};
        this.cxId;

    }


    componentDidMount() {

        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header={userid:this.cxId,token:this.props.userInfos.responseUserInfo.token};
            this.props.getHistoryData(this.cxId,header);
        }
    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.userInfos.responseUserInfo.userid!=""&&nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header={userid:this.cxId,token:nextProps.userInfos.responseUserInfo.token};
            this.props.getHistoryData(this.cxId,header);
        }
    }

    renderOperation() {
        const {classes}=this.props;
        const enabled=!!Object.keys(this.state.selectedItem)&&Object.keys(this.state.selectedItem).length>0;
        return <div style={{margin:"5px 0 25px 0px"}}><Button disabled={!enabled} className={classes.historyBtn} size="small" variant="outlined"
                                                              compoment={!enabled?"button":"a"}
                                                              href={!enabled?null:`/search?searchValue=${this.state.selectedItem.split("_")[1]}`}
                                                              target="_blank">
            <FormattedMessage id="Search"/>
        </Button><Button style={{marginLeft:"10px"}} variant="outlined" disabled={!enabled} className={classes.recordBtn} size="small"
                         href={!enabled?null:`/analyse?searchValue=${this.state.selectedItem.split("_")[1]}`}
                         compoment={!enabled?"button":"a"} target="_blank">
            <FormattedMessage id="View Records"/>
        </Button>
            <span style={{fontSize:'12px',marginLeft:'10px'}}><FormattedMessage id="History Word Count"/></span>

        </div>

    }

    removeSearchHistory(sItem) {
        this.props.deleteSearchHistory(this.cxId, sItem);
    }

    handleTagChange(checked,item,sitem){
        if(checked){
            this.setState({selectedItem:item+"_"+sitem})
        }else{
            this.setState({selectedItem:""})
        }

    }

    render() {

        const type = this.props.location.query.type;
        console.log(this.props.historyData.historyList);
        const {classes}=this.props;
        const timeKeys = Object.keys(this.props.historyData.historyList) || [];
        return (
            <div>
                <style type='text/css'>{`.footer{display:none}`}</style>
             




            </div>

        )
    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,

        historyData: state.historyData
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getHistoryData: (userId,header)=>dispatch(getHistoryData(userId,header)),
        deleteSearchHistory: (userId, searchId)=>dispatch(deleteSearchHistory(userId, searchId)),


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(injectIntl(ToolPage)));
