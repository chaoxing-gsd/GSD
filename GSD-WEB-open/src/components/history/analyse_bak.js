/**
 * Created by Aaron on 2018/7/22.
 */
import React, {Component} from 'react'

import {connect} from 'react-redux'
import {Link} from 'react-router';

import {Grid, Row, Col, Modal, Button, Panel} from 'react-bootstrap';
import {browserHistory} from 'react-router'
import {getHistoryRecord, deleteSearchHistory} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {Breadcrumb} from 'antd';
import Paper from '@material-ui/core/Paper';
import Header from '../result/Header'
import {Timeline, Tag} from 'antd';
import {withStyles} from '@material-ui/core/styles';

import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/graph';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';


const styles = theme => ({
    rootPage: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        width: '100%',
        marginTop: "30px"
    },
});


class AnalysePage extends Component {
    static propTypes = {
        intl: intlShape.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {noData: true};
        this.cxId;
        this.searchValue;
    }


    componentDidMount() {
        this.searchValue = this.props.location.query.searchValue || "";

        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
            this.props.getHistoryRecord(this.cxId, this.searchValue, header);
        }
    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.userInfos.responseUserInfo.userid!=""&&nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: nextProps.userInfos.responseUserInfo.token};
            this.props.getHistoryRecord(this.cxId, this.searchValue, header);
        }
        if (!!nextProps.historyData.historyRecord && nextProps.historyData.historyRecord.length > 0) {
            this.renderChar(nextProps.historyData.historyRecord);
        }
    }


    renderChar(dataList) {
        if (!!dataList && dataList.length > 0) {
            console.log(dataList);
            var edges=[];

            var data = [{label: this.searchValue, name: this.searchValue, symbolSize: 60, id: 0}];
            data = data.concat(dataList.reduce((arr, item, index)=> {
                if (!!item.children && item.children.length > 0) {
                    var size=(10 * item.children.length)>40?40:10 * item.children.length;
                    arr.push({
                        itemStyle: {
                            normal: {
                                color: "#3399cc"
                            }
                        },
                        label: this.props.intl.formatMessage({id: item.name}),
                        name: this.props.intl.formatMessage({id: item.name}),
                        id: index + 1,
                        symbolSize: size
                    });
                    edges.push({
                        source: index+1,
                        target: 0
                    });
                    var chilidrenList = item.children.reduce((sarr, sitem, sindex)=> {
                        if (!!sitem.name && sitem.name != "") {
                            edges.push({
                                source: (index+1) + "_" + sindex,
                                target: index+1
                            });
                            sarr.push({
                                name: sitem.name,
                                label: sitem.name,
                                url: sitem.url,
                                symbolSize: 10,
                                id: (index+1) + "_" + sindex,
                                itemStyle: {
                                    normal: {
                                        color: "#99cc33"
                                    }
                                }
                            })
                        }
                        return sarr;

                    }, []);
                    arr = arr.concat(chilidrenList);


                }
                return arr;
            }, []));

            console.log(data);
            console.log(edges);

            // var data = {
            //     "name": this.searchValue,
            //     "children": dataList.reduce((arr, item, index)=> {
            //         if (!!item.name)arr.push(Object.assign({},!!item.children&&item.children.length>0?{
            //             name: this.props.intl.formatMessage({id: item.name}),
            //             "children": item.children.reduce((sarr,sitem,sindex)=>{
            //                 if(!!sitem.name)sarr.push(sitem);
            //                 return sarr;
            //             },[])
            //         }:{
            //             name: this.props.intl.formatMessage({id: item.name})
            //         }))
            //         return arr;
            //     }, [])
            // };

            // var data={
            //     nodes:[{value:100,id:0},{value:100,id:1},{value:100,id:2}],
            //     links:[{
            //         source: 0,
            //         target: 1
            //     },
            //         {
            //             source: 0,
            //             target: 2
            //         }]
            // }

            console.log(data);
            var myChart = echarts.init(document.getElementById('treeChart'));
            var categories = [];
            categories[0] = {
                name: '搜索词'
            };
            categories[1] = {
                name: '库名'
            };
            categories[2] = {
                name: '资源'
            }

            var option = {
                title: {
                    text: 'Les Miserables',
                    subtext: 'Default layout',
                    top: 'bottom',
                    left: 'right'
                },
                tooltip: {},
                legend: [{
                    // selectedMode: 'single',
                    data: categories.map(function (a) {
                        return a.name;
                    })
                }],
                series: [
                    {
                        type: 'graph',
                        layout: 'force',
                        animation: false,
                        force: {
                            // initLayout: 'circular'
                            // gravity: 0
                            repulsion: 100,
                            edgeLength: 5
                        },
                        data: data,
                        label: {
                            normal: {
                                position: 'right',
                                formatter: '{b}'
                            }
                        },
                        edges: edges,
                        lineStyle: {
                            normal: {
                                width: 0.5,
                                curveness: 0.3,
                                opacity: 0.7
                            }
                        }
                    }
                ]
            };


            if (option && typeof option === "object") {
                myChart.setOption(option, true);
            }
            myChart.on("click", (param)=>this.chartClick(param));
        }


    }

    chartClick(param) {
        console.log(param);
        if(!!param.data&&!!param.data.url){
            window.open(param.data.url);
        }
        // if (typeof param.seriesIndex == 'undefined') {
        //     return;
        // }
        // if (param.type == 'click') {
        //
        //     if (param.data.children == null) {
        //
        //         //window.location.href = param.data.url;
        //         window.open(param.data.url);
        //     }
        //
        // }
    }

    render() {

        const {classes}=this.props;
        const isAccessing = this.props.historyData.pageInfos.isAccessing;
        const dataLength = this.props.historyData.historyRecord;
        return (
            <div>
                <Header hideSearchInput location={this.props.location}/>

                <Grid style={{marginTop:"30px"}}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item href="/"><FormattedMessage id="HOME"/></Breadcrumb.Item>
                        <Breadcrumb.Item><FormattedMessage id="Analysize"/></Breadcrumb.Item>
                    </Breadcrumb>


                    <Row>
                        <Col className="left-bar" sm={12} md={12} lg={12}>

                            <Paper elevation={1} className={classes.rootPage}>
                                <h4 style={{margin:"10px 0 30px 0"}}><FormattedMessage id="Analysize"/></h4>
                                {dataLength == 0 && <span><FormattedMessage id="NO_DATA"/></span>}

                                <div
                                    style={{height:isAccessing||dataLength==0?"0":"auto",overflow:isAccessing||dataLength==0?"hidden":"auto"}}>

                                    {isAccessing &&
                                    <div style={{margin:"10px auto",textAlign:"center"}}><CircularProgress
                                        color="secondary"/></div>}
                                    {<div style={{height:isAccessing?"0":"auto",overflow:isAccessing?"hidden":"auto"}}>
                                        <div id="treeChart"
                                             style={{ width: "100%", minHeight: 480,margin:'0 auto'}}></div>
                                    </div>}
                                </div>
                            </Paper></Col></Row></Grid></div>

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
        getHistoryRecord: (userId, content, header)=>dispatch(getHistoryRecord(userId, content, header)),
        deleteSearchHistory: (userId, searchId, type, header)=>dispatch(deleteSearchHistory(userId, searchId, type, header)),


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(injectIntl(AnalysePage)));
