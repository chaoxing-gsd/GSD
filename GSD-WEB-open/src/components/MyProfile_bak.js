import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import {withStyles} from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import {Glyphicon} from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import {Breadcrumb} from 'antd';
import Header  from "./header";
import {getBindedEmails, addLocalEmails, BindedEmail, removeLocalEmails, DeleteEmail} from "../actions"
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {browserHistory} from 'react-router'
import {INNER_SERVER_URL} from  "../config/constants";
import {Progress, Divider,Popover} from 'antd';
import {fetchUrl} from '../actions/fetchData';
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/bar';
import BindEmails from './sys/BindEmails'


import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/polar';
import 'echarts/lib/component/legend';
import swal from 'sweetalert2'
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



class MyProfile extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {isEditing: false, userFileNumData: {}, searchRankList: [], userFrequencyList: [],currentMyDataPage:1,myDataList:[]}
        this.cxId;

    }


    toBindEmails(){
        browserHistory.push("myEmails")
    }


    getUserNotesInfo = async(userId, header)=> {
        var response = await fetchUrl(INNER_SERVER_URL + `getStatisticsDataByUserId?userid=` + userId, "get", null, header);
        console.log(response);
        if (!!response) {
            if (!!response.statu) {
                this.setState({userFileNumData: response.data});

            } else {
                swal({
                    title: response.msg,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                }).then((result) => {

                })
            }

        } else {
            swal({
                title: this.props.intl.formatMessage({id: 'Error Tip'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
        }
    }


    getMyDatabases = async(header)=> {//获取我的数据库信息
        var formData=new FormData();
        formData.append("userid",this.cxId);
        formData.append("pageNum",this.state.currentMyDataPage);
        formData.append("pageSize","10");
        console.log(formData);
        var response = await fetchUrl(INNER_SERVER_URL + `getindex`, "post", formData, header);
        console.log(response);
        if (!!response) {
            if (!!response.statu) {
                this.setState({myDataList: response.data.list,myDataListTotal:response.data.total});

            } else {
                swal({
                    title: response.msg,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                }).then((result) => {

                })
            }

        } else {
            swal({
                title: this.props.intl.formatMessage({id: 'Error Tip'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
        }
    }


    getSearchRank = async(header)=> {//获取搜索排行
        var response = await fetchUrl(INNER_SERVER_URL + `getCountOfSearch?offset=0&limit=10&isdesc=1`, "get", null, header);
        console.log(response);
        if (!!response) {
            if (!!response.statu) {
                this.setState({searchRankList: response.data});

            } else {
                swal({
                    title: response.msg,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                }).then((result) => {

                })
            }

        } else {
            swal({
                title: this.props.intl.formatMessage({id: 'Error Tip'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
        }
    }



    renderChar(dataList) {
        console.log(dataList);

        if (!!dataList && dataList.length > 0) {

            var dataAxis= dataList.map(item=> this.props.intl.formatMessage({id: item.title1})||item.title1);
            var dataValue=dataList.map(item=>parseInt(item.totalSize));
            var myChart = echarts.init(document.getElementById('resourceRankChart'));

            var option = {
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: dataAxis,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: this.props.intl.formatMessage({id: 'DATA_COUNT'}),
                        type: 'bar',
                        barWidth: '60%',
                        data:dataValue ,
                    }
                ]
            };


            if (option && typeof option === "object") {
                myChart.setOption(option, true);
                // var zoomSize = 6;
                // myChart.on('click', function (params) {
                //     myChart.dispatchAction({
                //         type: 'dataZoom',
                //         startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                //         endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, dataValue.length - 1)]
                //     });
                // });
            }
        }


    }

    getFrequency = async(header)=> {
        var response = await fetchUrl(INNER_SERVER_URL + `getSearchCountRanking?limitSzie=20&endTime=2018-08-24%2000:00:00&startTime=2018-08-01%2000:00:00`, "get", null, header);
        console.log(response);
        if (!!response) {
            if (!!response.statu) {
                this.setState({userFrequencyList: response.data.rankingData});
                this.renderChar(response.data.rankingData);

            } else {
                swal({
                    title: response.msg,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                }).then((result) => {

                })
            }

        } else {
            swal({
                title: this.props.intl.formatMessage({id: 'Error Tip'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
        }
    }


    componentDidMount() {
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
            this.getUserNotesInfo(this.cxId, header);
            this.getSearchRank(header)
            this.getFrequency(header);
            this.getMyDatabases(header);

        }

    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.userInfos.responseUserInfo.userid!=""&&nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: nextProps.userInfos.responseUserInfo.token};
            this.getUserNotesInfo(this.cxId, header);
            this.getSearchRank(header)
            this.getFrequency(header);
            this.getMyDatabases(header);
        }

    }



    render() {
        const {classes} = this.props;


        return (
            <div>
                <Header/>
                <Grid style={{marginTop:"30px"}}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item href="/"><FormattedMessage id="HOME"/></Breadcrumb.Item>
                        <Breadcrumb.Item><strong></strong><FormattedMessage
                            id="MY_PROFILE"/></Breadcrumb.Item>
                    </Breadcrumb>
                    <Row style={{marginTop:'20px'}}>
                        <Col sm={12} md={9}
                             lg={9}>
                            <div style={{backgroundColor:"#ffffff",marginBottom:'20px'}}>
                                <h5 style={{ padding: "20px 0 0 15px",margin:"0",color:"#8a8787"}}><i
                                    className="fa fa-television"></i>&nbsp;<FormattedMessage
                                    id="Useage Summary"/></h5>
                                <Divider style={{margin:"10px 0"}}></Divider>
                                <div style={{padding:'15px'}}>
                                    <Row>
                                        <Col sm={4} style={{marginBottom:'10px'}}>

                                            <div className="circle-summary">
                                                <h5 style={{color:"#a0a0a0",marginTop:'30px'}}><FormattedMessage
                                                    id="Search Summary"/></h5>
                                                <h3 style={{color:"#52c41a"}}>{this.state.userFileNumData.scnum || 0} </h3>
                                            </div>

                                        </Col>
                                        <Col sm={4} style={{marginBottom:'10px'}}>
                                            <div className="circle-summary" style={{ borderColor: "#2196F3"}}>
                                                <h5 style={{color:"#a0a0a0",marginTop:'30px'}}><FormattedMessage
                                                    id="Export Summary"/></h5>
                                                <h3 style={{color:"#2196F3"}}>{this.state.userFileNumData.lrdnum || 0} </h3>
                                            </div>
                                        </Col>
                                        <Col sm={4} style={{marginBottom:'10px'}}>

                                            <div className="circle-summary" style={{ borderColor: "#E91E63"}}>
                                                <h5 style={{color:"#a0a0a0",marginTop:'30px'}}><FormattedMessage
                                                    id="My Notes Summary"/></h5>
                                                <h3 style={{color:"#E91E63"}}>{this.state.userFileNumData.notenum || 0} </h3>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>


                            <div style={{backgroundColor:"#ffffff",marginBottom:'20px'}}>
                                <h5 style={{ padding: "20px 0 0 15px",margin:"0",color:"#8a8787"}}><i
                                    className="fa fa-bar-chart"></i>&nbsp;<FormattedMessage
                                    id="Resource Rank"/></h5>
                                <Divider style={{margin:"10px 0"}}></Divider>
                                <div style={{padding:'15px'}}>

                                    <div style={{width:'100%',height:"350px"}} id="resourceRankChart"></div>

                                </div>
                            </div>


                            <div style={{backgroundColor:"#ffffff",marginBottom:'20px'}}>
                                <h5 style={{ padding: "20px 0 0 15px",margin:"0",color:"#8a8787"}}><i
                                    className="fa fa-database"></i>&nbsp;<FormattedMessage
                                    id="My DataBase"/></h5>
                                <Divider style={{margin:"10px 0"}}></Divider>
                                <div style={{padding:'15px'}}>
                                    {this.state.myDataList.length==0&&<h5 style={{color:"#cccccc"}}><FormattedMessage
                                        id="NO_DATA"/></h5>}

                                    {this.state.myDataList.length>0&&<div >
                                        <div className="row">
                                        <Col sm={4} md={4}
                                             lg={4}>
                                            数据库名
                                            </Col>

                                        <Col sm={4} md={4}
                                             lg={4}>
                                           邮箱
                                        </Col>

                                        <Col sm={4} md={4}
                                             lg={4}>
                                            状态
                                        </Col>
                                            </div>

                                        <Divider style={{margin:"10px 5px"}}></Divider>
                                        {
                                            this.state.myDataList.map((item,index)=>  <div><div className="row">
                                                <Col sm={4} md={4}
                                                     lg={4}>
                                                    {item.name}
                                                </Col>

                                                <Col sm={4} md={4}
                                                     lg={4}>
                                                    {item.email}
                                                </Col>

                                                <Col sm={4} md={4}
                                                     lg={4}>
                                                    {item.update?"已处理":"未处理"}

                                                </Col>

                                                </div>
                                                <Divider style={{margin:"10px 5px"}}></Divider>
                                                </div>
                                                )
                                        }

                                        </div>}


                                </div>
                            </div>


                        </Col>

                        <Col  sm={12}
                             md={3} lg={3}>

                            <div style={{backgroundColor:"#ffffff",marginBottom:'20px'}}>
                                <h5 style={{ padding: "20px 0 0 15px",margin:"0",color:"#8a8787"}}><i
                                    className="fa fa-envelope-open"></i>&nbsp;<FormattedMessage
                                    id="Bind_Email"/>  <Popover
                                    placement="bottom"
                                    content={<div style={{fontSize:'14px',display:'block',color:"rgb(103, 103, 103)",marginTop:"5px"}}><FormattedMessage id="Bind Email Tip"/></div>}
                                    title={<FormattedMessage
                        id="TIP"/>}
                                    trigger="click"
                                    visible={this.state.toolTipState}
                                    onVisibleChange={(state)=>{this.setState({toolTipState:state})}}
                                >
                                    <Button  className={classes.buttonInfo} type="primary"><i className="fa fa-info-circle"></i></Button>
                                </Popover>
                                </h5>
                                <Divider style={{margin:"10px 0"}}></Divider>
                                <div style={{padding:'0px 15px 15px 15px'}}>


                                    <BindEmails/>
                                </div>
                            </div>


                            <div style={{backgroundColor:"#ffffff",marginBottom:'20px'}}>
                                <h5 style={{ padding: "20px 0 0 15px",margin:"0",color:"#8a8787"}}><i
                                    className="glyphicon glyphicon-plus-sign"></i>&nbsp;<FormattedMessage
                                    id="Add New Db"/>
                                </h5>
                                <Divider style={{margin:"10px 0"}}></Divider>
                                <div style={{padding:'0px 15px 15px 15px'}}>

                                    <Button disabled={this.state.isEditing} onClick={(e)=>{browserHistory.push("addNewDb")}}
                                            className={classes.buttonEmail} variant="outlined"
                                            size="small"><i className="fa fa-file-excel-o"></i>&nbsp;<FormattedMessage
                                        id="Add New Db"/></Button>
                                </div>
                            </div>

                            <div style={{backgroundColor:"#ffffff"}}>
                                <h5 style={{ padding: "20px 0 0 15px",margin:"0",color:"#8a8787"}}><i
                                    className="fa fa-rss"></i>&nbsp;<FormattedMessage
                                    id="Search Rank"/></h5>
                                <Divider style={{margin:"10px 0"}}></Divider>
                                <div style={{padding:'0px 15px 15px 15px'}}>
                                    <div className="clearfix" style={{color:"#adadad",marginBottom:"5px"}}><div style={{float:'left',width:'60%',marginLeft:"20px",marginRight: "0.2em"}}>关键词</div><div>周涨幅</div></div>
                                    {(!this.state.searchRankList || this.state.searchRankList.length == 0) &&
                                    <h5 style={{color:"#cccccc"}}><FormattedMessage
                                        id="NO_DATA"/></h5>}
                                    {!!this.state.searchRankList && this.state.searchRankList.length > 0 && this.state.searchRankList.map((item, index)=>
                                        <div className="gsd-rank-item clearfix"><span
                                            className="gsd-badge"
                                            style={{backgroundColor: index==0?"#F44336":(index==1?"#FF9800":(index==2?"#03A9F4":""))}}>{index + 1}</span><a
                                            className="gsd-rank-desc" href={"/search?searchValue="+item.content}
                                            target="_blank">{item.content}</a>
                                            <span
                                                className={(item.weekIncrease.indexOf("-")==0)?"trendPecent down":"trendPecent"}
                                                style={{fontSize:"12px"}}><i
                                                className={(item.weekIncrease.indexOf("-")==0)?"fa fa-long-arrow-down":"fa fa-long-arrow-up"}></i>{item.weekIncrease || 0}</span>
                                        </div>)}
                                </div>
                            </div>
                        </Col>
                    </Row>
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
        getBindedEmails: (userId, header) => dispatch(getBindedEmails(userId, header)),
        addLocalEmails: (data) => dispatch(addLocalEmails(data)),
        BindedEmail: (userId, email, header)=>dispatch(BindedEmail(userId, email, header)),
        removeLocalEmails: (userId, email)=>dispatch(removeLocalEmails(userId, email)),
        DeleteEmail: (userId, email, header)=>dispatch(DeleteEmail(userId, email, header)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(MyProfile)))
