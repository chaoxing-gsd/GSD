/**
 * Created by Aaron on 2018/8/8.
 */
/**
 * Created by Aaron on 2018/8/8.
 */
import React, {Component} from 'react'
import {Glyphicon} from 'react-bootstrap';
import {connect} from 'react-redux'
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {browserHistory} from 'react-router'
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {setSearchResultPageInfos,setPageInfos,downloadFiles,deleteMyIndexsDataInSearchResult} from "../../actions";
import FilterDropDown from "./filterDropDown"
import { Tooltip } from 'antd';
import Badge from '@material-ui/core/Badge';
import ClusterFilter from './clusterFilter';
import NewestTag from '../personality/newestTag';
import swal from 'sweetalert2'
const styles = theme => ({
    buttonList: {
        display: "inline-block",
        color: "#a09d9d",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        borderRight:"0px",
        minWidth:'45px',
        borderTopRightRadius:"0px",
        borderBottomRightRadius:"0px",
    },
    buttonListSelected: {
        display: "inline-block",
        color: "#ffffff",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        borderRight:"0px",
        minWidth:'45px',
        borderTopRightRadius:"0px",
        borderBottomRightRadius:"0px",
        backgroundColor: "#a09d9d",
        boxShadow: "inset -1px 0px 10px #7b7676",
        '&:hover': {
            backgroundColor:"#b9b3b3",
            boxShadow: "inset -1px 0px 10px # 504e4e"
        },

},
    buttonTable: {
        display: "inline-block",
        color: "#a09d9d",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        borderTopLeftRadius:"0px",
        borderBottomLeftRadius:"0px",
        minWidth:'45px'
    },
    buttonTableSelected: {
        display: "inline-block",
        color: "#ffffff",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        borderTopLeftRadius:"0px",
        borderBottomLeftRadius:"0px",
        minWidth:'45px',
        backgroundColor: "#a09d9d",
        boxShadow: "inset -1px 0px 10px #7b7676",
        '&:hover': {
            backgroundColor:"#b9b3b3",
            boxShadow: "inset -1px 0px 10px # 504e4e"
        },
    },
    buttonConfig: {
        display: "inline-block",
        color: "#989696",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        minWidth:'45px',
        marginBottom: '15px'
        // marginLeft:"15px"
    },
    buttonConfigNoLine:{
        display: "inline-block",
        borderWidth:'0',
        color: "#a09d9d",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        minWidth:'45px',
    },
    buttonConfig1: {
        display: "inline-block",
        color: "#a09d9d",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        minWidth:'45px',
         marginLeft:"15px",
        marginBottom: '15px'
    },
    buttonEdit: {
        display: "inline-block",
        color: "#ffffff",
        backgroundColor:"#d45f5f",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        minWidth:'45px',
        marginBottom: '15px',
        // marginLeft:"15px",
        "&:hover":{
            backgroundColor:"#bb4343"
        },
    },
    buttonConfigSelected:{
        display: "inline-block",
        color: "#a09d9d",
        border: "1px solid rgb(185, 69, 69)",
        fontSize: "12px",
        minWidth:'45px',
        // marginLeft:"15px",
        color:"rgb(185, 69, 69)",
        "&:hover":{

        },

},    buttonRemove: {
        marginLeft: "15px",
        marginBottom: '15px',
        display: 'inline-block',
        textAlign: 'center',
        fontSize: '12px',
        minWidth: '45px',
        marginRight:"15px",
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#b53737"
        },
        '&:disabled':{
            color: "#ffffff",
            backgroundColor: "#d8d5d5",

        },
        color: "#ffffff",
        backgroundColor: "#cc4141"
    },

    buttonfConfigSelected1:{
        display: "inline-block",
        color: "#ffffff",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        minWidth:'45px',
        // marginLeft:"15px",
        backgroundColor:"#a09d9d",
        boxShadow: "inset -1px 0px 10px #7b7676",
        '&:hover': {
            backgroundColor:"#b9b3b3",
            boxShadow: "inset -1px 0px 10px # 504e4e"
        },
    },
    downLoadIcon:{
        display: "inline-block",
        color: "#ffffff",
        border: "1px solid rgb(183, 67, 67)",
        fontSize: "12px",
        minWidth:'45px',
        backgroundColor:"#d45f5f",
        '&:hover': {
            backgroundColor:"#e67b7b",
            border:"1px solid rgb(212, 95, 95)"
        },
    },
    badge:{
        backgroundColor:"#d45f5f"
    },
    badgeHide:{
        display:"none"
    }
});

const orderOptions = [
    {value:"0",label:<FormattedMessage
        id="Order by"
    />},
    {value:"1",label:<FormattedMessage
        id="Time Desc"
    />},
    {value:"2",label:<FormattedMessage
        id="Time Asc"
    />},

];

const dowloadTypeOptions = [
    {value:"1",label:"RIS"},
    {value:"2",label:"BIB"},


];

class TopTools extends Component {

    constructor(props) {
        super(props);
        this.state = {open: true,filterOpenMode:false,selectedAll:false,selectAllBtnShow:true};

    }

    toggleResultMode(mode){
        this.props.setSearchResultPageInfos({"allPageMode":mode});
    }

    orderOption(option){
        console.log(option);
        this.props.setSearchResultPageInfos({timeSort:option.value})
    }

    editMyIndex(){
        this.props.setSearchResultPageInfos({editMyIndex:!this.props.searchResult.pageInfos.editMyIndex})
    }

    selectAll(){
        this.props.setSearchResultPageInfos({selectALLIndex:true})
        this.setState({selectAllBtnShow:false});
    }

    unSelectAll(){
        this.props.setSearchResultPageInfos({unSelectALLIndex:true})
        this.setState({selectAllBtnShow:true});

    }

    editIndex(){
        window.open("/editMyIndexs?from=0&indexId="+this.props.searchResult.pageInfos.selectedMyIndex[0].webpageId+"&searchValue="+(this.props.location.query.searchValue||''));
    }
    showConfigDialog(){

        this.props.setPageInfos({editMode: true,});

    }

    removeIndex(){
        var _self=this;
        swal({
            title: this.props.intl.formatMessage({id: 'TIP'}),
            text: this.props.intl.formatMessage({id: 'CONFIRM OPERATION'}),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'}),
            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
        }).then((result) => {
            if (result.value) {


                _self.props.deleteMyIndexsDataInSearchResult(_self.props.userInfos.responseUserInfo.userid,_self.props.searchResult.pageInfos.selectedMyIndex.map(item=>item.webpageId), {
                    userid: _self.props.userInfos.responseUserInfo.userid,
                    token: _self.props.userInfos.responseUserInfo.token
                });
            }
        })
    }

    downloadFile(value){
        console.log(value);
        var header={userid:this.props.userInfos.responseUserInfo.userid,token:this.props.userInfos.responseUserInfo.token};
        this.props.downloadFiles(this.props.searchResult.pageInfos.selectedMyIndex.map(item=>item.webpageId),this.props.userInfos.responseUserInfo.userid,value.value,header);
    }

    clustChartsMode(state){
        this.setState({filterOpenMode:state});
    }

    toggleItemAll(){
        this.props.setSearchResultPageInfos({selectAllMyIndex:!this.props.searchResult.pageInfos.selectAllMyIndex})

    }

    render() {
        const {classes}=this.props;
        return <div><div className="top-tool-bar" style={{display:this.props.personality.pageInfos.editMode&&this.props.tabIndex==1?"none":"block"}}>
            <div className="top-tool-bar-wrapper clearfix">
                {

               // <div className="btn-group">
               //
               //      <Tooltip   title={<FormattedMessage id="List_Mode"/>}  placement="bottom">
               //          <Button variant="outlined" size="small" onClick={()=>this.toggleResultMode("list")} className={this.props.searchResult.pageInfos.allPageMode=="list"?classes.buttonListSelected:classes.buttonList}>
               //      <i className="glyphicon glyphicon-th-list"></i>
               //  </Button></Tooltip>
               //      <Tooltip    title={<FormattedMessage id="Table_Mode"/>}  placement="bottom"><Button  onClick={()=>this.toggleResultMode("table")} variant="outlined" size="small" className={this.props.searchResult.pageInfos.allPageMode=="table"?classes.buttonTableSelected:classes.buttonTable}>
               //      <i className="glyphicon glyphicon-th-large"></i>
               //  </Button></Tooltip>
               //      </div>
                }

                {this.props.tabIndex==0&&<Tooltip title={<FormattedMessage id="Chart Data"/>} placement="bottom"> <Button
                    className={this.state.filterOpenMode?classes.buttonfConfigSelected1:classes.buttonConfig}
                    onClick={()=>this.setState({filterOpenMode:!this.state.filterOpenMode})}
                    variant="outlined" size="small">
                    <i className="glyphicon glyphicon-stats"> </i>
                </Button>
                </Tooltip>
                }


                {this.props.tabIndex==1&& <div className="clearfix"><Button
                    style={{float:'left'}}
                    className={classes.buttonConfigNoLine}
                    variant="outlined" size="small" onClick={()=>this.showConfigDialog()}>
                    <Glyphicon
                        glyph="cog"/>
                </Button>
                    <span className="spliter"></span>
                <NewestTag selectedTagName={this.props.personality.pageInfos.localTagName}/>
                </div>

                }

                {
                //     this.props.tabIndex==2&&<Button
                //     className={this.props.searchResult.pageInfos.editMyIndex?classes.buttonEdit:classes.buttonConfig} onClick={()=>this.editMyIndex()}
                //     variant="outlined" size="small">
                //     <Glyphicon
                //         glyph="edit"/>&nbsp;
                //     <FormattedMessage id={!this.props.searchResult.pageInfos.editMyIndex?"EDIT":"CANCEL"}/>
                // </Button>

                }

                {
                    this.props.tabIndex==2&&this.props.searchResult.pageInfos.editMyIndex&&((this.props.searchResult.pageInfos.selectedMyIndex.length==0||this.props.searchResult.pageInfos.currentTotal>this.props.searchResult.pageInfos.selectedMyIndex.length))&&
                    <Button className={classes.buttonConfig}
                            style={{marginLeft:'1rem'}}
                            onClick={()=>this.selectAll()}
                            size="small"
                    ><i className="fa fa-check-circle-o"/>&nbsp;<FormattedMessage id="Select_ALL"/>
                    </Button>


                }

                {
                    this.props.tabIndex==2&&this.props.searchResult.pageInfos.editMyIndex&&(this.props.searchResult.pageInfos.currentTotal==this.props.searchResult.pageInfos.selectedMyIndex.length)&&
                    <Button className={classes.buttonConfig} style={{marginLeft:'1rem'}}
                            onClick={()=>this.unSelectAll()}
                            size="small"
                    ><i className="fa fa-circle-o"/>&nbsp;<FormattedMessage id="UnSelect_ALL"/>
                    </Button>


                }

                {
                    this.props.tabIndex==2&&this.props.searchResult.pageInfos.editMyIndex&&
                                           <Button className={classes.buttonRemove}
                                                   onClick={()=>this.removeIndex()}
                                                   size="small"
                                            disabled={this.props.searchResult.pageInfos.selectedMyIndex.length==0}
                                            ><Glyphicon
                                               glyph="trash"/>&nbsp;<FormattedMessage id="DELETE"/>
                                               </Button>


                }

                {
                    this.props.tabIndex==2&&this.props.searchResult.pageInfos.editMyIndex&&
                    <Button className={classes.buttonConfig}
                            onClick={()=>this.editIndex()}
                            size="small"
                            disabled={this.props.searchResult.pageInfos.selectedMyIndex.length!=1}
                    ><Glyphicon
                        glyph="pencil"/>&nbsp;<FormattedMessage id="EDIT"/>
                    </Button>


                }


                { this.props.tabIndex == 2 && this.props.searchResult.pageInfos.editMyIndex &&
                <Badge classes={{badge:this.props.searchResult.pageInfos.selectedMyIndex.length>0?classes.badge:classes.badgeHide}}
                       badgeContent={this.props.searchResult.pageInfos.selectedMyIndex.length} color="primary"><Button
                    className={classes.buttonConfig1}
                    size="samll"
                    disabled={this.props.searchResult.pageInfos.selectedMyIndex.length==0}
                    onClick={()=>this.props.setSearchResultPageInfos({openTagDialog:true})}
                    variant="outlined" size="small">
                    <i className="fa fa-tasks"> </i>&nbsp;<FormattedMessage id="Add to Compare"/>
                </Button>
                </Badge>
                }


                { this.props.tabIndex == 2 && this.props.searchResult.pageInfos.editMyIndex &&
                <Badge classes={{badge:this.props.searchResult.pageInfos.selectedMyIndex.length>0?classes.badge:classes.badgeHide}}
                       badgeContent={this.props.searchResult.pageInfos.selectedMyIndex.length} color="primary"><Button
                    className={classes.buttonConfig1}
                    size="samll"
                    disabled={this.props.searchResult.pageInfos.selectedMyIndex.length==0}
                    onClick={()=>this.props.setSearchResultPageInfos({openImportTextToolDialog:true})}
                    variant="outlined" size="small">
                    <i className="fa fa-file-text"> </i>&nbsp;<FormattedMessage id="Import To Text Tools"/>
                </Button>
                </Badge>
                }

                {
                //     this.props.tabIndex==2&&this.props.searchResult.pageInfos.editMyIndex&&<Tooltip title={<FormattedMessage id="Download"/>} placement="bottom">
                //     <Badge classes={{badge:this.props.searchResult.pageInfos.selectedMyIndex.length>0?classes.badge:classes.badgeHide}}  badgeContent={this.props.searchResult.pageInfos.selectedMyIndex.length} color="secondary">
                //         <FilterDropDown compomentStyle={classes.buttonConfig1}
                //                         disabled={this.props.searchResult.pageInfos.selectedMyIndex.length==0}
                //                         hideSelectedLabel
                //                         itemClick={(option)=>this.downloadFile(option)}
                //                         name={<Glyphicon
                //         glyph="download-alt"/>} options={dowloadTypeOptions}/>
                //        </Badge>
                // </Tooltip>
                }

                {
                //     this.props.tabIndex==2&&this.props.searchResult.pageInfos.editMyIndex&&<Tooltip title={<FormattedMessage id={this.state.selectedAll?"UnSelect_ALL":"Select_ALL"}/>} placement="bottom"> <Button
                //     className={this.props.searchResult.pageInfos.selectAllMyIndex?classes.buttonEdit:classes.buttonConfig} onClick={()=>this.toggleItemAll()}
                //     variant="outlined" size="small">
                //     <Glyphicon
                //         glyph="check"/>
                // </Button>
                // </Tooltip>
                }



                {
                    (this.props.tabIndex == 2)&& <div className="right-tools">
                    <FilterDropDown  iconClass="glyphicon glyphicon-filter"
                                    itemClick={(option)=>this.orderOption(option)}
                                    name={<FormattedMessage id="Order by"/>} options={orderOptions}/>
                    {
                        // <Tooltip title={<FormattedMessage id="Download"/>} placement="bottom"><Button variant="outlined"
                        //                                                                               size="small"
                        //                                                                               className={classes.downLoadIcon}>
                        //     <i className="glyphicon glyphicon-download-alt"></i>
                        // </Button></Tooltip>
                    }
                </div>
                }


            </div>
        </div>
           <div style={{display:this.props.tabIndex==0?"block":"none"}}> <ClusterFilter onClose={()=>this.setState({filterOpenMode:false})} searchValue={this.props.location.query.searchValue||''} filterOpenMode={this.state.filterOpenMode}/></div>
            </div>
    }

}


const mapStateToProps = (state, props) => {

    return {
        userInfos: state.userInfos,
        searchResult:state.searchResult,
        routing: state.routing,
        personality:state.personality,
        ...props
    }
}


const mapDispatchToProps = (dispatch, props) => {
    return {
        setSearchResultPageInfos: (pageInfos) => dispatch(setSearchResultPageInfos(pageInfos)),
        setPageInfos: (pageInfos)=>dispatch(setPageInfos(pageInfos)),
        downloadFiles: (webpageIds,userid,downloadType,header)=>dispatch(downloadFiles(webpageIds,userid,downloadType,header)),
        deleteMyIndexsDataInSearchResult: (userId, noteIds, header) => dispatch(deleteMyIndexsDataInSearchResult(userId, noteIds, header)),



    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(injectIntl(TopTools)));


