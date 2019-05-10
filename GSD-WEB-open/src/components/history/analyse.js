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
import  'echarts/lib/chart/tree';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/polar';
import 'echarts/lib/component/legend';


const styles = theme => ({
    rootPage: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        width: '100%',
        marginTop:"30px"
    },
    viewBtn:{
        color: "#ffffff",
        backgroundColor: "#2196F3",
        border: "none",
        float:'right',
        fontSize: '12px',
        padding: "0.4rem 1rem",
        '&:hover': {
            backgroundColor: "#459ee4",
            color: "#ffffff",
        },
        '&:disabled': {
            backgroundColor: "#cccccc",
            color: "#ffffff",
        },
    }
});


class AnalysePage extends Component {
    static propTypes = {
        intl: intlShape.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {noData: true};
        this.myChart=null;
        this.cxId;
        this.searchValue;
        this.handleWindowResize = this.handleWindowResize.bind(this);
    }

    handleWindowResize(){
        console.log("resizing....");
        this.myChart.resize();
    }

    componentDidMount() {
        this.searchValue = this.props.location.query.searchValue || "";

        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header={userid:this.cxId,token:this.props.userInfos.responseUserInfo.token};
            this.props.getHistoryRecord(this.cxId, this.searchValue,header);
        }
        window.addEventListener('resize', this.handleWindowResize)
        document.title=this.props.intl.formatMessage({id: 'Analysize'})+"-"+this.props.intl.formatMessage({id: 'PROJECT_NAME'});

    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.userInfos.responseUserInfo.userid!=""&&nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header={userid:this.cxId,token:nextProps.userInfos.responseUserInfo.token};
            this.props.getHistoryRecord(this.cxId, this.searchValue,header);
        }
        if (!!nextProps.historyData.historyRecord && Object.keys(nextProps.historyData.historyRecord).length > 0) {
            this.renderChar(nextProps.historyData.historyRecord);
        }
    }


    renderChar(dataList) {
        if (!!dataList && Object.keys(dataList).length > 0) {


            var dateKeys= Object.keys(dataList);

            var data = {
                "name": this.searchValue,
                "labelName":this.searchValue,
                "children": dateKeys.reduce((arr, keyDate, index)=> {
                    if (!!keyDate&&!!dataList[keyDate]&&dataList[keyDate].length>0){
                        //var libName=this.props.intl.formatMessage({id: item.name});
                        arr=arr.concat(Object.assign({},{
                            labelName:keyDate,
                            value:keyDate,
                            name: keyDate,
                            "children": dataList[keyDate].reduce((sarr,sitem,sindex)=>{
                                if(!!sitem.title2){//存在用户点击资源信息,则加入
                                    var libName=this.props.intl.formatMessage({id: sitem.title1});
                                    var itemIndex=sarr.findIndex(ssitem=>{return ssitem.id==sitem.title1});
                                    if(itemIndex>=0){//已经存在了,则往children中加
                                        var children=[].concat(sarr[itemIndex]["children"]);
                                        var subTitle=sitem.title2.length>8?sitem.title2.substring(0,8)+"...":sitem.title2;
                                        children=children.concat(Object.assign({},{name:sitem.title2,labelName:subTitle,url:sitem.url}));
                                        sarr[itemIndex]["children"]=children;
                                    }else{
                                        var subTitle=sitem.title2.length>8?sitem.title2.substring(0,8)+"...":sitem.title2;
                                        sarr.push(Object.assign({},{
                                            name:libName,
                                            labelName:libName,
                                            id:sitem.title1,
                                            children:[{
                                                name:sitem.title2,url:sitem.url,labelName:subTitle
                                            }]
                                        }));
                                    }


                                }

                                return sarr;
                            },[])
                        }))
                    }
                    return arr;
                }, [])
            };

            if(!!data.children&&data.children.length>0){
                var children=data.children;
                children=children.filter(item=>item.children.length>0);
                data.children=children;
            }
            console.log(data);
           //document.write(JSON.stringify(data));
            this.myChart= echarts.init(document.getElementById('treeChart'));

            var option = option = {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove',
                    formatter: "{b}"

                },
                toolbox: {
                    left: 'center',
                    itemSize: 25,
                    top: 55,
                    feature: {
                        dataZoom: {
                        },
                        restore: {}
                    }
                },


                series: [
                    {
                        type: 'tree',
                        roam:true,
                        data:[data],
                        initialTreeDepth:3,
                        top: '1%',
                        left: '7%',
                        bottom: '1%',
                        right: '20%',
                        symbolSize: 10,
                        roam:'scale',
                        label: {
                            normal: {
                                position: 'left',
                                verticalAlign: 'middle',
                                align: 'right',
                                fontSize: 9,
                                formatter: function (v) {
                                    if(!!v.data.labelName){
                                        return  v.data.labelName;
                                    }
                                    return v.name;
                                },
                                rich:{x:{cursor:"pointer",color:"red"}}
                            },

                        },

                        leaves: {
                            label: {
                                normal: {
                                    position: 'right',
                                    verticalAlign: 'middle',
                                    align: 'left',
                                    rotate: 45,
                                    formatter: function (v) {
                                        if(!!v.data.labelName){
                                            return  v.data.labelName;
                                        }
                                        return v.name;
                                    },
                                    rich:{x:{cursor:"pointer",color:"red"}}
                                }
                            }
                        },

                        expandAndCollapse: false
                    }
                ]
            };


            if (option && typeof option === "object") {
                this.myChart.setOption(option, true);
            }
            this.myChart.on("click", (param)=>this.chartClick(param));




        }


    }

    componentWillUnmount() {
       this.myChart=null;
        window.removeEventListener('resize', this.handleWindowResize)
    }

    chartClick(param) {
        console.log(param);
        if (!!param.data.url) {

            //window.location.href = param.data.url;
            window.open(param.data.url);
        }
    }

    render() {

        const {classes}=this.props;
        const isAccessing = this.props.historyData.pageInfos.isAccessing;
        const dataLength = this.props.historyData.historyRecord;
        return (
            <div>
                <Header hideSearchInput location={this.props.location}/>

                <Grid style={{marginTop:"30px"}}>
                    {
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item href="/"><FormattedMessage id="HOME"/></Breadcrumb.Item>
                            <Breadcrumb.Item href="/history"><FormattedMessage id="Search History"/></Breadcrumb.Item>
                            <Breadcrumb.Item><FormattedMessage id="Analysize"/></Breadcrumb.Item>
                        </Breadcrumb>
                    }




                    <Row>
                        <Col className="left-bar" sm={12} md={12} lg={12}>

                            <Paper elevation={1} className={classes.rootPage}>
                                <h4 style={{margin:"10px 0 30px 0"}}><FormattedMessage id="Analysize"/> <Button className={classes.viewBtn} size="small" variant="outlined"
                                                                                                                compoment={"a"}
                                                                                                                href={`/search?searchValue=${this.props.location.query.searchValue}`}
                                                                                                                target="_self">
                                    <FormattedMessage id="Search again"/>
                                </Button></h4>
                                {dataLength == 0&&!isAccessing && <span><FormattedMessage id="NO_DATA"/></span>}

                                <div
                                    style={{height:isAccessing||dataLength==0?"0":"auto",overflow:isAccessing||dataLength==0?"hidden":"auto"}}>

                                    {isAccessing &&
                                    <div style={{margin:"10px auto",textAlign:"center"}}><CircularProgress
                                        color="secondary"/></div>}
                                    {<div style={{height:isAccessing?"0":"auto",overflow:isAccessing?"hidden":"auto"}}>

                                        <div id="treeChart"
                                             style={{ width: "100%", minHeight: 880,margin:'0 auto'}}></div>
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
        getHistoryRecord: (userId, content,header)=>dispatch(getHistoryRecord(userId, content,header)),
        deleteSearchHistory: (userId, searchId)=>dispatch(deleteSearchHistory(userId, searchId)),


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(injectIntl(AnalysePage)));
