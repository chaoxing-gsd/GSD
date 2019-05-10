import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router';

import {Grid, Row, Col, Modal, Button, Panel} from 'react-bootstrap';
import { browserHistory } from 'react-router'
import {getGroupContainTags,getSearchResult,setToolMode} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import { Breadcrumb } from 'antd';
import ResultList from '../result/ResultList'

import Search from "../result/Search"
import Header from '../result/Header'


class SearchResult extends Component {
    static propTypes = {
        intl: intlShape.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {filterData:{}};

    }



    componentDidMount() {
        var channel=this.props.location.query.channel;
        var libName=this.props.intl.formatMessage({id: channel})||"";
        document.title=this.props.intl.formatMessage({id: 'Search Result'})+"-"+libName+"-"+this.props.location.query.searchValue+"-GSD";

    }

    componentWillMount(){
        this.props.setToolMode(false);
    }

    render() {

        const type=this.props.location.query.type;
        var libId=this.props.location.query.channel+(!!this.props.location.query.degree?("_"+this.props.location.query.degree):'');
        console.log(libId);
        const LIB_NAME=this.props.intl.formatMessage({id: libId});

        return (
            <div>
                <Header {...this.props}/>
                <Search {...this.props}/>
                <Grid style={{marginTop:"30px"}}>

                    <Row>
                        <Col className={!this.props.userInfos.showToolsMode?"left-bar":"left-bar hide"} sm={12} md={12} lg={12}>
                            <div>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item href="/"><FormattedMessage id="HOME"/></Breadcrumb.Item>
                                <Breadcrumb.Item href={`/search?searchValue=${this.props.location.query.searchValue}`}><FormattedMessage id="ALL_RESULT"/></Breadcrumb.Item>
                                <Breadcrumb.Item><strong>{LIB_NAME}</strong></Breadcrumb.Item>
                            </Breadcrumb>
                               

                                </div>
                            <div style={{marginTop:"15px"}}>
                                <ResultList location={this.props.location} degree={this.props.location.query.degree} choren={this.props.location.query.choren} clusterMode={false} queryType={2} libIds={[{id:this.props.location.query.channel,type:this.props.location.query.type}]}/>
                                </div>

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
        getGroupContainTags:(userId,groupId)=>dispatch(getGroupContainTags(userId,groupId)),
        getSearchResult:(searchTitle, ids) => dispatch(getSearchResult(searchTitle, ids)),
        setToolMode:(mode)=>dispatch(setToolMode(mode))

    }
}



export default connect(mapStateToProps,mapDispatchToProps)(injectIntl(SearchResult));
