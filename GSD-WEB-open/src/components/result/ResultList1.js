/**
 * Created by Aaron on 2018/7/10.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {UserProfile, GearConfig} from '../sys'
import {Navbar, NavItem, Nav, Glyphicon} from 'react-bootstrap';
import {withStyles} from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {getSearchResult, getSearchResultByIds, getSearchResultListById,getResultByArguments} from "../../actions";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import Paper from '@material-ui/core/Paper';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Badge from '@material-ui/core/Badge';
import {browserHistory} from 'react-router'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import {Pagination} from 'antd';
import {FILTER_RULES} from "../../config/constants";


const BASE_LINK = {
    "BK": "http://ss.chaoxing.com/",
    "JN": "http://qikan.chaoxing.com/",
    "DT": "http://ss.chaoxing.com/",
    "PT": "http://ss.chaoxing.com/",
    "ST": "http://ss.chaoxing.com/",
    "VI": "http://ss.chaoxing.com/",
    "NP": "http://ss.chaoxing.com/",
    "TR": "http://ss.chaoxing.com/",
    "CP": "http://ss.chaoxing.com/"

};

const LINK_REC = {
    "BK": (url, id)=> {
        return url + "detail_" + id
    },
    "JN": (url, id)=> {
        return url + "detail_" + id
    },
    "DT": (url, id)=> {
        return url + "detail_" + id
    },
    "PT": (url, id)=> {
        return url + "detail_" + id
    },
    "ST": (url, id)=> {
        return url + "detail_" + id
    },
    "VI": (url, id)=> {
        return url + "detail_" + id
    },
    "NP": (url, id)=> {
        return url + "detail_" + id
    },
    "TR": (url, id)=> {
        return url + "detail_" + id
    },
    "CP": (url, id)=> {
        return url + "detail_" + id
    },

};


const REPEAT_SKELETON = 4;
const styles = theme => ({
    rootPage: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        width: '100%'
    },
});


class ResultList1 extends Component {
    static propTypes = {
        wrapperStyle: PropTypes.object,
        intl: intlShape.isRequired,
        classes: PropTypes.object.isRequired,
        theme: PropTypes.object.isRequired,
        filterData:PropTypes.object
       // onChange: PropTypes.func,


    }


    constructor(props) {
        super(props);
        this.state = {currentPage: 0,filterData:{}};

    }


    renderSkeletons() {
        const {classes, queryType} = this.props;
        var skeletons = [];
        if (queryType == 2 || queryType == 3 || queryType == 4) {//二级页面
            return <Paper className={classes.rootPage} key={`result_0`} elevation={1}>

                { (() => {
                    for (var i = 0; i < REPEAT_SKELETON; i++) {
                        skeletons.push(
                            <div style={{fontSize: 16, lineHeight: 2}}>
                                <Divider light/>
                                <SkeletonTheme color="#e0e0e0" highlightColor="#edecec">
                                    <div style={{width: "30%"}}><h1
                                        style={{marginBottom:'0',marginTop:i>0?'20px':'10px'}}><Skeleton/></h1></div>
                                    <Skeleton count={2}/>
                                </SkeletonTheme>
                            </div>);

                    }
                    skeletons.push(<Divider light/>);
                    return skeletons;
                })()
                }


            </Paper>
        } else {
            for (var i = 0; i < REPEAT_SKELETON; i++) {
                skeletons.push(<Paper className={classes.rootPage} key={`result_${i}`}
                                      style={{marginTop:i>0?"25px":"",width:'100%'}} elevation={1}>
                    <div style={{fontSize: 16, lineHeight: 1.5}}>
                        <SkeletonTheme color="#e0e0e0" highlightColor="#edecec">
                            <div style={{width:"30%"}}><h1><Skeleton/></h1></div>
                            <Skeleton count={4}/>
                        </SkeletonTheme>
                    </div>
                </Paper>);
            }
            return skeletons;
        }

    }


    componentDidMount() {

        this.getResultDatas();

    }


    buildArgumentData(){
        var data=this.props.filter.secondPageFilter;
        var argumentArr=[];
        if(!!data){
            var keys=Object.keys(data);
            if(!!keys&&keys.length>0){
               argumentArr= keys.reduce((arr,itemKey,index)=>{
                    var dataList=data[itemKey];
                    var rule=FILTER_RULES[itemKey];
                    if(!!rule&&!!dataList&&dataList.length>0){
                        arr.push(`${rule}= ${dataList.join(" | ")}`)
                    }
                    return arr;

                },[]);


            }
        }
        console.log(argumentArr);
        return argumentArr.join(" AND ");

    }


    getResultDatas() {
        const {classes, queryType, catIds} = this.props;
        console.log(this.buildArgumentData());
        this.props.getResultByArguments()
        // if (queryType == 1) {
        //     this.props.getSearchResultByIds(this.props.searchValue, catIds);
        // } else if (queryType == 2) {
        //     this.props.getSearchResultListById(this.props.searchValue, catIds, this.state.currentPage, 2);
        // } else if (queryType == 3) {
        //     this.props.getSearchResultListById(this.props.searchValue, catIds, this.state.currentPage, 3);
        // } else if (queryType == 4) {
        //     this.props.getSearchResultListById(this.props.searchValue, catIds, this.state.currentPage, 4);
        // } else {
        //     this.props.getSearchResult(this.props.searchValue, {});
        // }
    }

    getResourceLink(type, link) {

        var baseLink = BASE_LINK[type];
        if (!!baseLink && !!link) {
            var detailId = link.substring(link.lastIndexOf("/") + 1);
            return LINK_REC[type](baseLink, detailId);

        }
        return "javascript:void(0);";

    }

    toSecondeResultPage(channel) {
        browserHistory.push('/ssearch?searchValue=' + this.props.searchValue + "&channel=" + channel);
    }

    renderFirstDeepPage(dataList) {//第一级搜索渲染
        const {classes} = this.props;

        if (dataList.length > 0) {

            return dataList.reduce((arr, data, index)=> {
                arr.push(<Paper key={data.documenttype||data.name} className={classes.rootPage}
                                style={{marginTop:index>0?"25px":"",width:'100%'}} elevation={1}>
                    <div >
                        <h4 className="result-total-title"><span
                            className={`type-logo ${data.documenttype||data.name}-type-logo`}></span><a href="javascript:void(0)"
                                                                                             onClick={()=>this.toSecondeResultPage(data.documenttype||data.name)}><FormattedMessage
                            id={data.documenttype||data.name}/><span className="desc">({data.documentnum||data.num})</span></a></h4>
                        {

                            (data.documentcontent||data.list || []).reduce((itemArr, item, itemIndex)=> {
                                const matches = match(item.basic_title, this.props.searchValue);
                                const parts = parse(item.basic_title, matches);

                                const matcheAuthor = match(item.basic_creator, this.props.searchValue);
                                const partAuthor = parse(item.basic_creator, matcheAuthor);

                                const matcheYear = match(item.basic_date_time, this.props.searchValue);
                                const partYear= parse(item.basic_date_time, matcheYear);


                                var link = this.getResourceLink(data.documenttype||data.name, item.basic_title_url);
                                itemArr.push(<div className="result-item" key={item.proc_dxid}><a href={link}
                                                                                                  target="_blank">    {parts.map((part, index) => {
                                    return part.highlight ? (
                                        <span key={String(index)} style={{ color:'#b53535',fontSize:'14px'}}>
              {part.text}
            </span>
                                    ) : (
                                        <strong key={String(index)} style={{ fontWeight: '300',fontSize:'14px' }}>
                                            {part.text}
                                        </strong>
                                    );
                                })}</a>
                                    <span
                                        className="link-desc">{partAuthor.map((part, index) => {
                                        return part.highlight ? (
                                            <span key={String(index)} style={{ color:'#b53535',fontSize:'13px'}}>
              {part.text}
            </span>
                                        ) : (
                                            <span key={String(index)} style={{ fontSize:'13px' }}>
                                        {part.text}
                                    </span>
                                        );
                                    })}&nbsp;&nbsp;{partYear.map((part, index) => {
                                        return part.highlight ? (
                                            <span key={String(index)} style={{ color:'#b53535',fontSize:'13px'}}>
              {part.text}
            </span>
                                        ) : (
                                            <span key={String(index)} style={{ fontSize:'13px' }}>
                                        {part.text}
                                    </span>
                                        );
                                    })}</span>
                                </div>)
                                return itemArr;
                            }, [])
                        }

                    </div>
                </Paper>);
                return arr;
            }, []);


        }

        else return <div>没有数据</div>;
    }

    renderSecondDeepPage(data) {
        const {classes, catIds} = this.props;
        var dataList = data.documentcontent;
        if (!!dataList && dataList.length > 0) {

            return <Paper className={classes.rootPage}
                          elevation={1}>
                <div>为您找到相关结果为&nbsp;<span style={{color:"#b53535"}}>{data.documentnum}</span>&nbsp;个</div>
                <List component="nav">
                    { dataList.reduce((arr, item, index)=> {
                        const matches = match(item.basic_title, this.props.searchValue);
                        const parts = parse(item.basic_title, matches);

                        const matcheAuthor = match(item.basic_creator, this.props.searchValue);
                        const partAuthor = parse(item.basic_creator, matcheAuthor);

                        const matcheYear = match(item.basic_date_time, this.props.searchValue);
                        const partYear= parse(item.basic_date_time, matcheYear);

                        const matcheDess = match(item.basic_description, this.props.searchValue);
                        const partDess = parse(item.basic_description, matcheDess);
                        var link = this.getResourceLink(catIds, item.basic_title_url);
                        arr.push(
                            <div>
                                <Divider light/>
                                <ListItem button key={`list_${index}`}>
                                    <ListItemText primary={
                                  <div><a
                                target="_blank" href={link}>    {parts.map((part, index) => {
                                return part.highlight ? (
                                    <span key={String(index)} style={{ color:'#b53535',fontSize:'14px'}}>
              {part.text}
            </span>
                                ) : (
                                    <strong key={String(index)} style={{ fontWeight: 'bold',fontSize:'14px' }}>
                                        {part.text}
                                    </strong>
                                );
                            })}</a>
                                        <span
                                            className="link-desc">{partAuthor.map((part, index) => {
                                return part.highlight ? (
                                    <span key={String(index)} style={{ color:'#b53535',fontSize:'13px'}}>
              {part.text}
            </span>
                                ) : (
                                    <span key={String(index)} style={{ fontSize:'13px' }}>
                                        {part.text}
                                    </span>
                                );
                            })}

                            &nbsp;&nbsp;{partYear.map((part, index) => {
                                return part.highlight ? (
                                    <span key={String(index)} style={{ color:'#b53535',fontSize:'13px'}}>
              {part.text}
            </span>
                                ) : (
                                    <span key={String(index)} style={{ fontSize:'13px' }}>
                                        {part.text}
                                    </span>
                                );
                            })}
                            </span>

                                            <div className="content-desc">
                                           {partDess.map((part, index) => {
                                return part.highlight ? (
                                    <span key={String(index)} style={{ color:'#b53535',fontSize:'14px'}}>
              {part.text}
            </span>
                                ) : (
                                    <span key={String(index)} style={{ fontSize:'14px' }}>
                                        {part.text}
                                    </span>
                                );
                            })}
</div>
                                </div>
                                }/>

                                    <ListItemSecondaryAction>
                                        <Glyphicon style={{color:"#b3b3b3",marginRight:'20px'}} glyph="chevron-right"/>
                                    </ListItemSecondaryAction>
                                </ListItem></div>);
                        return arr;
                    }, [])
                    }

                    <Divider light/>


                </List>

            </Paper>


        }

        else return <div>没有数据</div>;
    }

    shouldComponentUpdate(nextProps,nextState){

        console.log(nextProps);
        console.log(nextState);
        return true;
    }


    componentWillReceiveProps(nextProps){
        console.log(nextProps);
    }

    onPageChange(pageNum) {
        console.log(pageNum);
        if(this.props.searchResult.pageInfos.isAccessing)return;
        this.setState({currentPage: pageNum - 1});
        this.getResultDatas();
    }

    renderPagination() {
        const {queryType} = this.props;
        var data;
        if (queryType == 2) {//二级页面数据
            data = this.props.searchResult.secondPageResult || {};

        } else if (queryType == 3) {//期刊
            data = this.props.searchResult.jnPageResult || {};

        } else if (queryType == 4) {//图书
            data = this.props.searchResult.bkPageResult || {};
        }
        if (queryType == 2 || queryType == 3 || queryType == 4) {//需要分页
            // var pageNum=parseInt((data.num||0)/20)+1;
            return <Pagination style={{marginTop:'20px'}} showQuickJumper current={this.state.currentPage+1}
                               total={data.documentnum} pageSize={20}
                               onChange={(pageNumber)=>this.onPageChange(pageNumber)}/>;
        }
        return null;
    }

    renderSearchResult() {
        const {queryType} = this.props;
        var dataList;
        if (queryType == 1) {//用户自定义数据
            dataList = this.props.searchResult.personalResult || [];
            return this.renderFirstDeepPage(dataList);
        } else if (queryType == 2) {//二级页面数据
            dataList = this.props.searchResult.secondPageResult || {};
            return this.renderSecondDeepPage(dataList);
        } else if (queryType == 3) {//期刊
            dataList = this.props.searchResult.jnPageResult || {};
            return this.renderSecondDeepPage(dataList);
        } else if (queryType == 4) {//图书
            dataList = this.props.searchResult.bkPageResult || {};
            return this.renderSecondDeepPage(dataList);
        } else {
            dataList = this.props.searchResult.searchResult || [];
            return this.renderFirstDeepPage(dataList);
        }


    }

    render() {
        console.log(this.props.filter.secondPageFilter);

        const {classes, theme} = this.props;


        return (
            <div style={{width:'100%'}}>
                {this.props.searchResult.pageInfos.isAccessing && <div>{this.renderSkeletons()}</div>  }

                {!this.props.searchResult.pageInfos.isAccessing && <div>{this.renderSearchResult()} </div>  }
                {this.renderPagination()}
            </div>

        );
    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        searchResult: state.searchResult,
        filter: state.filter
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getSearchResult: (searchTitle, pageInfo) => dispatch(getSearchResult(searchTitle, pageInfo)),
        getSearchResultByIds: (searchTitle, ids) => dispatch(getSearchResultByIds(searchTitle, ids)),
        getSearchResultListById: (searchTitle, id, cur, dataIndex) => dispatch(getSearchResultListById(searchTitle, id, cur, dataIndex)),
        getResultByArguments:(argument,dataIndex,currentPage,pageSize,clusternames,channels)=>dispatch(getResultByArguments(argument,dataIndex,currentPage,pageSize,clusternames,channels))


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles, {withTheme: true})(ResultList1)));
