import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import {withStyles} from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import {Glyphicon} from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import {Breadcrumb} from 'antd';
import {getBindedEmails, addLocalEmails, BindedEmail, removeLocalEmails, DeleteEmail} from "../../actions"
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {browserHistory} from 'react-router'
import {INNER_SERVER_URL} from  "../../config/constants";
import {Progress, Divider,Popover} from 'antd';
import {fetchUrl} from '../../actions/fetchData';
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/bar';
import BindEmails from './BindEmails'

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
        maxWidth:'400px',
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



class Account extends Component {
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



    componentDidMount() {
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};

            this.getMyDatabases(header);

        }

    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.userInfos.responseUserInfo.userid!=""&&nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: nextProps.userInfos.responseUserInfo.token};

            this.getMyDatabases(header);
        }

    }



    render() {
        const {classes} = this.props;


        return (
            <div>

                    <Row style={{marginTop:'20px'}}>
                        <Col sm={12} md={9}
                             lg={12}>
                            {
                                this.props.personal == true ?
                                (
                                   null     
                                ):
                                (
                                    <div>
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
                                                        <FormattedMessage
                                                            id="DataBase"/>
                                                        </Col>

                                                    <Col sm={4} md={4}
                                                        lg={4}>
                                                        <FormattedMessage
                                                            id="Email"/>
                                                    </Col>

                                                    <Col sm={4} md={4}
                                                        lg={4}>
                                                        <FormattedMessage
                                                            id="Statu"/>
                                                    </Col>
                                                        </div>

                                                    <Divider style={{margin:"10px 5px"}}></Divider>
                                                    {
                                                        this.state.myDataList.map((item,index)=>  <div key={index}><div className="row">
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
                                                                {item.update?<FormattedMessage
                                                                    id="Processed"/>:<FormattedMessage
                                                                    id="Unprocessed"/>}

                                                            </Col>

                                                            </div>
                                                            <Divider style={{margin:"10px 5px"}}></Divider>
                                                            </div>
                                                            )
                                                    }

                                                    </div>}


                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            


                        </Col>


                    </Row>
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


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(Account)))
