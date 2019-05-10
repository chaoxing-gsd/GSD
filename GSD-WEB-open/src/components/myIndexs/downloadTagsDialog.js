/**
 * Created by Aaron on 2018/7/5.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, Glyphicon} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import {connect} from 'react-redux'
import {Divider} from 'antd'
import {INNER_SERVER_URL} from  "../../config/constants";
import {fetchUrl} from '../../actions/fetchData';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert2'
import {browserHistory} from 'react-router'
const styles = theme => ({
    chip: {
        fontSize: "0.9rem",
        margin: theme.spacing.unit,
        backgroundColor: "#ffffff",
        color: "#d45f5f",
        border: "solid 1px #d45f5f",
        '&:hover': {
            fontSize: "0.9rem",
            color: '#ffffff',
            border: 'solid 1px #d45f5f00',
            backgroundColor: '#e88a8a',
            textDecoration: 'none'
        },
        '&:focus': {
            fontSize: "0.9rem",
            backgroundColor: "#ffffff",
            color: "#d45f5f",
            border: "solid 1px #d45f5f",
            textDecoration: 'none'
        },
    },
    chipSelected: {
        fontSize: "0.9rem",
        margin: theme.spacing.unit,
        backgroundColor: "#d45f5f",
        color: "#ffffff",
        border: "solid 1px #d45f5f",
        '&:hover': {
            fontSize: "0.9rem",
            color: '#ffffff',
            border: 'solid 1px #d45f5f00',
            backgroundColor: '#e88a8a',
            textDecoration: 'none'
        },
        '&:focus': {
            fontSize: "0.9rem",
            backgroundColor: "#d45f5f",
            color: "#ffffff",
            border: "solid 1px #d45f5f",
            textDecoration: 'none'
        },
    },
    buttonOk:{
        backgroundColor: "#d45f5f",
        textAlign:"center",
        display: "inline-block",
        fontSize:'12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#b93939"
        },
        color: "#ffffff",
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
});


class DownloadTagsDialog extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        intl: intlShape.isRequired
    }

    constructor(props) {
        super(props);
        this.cxId = null;
        this.isAdding = false;
        this.currentDataList=[];
        this.state = {editMode:false,snakeOpen: false,selectedKeys:[], tags: [],selectTagId:"",selectedFormater:"",dialogOpenMode:false}
    }

    getUserTags = async(userId, header)=> {
        var response = await fetchUrl(INNER_SERVER_URL + `queryDownLabels?userid=` + userId, "get", null, header);
        if (!!response) {
            if (!!response.statu) {
                this.setState({tags: response.data.data});

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

    componentDidMount() {
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
            this.getUserTags(this.cxId, header);
            this.setState({selectedKeys:this.props.selectedKeys,dialogOpenMode:this.props.dialogOpenMode});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userInfos.responseUserInfo.userid!=""&&nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: nextProps.userInfos.responseUserInfo.token};
            this.getUserTags(this.cxId, header);
        }
        if(!!nextProps.selectedKeys&&JSON.stringify(nextProps.selectedKeys)!=JSON.stringify(this.state.selectedKeys)){
            this.setState({selectedKeys:nextProps.selectedKeys});
        }
        if(nextProps.dialogOpenMode!=this.state.dialogOpenMode){
            this.setState({dialogOpenMode:nextProps.dialogOpenMode});
        }

    }

    addUserTag = async(labelName,userId, header)=> {
        let formdata = new FormData();
        formdata.append("labelname",labelName);
        formdata.append("userid",userId);
        var response = await fetchUrl(INNER_SERVER_URL + `createDownLabel`, "post", formdata, header);
        var tags=this.state.tags.filter(item=>item.id!='newAdd');
        this.isAdding=false;
        if (!!response) {
            if (!!response.statu) {

                tags.push({labelname:labelName,id:response.data})
                this.setState({tags: tags,selectTagId:response.data});


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


    addNewTag() {
        if (!this.isAdding) {
            this.isAdding = true;
            var tags = this.state.tags;
            tags = tags.concat({id: "newAdd"})
            this.setState({tags: tags});
        }


    }

    modifyCatGroup(value){
        if(!!value){
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
            this.addUserTag(value,this.cxId,header);
        }else{
            var tags=this.state.tags.filter(item=>item.id!='newAdd');
            this.isAdding=false;
            this.setState({tags:tags});
        }

    }

    onKeyupModify(e){
        if (e.keyCode == 13) {

            this.modifyCatGroup(e.target.value);

        }
    }

    onNewInputBlur(e){
        this.modifyCatGroup(e.target.value);
    }

    removeTags=async(tagId)=>{
        swal({
            title: this.props.intl.formatMessage({id: 'TIP'}),
            text: this.props.intl.formatMessage({id: 'CONFIRM OPERATION'}),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'}),
            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
        }).then(async(result) => {
            if (result.value) {
                var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
                // for(var i=0;i<this.state.selectTags.length;i++){
                var postParam={};
                postParam["labelid"]=tagId;
                var response = await fetchUrl(INNER_SERVER_URL + `deleteDownLabel?labelid=`+tagId, "delete", JSON.stringify(postParam), header);
                if (!!response) {
                    if (!!response.statu) {
                        var tags=this.state.tags.filter(item=>item.id!=tagId);
                        this.setState({tags: tags,selectTagId:""});

                    } else {
                        swal({
                            title: response.msg,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                        });

                    }

                } else {
                    swal({
                        title: this.props.intl.formatMessage({id: 'Error Tip'}),
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                    });

                }
            }
        });

        //}


    }


    toDownloadFile=async() => {

        if(!this.state.selectTagId){
            swal({
                title: this.props.intl.formatMessage({id: 'UnSelect Download Tag'}),
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {


            })
            return;
        }
        if(!this.state.selectedFormater){
            swal({
                title: this.props.intl.formatMessage({id: 'UnSelect Download Formater'}),
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            })
            return;
        }

        try{




        //查询标签中的所有id,用于下载
        var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
        var response = await fetchUrl(INNER_SERVER_URL + `queryDownDetails?labelid=${this.state.selectTagId}`, "post", {}, header);
        var dataList;
        if (!!response) {
            if (!!response.statu) {
                dataList=response.data.data.map(item=>item.literatureid);

            }
        }

        if(!!this.props.onDownload){
            var selectedTag=this.state.tags.find(item=>item.id==this.state.selectTagId);
            var fileName=!!selectedTag?selectedTag.labelname:null;
            this.props.onDownload(dataList,this.state.selectedFormater||this.state.selectedKeys,fileName);
        }
        }catch(e){
            console.log(e);
            swal({
                title: this.props.intl.formatMessage({id: 'Download Error'}),
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            })
        }


    }


    selectChip=async(tagId)=>{

        if(tagId==this.state.selectTagId){
            this.setState({selectTagId:""});
            if(!!this.props.updateDataList)this.props.updateDataList(null,"");
        }else{
            this.setState({selectTagId:tagId});
            if(!this.state.editMode){//非编辑模式则,切换列表数据
                var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
                var response = await fetchUrl(INNER_SERVER_URL + `queryDownDetails?labelid=${tagId}`, "post", {}, header);

                if (!!response) {
                    if (!!response.statu) {
                        this.currentDataList=response.data.data.map(item=>Object.assign({},JSON.parse(item.jsonbody),{webpageId:item.literatureid}));

                    }
                }
                if(!!this.props.updateDataList)this.props.updateDataList(this.currentDataList,tagId);
            }
        }



    }

    renderChips() {
        const {classes} = this.props;
        var componentArr = [];
        if (!!this.state.tags && this.state.tags.length > 0) {


            var tagList = this.state.tags;

            componentArr = tagList.map((item, index)=> {
                    if (item.id == "newAdd") {
                        return <span className="gsd-chip "><input autoFocus onBlur={(e)=>this.onNewInputBlur(e)} onKeyUp={(e)=>this.onKeyupModify(e)} type="text"
                                                                  style={{border:"none",boxShadow:'none',outline:0,width:'50px'}}/> </span>
                    } else return <Chip
                        key={item.id}
                        label={<span>&nbsp;&nbsp;{item.labelname}&nbsp;&nbsp;{this.state.editMode&&<i onClick={()=>this.removeTags(item.id)} className="glyphicon glyphicon-remove"></i>}</span>}
                        onClick={()=>this.selectChip(item.id)}
                        className={item.id==this.state.selectTagId?classes.chipSelected:classes.chip}
                        component="span"
                        clickable
                    />
                }) || [];


        }
       if(this.state.editMode)componentArr = componentArr.concat(<Chip
            onClick={()=>this.addNewTag()}
            key="add"
            label={<span><i className="fa fa-plus-square"></i>&nbsp;<FormattedMessage
        id="Add"
    /></span>}
            className={classes.chip}
            component="span"
            clickable
        />)
        if(componentArr.length>0){
            return componentArr;
        }else{
            return  <h4><small> <FormattedMessage id="NO_DATA"/></small></h4>
        }

    }

 

    toggleEditMode(flag){
        this.setState({editMode:flag});
        if(flag)this.props.updateDataList(null,"")//开始编辑标签,列表展现全部
        else {
            this.setState({selectTagId:''})
            this.props.updateDataList(null,"")
        }
    };


    bindToTag=async()=>{
        //将用户选中id插入到tag中
        if(this.state.selectedKeys.length==0){
            swal({
                title: this.props.intl.formatMessage({id: 'UnSelect References'}),
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            })
            return;
        }
        var infos=this.state.selectedKeys.map(item=>{

            let formdata ={};
            formdata["labelid"]=this.state.selectTagId;
            formdata["literatureid"]= item;
            formdata["type"]= "3";
            formdata["jsonbody"]= "";
            formdata["indexname"]= "webpage";
            return formdata;

        })
        var header1 = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token,"Content-Type":"application/json"};
        var response1 = await fetchUrl(INNER_SERVER_URL + `insertDownDetails`, "post",JSON.stringify(infos), header1);
        console.log(response1);
        if (!!response1) {
            if (!!response1.statu) {
                swal({
                    title: this.props.intl.formatMessage({id: 'Success Result'}),
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                })

            }else{
                swal({
                    title: response1.msg,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                }).then((result) => {

                })
            }
        }

    }

    render() {
        const {classes}=this.props;

        return (
            <div style={{marginTop:'20px'}} className="animateDiv">
                <div className={this.state.dialogOpenMode?"filterDialog show":"filterDialog"}>
                <Divider style={{color:"#6f6e6e"}} orientation="left"><span><FormattedMessage id="DownLoad Tag"/>&nbsp;&nbsp;<a onClick={()=>{this.toggleEditMode(!this.state.editMode)}} style={{color:"#cc4141"}}><i className="fa fa-cog"></i></a></span></Divider>
                {this.renderChips()}

                    {this.state.editMode&&<div style={{textAlign:'right'}}>
                        <Button variant="contained" disabled={!this.state.selectTagId} className={classes.buttonOk} onClick={()=>this.bindToTag()}
                                size="small"><FormattedMessage
                            id="Add To Tag"/></Button>
                        &nbsp;
                        <Button onClick={()=>this.toggleEditMode(false)} size="small"><FormattedMessage
                        id="Cancel Manage"/></Button></div>}
                <Divider style={{color:"#6f6e6e"}} orientation="left"><FormattedMessage id="DownLoad Formatter"/></Divider>

                <div><Chip
                    label="RIS"
                    onClick={()=>this.setState({selectedFormater:"RIS"})}
                    className={'RIS'==this.state.selectedFormater?classes.chipSelected:classes.chip}
                    component="span"
                    clickable
                />
                    <Chip
                        label="BIB"
                        onClick={()=>this.setState({selectedFormater:"BIB"})}
                        className={'BIB'==this.state.selectedFormater?classes.chipSelected:classes.chip}
                        component="span"
                        clickable
                    />
                </div>
                <div style={{marginTop:"20px",textAlign:"right"}}>
                    <Button disabled={!this.state.selectTagId&&!this.state.selectedFormater}  variant="contained" className={classes.buttonOk} onClick={()=>this.toDownloadFile()} size="small"><FormattedMessage
                        id="EXPORT"/></Button>
                    &nbsp;
                    <Button size="small" onClick={()=>{this.setState({selectTagId:'',selectedFormater:''});this.props.updateDataList(null,"");this.props.onClose()}} style={{textAlign:"center",display:'inline-block'}}><FormattedMessage
                        id="CANCEL"/></Button>
                </div>
                    </div>
            </div>
        );
    }

}


const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos
    }
}


export default connect(mapStateToProps)(withStyles(styles)(injectIntl(DownloadTagsDialog)));

