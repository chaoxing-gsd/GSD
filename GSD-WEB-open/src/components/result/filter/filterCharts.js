/**
 * Created by Aaron on 2018/7/17.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router';
import '../../../assets/styles/home.css'
import {Glyphicon, Row, Col} from 'react-bootstrap';
import {browserHistory} from 'react-router'
import {getAllCluster, setSecondPageFilter} from "../../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {Breadcrumb} from 'antd';
import {TreeSelect} from 'antd';
import {withStyles} from '@material-ui/core/styles';
import { Select } from 'antd';
import {FILTER_LABELS} from "../../../utils/utils"
import echarts from 'echarts/lib/echarts';
import { Tag } from 'antd';
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/pie';
import {checkIsMobile} from "../../../utils/utils";
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/radiusAxis';
import 'echarts/lib/component/angleAxis';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/polar';
import 'echarts/lib/component/legend';

const Option = Select.Option;

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    cardAction:{
        textAlign:"right",
        display:"block"
    },
    buttonOk:{
        backgroundColor: "#8c1515",
        textAlign:"center",
        fontSize:'12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#b93939"
        },
        color: "#ffffff",
    },


});


class FilterChart extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        onFilterSelect: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {filterData:{},currentClass:"",filterDataName:""};

    }

    componentDidMount() {

        const clusterData = this.props.filter.clusters;
        const clusterKey = (Object.keys(clusterData)||[]).reduce((arr,key,index)=>{
            if(!!clusterData[key]&&clusterData[key].length>0&&!!FILTER_LABELS[key])arr.push(key);
            return arr;
        },[]);
        if(!!clusterKey&&clusterKey.length>0){
            this.renderChar(clusterKey[0]);
        }

    }

    renderChar(v){
        this.setState({currentClass:v});
        const clusterData = this.props.filter.clusters;
        const filterList = clusterData[v];

        var axisLabels=filterList.reduce((arr,item,index)=>{
           if(arr.length>=15)return arr;
            arr.push(item.label);
            return arr;
        },[]);


        var data=filterList.reduce((arr,item,index)=>{
            if(arr.length>=15){
                var total=parseInt(arr[arr.length-1].value||0)+parseInt(item.count||0);
                arr.splice(arr.length-1,1,{name:"其他",value:total});
                return arr;
            }
            arr.push({name:item.label,value:item.count});
            return arr;
        },[]);


        var myChart = echarts.init(document.getElementById('main'));
        var option = {
            title : {
                x:'center',
                y:'top'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            legend: {
                bottom: 10,
                left: 'center',
                data: axisLabels
            },
            series : [
                {
                    label: {
                        normal: {
                            show: !checkIsMobile()
                        },
                    },
                    name: '',
                    type: 'pie',
                    radius : checkIsMobile()?"80%":'50%',
                    center: ['50%', '40%'],
                    data:data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        if (option && typeof option === "object") {
            myChart.setOption(option, true);
            myChart.on("click", (param)=>this.chartClick(param));
        }


    }

    chartClick(param){
        console.log(param);
        var obj={};
        var arr=[];
        arr.push(param.data.name);
        obj[this.state.currentClass]=arr;
        this.setState({filterDataName:param.data.name});
        this.props.onFilterChange(obj);
    }


    clearFilterData(){
        this.setState({filterDataName:""});
        this.props.onFilterChange({});
    }




    render() {

        const clusterData = this.props.filter.clusters;
        const clusterKey = (Object.keys(clusterData)||[]).reduce((arr,key,index)=>{
            if(!!clusterData[key]&&clusterData[key].length>0&&!!FILTER_LABELS[key])arr.push(key);
            return arr;
        },[]);
        

        return (
            <div>
                <div>
                    {!!clusterKey&&clusterKey.length>0&&<Select defaultValue={clusterKey[0]}  style={{ width: 120 }} onChange={(value)=>this.renderChar(value)}>
                        {clusterKey.map(item=>!!FILTER_LABELS[item]&&<Option value={item}><FormattedMessage id={"TYPE_NAME_"+item}/></Option>)}
                    </Select>}
                    {!!this.state.filterDataName&&<Tag style={{marginLeft:"10px"}} onClose={()=>this.clearFilterData()}  closable color="red">
                        <FormattedMessage id="CURRENT_SELECT_CLASS"  values={{className:this.state.filterDataName}}/></Tag>}
                    </div>
            <div id="main" style={{ width: "100%", minHeight: 500,margin:'0 auto' }}></div>
             </div>

        )
    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        filter: state.filter
    }
}




export default connect(mapStateToProps)(injectIntl(withStyles(styles)(FilterChart)));
