import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import {withStyles} from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import {Glyphicon} from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import {Breadcrumb, Select, Radio} from 'antd';
import Header  from "../header";
import {getBindedEmails, addLocalEmails, BindedEmail, removeLocalEmails, DeleteEmail} from "../../actions"
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {browserHistory} from 'react-router'
import {INNER_SERVER_URL,UPLOAD_SERVER_URL} from  "../../config/constants";
import {isEmail} from "../../utils/utils"
import {Progress, Divider,Popover} from 'antd';
import {fetchUrl} from '../../actions/fetchData';

import swal from 'sweetalert2'
const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        marginTop: "10px"
    },
    okBtn: {
        fontSize: '13px',
        textAlign:"center",
        display: "inline-block",
        backgroundColor: "#F44336",
        '&:hover': {
            backgroundColor: "#b93939",
        },
    },
    cancelBtn: {
        fontSize: '13px',
        display: "inline-block",
        textAlign:"center",
        color: "#777777",
        border: "none",
        '&:hover': {
            border: "none",

        },

    },
    buttonEmail:{
        background: "#2196f3",
        display: "block",
        width:"100%",
        color: "#ffffff",
        border: "none",
        fontSize: "14px",
        '&:disabled': {
            backgroundColor: "#cccccc",
            // color:"#ffffff"

        },
        '&:hover': {
            backgroundColor: "#46a6f3",
            // color:"#ffffff"

        },
    },

});
const Option = Select.Option;
const RadioGroup = Radio.Group;


class AddNewDb extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            dbData:{},
            radioValue:1,
        }
        this.cxId;
        this.header;

    }





    saveData = async()=> {//保存数据
        console.log(this.state.dbData);
        if(!this.state.dbData.name||!this.state.dbData.domainname||!this.state.dbData.email){
            swal({
                title: this.props.intl.formatMessage({id: 'Data is empty'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
            return;
        }
        if(!this.state.dbData.csvurl && this.state.radioValue == 1){
            swal({
                title: this.props.intl.formatMessage({id: 'UploadList is empty'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            });
            return;
        }
        if(!this.state.dbData.csvurlHttp && this.state.radioValue == 2){
            swal({
                title: "请输入上传地址",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            });
            return;
        }
        if(!this.isHttp(this.state.dbData.domainname)){
            swal({
                title: "请输入正确的数据源域名",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            });
            return;
        }
        if(!isEmail(this.state.dbData.email)){
            swal({
                title: this.props.intl.formatMessage({id: 'Email Error'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
            return;
        }
        var formData=new FormData();
        var keys=Object.keys(this.state.dbData);
        keys.forEach(key=>{
            if((key == "csvurl" && this.state.radioValue == 2) || (key == "csvurlHttp" && this.state.radioValue == 1))
                return;
            formData.append(key,this.state.dbData[key]);
        });
        formData.append("userid",this.cxId);
        console.log(formData);
        var response = await fetchUrl(INNER_SERVER_URL + `putindex`, "post", formData,  this.header);
        console.log(response);
        if (!!response) {
            if (!!response.statu) {
                swal({
                    title: this.props.intl.formatMessage({id: 'SUCCESS'}),
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    timer:2000,
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                }).then((result) => {
                    history.go(-1);
                })

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

    isHttp(domainname){
        var check = true;
        var array = domainname.split(",");
        for(var i=0;i<array.length;i++){
            if(array[i].indexOf("http://") == -1){
                check = false;
            }
        }
        return check;
    }

    componentDidMount() {
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            this.header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};

        }
        document.title=this.props.intl.formatMessage({id: 'Add New Db'})+"-"+this.props.intl.formatMessage({id: 'PROJECT_NAME'});

    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.userInfos.responseUserInfo.userid!=""&&nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            this.header= {userid: this.cxId, token: nextProps.userInfos.responseUserInfo.token};
        }

    }

    handleTextChange(e,name){
        if(name == "indexname"){
            e.target.value = e.target.value.replace(/[^a-z0-9_]/g,'');
        }
        this.setState({
            dbData:{...this.state.dbData,[name]: e.target.value.trim()}
        });
    };

    checkIndexname = async(save = false)=> {
        var that = this;
        var indexname = this.state.dbData["indexname"] || "";
        var formData=new FormData();
        formData.append("indexname",indexname);
        var response = await fetchUrl(INNER_SERVER_URL + `checkindexisexist`, "post", formData,  this.header);
        if (!!response) {
            if(!response.statu){
                swal({
                    title: "校验成功",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                }).then((result) => {

                })         
            }else{
                swal({
                    title: "校验失败",
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                }).then((result) => {
                    that.setState({
                        dbData:{...that.state.dbData,["indexname"]: ""}
                    });
                    document.getElementById("dbIndexInput").value = "";
                })
            }            
        } else {
            swal({
                title: "校验失败",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {
                that.setState({
                    dbData:{...that.state.dbData,["indexname"]: ""}
                });
                document.getElementById("dbIndexInput").value = "";
            })
        }        
    }

    handleChange(e,name){
        this.setState({
            dbData:{...this.state.dbData,[name]: e}
        });
    }

    uploadFile = async(file,fileName)=> {
        var formdata = new FormData();
        formdata.append('file', file, fileName);
        var response = await fetchUrl(UPLOAD_SERVER_URL + `upload`, "post", formdata, {});
        console.log(response);
        if (!!response) {
            console.log(response);
            if (response.status == 'success' || response.status == 'exist') {
                var url = "http://cs.ananas.chaoxing.com/download/" + response.objectid;
                return url;
            }
        }
        return null;
    }

    onSelectFile=async(e)=> {//用户上传文件
        var files = document.getElementById("upload-text-file").files;
        if (files.length) {
            var file = files[0];
            var nameValue=document.getElementById("upload-text-file").value;
            var suffix=nameValue.substring(nameValue.lastIndexOf(".")+1);
            if(!!suffix&&suffix.toLowerCase()=='csv'){
                var fileName=nameValue.substring(nameValue.lastIndexOf("\\")+1);
                console.log(fileName);
                var url=await this.uploadFile(file,fileName);
                this.setState({
                    dbData:{...this.state.dbData,csvurl: url,fileName:fileName}
                });
            }else{
                swal({
                    title: this.props.intl.formatMessage({id: 'Only support Csv'}),
                    type: 'info',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                })
            }
        }
    }

    removeFileItem(){
        this.setState({
            dbData:{...this.state.dbData,csvurl: "",fileName:null}
        });
    }

    openMediaWikiDialog(){
        swal({
            html: `<h4>${this.props.intl.formatMessage({id: 'Edit with MediaWiki'})}</h4><div><input id="wiki_title" placeholder='${this.props.intl.formatMessage({id: 'Input Wiki Title'})}' type="text" class="form-control"/></div>`,
            showCancelButton:true,
            cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'}),
            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
        }).then(result=>{
            if(result){
                var title=document.getElementById("wiki_title").value;
                if(!!title&&!!title.trim()){
                    window.open("http://gsd.chaoxing.com/index.php?title="+title+"&action=edit&redlink=1");
                }else{
                    return false;
                }

            }
        });
    }

    render() {
        const {classes} = this.props;


        return (
            <div>
                <Header/>
                <Grid style={{marginTop:"30px"}}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item href="/"><FormattedMessage id="HOME"/></Breadcrumb.Item>
                        <Breadcrumb.Item href="/myProfile"><FormattedMessage id="MY_PROFILE"/></Breadcrumb.Item>
                        <Breadcrumb.Item><strong></strong><FormattedMessage
                            id="Add New Db"/></Breadcrumb.Item>
                    </Breadcrumb>
                    <Row style={{marginTop:'20px'}}>
                        <Col sm={12} md={12}
                             lg={12}>
                            <div style={{backgroundColor:"#ffffff",marginBottom:'20px'}}>
                                <h5 style={{ padding: "20px 0 0 15px",margin:"0",color:"#8a8787"}}><i
                                    className="fa fa-database"></i>&nbsp;<FormattedMessage
                                    id="Add New Db"/></h5>
                                <Divider style={{margin:"10px 0"}}></Divider>
                                <div style={{padding:'15px'}} className="form-horizontal">

                                    <div className="form-group">
                                        <label for="dbNameInput" className="col-sm-2 control-label"><FormattedMessage
                                            id="Db name"/><i style={{color:'red',fontWeight:'bold'}}>*</i></label>
                                        <div className="col-sm-10">
                                            <input placeholder="请输入数据源名称" type="text" onChange={(e)=>this.handleTextChange(e,"name")}  className="form-control" id="dbNameInput" />
                                        </div>                                        
                                    </div>

                                    <div className="form-group">
                                        <label for="dbIndexInput" className="col-sm-2 control-label"><FormattedMessage
                                            id="Db index"/><i style={{color:'red',fontWeight:'bold'}}>*</i></label>
                                        <div className="col-sm-8">
                                            <input placeholder="请输入索引名称(英文、数字、下划线)" type="text" onChange={(e)=>this.handleTextChange(e,"indexname")}  className="form-control" id="dbIndexInput" />
                                        </div>
                                        <div className="col-sm-2">
                                            <Button onClick={()=>this.checkIndexname()} variant="contained"
                                                    color="primary" className={classes.okBtn}>
                                                <FormattedMessage id="checkIndex"/>
                                            </Button>
                                        </div>
                                    </div>


                                    <div className="form-group">
                                        <label for="dbDomainInput" className="col-sm-2 control-label"><FormattedMessage
                                            id="Db domain"/><i style={{color:'red',fontWeight:'bold'}}>*</i></label>
                                        <div className="col-sm-10">
                                            <textarea onChange={(e)=>this.handleTextChange(e,"domainname")} rows="5" type="text" className="form-control" id="dbDomainInput" placeholder="请输入域名，如“http://gsd.chaoxing.com/”多个域名请用逗号隔开。"/>
                                        </div>
                                    </div>


                                    {

                                    // <div className="form-group">
                                    //     <label for="phone" className="col-sm-2 control-label"><FormattedMessage
                                    //         id="Contact phone"/></label>
                                    //     <div className="col-sm-10">
                                    //         <input onChange={(e)=>this.handleTextChange(e,"tel")} type="text" className="form-control" id="phone" placeholder=""/>
                                    //     </div>
                                    // </div>

                                    }

                                    <div className="form-group">
                                        <label for="fulltext" className="col-sm-2 control-label"><FormattedMessage
                                            id="Db fulltext"/>
                                            {/* <i style={{color:'red',fontWeight:'bold'}}>*</i> */}
                                        </label>
                                        <div className="col-sm-10">
                                            {/* <input type="email" className="form-control" id="Db fulltext" placeholder="请输入全文匹配字段"/> */}
                                            <Select
                                                mode="tags"
                                                className="form-control"
                                                placeholder="请输入全文匹配字段（可输入多个）"
                                                dropdownStyle={{display:"none"}}
                                                onChange={(e)=>this.handleChange(e,"fulltext")}
                                            >
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label for="keyword" className="col-sm-2 control-label"><FormattedMessage
                                            id="Db keyword"/>
                                            {/* <i style={{color:'red',fontWeight:'bold'}}>*</i> */}
                                        </label>
                                        <div className="col-sm-10">
                                            {/* <input type="email"  className="form-control" id="Db keyword" placeholder="请输入完全匹配字段"/> */}
                                            <Select
                                                mode="tags"
                                                className="form-control"
                                                placeholder="请输入完全匹配字段（可输入多个）"
                                                dropdownStyle={{display:"none"}}
                                                onChange={(e)=>this.handleChange(e,"keyword")}
                                            >
                                            </Select>
                                        </div>
                                    </div>                                    


                                    <div className="form-group">
                                        <label for="email" className="col-sm-2 control-label"><FormattedMessage
                                            id="Email"/><i style={{color:'red',fontWeight:'bold'}}>*</i></label>
                                        <div className="col-sm-10">
                                            <input type="email" onChange={(e)=>this.handleTextChange(e,"email")} className="form-control" id="email" placeholder="请输入方便联系的邮箱地址"/>
                                        </div>
                                    </div>


                                    <div className="form-group">
                                        <label for="wiki" className="col-sm-2 control-label"><FormattedMessage
                                            id="Db wiki"/></label>
                                        <div className="col-sm-10">
                                            <input type="text" onChange={(e)=>this.handleTextChange(e,"wiki")} className="form-control" id="wiki" placeholder="请在GSD官方Wiki页面编辑相关数据源信息，如有其它关于网站介绍信息，请在其它信息栏填写。"/>
                                            <a onClick={()=>this.openMediaWikiDialog()}><FormattedMessage
                                                id="Edit with MediaWiki"/></a>
                                        </div>
                                    </div>




                                    <div className="form-group">
                                        <label for="other_info" className="col-sm-2 control-label"><FormattedMessage
                                            id="Other info"/></label>
                                        <div className="col-sm-10">
                                            <textarea rows="6" type="text" onChange={(e)=>this.handleTextChange(e,"message")} className="form-control" id="other_info" placeholder=""/>
                                        </div>
                                    </div>


                                    {
                                        // <div className="form-group">
                                        //     <label for="metaData" className="col-sm-2 control-label"><FormattedMessage
                                        //         id="Meta Data Update Mode"/></label>
                                        //     <div className="col-sm-10">
                                        //         <input type="text" onChange={(e)=>this.handleTextChange(e,"updatetype")} className="form-control" id="metaData" placeholder=""/>
                                        //     </div>
                                        // </div>
                                    }

                                    <div className="form-group">
                                        <label  className="col-sm-2 control-label">
                                            <Radio value={1} checked={this.state.radioValue == 1} onClick={()=>this.setState({radioValue:1})}></Radio>
                                            <FormattedMessage id="UploadFile"/>
                                            <i style={{color:'red',fontWeight:'bold'}}>*</i>
                                        </label>
                                        <div className="col-sm-10">
                                            <div className="upload-wrapper" style={{width:'100px'}}>
                                                <input className="uploadFileInput" type="file" id="upload-text-file" onChange={(e)=>this.onSelectFile(e)}/>
                                                <div><a className="btn btn-warning btn-block"><i className="glyphicon glyphicon-upload"></i>上传文件</a></div>
                                            </div>
                                            <a href="/templates/第三方数据模板.csv" style={{marginTop:'5px',display:'block'}}>下载模板</a>

                                            {!!this.state.dbData.fileName && <div style={{marginTop:'1.5rem'}}>
                                                <ul>
                                                    <li >{this.state.dbData.fileName}&nbsp;<span onClick={()=>{this.removeFileItem()}} className="glyphicon glyphicon-remove"></span></li>
                                                </ul>
                                            </div>
                                            }

                                        </div>
                                    </div>                                        
                                        <div className="form-group">
                                        <label for="csvurl" className="col-sm-2 control-label">
                                            <Radio value={2} checked={this.state.radioValue == 2} onClick={()=>this.setState({radioValue:2})}></Radio>
                                            <FormattedMessage id="UploadURL"/>
                                            <i style={{color:'red',fontWeight:'bold'}}>*</i>
                                        </label>
                                        <div className="col-sm-10">
                                            <input type="text" onChange={(e)=>this.handleTextChange(e,"csvurlHttp")} className="form-control" id="csvurlHttp" placeholder="请输入上传url地址"/>                                            
                                        </div>
                                    </div>   

                                    <div style={{marginTop:"20px",textAlign:"right"}}>
                                        <Button onClick={()=>this.saveData()} style={{marginRight:"15px"}} variant="contained"
                                                color="primary" className={classes.okBtn}>
                                           <FormattedMessage id="Ok"/>
                                        </Button>

                                        <Button variant="outlined" color="primary" onClick={()=>{history.go(-1)}} className={classes.cancelBtn}>
                                            <FormattedMessage id="CANCEL"/>
                                        </Button>
                                    </div>

                                </div>
                            </div>





                        </Col>


                    </Row>
                </Grid>
            </div>
        );
    }

}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        myIndexs: state.myIndexs
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getBindedEmails: (userId, header) => dispatch(getBindedEmails(userId, header)),
        addLocalEmails: (data) => dispatch(addLocalEmails(data)),
        BindedEmail: (userId, email, header)=>dispatch(BindedEmail(userId, email, header)),
        removeLocalEmails: (userId, email)=>dispatch(removeLocalEmails(userId, email)),
        DeleteEmail: (userId, email, header)=>dispatch(DeleteEmail(userId, email, header)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(AddNewDb)))
