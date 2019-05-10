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

import {browserHistory} from 'react-router'
import {getClusterData} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';
import {getAllLibTags} from '../../actions';
import {Select, Form} from 'antd';
import Drawer from '@material-ui/core/Drawer';
import {Icon, Slider} from 'antd'
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert2'
import {buildBaseArgument,CHINESENAME_TO_ID} from "../../utils/utils";
import SingleResultPageList from "../result/SingleResultPageList"
const styles = theme => ({

    drawerPaper: {
        top: 0,
        right: 0,
        width: 350,
        boxShadow: "4px 0px 20px #d8d6d6"
    },
    drawerPaperList:{
        top: 0,
        right: 0,
        width: 500,
        boxShadow: "4px 0px 20px #d8d6d6"
    },
    closeBtn: {
        width: "35px",
        height: "35px",
        marginTop: "6px",
        position: "absolute",
        right: "0",
        top: "0",
        "&:hover": {}
    },
    filterTypeDiv: {
        padding: "1rem 0 0 0",
    },
    filterTypeTitle: {
        color: "#848282",
        margin: "1rem 0"
    },
    okBtn: {
        fontSize: '13px',
        textAlign: "center",
        display: "inline-block",
        backgroundColor: "#d45f5f",
        '&:hover': {
            backgroundColor: "#b93939",
        },
    },
    cancelBtn: {
        fontSize: '13px',
        display: "inline-block",
        textAlign: "center",
        color: "#777777",

    },
});
const Option = Select.Option;

const children = [];
for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}


class ScatterDrawer extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        open: PropTypes.bool

    }

    constructor(props) {
        super(props);
        this.allLibs = [];
        this.state = {yearRange: [1900, 2018], libs: [], authorList: [], dimension: {}};

    }

    componentDidMount() {


        this.prepareData()

    }


    prepareData() {//准备数据
        if (!(!!this.props.personality.allLibs && Object.keys(this.props.personality.allLibs).length > 0)) {//数据不存在,则查询数据
            this.props.getAllLibTags();
        }
    }


    generateAllLibs() {
        // if (!!this.allLibs && this.allLibs.length > 0) {
        //     return this.allLibs;
        // } else {
        //     var libArrys = [];
        //     if (!!this.props.personality.allLibs && Object.keys(this.props.personality.allLibs).length > 0) {
        //         libArrys = [].concat(Object.keys(this.props.personality.allLibs).reduce((arr, key, item)=> {
        //             arr = arr.concat(this.props.personality.allLibs[key]);
        //             return arr;
        //
        //         }, []));
        //     }
        //     this.allLibs = libArrys;
        //     return libArrys;
        // }

        this.allLibs=[{id: "textref_zhonghuajingdian", type: "2",supportCluster:"author,edition,dynasty,collection"},
        {id: "textref_kanripo", type: "2",supportCluster:"author,edition,dynasty,collection"},
        {id: "textref_ctext", type: "2",supportCluster:"author,edition,dynasty,collection"},
        {id: "textref_cbta", type: "2",supportCluster:"author,edition,dynasty,collection"},
        {id: "biogref_dnb", type: "2",supportCluster:"born_year,died_year,gender,dynasty"},
        {id: "biogref_ddbc", type: "2",supportCluster:"born_year,died_year,gender,dynasty"},
        {id: "biogref_cbdb", type: "2",supportCluster:"born_year,died_year,gender,dynasty"}]
        return this.allLibs;

    }

    handleYearRange(value) {
        console.log(value);
        this.setState({yearRange: value});
    }

    saveFilter() {

        if(!!this.state.libs&&this.state.libs.length>0){

            if(!!this.state.dimension.x){
                if(!!this.state.dimension.y) {
                    if(!!this.state.dimension.z) {
                        this.props.handeDrawerCloase(true, {
                            libs: this.state.libs,
                            dimension: this.state.dimension
                        });
                    }else{
                        swal({
                            title:  this.props.intl.formatMessage({id: 'Please select Z-axis'}),
                            type: 'info',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                        })
                    }
                }else{
                    swal({
                        title:  this.props.intl.formatMessage({id: 'Please select Y-axis'}),
                        type: 'info',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                    })
                }
            }else{
                swal({
                    title:  this.props.intl.formatMessage({id: 'Please select X-axis'}),
                    type: 'info',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                })
            }

        }else{
            swal({
                title:  this.props.intl.formatMessage({id: 'Ok'}),
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            })
        }
       
    }

    changeFilterType(axisValue,value) {


        var dimension=Object.assign({},this.state.dimension,{[axisValue]:value})
        this.setState({dimension: dimension});
        console.log(this.state.dimension);
        // if (value == "author") {
        //     if (!this.props.chart.clustersData.authorList)this.props.getClusterData(this.props.searchValue, "authorList");
        //     this.getAllLibAuthorSummaryList();
        // }
    }


    getAllLibAuthorSummaryList() {
        const allLibs = this.generateAllLibs();
        allLibs.map(item=> {
            console.log(buildBaseArgument(this.props.searchValue, item.id, item.type));
        })
    }


    renderSourceList(){
        var libId=CHINESENAME_TO_ID[this.props.listLibItem[0]];
        const allLibs = this.generateAllLibs();
        var libItem=allLibs.find(item=>item.id==libId)||0;
        return <SingleResultPageList  queryType={2} type={libItem.type} libId={libId}></SingleResultPageList>
    }


    getLibItem(){
        var locale = this.props.userInfos.language || 'auto';
        if (locale == 'auto') {
            var lang = navigator.language;
            var locale = "en";
            if (lang === "zh" || lang === "zh-CN" || lang === "zh-TW") {
                locale = "zh";
            }
        }
        var libId=CHINESENAME_TO_ID[this.props.listLibItem[0]];
        const allLibs = this.generateAllLibs();
        var libItem=allLibs.find(item=>item.libid==libId)||0;
        return locale=='en'?libItem.nameeng:libItem.namecha;

    }


    render() {

        const {classes}=this.props;
        const allLibs = this.generateAllLibs();
        var xLabel=this.state.dimension["x"];
        var yLabel=this.state.dimension["y"];
        var zLabel=this.state.dimension["z"];

        var libInfo=this.allLibs.find(item=>item.id==this.state.libs);
        var supportCluster="";
        if(!!libInfo){
            supportCluster=libInfo.supportCluster||"";
        }

        console.log(this.state.libs);
        console.log(supportCluster);
        return (
            <Drawer
                variant="temporary"
                anchor="right"
                open={this.props.drawerOpen}
                classes={{
          paper: this.props.listMode?classes.drawerPaperList:classes.drawerPaper,
        }}
            >


                <div className="drawerContainer">

                    <div className="drawerHeader">
                        {this.props.listMode&&  <div className="drawer-title">{this.props.listLibItem[0]}</div>}
                            {!this.props.listMode&&  <div className="drawer-title"><FormattedMessage id="Filter"/></div>}
                        <IconButton className={classes.closeBtn} onClick={()=>{this.props.handeDrawerCloase()}}
                                    aria-label="Close">
                            <Icon type="close"/>
                        </IconButton>
                    </div>

                    {this.props.listMode &&<div>{this.renderSourceList()}
                    </div> }


                    { !this.props.listMode && <div>
                        <div className="drawerContent">
                            <div className={classes.filterTypeDiv} style={{padding:"0"}}>
                                <h5 className={classes.filterTypeTitle}><FormattedMessage id="LibName"/></h5>
                                <Select
                                    allowClear={true}
                                    className="gsd-select"
                                    dropdownClassName="gsd-select-dropdown"
                                    placeholder={<FormattedMessage
            id='PLEASE_SELECT LIBS'
        />}
                                    onChange={(value)=>{this.setState({libs:value,dimension:{}});}}
                                    style={{ width: '100%' }}
                                    dropdownStyle={{zIndex:"1400"}}
                                >
                                    {allLibs.map((item,index)=><Option
                                        key={item.id}><FormattedMessage id={item.id}/></Option>)}
                                </Select>
                            </div>

                            {
        //                     <div className={classes.filterTypeDiv}>
        //                         <h5 className={classes.filterTypeTitle}><FormattedMessage id="SUMMARY_DIMENSION"/></h5>
        //                         <Select
        //                             className="gsd-select"
        //                             dropdownClassName="gsd-select-dropdown"
        //                             defaultValue="year"
        //                             placeholder={<FormattedMessage
        //     id='PLEASE_SELECT LIBS'
        // />}
        //                             onChange={(value)=>this.changeFilterType(value)}
        //                             style={{ width: '100%' }}
        //                             dropdownStyle={{zIndex:"1400"}}
        //                         >
        //                             <Option key="year"><FormattedMessage id="TYPE_NAME_yearList"/></Option>
        //                             <Option key="author" disabled><FormattedMessage id="TYPE_NAME_authorList"/></Option>
        //                             <Option key="keyword" disabled><FormattedMessage
        //                                 id="TYPE_NAME_keywordList"/></Option>
        //                             <Option key="company" disabled><FormattedMessage
        //                                 id="TYPE_NAME_authorcompyList"/></Option>
        //
        //                         </Select>
        //                     </div>
                            }

                                                <div className={classes.filterTypeDiv}>
                                                    <h5 className={classes.filterTypeTitle}></h5><FormattedMessage id="X-axis"/>
                                                    <Select
                                                        disabled={!this.state.libs||this.state.libs.length==0}
                                                        className="gsd-select"
                                                        dropdownClassName="gsd-select-dropdown"
                                                        defaultValue=""
                                                        placeholder={<FormattedMessage
                                id='PLEASE_SELECT LIBS'
                            />}
                                                        onChange={(value)=>this.changeFilterType("x",value)}
                                                        style={{ width: '100%' }}
                                                        value={this.state.dimension.x}
                                                        dropdownStyle={{zIndex:"1400"}}
                                                    >
                                                        <Option key="collection" disabled={yLabel=='collection'||zLabel=='collection'||supportCluster.indexOf("collection")==-1}><FormattedMessage id="Collection"/></Option>
                                                        <Option key="author" disabled={yLabel=='author'||zLabel=='author'||supportCluster.indexOf("author")==-1}><FormattedMessage id="TYPE_NAME_authorList"/></Option>
                                                        <Option key="edition" disabled={yLabel=='edition'||zLabel=='edition'||supportCluster.indexOf("edition")==-1}><FormattedMessage
                                                            id="Edition"/></Option>
                                                        <Option key="born_year" disabled={yLabel=='born_year'||zLabel=='born_year'||supportCluster.indexOf("born_year")==-1}><FormattedMessage
                                                            id="born_year"/></Option>
                                                        <Option key="died_year" disabled={yLabel=='died_year'||zLabel=='died_year'||supportCluster.indexOf("died_year")==-1}><FormattedMessage
                                                            id="died_year"/></Option>
                                                        <Option key="gender" disabled={yLabel=='gender'||zLabel=='gender'||supportCluster.indexOf("gender")==-1}><FormattedMessage
                                                            id="gender"/></Option>

                                                    </Select>
                                                </div>


                            <div className={classes.filterTypeDiv}>
                                <h5 className={classes.filterTypeTitle}></h5><FormattedMessage id="Y-axis"/>
                                <Select
                                    disabled={!this.state.libs||this.state.libs.length==0}
                                    className="gsd-select"
                                    dropdownClassName="gsd-select-dropdown"
                                    defaultValue=""
                                    placeholder={<FormattedMessage
                                id='PLEASE_SELECT LIBS'
                            />}
                                    onChange={(value)=>this.changeFilterType("y",value)}
                                    style={{ width: '100%' }}
                                    value={this.state.dimension.y}
                                    dropdownStyle={{zIndex:"1400"}}
                                >
                                    <Option key="collection" disabled={xLabel=='collection'||zLabel=='collection'||supportCluster.indexOf("collection")==-1}><FormattedMessage id="Collection"/></Option>
                                    <Option key="author" disabled={xLabel=='author'||zLabel=='author'||supportCluster.indexOf("author")==-1}><FormattedMessage id="TYPE_NAME_authorList"/></Option>
                                    <Option key="edition" disabled={xLabel=='edition'||zLabel=='edition'||supportCluster.indexOf("edition")==-1}><FormattedMessage
                                        id="Edition"/></Option>
                                    <Option key="born_year" disabled={xLabel=='born_year'||zLabel=='born_year'||supportCluster.indexOf("born_year")==-1}><FormattedMessage
                                        id="born_year"/></Option>
                                    <Option key="died_year" disabled={xLabel=='died_year'||zLabel=='died_year'||supportCluster.indexOf("died_year")==-1}><FormattedMessage
                                        id="died_year"/></Option>
                                    <Option key="gender" disabled={xLabel=='gender'||zLabel=='gender'||supportCluster.indexOf("gender")==-1}><FormattedMessage
                                        id="gender"/></Option>

                                </Select>
                            </div>


                            <div className={classes.filterTypeDiv}>
                                <h5 className={classes.filterTypeTitle}></h5><FormattedMessage id="Z-axis"/>
                                <Select
                                    disabled={!this.state.libs||this.state.libs.length==0}
                                    className="gsd-select"
                                    dropdownClassName="gsd-select-dropdown"
                                    defaultValue=""
                                    placeholder={<FormattedMessage
                                id='PLEASE_SELECT LIBS'
                            />}
                                    onChange={(value)=>this.changeFilterType("z",value)}
                                    style={{ width: '100%' }}
                                    value={this.state.dimension.z}
                                    dropdownStyle={{zIndex:"1400"}}
                                >
                                    <Option key="collection" disabled={yLabel=='collection'||xLabel=='collection'||supportCluster.indexOf("collection")==-1}><FormattedMessage id="Collection"/></Option>
                                    <Option key="author" disabled={yLabel=='author'||xLabel=='author'||supportCluster.indexOf("author")==-1}><FormattedMessage id="TYPE_NAME_authorList"/></Option>
                                    <Option key="edition" disabled={yLabel=='edition'||xLabel=='edition'||supportCluster.indexOf("edition")==-1}><FormattedMessage
                                        id="Edition"/></Option>
                                    <Option key="born_year" disabled={yLabel=='born_year'||xLabel=='born_year'||supportCluster.indexOf("born_year")==-1}><FormattedMessage
                                        id="born_year"/></Option>
                                    <Option key="died_year" disabled={yLabel=='died_year'||xLabel=='died_year'||supportCluster.indexOf("died_year")==-1}><FormattedMessage
                                        id="died_year"/></Option>
                                    <Option key="gender" disabled={yLabel=='gender'||xLabel=='gender'||supportCluster.indexOf("gender")==-1}><FormattedMessage
                                        id="gender"/></Option>

                                </Select>
                            </div>


                            {
                            //     this.state.dimension == "year" && <div className={classes.filterTypeDiv}>
                            //     <h5 className={classes.filterTypeTitle}><FormattedMessage
                            //         id="YEAR_RANGE"/>&nbsp;{this.state.yearRange[0]}-{this.state.yearRange[1]}</h5>
                            //     <Slider className="gsd-slider" min={1900} value={this.state.yearRange} max={2018} range
                            //             step={1} defaultValue={[1900, 2018]}
                            //             onChange={(value)=>this.handleYearRange(value)}/>
                            // </div>
                            }

                            {
        //                         this.state.dimension == "author" && <div className={classes.filterTypeDiv}>
        //                         <h5 className={classes.filterTypeTitle}><FormattedMessage
        //                             id="Author"/></h5>
        //
        //                         {!!this.props.chart.pageInfos.authorListChartAccessing &&
        //                         <CircularProgress size="30" color="secondary"/>}
        //
        //                         {!this.props.chart.pageInfos.authorListChartAccessing && <Select
        //                             allowClear={true}
        //                             className="gsd-select"
        //                             dropdownClassName="gsd-select-dropdown"
        //                             mode="multiple"
        //                             placeholder={<FormattedMessage
        //     id='PLEASE_SELECT LIBS'
        // />}
        //                             onChange={(value)=>{this.setState({authorList:value});}}
        //                             style={{ width: '100%' }}
        //                             dropdownStyle={{zIndex:"1400"}}
        //                         >
        //                             {this.props.chart.clustersData.authorList.map(item=><Option
        //                                 key={item.label}>{item.label}({item.count})</Option>)}
        //                         </Select>}
        //                     </div>

                            }


                        </div>

                        <div className="drawerAction">
                            <Button onClick={()=>this.saveFilter()} style={{marginRight:"15px"}} variant="contained"
                                    color="primary" className={classes.okBtn}>
                                <FormattedMessage id="Ok"/>
                            </Button>

                            <Button variant="outlined" color="primary" onClick={()=>{this.props.handeDrawerCloase()}}
                                    className={classes.cancelBtn}>
                                <FormattedMessage id="CANCEL"/>
                            </Button>

                        </div>
                    </div>
                    }


                </div>


            </Drawer>

        )
    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        personality: state.personality,
        chart: state.chart

    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getAllLibTags: () => dispatch(getAllLibTags()),
        getClusterData: (searchValue, clusterName)=>dispatch(getClusterData(searchValue, clusterName))


    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(ScatterDrawer)));
