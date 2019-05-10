import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router';
import {saveHistoryData} from "../../actions";
import {Grid, Row, Col, Modal, Button, Panel} from 'react-bootstrap';
import {browserHistory} from 'react-router'
import {getGroupContainTags, getSearchResult, setToolMode} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import Search from "./Search"

import Header from './Header'
import Nav from './Nav';


class SearchResult extends Component {
    static propTypes = {
        intl: intlShape.isRequired
    }

    constructor(props) {
        super(props);
        this.userId = null;
        this.state = {};

    }

    componentDidMount() {
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.userId = this.props.userInfos.responseUserInfo.userid;
            var searchValue = this.props.location.query.searchValue;
            var header = {
                userid: this.props.userInfos.responseUserInfo.userid,
                token: this.props.userInfos.responseUserInfo.token
            };
            this.props.saveHistoryData(this.props.userInfos.responseUserInfo.userid, searchValue, header);

        }
        var searchValue = this.props.location.query.searchValue;
        document.title=this.props.intl.formatMessage({id: 'Search Result'})+"-"+this.props.intl.formatMessage({id: 'ALL'})+"-"+searchValue+"-GSD";
    }

    componentWillReceiveProps(nextProps) {
        if (this.userId == null && !!nextProps.userInfos.responseUserInfo.userid) {
            this.userId = nextProps.userInfos.responseUserInfo.userid;
            var searchValue = this.props.location.query.searchValue;
            var header = {
                userid: nextProps.userInfos.responseUserInfo.userid,
                token: nextProps.userInfos.responseUserInfo.token
            };
            this.props.saveHistoryData(nextProps.userInfos.responseUserInfo.userid, searchValue, header);


        }
    }

    tabChange(index, menu) {

        // if(index==0){
        //     this.props.getSearchResult(this.props.location.query.searchValue,{});
        // }
        if (index == 1) {
            var tabIndex = this.props.personality.pageInfos.tabIndex;
            var currentTab = this.props.personality.myGroupTags[tabIndex];
            if (!!currentTab) {//当前标签存在
                var header = {
                    userid: this.props.userInfos.responseUserInfo.userid,
                    token: this.props.userInfos.responseUserInfo.token
                };
                this.props.getGroupContainTags(this.props.userInfos.responseUserInfo.userid, currentTab.categoryid, header)
            }
        }
        if (!!menu.url)browserHistory.push(menu.url + "/" + this.props.location.query.searchValue);
    }

    componentWillMount() {
        this.props.setToolMode(false);
    }


    render() {
        const {children}=this.props;
        const altHolder = this.props.intl.formatMessage({id: 'PROJECT_NAME'});
        return (
            <div>
                <Header {...this.props}/>
                <Search {...this.props}/>
                <Grid style={{marginTop:"30px"}}>

                    <Row>
                        <Col className={!this.props.userInfos.showToolsMode?"left-bar":"left-bar hide"} sm={12} md={12}
                             lg={12}>

                            <Nav onChange={(index,value)=>this.tabChange(index,value)} {...this.props}></Nav>
                            {children}
                        </Col>
                    </Row>

                </Grid>


            </div>

        )
    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        personality: state.personality
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getGroupContainTags: (userId, groupId, header)=>dispatch(getGroupContainTags(userId, groupId, header)),
        getSearchResult: (searchTitle, ids) => dispatch(getSearchResult(searchTitle, ids)),
        setToolMode: (mode)=>dispatch(setToolMode(mode)),
        saveHistoryData: (userId, title, header)=>dispatch(saveHistoryData(userId, title, header))

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SearchResult));
