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
import {getYearChannelListData} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';
import {checkIsMobile} from "../../utils/utils";
import CircularProgress from '@material-ui/core/CircularProgress';
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/line';


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


class YearChannelChart extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        onFilterSelect: PropTypes.func,
        dialog:PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.searchValue;
        this.state = {yearchannelList: [], initFlag: false};

    }

    componentDidMount() {
        this.searchValue=this.props.searchValue;
          if(!!this.props.dialog) this.props.getYearChannelListData(this.props.searchValue)

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.filterOpenMode && !this.state.initFlag) {
            this.setState({initFlag: true});
            this.searchValue=this.props.searchValue;
            this.props.getYearChannelListData(this.props.searchValue)
        }else if(this.searchValue!=nextProps.searchValue){
            this.searchValue=nextProps.searchValue;
            this.props.getYearChannelListData(nextProps.searchValue)

        }
        if (!!nextProps.chart.yearChannelData.yearchannelList && nextProps.chart.yearChannelData.yearchannelList.length > 0) {
            this.renderChar(nextProps.chart.yearChannelData.yearchannelList);
        }
    }

    renderChar(dataList) {


        if (!!dataList && dataList.length > 0) {
            // var data=dataList.reduce((arr,item,index)=>{
            //     var itemList=(item.secondmenu||[]).reduce((sarray,sitem,sindex)=>{
            //         sarray.push([item.label,sitem.name,sitem.count])
            //         return sarray;
            //     },[]);
            //     arr=arr.concat(itemList);
            //     return arr;
            // },[]);

            //console.log(data);
            var maxYearLength = dataList.reduce((arr, item, index)=> {
                var itemList = (item.secondmenu || []);
                if (itemList.length > arr.length) {
                    arr = [].concat(itemList);
                }
                return arr;
            }, []).reverse();

            // var datas=dataList.map(item=> {
            //     return {
            //         name: item.label,
            //         "type": 'line',
            //         data: maxYearLength.reduce((sarr,sitem,sindex)=> {
            //             var find = item.secondmenu.find(v=>v.name = sitem.name);
            //             if (!!find)sarr.push(find.count);
            //             else sarr.push(0);
            //             return sarr;
            //         },[]),
            //         stack: this.props.intl.formatMessage({id: 'DATA_COUNT'})
            //     }
            // });
            // console.log(datas);
            //
            // console.log(datas);

            var myChart = echarts.init(document.getElementById('yearChannelChart'));

            var option = {

                tooltip: {
                    trigger: 'axis'
                },
                legend: {

                    data: dataList.map(item=>item.label)
                },

                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top:checkIsMobile()?'40%':"15%",
                    containLabel: true
                },
                toolbox: {
                   
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: maxYearLength.map(item=>item.name)
                },
                yAxis: {
                    type: 'value'
                },
                series: dataList.map(item=> {
                    return {
                        name: item.label,
                        "type": 'line',
                        data: maxYearLength.map(sitem=> {
                            var find = item.secondmenu.find(v=>v.name ==sitem.name);
                            if (!!find)return find.count; else return 0;
                        }),
                        stack: this.props.intl.formatMessage({id: 'DATA_COUNT'})
                    }
                })
            };


            if (option && typeof option === "object") {
                myChart.setOption(option, true);
            }
        }


    }

    chartClick(param) {
        console.log(param);
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

        const isYearChartAccessing = this.props.chart.pageInfos.isYearChartAccessing;

        console.log(isYearChartAccessing);

        return (
            <div>
                {isYearChartAccessing &&
                <div style={{margin:"10px auto",textAlign:"center"}}><CircularProgress color="secondary"/></div>}
                {<div style={{height:isYearChartAccessing?"0":"auto",overflow:isYearChartAccessing?"hidden":"auto"}}><h4>{this.props.intl.formatMessage({id: 'DATAS_LINE'})}</h4> <div id="yearChannelChart"></div></div>}
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
        getYearChannelListData: (searchValue) => dispatch(getYearChannelListData(searchValue))


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(YearChannelChart)));
