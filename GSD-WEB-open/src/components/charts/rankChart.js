/**
 * Created by Aaron on 2018/7/18.
 */
/**
 * Created by Aaron on 2018/7/17.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router';

import {Glyphicon, Row, Col} from 'react-bootstrap';
import {browserHistory} from 'react-router'
import {getRankListData} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/bar';


import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/polar';
import 'echarts/lib/component/legend';


const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    cardAction: {
        textAlign: "right",
        display: "block"
    },
    buttonOk: {
        backgroundColor: "#8c1515",
        fontSize: '12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#b93939"
        },
        color: "#ffffff",
    },


});


class RankChart extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        onFilterSelect: PropTypes.func,
        dialog:PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.searchValue;
        this.state = {channelList: [], initFlag: false};

    }

    componentDidMount() {
        console.log(this.props.dialog);
        console.log(this.props.dialog);
        console.log(this.props.dialog);
        console.log(this.props.dialog);
        this.searchValue=this.props.searchValue;
        if(!!this.props.dialog) this.props.getRankListData(this.props.searchValue)

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.filterOpenMode && !this.state.initFlag) {
            this.setState({initFlag: true});
            this.searchValue=this.props.searchValue;
            this.props.getRankListData(this.props.searchValue)
        }else if(this.searchValue!=nextProps.searchValue){
            this.searchValue=nextProps.searchValue;
            this.props.getRankListData(nextProps.searchValue)

        }
        if (!!nextProps.chart.rankData.channelList && nextProps.chart.rankData.channelList.length > 0) {
            this.renderChar(nextProps.chart.rankData.channelList);
        }
    }

    renderChar(dataList) {

        if (!!dataList && dataList.length > 0) {

            if(dataList.length>10)dataList= dataList.slice(0,10);
           dataList.sort((v1,v2)=>{

                if(parseInt(v1.count)<parseInt(v2.count)){
                    return 1;
                }else if(parseInt(v1.count)>parseInt(v2.count)){
                    return -1;
                }else{
                    return 0;
                }
            })


            var myChart = echarts.init(document.getElementById('rankChart'));

            var option = {
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : dataList.map(item=>item.label),
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:this.props.intl.formatMessage({id: 'DATA_COUNT'}),
                        type:'bar',
                        barWidth: '60%',
                        data: dataList.map(item=>parseInt(item.count)),
                    }
                ]
            };


            if (option && typeof option === "object") {
                myChart.setOption(option, true);
            }
        }


    }

    chartClick(param) {

        var obj = {};
        var arr = [];
        arr.push(param.data.name);
        obj[this.state.currentClass] = arr;
        this.setState({filterDataName: param.data.name});
        this.props.onFilterChange(obj);
    }


    clearFilterData() {
        this.setState({filterDataName: ""});
        this.props.onFilterChange({});
    }


    render() {

        const {classes}=this.props;

        const isRankChartAccessing = this.props.chart.pageInfos.isRankChartAccessing;



        return (
            <div>
                {isRankChartAccessing &&
                <div style={{margin:"10px auto",textAlign:"center"}}><CircularProgress color="secondary"/></div>}
                {<div style={{height:isRankChartAccessing?"0":"auto",overflow:isRankChartAccessing?"hidden":"auto"}}><h4>{this.props.intl.formatMessage({id: 'RANK CHART'})}</h4> <div id="rankChart" ></div></div>}
            </div>

        )
    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        chart: state.chart
    }
}


const mapDispatchToProps = (dispatch, props) => {
    return {
        getRankListData: (searchValue) => dispatch(getRankListData(searchValue))


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(RankChart)));
