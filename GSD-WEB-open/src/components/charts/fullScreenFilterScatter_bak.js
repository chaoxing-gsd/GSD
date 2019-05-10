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
import echarts from 'echarts/lib/echarts';
import SearchInput from '../home/SearchInput'
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import ScatterDrawer from './scatterDrawer';
import NoData from "../NoData"
require('echarts');
require('echarts-gl');

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
        width: "35px",
        height: "35px",
        marginTop: "6px",
        "&:hover": {}
    },
    menuBtn: {
        width: "35px",
        height: "35px",
        marginTop: "6px",
        "&:hover": {}
    }


});


class FullScreenFilterScatter extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        open: PropTypes.bool

    }

    constructor(props) {
        super(props);

        this.searchValue;
        this.state = {yearchannelList: [],selectedItem:[], initFlag: false, fullScreenState: false,listMode:false, drawerOpen: false, noData: false,searchValue:""};

    }

    componentDidMount() {

        document.title=this.props.intl.formatMessage({id: '3DFILTERCHART'})+"-"+this.props.intl.formatMessage({id: 'Data Visualization'})+"-"+this.props.intl.formatMessage({id: 'PROJECT_NAME'});

        if (!!this.props.location.query.searchValue) {
            this.setState({searchValue:this.props.location.query.searchValue});
            this.props.getClusterData(this.props.location.query.searchValue)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.chart.clustersData.yearchannelList && nextProps.chart.clustersData.yearchannelList.length > 0) {
            this.renderChar(nextProps.chart.clustersData.yearchannelList);
        }
    }

    handleClose = () => {
        if (!!this.props.handleClose) {
            this.props.handleClose({fullScreenState: false})
        }

    };


    chartClick(param) {
        
        console.log(param);
        this.setState({drawerOpen:true,listMode:true,selectedItem:param.data});
    }


    onEntered() {
        this.renderChar(this.props.chart.clustersData.yearchannelList);
    }

    searchDatas(searhValue){
        this.props.getClusterData(searhValue)
        this.setState({searchValue:searhValue});
    }

    getLibChildDatas(item, filterData) {
        var childArr = item.secondmenu.reduce((sarr, sitem, sindex)=> {
            var minYear = -1, maxYear = -1;
            if (!!filterData && !!filterData.yearRange) {//时间过滤
                minYear = filterData.yearRange[0];
                maxYear = filterData.yearRange[1];
            }
            if (minYear > 0 && maxYear > 0) {
                if (parseInt(sitem.name || 0) >= minYear && parseInt(sitem.name || 0) <= maxYear) {
                    sarr.push([item.label, sitem.name, sitem.count]);
                }

            } else {
                sarr.push([item.label, sitem.name, sitem.count]);
            }

            return sarr;
        }, []);
        return childArr;
    }


    renderChar(dataList, filterData = null) {
        if (!!dataList && dataList.length > 0) {
            this.setState({noData: false});
            var data = dataList.reduce((arr, item, index)=> {
                if (!!filterData && !!filterData.libs && !!filterData.libs.length > 0) {//库过滤
                    var libIndex = filterData.libs.findIndex(libItem=>libItem == item.label);
                    if (libIndex >= 0) {//找到库则加入返回
                        arr = arr.concat(this.getLibChildDatas(item, filterData));
                    }

                } else {//不做库过滤查询所有的
                    arr = arr.concat(this.getLibChildDatas(item, filterData));
                }


                return arr;
            }, []);

            if (!!data && data.length == 0) {
                this.setState({noData: true});

                return;
            }
            var myChart = echarts.init(document.getElementById("scatterGraphFull"));


            var yAxisLabelName='year';
            if(!!filterData){
                switch (filterData.dimension) {
                    case 'year':
                        yAxisLabelName = this.props.intl.formatMessage({id: 'YEAR'})
                        break;
                    case 'author':
                        yAxisLabelName = this.props.intl.formatMessage({id: 'AUTHOR'})
                        break;

                }
            }



            var option = {
                tooltip: {
                    show: true,
                    formatter: function (params) {
                        return params.data[0] + "<br/>" + params.data[1] + ":" + params.data[2];
                    }
                },
                grid3D: {},
                xAxis3D: {
                    type: 'category',
                    name: this.props.intl.formatMessage({id: 'LibName'})
                },
                yAxis3D: {type: 'category', name: yAxisLabelName},
                zAxis3D: {name: this.props.intl.formatMessage({id: 'DATA_COUNT'})},
                dataset: {
                    dimensions: [
                        'label',
                          !!filterData&&!!filterData.dimension?filterData.dimension:"year",
                        'count',
                        {name:  !!filterData&&!!filterData.dimension?filterData.dimension:"year", type: 'ordinal'}
                    ],
                    source: data
                },
                series: [
                    {
                        type: 'scatter3D',
                        symbolSize: 8,
                        coordinateSystem: "cartesian3D",
                        itemStyle: {
                            color: "#3399cc"
                        },
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
                myChart.on("click", (param)=>this.chartClick(param));
            }
        }


    }

    handeDrawerCloase(reRenderChartFlag = false, filterData = null) {
        this.setState({drawerOpen: false,listMode:false});
        if (reRenderChartFlag) {
            if (!!filterData && filterData.dimension === "author") {//获取作者的维度
                if (!!filterData && !!filterData.libs && !!filterData.libs.length > 0) {//需要根据库查询

                }

            } else {
                this.renderChar(this.props.chart.clustersData.yearchannelList, filterData)
            }

        }
    }


    Transition(props) {
        return <Slide direction="up" {...props} />;
    }

    render() {

        const {classes}=this.props;

        return (



            <div
                fullScreen
                open={this.props.open}
                onClose={this.handleClose}
                className={classes.dialogBg}
                onEntered={()=>this.onEntered()}
                TransitionComponent={this.Transition}
            >

                <style type="text/css">{`#tool-menus a{color:#757575;}`}</style>

                {!!this.state.searchValue&& <div style={{position:"absolute",padding:"0 0px",zIndex:8,right:'10px'}}>

                    <IconButton className={classes.menuBtn} onClick={()=>this.setState({drawerOpen:true})}
                                aria-label="Open">
                        <i className="glyphicon glyphicon-filter"></i>
                    </IconButton>

                </div>}

                <div id="chart_search">
                    <SearchInput small
                                 initValue={this.props.location.query.searchValue||""}
                                 onSearchCallBack={(searchValue)=>this.searchDatas(searchValue)}
                                 hideIcon showButton inputStyle={{height: "40px",fontSize: "1rem",lineHeight: "1rem"}}
                                 wrapperStyle={{margin:"5px 0"}}
                                 lineStyle={{float:"left",width:"85%",border:"1px solid rgb(212, 95, 95)"}}/>
                    </div>
                <div style={{position:'fixed',top:'0',right:'0',left:'0',bottom:'0'}}>
                <div style={{height:"100%",width:"100%",display:this.state.noData?"block":"none"}}
                     id="scatterGraphFullNoData"><NoData/></div>
                <div style={{height:"100%",width:"100%",display:!this.state.noData?"block":"none"}}
                     id="scatterGraphFull" ref="scatterGraphFull"></div>
                    </div>
                {!this.state.searchValue&&<h5 style={{margin:"6rem auto",textAlign:"center"}}><FormattedMessage id="Please_input_search_condtion"/></h5>}
               <ScatterDrawer
                    listLibItem={this.state.selectedItem}
                    listMode={this.state.listMode}
                    searchValue={this.state.searchValue}
                    handeDrawerCloase={(reRenderChartFlag,filterData)=>this.handeDrawerCloase(reRenderChartFlag,filterData)}
                    drawerOpen={this.state.drawerOpen}
                >

                </ScatterDrawer>
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

export default connect(mapStateToProps,mapDispatchToProps)(injectIntl(withStyles(styles)(FullScreenFilterScatter)));
