import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import {Glyphicon} from 'react-bootstrap';
import {getMyIndexsData, deleteMyIndexsData, downloadFiles} from "../../actions"
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {browserHistory} from 'react-router'
import {Breadcrumb, Radio, Divider, Input} from 'antd';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import swal from 'sweetalert2'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {Checkbox, Icon} from 'antd';
import NoData from "../NoData"
var JSONbig = require('json-bigint');
import {fetchUrlText, fetchUrl} from '../../actions/fetchData';
import {INNER_SERVER_URL, UPLOAD_SERVER_URL, CHAOXING_PAN} from  "../../config/constants";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ReactDOM from 'react-dom'
import OrderField from "../plugins/orderField"

const PAGE_SIZE = 20;
const orderOptionFile = [
    {
        value: "-1", label: <FormattedMessage
        id="AllFileType"
    />
    },
    {
        value: "image", label: <FormattedMessage
        id="ImageType"
    />
    },
    {
        value: "doc", label: <FormattedMessage
        id="FileType"
    />
    },
    {
        value: "video", label: <FormattedMessage
        id="VideoType"
    />
    },
    {
        value: "audio", label: <FormattedMessage
        id="AudioType"
    />
    },
    {
        value: "other", label: <FormattedMessage
        id="Other"
    />
    },


];

const orderOptions = [
    {
        value: "-1", label: <FormattedMessage
        id="Default Order"
    />
    },
    {
        value: "0", label: <FormattedMessage
        id="Time Desc"
    />
    },
    {
        value: "1", label: <FormattedMessage
        id="Time Asc"
    />
    },

];

const orderOptions1 = [
    {
        value: "-1", label: <FormattedMessage
        id="Default Order"
    />
    },
    {
        value: "0", label: <FormattedMessage
        id="Size Desc"
    />
    },
    {
        value: "1", label: <FormattedMessage
        id="Size Asc"
    />
    },

];

const orderOptions2 = [
    {
        value: "-1", label: <FormattedMessage
        id="Default Order"
    />
    },
    {
        value: "0", label: <FormattedMessage
        id="FileName Desc"
    />
    },
    {
        value: "1", label: <FormattedMessage
        id="FileName Asc"
    />
    },

];

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        marginTop: "30px"
    },
    rootSlider: {
        ...theme.mixins.gutters(),
        marginTop: "20px",
        boxShadow: "none",
        padding: "0"
    },
    rootPage: {},
    rootSliderPage: {
        maxHeight: '478px',
        overflow: "auto"
    },
    buttonRemove: {
        marginRight: "15px",
        display: 'inline-block',
        textAlign: 'center',
        fontSize: '12px',
        minWidth: '45px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#b53737"
        },
        color: "#ffffff",
        backgroundColor: "#cc4141"
    },
    buttonExport: {

        display: 'inline-block',
        textAlign: 'center',
        fontSize: '12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#068074"
        },
        color: "#ffffff",
        backgroundColor: "#009688"
    },
    buttonAdd: {

        display: 'inline-block',
        textAlign: 'center',
        fontSize: '12px',
        minWidth: '45px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#21729a"
        },
        color: "#ffffff",
        backgroundColor: "#009688"
    },
    buttonEdit: {
        marginLeft: "15px",
        display: 'inline-block',
        textAlign: 'center',
        fontSize: '12px',
        minWidth: '45px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#21729a"
        },
        color: "#ffffff",
        backgroundColor: "#3399cc"
    },
    buttonUpload: {
        display: 'inline-block',
        textAlign: 'center',
        fontSize: '12px',
        marginRight: "15px",
        minWidth: '45px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#f55b50"
        },
        color: "#ffffff",
        backgroundColor: "#F44336"
    },
    buttonNewFolder: {
        display: 'inline-block',
        textAlign: 'center',
        fontSize: '12px',
        marginRight: "15px",
        minWidth: '45px',
        '&:hover': {
            color: "#f55b50",
            borderColor: "#f55b50"
        },
        color: "#F44336",
        borderColor: "#F44336"
    },
    removeProgress: {
        color: "#7f818a",
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -9,
        marginLeft: -9,
    },
    buttonConfig: {
        display: "inline-block",
        color: "#757575",
        border: "1px solid  rgb(165, 165, 165)",
        fontSize: "12px",
        minWidth: '45px',
        marginRight: "15px"
    },
    badge: {
        backgroundColor: "#d45f5f"
    },
    badgeHide: {
        display: "none"
    }
});

const dowloadTypeOptions = [
    {value: "1", label: "RIS"},
    {value: "2", label: "BIB"},
];


class MySource extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.file = null;
        this.offsetTop = null;//用于记录上一次距离顶部
        this.loadMoreRef = null;
        this.state = {
            selectedRowKeys: [],
            uploadFileList: [],
            fileList: [],
            curentFileType: -1,
            pageIndex: 0,
            searchValue: "",
            uploadDialogOpen: false,
            currentEditItem: null,//当前编辑的项
            typedatetime: -1,
            orderfileName: -1,
            typefilesize: -1,
            isLoading: false,
            total: 1,
            isUploading: false,
            addNewFolder: false,//新建文件夹dialog
            currentFolderId: null,//当前文件夹id
            newSourceName: "", //上传资源的名称
            tracks: [],//点击路径
            isEnded:false,//是否已经没有数据
            viewFolers:true,//是否展现目录层级关系,false的时候隐藏上传,新建文件夹按钮    
            isUplaod:true,
        }
        this.cxId;
        this.currentPage=1;
        this.isLoading=false;
        this.isEnded=false;
        this.editCell = null;
        this.handleScroll = this.handleScroll.bind(this);
    }


    handleScroll(e) {

        var offset = this.getOffsetTop();
        console.log(offset);
        if(offset<=0&&!this.isEnded){
            this.getMySourceData(this.cxId,this.state.currentFolderId,true);
        }
        // if (!!this.props.userInfos.responseUserInfo.userid && offset <= 30 && this.state.total > this.state.fileList.length && this.state.currentPage * PAGE_SIZE <= this.state.total) {
        //     this.setState({currentPage: this.state.currentPage + 1});
        //     this.cxId = this.props.userInfos.responseUserInfo.userid;
        //     this.getMySourceData(this.cxId);
        // }
    }

    loadMore() {
        if (!!this.props.userInfos.responseUserInfo.userid && this.state.total > this.state.fileList.length) {
            this.setState({currentPage: this.state.currentPage + 1});
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            this.getMySourceData(this.cxId,this.state.currentFolderId,true);
        }
    }

    getOffsetTop() {
        if(!!this.loadMoreRef){
            var rect = ReactDOM.findDOMNode(this.loadMoreRef)
                .getBoundingClientRect();
            var clientHeight = document.body.clientHeight;
            var offsetTop = rect.top - clientHeight;
            console.log(offsetTop);
            return offsetTop;
        }
        return -1;

    }


    componentDidMount() {

        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            this.getMySourceData(this.cxId);
        }
        window.addEventListener('scroll', this.handleScroll);
        // document.getElementById("dot-area").addEventListener("drop",(e)=>this.onDrop(e));

    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }


    onSelectFile(e) {//选择文件
        var files = document.getElementById("upload-text-file").files;
        if (files.length > 0) {
            console.log(files);
            var fileList = [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                fileList.push({name: file.name});
            }

            this.setState({uploadFileList: fileList})


        }
    }

    onDrop(e) {
        e.preventDefault();
        var files = e.dataTransfer.files;

        var fileList = [];
        if (!!files && files.length > 0) {

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                fileList.push({name: file.name});
            }

            this.setState({uploadFileList: fileList})
            this.file = files;


            // this.setState({uploadFileList: [{name: files[0].name}]})

        }

    }

    removeItem(index) {
        var fileList = this.state.uploadFileList;
        fileList.splice(index, 1);
        this.setState({uploadFileList: fileList});

    }

    onDragEnter(e) {
        e.preventDefault();
        console.log("onDragEnter...");
    }

    onDragLeave(e) {
        e.preventDefault();
        console.log("onDragLeave...");
    }


    onDragOver(e) {
        e.preventDefault();
        console.log("onDragOver...");
    }




    getMySourceData = async(userId, parentd = '',loadmore=false,type='',searchname='')=> {//默认查询方法
        if(this.state.isLoading)return;
        try {
            this.setState({isLoading: true})
            if(loadmore)this.currentPage++;else {
                this.currentPage=1;
                this.isEnded=false;
                this.setState({isEnded:false});
            }
            // var url = !!this.state.curentFileType && this.state.curentFileType != -1 ? "getfilesbytype?userid=" + userId + "&type=" + this.state.curentFileType + "&index=" + this.state.pageIndex + "&limit=20" : "getfilesbyname?userid=" + userId + "&filename=" + this.state.searchValue + "&index=" + this.state.pageIndex + "&limit=20 ";
            var url = `api/getDirAndFiles?puid=${userId}&orderby=d&fldid=${parentd}&order=desc&page=${this.currentPage}&size=20`;
            if(searchname){
                url = `api/searchByName?puid=${userId}&kw=${searchname}&page=${this.currentPage}&size=20`;
            }else if(type){
                url = `api/sortedfiles?puid=${userId}&type=${type}&page=${this.currentPage}&size=20`;
            }
            var responseData = await fetchUrlText(CHAOXING_PAN + url, "post", null, {});
            var response = JSONbig.parse(responseData);
            console.log(response);
            this.setState({isLoading: false});

            if (!!response) {
                if (!!response.result) {
                    if (loadmore) {
                        if(response.data.length==0){
                            this.setState({isEnded:true});
                            this.isEnded=true;
                        }else{
                            var fileList = this.state.fileList.concat(response.data)
                            this.setState({fileList: fileList, currentFolderId: response.curDir});
                        }

                    } else {
                        this.setState({fileList: response.data, currentFolderId: response.curDir, selectedRowKeys: []});
                    }





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
        } catch (e) {

        }

    }

    onPageChange(pageNum) {

        if (this.props.myIndexs.pageInfos.isAccessing)return;

        this.setState({currentPage: pageNum});
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
            this.getMyIndexsData(this.cxId, pageNum, header);
        }

    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.userInfos.responseUserInfo.userid != "" && nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: nextProps.userInfos.responseUserInfo.token};
            this.getMySourceData(this.cxId);
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(!!this.loadMoreRef){
            var offset = this.getOffsetTop();
            console.log(offset);
            if(offset<=0&&!this.isEnded){
                console.log("componentDidUpdate");
                this.getMySourceData(this.cxId,this.state.currentFolderId,true);
            }
        }

    }


    removeSources(items = null) {
        var _self = this;
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
                var selectedRowKeys = items || _self.state.selectedRowKeys;
                http://test.pan.chaoxing.com/api/delete?puid={puid}&resids={resids}

                    var url = `api/delete?puid=${this.cxId}&resids=${selectedRowKeys.join(",")}`;
                var responseData = await fetchUrlText(CHAOXING_PAN + url, "post", null, {});
                var response = JSONbig.parse(responseData);
                console.log(response);
                if (response.result) {

                    var fileList = _self.state.fileList;
                    if (!!fileList) {
                        fileList = fileList.filter(item=>selectedRowKeys.findIndex(s=>s == item.resid) < 0);
                    }
                    _self.setState({selectedRowKeys: [], fileList: fileList})

                } else {
                    swal({
                        title: response.msg,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: _self.props.intl.formatMessage({id: 'Ok'})
                    })
                }

            }
        })

    }

    editMyFileName(item = null) {//编辑文件
        //browserHistory.push("/editMyIndexs?indexId=" + this.state.selectedRowKeys[0]);
        var selectedRowKeys = this.state.selectedRowKeys;
        if (item || !!selectedRowKeys) {

            var selectedItem = item || this.state.fileList.find(item=>item.resid == selectedRowKeys[0]);
            if (selectedItem) {
                if (!selectedItem.isfile) {//编辑文件夹名
                    this.setState({currentEditItem: selectedItem, addNewFolder: true, newFolerName: selectedItem.name});
                } else {//重新上传文件
                    this.setState({currentEditItem: selectedItem, uploadDialogOpen: true , isUplaod:false,newSourceName :selectedItem.name.replace("." +selectedItem.suffix,"")});
                }
            }

        }
    }

    orderFileOption(e) {
        if(this.state.isLoading||this.isLoading)return;
        this.setState({curentFileType: e.target.value, currentPage: 1});
        if (!!this.cxId) {

            if(e.target.value==-1){//查看全部
                this.getMySourceData(this.cxId);
                this.setState({viewFolers:true})
            }else{
                this.setState({viewFolers:false,tracks:[]})
                this.getMySourceData(this.cxId,"",false,e.target.value);

            }

        }

    }

    toSearchByFileName(value) {//根据名称搜索
        this.setState({currentPage: 1,curentFileType:-1});
        if (value) {//根据关键字搜索
            this.setState({viewFolers:false,tracks:[]})
            this.getMySourceData(this.cxId,"",false,"",value);
        }else{//全局搜索
            this.setState({viewFolers:true})
            this.getMySourceData(this.cxId);
        }
    }

    orderTimeOption(value) {
        this.setState({typefiletime: value, orderfileName: -1, typefilesize: -1, currentPage: 0});
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            this.getMySourceData(this.cxId);
        }


    }

    orderFileNameOption(value) {
        this.setState({orderfileName: value, typefilesize: -1, typefiletime: -1, currentPage: 0});
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;

            this.getMySourceData(this.cxId);
        }
    }

    orderSizeOption(value) {
        this.setState({typefilesize: value, orderfileName: -1, typefiletime: -1, currentPage: 0});
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;

            this.getMySourceData(this.cxId);
        }

    }


    openUploadDialog() {
        this.setState({uploadDialogOpen: true,isUplaod:true});
    }

    downloadFile = async(item)=> {//下载文件
        http://test.pan.chaoxing.com/api/getDownloadUrl?puid={puid}&fleid={fleid}

            var url = `api/getDownloadUrl?puid=${this.cxId}&fleid=${item.resid}`;
        var responseData = await fetchUrlText(CHAOXING_PAN + url, "post", null, {});
        var response = JSONbig.parse(responseData);
        console.log(response);
        if (response.result) {
            window.open(response.url);
        }
    }

    renderToolBar() {
        const {classes} = this.props;
        return <div className="clearfix">
            { !this.props.isSlider &&this.state.viewFolers&& <Button onClick={()=>this.openUploadDialog()}
                                              className={classes.buttonUpload} size="small"><i
                className="fa fa-cloud-upload"
                style={{fontSize:'1rem',top:'0px'}}/>&nbsp;
                <FormattedMessage id="Upload"/></Button>}

            { !this.props.isSlider &&this.state.viewFolers && <Button variant="outlined" onClick={()=>this.setState({addNewFolder:true})}
                                              className={classes.buttonNewFolder} size="small"><i
                className="fa fa-folder-open-o"
                style={{fontSize:'1rem',top:'0px'}}/>&nbsp;
                <FormattedMessage id="New Folder"/></Button>}

            { !this.props.isSlider &&
            <span style={{visibility:this.state.selectedRowKeys.length>0?'visible':'hidden'}}><Button
                disabled={this.state.selectedRowKeys.length!=1} onClick={()=>this.editMyFileName()}
                className={this.state.selectedRowKeys.length!=1?classes.buttonConfig:classes.buttonRemove} size="small"><Glyphicon glyph="pencil"
                                                                         style={{fontSize:'1rem',top:'0px'}}/>&nbsp;
                <FormattedMessage id="EDIT"/></Button></span>}
            { !this.props.isSlider &&
            <span style={{visibility:this.state.selectedRowKeys.length>0?'visible':'hidden'}}><Button
                onClick={()=>this.removeSources()} disabled={this.state.selectedRowKeys.length==0} variant="contained"
                className={classes.buttonRemove} size="small">

                {this.props.myIndexs.pageInfos.isDeleting && <CircularProgress
                    className={classes.removeProgress}
                    size={18}
                />}<Glyphicon glyph="trash" style={{fontSize:'1rem',top:'0px'}}/>&nbsp;<FormattedMessage
                id="DELETE"/></Button></span>}


            {
                <div className={!this.props.isSlider?"right-tools":""} size="small">
                    <Radio.Group defaultValue="-1"
                                 value={this.state.curentFileType}
                                 style={{marginRight:'15px',marginTop:!this.props.isSlider?"0":"10px"}}
                                 className="gsd-radios"
                                 buttonStyle="solid" onChange={(e)=>this.orderFileOption(e)}>
                        {
                            orderOptionFile.map(item=> <Radio.Button key={item.value}
                                                                     checked
                                                                     value={item.value}>{item.label}</Radio.Button>)
                        }
                    </Radio.Group>

                    <Input.Search
                        className="gsd-input"
                        value={this.state.fileName}
                        onChange={(e)=>{this.setState({fileName:e.target.value})}}
                        placeholder={this.props.intl.formatMessage({id: 'FileName'})}
                        suffix={!!this.state.fileName?<Icon type="close" theme="outlined" style={{cursor:'pointer',color:"#9a9a9a",fontSize:'12px',marginRight:"4px"}} onClick={()=>{this.setState({fileName:''});this.toSearchByFileName('')}}/>:""}
                        onSearch={value => this.toSearchByFileName(value)}
                        style={{ width: !this.props.isSlider?200:"100%",marginTop:!this.props.isSlider?"0":"10px" }}
                    />

                </div>
            }
            {
                //     <FilterDropDown  iconClass="glyphicon glyphicon-file"
                //                      itemClick={(option)=>this.orderFileOption(option)}
                //                      name={<FormattedMessage id="AllFileType"/>} options={orderOptionFile}/>
                //     <FilterDropDown  iconClass="glyphicon glyphicon-time"
                //                      itemClick={(option)=>this.orderFileNameOption(option)}
                //                      name={<FormattedMessage id="Order by FileName"/>} options={orderOptions2}/>
                // <FilterDropDown  iconClass="glyphicon glyphicon-time"
                //                 itemClick={(option)=>this.orderTimeOption(option)}
                //                 name={<FormattedMessage id="Order by Time"/>} options={orderOptions}/>
                //
                //     <FilterDropDown  iconClass="glyphicon glyphicon-filter"
                //                      itemClick={(option)=>this.orderSizeOption(option)}
                //                      name={<FormattedMessage id="Order by Size"/>} options={orderOptions1}/>
            }


        </div>

    }


    selectAll(e) {
        if (e.target.checked) {
            var dataList = this.state.fileList.map(item=> {
                return item.resid
            });
            this.setState({"selectedRowKeys": dataList})
        } else {
            this.setState({"selectedRowKeys": []})
        }
    }

    setSelectedItem(e, item) {

        if (e.target.checked) {
            var selectedIndexs = this.state.selectedRowKeys;
            selectedIndexs.push(item.resid);
            this.setState({"selectedRowKeys": selectedIndexs})
        } else {
            var selectedIndexs = this.state.selectedRowKeys;
            var filterDatas = selectedIndexs.filter(sitem=>sitem != item.resid);
            this.setState({"selectedRowKeys": filterDatas})

        }


    }


    uploadFile = async(e)=> {
        if (this.state.uploadFileList.length > 0) {
            var files = document.getElementById("upload-text-file").files;
            if (files.length == 0) {
                files = this.file;
            }
            this.setState({uploadDialogOpen: false, isUploading: true});
            for (var i = 0; i < files.length; i++) {
                var formdata = new FormData();                    
                formdata.append('file', files[i]);
                if (this.state.currentEditItem) {
                    var suffix = this.state.currentEditItem.suffix;
                    var newSuffix = files[i].name.substring(files[i].name.lastIndexOf(".") + 1) || "";
                    console.log(newSuffix);
                    if (!!newSuffix && suffix == newSuffix.toLowerCase()) {
                        formdata.append('fleid', this.state.currentEditItem.resid);
                    } else {//后缀名不一致则不允许上传
                        this.setState({uploadFileList: [], isUploading: false});
                        swal({
                            title: this.props.intl.formatMessage({id: 'Different type files'}),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                        });
                        return false;
                    }
                } else {
                    formdata.append('fleid', '');
                }
                formdata.append('fldid', this.state.currentFolderId);
                formdata.append('puid', this.cxId);
                var responseData = await fetchUrlText(CHAOXING_PAN + `upload/uploadfile`, "post", formdata, {});
                var response = JSONbig.parse(responseData);
                console.log(response);
                if (!!response) {
                    console.log(response);
                    if (!response.result) {
                        swal({
                            title: response.msg,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                        });
                        this.setState({uploadFileList: [], isUploading: false});
                        return;
                    }
                }
            }            
            this.setState({uploadFileList: [], isUploading: false, currentEditItem: null});
            this.setState({orderfileName: -1, typefilesize: -1, typefiletime: 1, currentPage: 0, newSourceName:""});
            this.getMySourceData(this.cxId, this.state.currentFolderId);
        } else if(!!this.state.newSourceName){
            var name = this.state.newSourceName + "." + this.state.currentEditItem.suffix;
            var url = `api/rename?puid=${this.cxId}&resid=${this.state.currentEditItem.resid}&name=${name}`;
            var responseData = await fetchUrlText(CHAOXING_PAN + url, "post", null, {});
            var response = JSONbig.parse(responseData);
            this.setState({uploadFileList: [],uploadDialogOpen: false,currentEditItem: null});
            this.setState({orderfileName: -1, typefilesize: -1, typefiletime: 1, currentPage: 0 ,newSourceName:""});
            this.getMySourceData(this.cxId, this.state.currentFolderId);
        } else {
            swal({
                title: this.props.intl.formatMessage({id: 'UploadList is empty'}),
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
        }
    }

    renderLoadMore() {//加载更多

        return <div ref={(ref)=>this.loadMoreRef=ref} style={{textAlign:'center'}}>
            {!this.state.isLoading&&!this.state.isEnded  &&
            <a onClick={()=>this.loadMore()}  className="btn btn-default"><FormattedMessage id="Load More"/></a>}

        </div>

    }


    addorUpateFolder = async()=> {//增加或更新文件夹
        if (this.state.currentEditItem) {//更新文件夹
            try {
                var url = `api/rename?puid=${this.cxId}&resid=${this.state.currentEditItem.resid}&name=${this.state.newFolerName}`;
                var responseData = await fetchUrlText(CHAOXING_PAN + url, "post", null, {});
                var response = JSONbig.parse(responseData);
                if (response && response.result) {

                    var fileList = this.state.fileList.reduce((arr, item, index)=> {
                        if (item.resid == this.state.currentEditItem.resid)arr.push(response.data);
                        else arr.push(item);
                        return arr;
                    }, []);
                    this.setState({fileList: fileList});
                }
                console.log(response);
                this.setState({addNewFolder: false, currentEditItem: null})
            } catch (e) {
                this.setState({addNewFolder: false, currentEditItem: null})
            }
        } else {//新建文件夹
            try {
                var url = `api/newfld?puid=${this.cxId}&pntid=${this.state.currentFolderId}&name=${this.state.newFolerName}`;
                var responseData = await fetchUrlText(CHAOXING_PAN + url, "post", null, {});
                var response = JSONbig.parse(responseData);
                if (response && response.result) {
                    var datas = [].concat(response.data);
                    var fileList = datas.concat(this.state.fileList)
                    this.setState({fileList: fileList});
                }
                console.log(response);
                this.setState({addNewFolder: false})
            } catch (e) {
                this.setState({addNewFolder: false, currentEditItem: null})
            }
        }


    }

    toChildFoldder(item) {//进入子文件夹
        var tracks = this.state.tracks;
        var findInex = tracks.findIndex((sitem)=> {
            return sitem.resid == item.resid;
        });

        if (findInex >= 0) {
            tracks = tracks.slice(0, findInex + 1);
        } else {
            tracks.push(item);
        }

        this.getMySourceData(this.cxId, item.resid)
        this.setState({tracks})
    }

    startDrag(e, item) {
        console.log(item);
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('Data', JSON.stringify(item));
        document.getElementById("dropMask").style.display = 'block';
    }

    fmtDate(unixtimestamp){
        if(!!unixtimestamp){
            var unixtimestamp = new Date(unixtimestamp);
            var year = 1900 + unixtimestamp.getYear();
            var month = "0" + (unixtimestamp.getMonth() + 1);
            var date = "0" + unixtimestamp.getDate();
            var hour = "0" + unixtimestamp.getHours();
            var minute = "0" + unixtimestamp.getMinutes();
            var second = "0" + unixtimestamp.getSeconds();
            return year + "-" + month.substring(month.length-2, month.length)  + "-" + date.substring(date.length-2, date.length)
                + " " + hour.substring(hour.length-2, hour.length) + ":"
                + minute.substring(minute.length-2, minute.length) + ":"
                + second.substring(second.length-2, second.length);

        }
        return "-";

    }

    renderListItem() {//渲染list

        const {classes} =this.props;
        var dataList = this.state.fileList;


        if (!!dataList && dataList.length > 0) {

            return <div className={!this.props.isSlider?classes.rootPage:classes.rootSliderPage}
                        elevation={1}>

                <List component="nav">
                    <ListItem >
                        <ListItemText primary={
                    <div className="row"  >

                        <div className="col-sm-6 file-row"><span><Checkbox className="gsd-check" onChange={(e)=>this.selectAll(e)}/></span><span><FormattedMessage id="FileName"/></span></div>
                            <div className="col-sm-3"><span><FormattedMessage id="File Size"/></span></div>
                        <div className="col-sm-3"><span><FormattedMessage id="Upload Time"/></span></div>

                    </div>
                    }/>
                    </ListItem>
                    { dataList.reduce((arr, item, index)=> {

                        // var d = new Date(item.updatetime||item.createtime);
                        // var timestamp=Math.round(d.getTime());

                        var isChecked = this.state.selectedRowKeys.findIndex(sitem=>sitem == item.resid) >= 0;

                        var orginalName = this.state.currentEditName || item.name.substring(0, item.name.lastIndexOf("."));
                        var size = "-";
                        if (item.isfile) {
                            if (item.size > 1024 * 1024 * 1024) {
                                size = parseInt(item.size / (1024 * 1024 * 1024)) + "g";
                            } else if (item.size > 1024 * 1024) {
                                size = parseInt(item.size / (1024 * 1024)) + "m";
                            } else if (item.size > 1024) {
                                size = parseInt(item.size / (1024)) + "k";
                            } else {
                                size = parseInt(item.size) + "b";
                            }
                        }


                        arr.push(
                            <div
                                key={`list_${index}`}>
                                <Divider className="gsd-divider"/>
                                <ListItem >
                                    <ListItemText primary={
                                  <div className="row" onDragStart={(e)=>this.startDrag(e,item)} style={{cursor:this.props.isSlider?'move':'default'}} draggable={(this.props.isSlider&&item.isfile)?true:false}>

<div className="col-sm-6 file-row clearfix" style={{display:'block'}}>
<span><Checkbox checked={isChecked} onChange={(e)=>this.setSelectedItem(e,item)} className="gsd-check"/></span>
<span >

{item.isfile&&!item.thumbnail&&<span style={{fontSize:'3.2rem',color:"rgb(243, 102, 92)"}} className="fa fa-file-o"></span>}
{item.isfile&&item.thumbnail&&<span className="iconImage" style={{backgroundImage:`url(${item.thumbnail})`}} ></span>}
{!item.isfile&&<span style={{fontSize:'3.5rem',color:"rgb(243, 102, 92)"}} className="fa fa-folder"></span>}</span>
{!item.isfile&&<a onClick={()=>this.toChildFoldder(item)} style={{display: "inline-block",whiteSpace: "nowrap",overflow: "hidden",textOverflow:'ellipsis',color:"#383737"}} >{item.name}</a>}
{item.isfile&&<span onClick={()=>this.downloadFile(item)} style={{cursor:"pointer",display: "inline-block",whiteSpace: "nowrap",overflow: "hidden",textOverflow:'ellipsis',color:"#383737"}} >{item.name}</span>}


{!this.props.isSlider&&<span className="tool-items">{item.isfile&&<a style={{color:"#f3665c"}} onClick={()=>this.downloadFile(item)} className="glyphicon glyphicon-download-alt"></a>}&nbsp;&nbsp;<a style={{color:"#f3665c"}} onClick={()=>this.editMyFileName(item)} className="fa fa-edit"></a>&nbsp;&nbsp;<a style={{color:"#f3665c"}} className="glyphicon glyphicon-trash" onClick={()=>this.removeSources([item.resid])}></a></span>}

</div>
  <div className="col-sm-3">{size}</div>
 <div className="col-sm-3">{this.fmtDate(item.modifyDate||item.uploadDate)}</div>
                                </div>
                                }/>

                                </ListItem></div>);
                        return arr;
                    }, [])
                    }

                    <Divider />


                </List>

            </div>


        }

        else if (!this.props.myIndexs.pageInfos.isAccessing)return <NoData/>;

    }

    renderBreadcrumb() {//面包屑
        return <Breadcrumb separator=">" style={{marginTop:'20px',color:'#444'}}>
            <Breadcrumb.Item style={{cursor:'pointer'}}
                             onClick={()=>{this.getMySourceData(this.cxId);  this.setState({tracks:[],viewFolers:true,curentFileType:-1})}}>全部文件</Breadcrumb.Item>
            { this.state.tracks.map(item=> {
                return <Breadcrumb.Item style={{cursor:'pointer'}} key={item.resid}
                                        onClick={()=>this.toChildFoldder(item)}>{item.name}</Breadcrumb.Item>

            })
            }

        </Breadcrumb>;
    }

    render() {
        const {classes} = this.props;

        return (
            <div>
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    open={this.state.isUploading}
                    onClose={()=>this.setState({isUploading:false})}

                >
                    <DialogContent>
                        <CircularProgress
                            size={18}
                        /><FormattedMessage id="Is Uploading"/>
                    </DialogContent>
                </Dialog>

                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    open={this.state.addNewFolder}
                    onClose={()=>this.setState({isUploading:false,currentEditItem:null})}

                >
                    <DialogContent>
                        <h4>{this.state.currentEditItem ? <FormattedMessage id="Update Folder"/> :
                            <FormattedMessage id="New Folder"/>}</h4>
                        <input value={this.state.newFolerName} type="text"
                               onChange={(e)=>this.setState({newFolerName:e.target.value})} className="form-control"/>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={()=>this.addorUpateFolder()} className={classes.buttonUpload}>
                            <FormattedMessage id="Ok"/>
                        </Button>
                        <Button onClick={()=>this.setState({addNewFolder:false,currentEditItem:null})} color="primary"
                                autoFocus>
                            <FormattedMessage id="CANCEL"/>
                        </Button>
                    </DialogActions>

                </Dialog>

                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    open={this.state.uploadDialogOpen}
                    onClose={()=>this.setState({uploadDialogOpen:false,currentEditItem:null})}

                >
                    <DialogContent>
                        <div>  
                            <h4>
                                {
                                    this.state.isUplaod == false? 
                                    (<FormattedMessage id="EDIT"/>)
                                    :
                                    (<FormattedMessage id="UploadFile"/>)
                                }
                            </h4>
                            {this.state.isUplaod == false && this.state.uploadFileList.length == 0 && <input value={this.state.newSourceName} type="text" placeholder="资源名称"
                               onChange={(e)=>this.setState({newSourceName:e.target.value})} className="form-control"/>}

                            <div className="dot-area" id="dot-area" onDrop={(e)=>this.onDrop(e)}
                                 onDragEnter={(e)=>this.onDragEnter(e)}
                                 onDragLeave={(e)=>this.onDragLeave(e)} onDragOver={(e)=>this.onDragOver(e)}>
                                <div className="upload-wrapper">
                                    {this.state.currentEditItem && <input className="uploadFileInput" type="file"
                                                                          id="upload-text-file"
                                                                          onChange={(e)=>this.onSelectFile(e)}/>}

                                    {!this.state.currentEditItem &&
                                    <input className="uploadFileInput" type="file" multiple="multiple"
                                           id="upload-text-file"
                                           onChange={(e)=>this.onSelectFile(e)}/>}


                                    <div><a style={{borderWidth:0}} className="btn btn-default btn-block"><i
                                        className="glyphicon glyphicon-upload"></i>
                                        <FormattedMessage id="Click or Drop to upload"/></a></div>
                                </div>
                            </div>

                            {this.state.uploadFileList.length > 0 && <div style={{marginTop:"2rem"}}>
                                <Divider orientation="left"> 
                                    <FormattedMessage id="UploadFile"/>
                                </Divider>
                                <ul>
                                    {
                                        this.state.uploadFileList.map((item, index)=> {
                                            return <li key={index}>{item.name}&nbsp;<span
                                                onClick={()=>{this.removeItem(index)}}
                                                className="glyphicon glyphicon-remove"></span></li>
                                        })
                                    }

                                </ul>
                            </div>
                            }

                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>this.uploadFile()} className={classes.buttonUpload}>
                             {
                                this.state.isUplaod == false ?
                                (<FormattedMessage id="EDIT"/>)
                                :
                                (<FormattedMessage id="UploadFile"/>)
                             }
                        </Button>
                        <Button onClick={()=>this.setState({uploadDialogOpen:false,uploadFileList:[]})} color="primary" autoFocus>
                            <FormattedMessage id="CANCEL"/>
                        </Button>
                    </DialogActions>
                </Dialog>


                <Paper className={!this.props.isSlider?classes.root:classes.rootSlider} elevation={1}>
                    {this.renderToolBar()}
                    {this.renderBreadcrumb()}

                    {this.renderListItem()}
                    {this.state.fileList.length > 0 && this.renderLoadMore()}
                </Paper>
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
        getMyIndexsData: (userId, pageNum = 1, header, type = "") => {
            console.log(header);
            dispatch(getMyIndexsData(userId, pageNum, header, type))
        },
        deleteMyIndexsData: (userId, noteIds, header) => dispatch(deleteMyIndexsData(userId, noteIds, header)),
        downloadFiles: (fileids, userid, downloadType, header)=>dispatch(downloadFiles(fileids, userid, downloadType, header)),

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(MySource)))
