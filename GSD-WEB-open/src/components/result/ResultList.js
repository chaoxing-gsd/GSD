/**
 * Created by Aaron on 2018/7/13.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router';

import {Grid, Row, Col, Modal, Button, Panel} from 'react-bootstrap';
import {browserHistory} from 'react-router'
import {getGroupContainTags, getSearchResult} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import ClusterResultItem from "./ClusterResultItem";
import {Breadcrumb} from 'antd';
import SingleResultPageList from "./SingleResultPageList";
import {getLocalUserInfo} from "../../utils/utils";
import {setSeverResponseUserInfos, userLogout} from "../../actions";


const LIBS = [
    {id: "gsd_baidutiku1", type: "2"},
    {id: "textref_zhonghuajingdian", type: "2"},
    {id: "textref_kanripo", type: "2"},
    {id: "textref_ctext", type: "2"},
    {id: "textref_cbta", type: "2"},
    {id: "biogref_dnb", type: "2"},
    {id: "biogref_ddbc", type: "2"},
    {id: "biogref_cbdb", type: "2"},
    {id: "sanfrancisco_picture", type: "2"},
    {id: "stanford_database", type: "2"},

    // {id: "gsd_bksy", type: "2"},
    {id: "gsd_hkpu", type: "2"},
    {id: "gsd_nsf", type: "2"},
    {id: "gsd_hks", type: "2"},
    {id: "gsd_national_natural_science", type: "2"},
    // {id: "gsd_china_comp_gazetteers", type: "2"},
    {id: "gsd_hongkongeducationuniversity", type: "2"},
    {id: "gsd_quandashi", type: "2"},
    {id: "gsd_aaa", type: "2"},
    {id: "gsd_cmd", type: "2"},
    {id: "gsd_whtd", type: "2"},
    {id: "gsd_fcsd", type: "2"},

    {id: "gsd_kaggle", type: "2"},
    {id: "gsd_tpld", type: "2"},

];


class ResultList extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        clusterMode: PropTypes.bool,
        libIds: PropTypes.array,
        queryType: PropTypes.number,
    }


    constructor(props) {
        super(props);
        this.state = {filterData: {},clusterList:[],libIds:[],searchValue: this.props.initValue || ''};
    }


    componentDidMount() {

        this.setState({libIds:this.props.libIds});
        //查看是否登陆
        var userInfo = getLocalUserInfo();
        if (!!userInfo && !!userInfo.userid) {
            this.props.setSeverResponseUserInfos({responseUserInfo: {...userInfo}});            
        }        

    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.libIds&&JSON.stringify(nextProps.libIds) != JSON.stringify(this.state.libIds)) {
            this.setState({libIds:nextProps.libIds});
        }
        this.setState({searchValue:nextProps.searchResult.searchTitle})
        console.log(nextProps.libIds);
        if (!!this.props.userInfos.responseUserInfo.userid) {
            if(LIBS[0].id != "gsd_notes"){
                LIBS.unshift({id: "gsd_notes", type: "3"});
            }            
        }
    }


    renderClusterList() {
        var libIds = (this.state.libIds || LIBS).slice(0);
        console.log(libIds);


      

        var clusterArras = libIds.reduce((sarr, item, index) => {

            sarr.push(<div key={item.id} >

                <ClusterResultItem index={index} type={item.type} libId={item.id}/></div>);
            return sarr;
        }, []);
        if(this.state.searchValue == ''){
            return <div>
            {
                clusterArras.splice(0,14)
            }
        </div>;
        }else return <div>
            {clusterArras
            }
        </div>;
    }

    renderFlatList() {
        const item = this.props.libIds[0];
        return <SingleResultPageList location={this.props.location} degree={this.props.degree} choren={this.props.choren} queryType={this.props.queryType} type={item.type}
                                     libId={item.id}></SingleResultPageList>
    }


    render() {

        if (this.props.clusterMode) {//聚合数据模式显示
            return this.renderClusterList();
        } else {
            return this.renderFlatList();
        }
    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        searchResult: state.searchResult
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        setSeverResponseUserInfos: (infos) => dispatch(setSeverResponseUserInfos(infos)),
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(injectIntl(ResultList));
