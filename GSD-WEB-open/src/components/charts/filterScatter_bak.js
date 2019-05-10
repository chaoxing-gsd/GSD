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
import FilterDropDown from "../result/filterDropDown"
import CircularProgress from '@material-ui/core/CircularProgress';
import echarts from 'echarts/lib/echarts';
import Button from '@material-ui/core/Button';
// import 'echarts-gl/src/echarts-gl';
// grid3D is needed for all charts on the cartesian coordinate system
// import 'echarts-gl/src/component/grid3D';
// import 'echarts-gl/src/chart/scatter3D';
require('echarts');
require('echarts-gl');

import FullScreenFilterScatter from "./fullScreenFilterScatter"

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    cardAction: {
        textAlign: "right",
        display: "block"
    },
    buttonFullScreen: {
        display: "inline-block",
        color: "#a09d9d",
        border: "0",
        fontSize: "12px",
        minWidth: '25px',
        minHeight: '20px',
        textAlign: "center"
    },
    appBar: {
        position: 'relative',
        background: "#ffffff",
        minHeight: "50px",
        boxShadow: "none",
        boxShadow: "0 3px 6px rgba(6,0,1,.05)"
    },
    appBarRoot: {
        minHeight: "50px!important"
    },
    dialogBg: {
        backgroundColor: "#f2f2f5"
    },
    closeBtn: {
        backgroundColor: "#d45f5f",
        color: "#ffffff"
    },buttonToggle:{
        display: "inline-block",
        color: "#a09d9d",
        border: "0",
        fontSize: "12px",
        minWidth:'25px',
        minHeight:'20px',
        textAlign:"center",
        float:'right',
        marginTop:'-5px'
    }


});

const options = [
    {
        value: "0", label: <FormattedMessage
        id="SETTING"
    />
    },
    {
        value: "1", label: <FormattedMessage
        id="FULLSCREEN"
    />
    },


];


class FilterScatter extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        onFilterSelect: PropTypes.func,
        dialog: PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.searchValue;
        this.state = {yearchannelList: [], initFlag: false, fullScreenState: false,toggleState:true};

    }

    componentDidMount() {
        if (!!this.props.dialog) this.props.getClusterData(this.props.searchValue)

    }

    handleClose = () => {
        this.setState({fullScreenState: false});
    };

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
            this.searchValue = this.props.searchValue;
            this.props.getClusterData(this.props.searchValue)
        } else if (this.searchValue != nextProps.searchValue) {
            this.searchValue = nextProps.searchValue;
            this.props.getClusterData(nextProps.searchValue)

        }
        if (!!nextProps.chart.clustersData.yearchannelList && nextProps.chart.clustersData.yearchannelList.length > 0) {
            this.renderChar(nextProps.chart.clustersData.yearchannelList);
        }
    }

    renderChar(dataList) {

        if (!!dataList && dataList.length > 0) {
            var data=dataList.reduce((arr,item,index)=>{
                var childArr=item.secondmenu.reduce((sarr,sitem,sindex)=>{
                    sarr.push([item.label,sitem.name,sitem.count]);
                    return sarr;
                },[]);
                arr=arr.concat(childArr);
                return arr;
            },[]);



            var myChart = echarts.init(document.getElementById("scatterGraph"));

            var option = {
                grid3D: {},
                xAxis3D: {
                    type: 'category'
                },
                yAxis3D: {type:'category'},
                zAxis3D: {},
                dataset: {
                    dimensions: [
                        'label',
                        'year',
                        'count',
                        {name: 'year', type: 'ordinal'}
                    ],
                    source: data
                },
                series: [
                    {
                        type: 'scatter3D',
                        symbolSize: 3,

                        encode: {
                            x: 'label',
                            y: 'year',
                            z: 'count',
                            tooltip: [0]
                        }
                    }
                ]
            };


            if (option && typeof option === "object") {
                myChart.setOption(option, true);
            }
        }


    }


    orderOption(option) {
        if (option.value == 1) {
            this.setState({fullScreenState: true});
        }

    }


    render() {

        const {classes}=this.props;

        const yearchannelListChartAccessing = this.props.chart.pageInfos.yearchannelListChartAccessing;


        return (
            <div>
                <div>
                    <h4 style={{fontSize:"1.1rem",color:"rgb(135, 134, 134)"}}>{this.props.intl.formatMessage({id: 'Scatter Filter'})}
                        <Button style={{display:this.state.toggleState?"none":"inline-block"}} onClick={()=> this.setState({fullScreenState: true})} className={classes.buttonFullScreen}><i className="glyphicon glyphicon-fullscreen"></i></Button>
                        {
                            // <span>
                            // <FilterDropDown hideSelectedLabel itemClick={(option)=>this.orderOption(option)}
                            //                 iconClass="glyphicon glyphicon-option-vertical" name="" hideCart
                            //                 options={options}/></span>
                        }

                    <Button
                        className={classes.buttonToggle}
                        variant="outlined" size="small" onClick={()=>this.setState({toggleState:!this.state.toggleState})}>
                        <i className={this.state.toggleState?"glyphicon glyphicon-menu-down":"glyphicon glyphicon-menu-up"}></i>
                    </Button>


                </h4></div>
                <div className={this.state.toggleState?"toolDiv":"toolDiv visible"}>
                
                {<div
                    style={{height:yearchannelListChartAccessing?"0":"auto",overflow:yearchannelListChartAccessing?"hidden":"auto"}}>


                    <div style={{height:"300px"}} id="scatterGraph"></div>
                </div>}
                    </div>

                <FullScreenFilterScatter searchValue={this.props.searchValue} handleClose={this.handleClose} open={this.state.fullScreenState}/>


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
        getClusterData: (searchValue, clusterName = "yearchannelList") => dispatch(getClusterData(searchValue, clusterName))


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(FilterScatter)));
