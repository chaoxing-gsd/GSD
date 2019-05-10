/**
 * Created by Aaron on 2018/7/5.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, Glyphicon} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import {FormattedMessage,injectIntl} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import {connect} from 'react-redux'
import Databases from './databases'
import CustomGroup from './customGroup';
import {setPageInfos} from "../../actions";
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import ResultList from '../result/ResultList'
import swal from 'sweetalert2'
import {setUserLibs,getUserLibs} from "../../utils/utils"
import NoData from "../NoData"

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        padding: "15px 20px"
    },
    okBtn: {
        fontSize: '13px',
        textAlign:"center",
        display: "inline-block",
        backgroundColor: "#d45f5f",
        '&:hover': {
            backgroundColor: "#b93939",
        },
    },
    cancelBtn: {
        fontSize: '13px',
        display: "inline-block",
        textAlign:"center",
        color: "#777777",
        borderColor: "transparent",
        '&:hover': {
            borderColor: "transparent",
        },

    },
    fabIcon: {
        textAlign:"center",
        marginLeft:"10px",
        marginBottom:"10px"
    },
});


class Personality extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {currentLibs:[],localTagName:""}
    }

    cancelConfig(){
        this.props.setPageInfos({editMode: false});
    }

    saveConfigs() {
        var  currentTabIndex=this.props.personality.pageInfos.tabIndex;

        var currentTab=this.props.personality.myGroupTags[currentTabIndex];

        if(!!currentTab){//当前标签组存在,则保存
            var currentLibs=this.getLibIds();
            this.setState({currentLibs});
            if(this.props.userInfos.isLogined){
                setUserLibs(JSON.stringify({groupTag:currentTab.categoryname,libs:currentLibs}));
            }            
            this.props.setPageInfos({editMode: false});
            this.setState({localTagName:currentTab.categoryname,selectedLibIds:currentLibs});
            this.props.setPageInfos({localTagName:currentTab.categoryname,selectedLibIds:currentLibs});
        }else{

            swal({
                title: this.props.intl.formatMessage({id: 'NOT CHOOSED TAGS'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {
                if (result.value) {

                }
            })
        }


    }


    showConfigDialog(){

        this.props.setPageInfos({editMode: true,});

    }


    componentDidMount() {
        var localUserLibInfos=getUserLibs();
        if(!!localUserLibInfos&&localUserLibInfos!=""){
            var libsData=JSON.parse(localUserLibInfos);
            if(!!libsData.groupTag&&!!libsData.libs&&libsData.libs.length>0){
                this.setState({localTagName:libsData.groupTag});
                var currentLibs=libsData.libs||[];
                this.props.setPageInfos({localTagName:libsData.groupTag,selectedLibIds:currentLibs});

                this.setState({currentLibs});
                this.props.setPageInfos({editMode: false});
            }else{
                this.showConfigDialog();
            }

        }else{
            this.showConfigDialog();
        }
    }



    componentWillReceiveProps(nextProps) {


        if (!!nextProps.personality.pageInfos.localTagName&&nextProps.personality.pageInfos.localTagName != this.state.localTagName) {
            console.log("pppppppp");
            console.log(nextProps.personality.pageInfos.selectedLibIds);
            this.setState({currentLibs:nextProps.personality.pageInfos.selectedLibIds});
            setUserLibs(JSON.stringify({groupTag:nextProps.personality.pageInfos.localTagName ,libs:nextProps.personality.pageInfos.selectedLibIds}));
            this.props.setPageInfos({editMode: false});
            this.setState({localTagName:nextProps.personality.pageInfos.localTagName});

        }
    }

    getLibIds(){//获取库lib
        var allLibs=[];
        var currentLibs=[];
        var libs=this.props.personality.allLibs||{};
        var catKey=Object.keys(libs);
        if(!!catKey&&catKey.length>0){
            allLibs=catKey.reduce((arr,key,index)=>{
                var keyLibs=libs[key];
                arr=arr.concat(keyLibs)
                return arr;
            },[]);
        }
        if(!!this.props.personality.currentSelTags&&this.props.personality.currentSelTags.length>0){
            currentLibs=this.props.personality.currentSelTags.reduce((arr,item,index) => {
                var selctedItem=allLibs.find(sel=>
                {
                    return sel.libid==item
                })
                if(!!selctedItem){
                    arr.push({id:selctedItem.libid,type:selctedItem.type});
                }
                return arr;
            },[]);
        }
        return currentLibs;
    }

    renderResultList(){
        
        var dataList=(this.state.currentLibs||[]).reduce((arr,item)=>{
           if(this.props.searchResult.allSearchResultAccessing[item.id] === "stop"){
               const data = this.props.searchResult.allSearchResult[item.id];
               const hasData = (!!data && ((!!data.content && data.content.length > 0) || (!!data.documentcontent && data.documentcontent.length > 0))) ;
               if(hasData)arr.push(1);//有数据

           }else{
               arr.push(1);//还在加载中
           }
            return arr;
        },[]);
        if(dataList.length==0){//无数据
            return <NoData msg={<FormattedMessage id="Professional No Data Tip"/>}/>
        }else{
            console.log(this.state.currentLibs);
            return  <ResultList clusterMode={true} libIds={this.state.currentLibs}/>;
        }

    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                {this.props.personality.pageInfos.editMode&&<div>
                    <LinearProgress
                        style={{visibility:this.props.personality.pageInfos.isAccessing?"visible":"hidden"}}/>
                    <div className={classes.root} elevation={1}>

                        <CustomGroup/>
                        <Databases/>

                        <div className="actionArea">
                            <Button onClick={()=>this.saveConfigs()} style={{marginRight:"15px"}} variant="contained"
                                    color="primary" className={classes.okBtn}>
                                <FormattedMessage id="Ok"/>
                            </Button>
                            <Button variant="outlined" color="primary" onClick={()=>this.cancelConfig()} className={classes.cancelBtn}>
                                <FormattedMessage id="CANCEL"/>
                            </Button>
                        </div>
                    </div>
                </div>}
                {!this.props.personality.pageInfos.editMode&&this.renderResultList()}
            </div>
        );
    }

}


const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        personality: state.personality,
        searchResult:state.searchResult
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        setPageInfos: (pageInfos)=>dispatch(setPageInfos(pageInfos))


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(Personality)));

