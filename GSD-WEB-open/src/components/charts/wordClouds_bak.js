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
import {getClusterData} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import echarts from 'echarts/lib/echarts';
import 'echarts-wordcloud';


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
    },  buttonToggle:{
        display: "inline-block",
        color: "#a09d9d",
        border: "0",
        fontSize: "12px",
        minWidth:'25px',
        minHeight:'20px',
        textAlign:"center",
        marginTop:'-5px',
        float:'right'
    },buttonToggleShow:{
        display: "block",
        color: "#868585",
        border: "0",
        height: "50px",
        fontSize: "1.1rem",
        backgroundColor: "#ffffff",
        width:"100%",
        textAlign:"center"
    }


});


class WordClouds extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        onFilterSelect: PropTypes.func,
        dialog:PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.searchValue;
        this.state = {keywordList: [], initFlag: false,toggleState:true};

    }

    componentDidMount() {
        if(!!this.props.dialog) this.props.getClusterData(this.props.searchValue)

    }

   createRandomItemStyle() {
    return {
        normal: {
            color: 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
            ].join(',') + ')'
        }
    };
}
    componentWillReceiveProps(nextProps) {
        if (nextProps.filterOpenMode && !this.state.initFlag) {
            this.setState({initFlag: true});
            this.searchValue=this.props.searchValue;
            this.props.getClusterData(this.props.searchValue)
        }else if(this.searchValue!=nextProps.searchValue){
            this.searchValue=nextProps.searchValue;
            this.props.getClusterData(nextProps.searchValue)

        }
        if (!!nextProps.chart.clustersData.keywordList && nextProps.chart.clustersData.keywordList.length > 0) {
            this.renderChar(nextProps.chart.clustersData.keywordList);
        }
    }

    renderChar(dataList) {

        if (!!dataList && dataList.length > 0) {

            var myChart = echarts.init(document.getElementById('relatedWordClouds'));
            var datas=dataList.reduce((arr,item,itemIndex)=>{
                arr.push({
                    name:item.label,
                    value:item.count,
                    textStyle:{
                        normal: {
                            color: 'rgb(' + [
                                Math.round(Math.random() * 310),
                                Math.round(Math.random() * 210),
                                Math.round(Math.random() * 160)
                            ].join(',') + ')'
                        }
                    }
                });
                return arr;
            },[]);

            var option = {
                tooltip: {
                    show: true
                },
                series : [
                    {
                        type:'wordCloud',
                        shape: 'circle',
                        size: ['80%', '80%'],
                        autoSize: {
                            enable: true,
                            minSize: 14
                        },
                        left: 'center',
                        top: 'center',
                        width: '70%',
                        height: '80%',
                        right: null,
                        bottom: null,
                        data: datas
                    }
                ]
            };


            if (option && typeof option === "object") {
                myChart.setOption(option, true);
                myChart.on("click", (param)=>this.chartClick(param));
            }
        }


    }

    chartClick(param) {

        window.open("/search?searchValue="+param.name);
      console.log(param);
    }


    clearFilterData() {
        this.setState({filterDataName: ""});
        this.props.onFilterChange({});
    }


    render() {

        const {classes}=this.props;

        const keywordListChartAccessing = this.props.chart.pageInfos.keywordListChartAccessing;



        return (
            <div>
                <div><h4 style={{fontSize:"1.1rem",color:"rgb(135, 134, 134)"}}>{this.props.intl.formatMessage({id: 'Related Keywords'})}
                    <Button
                        className={classes.buttonToggle}
                        variant="outlined" size="small" onClick={()=>this.setState({toggleState:!this.state.toggleState})}>
                        <i className={this.state.toggleState?"glyphicon glyphicon-menu-down":"glyphicon glyphicon-menu-up"}></i>
                    </Button>


                </h4></div>

                <div className={this.state.toggleState?"toolDiv":"toolDiv visible"}>
                {keywordListChartAccessing &&
                <div style={{margin:"10px auto",textAlign:"center"}}><CircularProgress color="secondary"/></div>}
                {<div style={{height:keywordListChartAccessing?"0":"auto",overflow:keywordListChartAccessing?"hidden":"auto"}}> <div style={{height:"300px"}} id="relatedWordClouds" ></div></div>}
                    </div>
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
        getClusterData: (searchValue,clusterName="keywordList") => dispatch(getClusterData(searchValue,clusterName))


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(WordClouds)));
