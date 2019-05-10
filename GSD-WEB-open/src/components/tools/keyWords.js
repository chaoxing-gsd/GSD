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
import {getBaiKeData} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';
import {Divider, Radio, Tag} from 'antd';
import {fetchUrl,fetchBlobText} from '../../actions/fetchData';
import SplitPane from 'react-split-pane';
import {INNER_SERVER_URL, TXT_SERVER_URL, UPLOAD_SERVER_URL} from  "../../config/constants";
import swal from 'sweetalert2';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
const RadioGroup = Radio.Group;
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import RunCmdBtn from './runCmdBtn';
import {setTextToolInfo} from '../../actions';
const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        marginTop: '1rem',
        width: '100%',
        marginBottom: '2rem'
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
    },


});


class KeyWords extends Component {
    static propTypes = {
        intl: intlShape.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            addNewTextMode: false,
            textUploadType: 0,
            fileList: [],
            isFirstAdd: true,
            maxWord: '5',
            keyWords: "",
            isLoading: false,
            similarDatas: {},
            resultContent: "",
            selectedTag: "",
            currentWordList: [],
            hideLeftBox:false,
            splitPaneSize:300
        }


    }


    uploadTextFile = async(originalFile = null, originalName = null)=> {
        var formdata = new FormData();
        if (!!originalFile) {
            formdata.append('file', originalFile, originalName);
            var response = await fetchUrl(UPLOAD_SERVER_URL + `upload`, "post", formdata, {});
            console.log(response);
            if (!!response) {
                console.log(response);
                if (response.status == 'success' || response.status == 'exist') {
                    var url = "http://cs.ananas.chaoxing.com/download/" + response.objectid;
                    return url;


                }
            }
        }
        return "";

    }


    getKword = async(txtUrl)=> {
        var formdata = new FormData();
        var param = {};
        param['texturl'] = txtUrl;
        param['max_count'] = this.state.maxWord;

        formdata.append("param", JSON.stringify(param));

        var response = await fetchUrl(TXT_SERVER_URL + `textnlp/api/getKword`, "post", formdata, {});
        console.log(response);
        if (!!response) {
            if (!!response.status) {
                this.setState({currentWordList: response.data});
            } else {
                swal({
                    title: response.error,
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
            if(!!this.props.chaoxingData.textToolInfos.textUploadType){
                this.setState({textUploadType:this.props.chaoxingData.textToolInfos.textUploadType})
            }
            if(!!this.props.chaoxingData.textToolInfos.fileList){
                this.setState({fileList:this.props.chaoxingData.textToolInfos.fileList})
            }
            if(!!this.props.chaoxingData.textToolInfos.content){
                this.setState({content:this.props.chaoxingData.textToolInfos.content})
            }
            if(!!this.props.chaoxingData.textToolInfos.splitPaneSize){
                this.setState({splitPaneSize:this.props.chaoxingData.textToolInfos.splitPaneSize})
            }
        document.title=this.props.intl.formatMessage({id: 'KeyWords Picker'})+"-"+this.props.intl.formatMessage({id: 'Text Analysis'})+"-"+this.props.intl.formatMessage({id: 'PROJECT_NAME'});

    }

    componentWillReceiveProps(nextProps) {
        if(!!nextProps.chaoxingData.textToolInfos.fileList){
            this.setState({fileList:nextProps.chaoxingData.textToolInfos.fileList})
        }
        if(!!nextProps.chaoxingData.textToolInfos.content){
            this.setState({content:nextProps.chaoxingData.textToolInfos.content})
        }
    }

    onChangeType = (e) => {
        this.setState({
            type: e.target.value,
        });
    }

    handleInputChange(e) {
        this.setState({content: e.target.value});
        this.props.setTextToolInfo({content:e.target.value});
    }


    readFormText() { //从文件中读取文本信息
        var _self = this;
        var param = {};
        param['texturl'] = this.state.usedList[0].url;

        var formdata=new FormData();
        formdata.append("param",JSON.stringify(param));
        fetchUrl(TXT_SERVER_URL + `textnlp/api/transCoding`, "post", formdata, {}).then(response=>{
            console.log(response);
            if(response.status){
                _self.setState({resultContent: response.data});
            }
        });
    }

    runCmd = async()=> {//运行脚本
        this.setState({isLoading: true});
        if (this.state.textUploadType == 0) {
            if (!!this.state.content) {
                var blob = new Blob([this.state.content], {type: "text/plain;charset=utf-8"});
                //var wordStream = URL.createObjectURL(blob);
                var timestamp = (new Date()).getTime();
                var fileName = timestamp + ".txt";
                var uploadTextUrl = await this.uploadTextFile(blob, fileName);
                this.setState({resultContent: this.state.content})
                await this.getKword(uploadTextUrl);

            } else {
                swal({
                    title: this.props.intl.formatMessage({id: 'Text Content is Null'}),
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                });
            }
        } else if (this.state.textUploadType == 1) {
            if (this.state.fileList.length > 0) {
                this.setState({usedList: [].concat(this.state.fileList)})
                await this.getKword(this.state.fileList[0].url);
                this.readFormText();
            } else {
                swal({
                    title: this.props.intl.formatMessage({id: 'UploadList is empty'}),
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                });
            }

        }

        this.setState({isLoading: false});
    }

    onSelectFile = async(e)=> {
        var files = document.getElementById("upload-text-file").files;
        if (files.length) {
            var file = files[0];
            var nameValue = document.getElementById("upload-text-file").value;
            var suffix = nameValue.substring(nameValue.lastIndexOf(".") + 1);
            if (!!suffix && suffix.toLowerCase() == 'txt') {
                var fileName = nameValue.substring(nameValue.lastIndexOf("\\") + 1);
                var url = await this.uploadTextFile(file, fileName);
                this.setState({fileList: [{url: url, name: fileName}]});
                this.props.setTextToolInfo({fileList:[{url:url,name:fileName}]});
            } else {
                swal({
                    title: this.props.intl.formatMessage({id: 'Only support Txt'}),
                    type: 'info',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                })
            }

        }
    }

    removeItem(index) {
        var fileList = this.state.fileList;
        fileList.splice(index, 1);
        this.setState({fileList: fileList});
        this.props.setTextToolInfo({fileList:fileList});
        document.getElementById("upload-text-file").value="";
    }


    showSimlarLocation(word) {
        this.setState({highlightWord: word});

    }

    toggleLeftBox(){
        this.setState({hideLeftBox:!this.state.hideLeftBox});
    }


    renderResultContent() {
        if (!!this.state.highlightWord && this.state.highlightWord != "") {
            const matches = match(this.state.resultContent, this.state.highlightWord);
            const parts = parse(this.state.resultContent, matches);
            return parts.map((part, index) => {
                return part.highlight ? (
                    <span key={String(index)} style={{backgroundColor:"#b53535", color:'#ffffff',fontSize:'14px'}}>
                          {part.text}
                        </span>
                ) : (
                    <strong key={String(index)}
                            style={{ fontWeight: '300',fontSize:'14px' }}>
                        {part.text}
                    </strong>
                );
            });
        } else {
            return <div>{this.state.resultContent}</div>
        }
    }

    renderResult() {//渲染结果页面

        const {classes}=this.props;
        return <div>
            {
                // <h5><i className="glyphicon glyphicon-zoom-in"></i>&nbsp;<FormattedMessage id="To find words"/></h5>
            }
            <div style={{marginTop:'1rem'}}>

                <div className="row">
                    <div className="col-sm-8">
                        {
                            this.state.resultContent && <Paper elevation={1} className={classes.root}>
                                <div style={{padding:'1rem'}}>{this.renderResultContent()}</div>
                            </Paper>
                        }

                    </div>
                    <div className="col-sm-4">
                        <div style={{marginTop:'1rem'}}>

                            {this.state.currentWordList.length > 0 && <div
                                style={{marginTop:'1rem',marginTop: "1rem",background:"#ffffff",overflow: "hidden",padding: "15px"}}>

                                <h5>关键词列表</h5>
                                <ul className="gsd-menu-list">
                                    <li className="header"><div className="row"><span className="col-sm-4">关键词</span><span className="col-sm-8">权重</span></div></li>
                                    {
                                        this.state.currentWordList.map((item, index)=><li
                                            onClick={()=>this.showSimlarLocation(item.word)}
                                            key={"similary_word_"+index}>
                                            <div style={{padding:'0.5rem 0',cursor:'pointer'}}>
                                                <div className="row"><span className="col-sm-4">{item.word}</span><span
                                                    className="col-sm-8">{item.score}</span></div>
                                            </div>
                                        </li>)
                                    }

                                </ul>
                            </div>}
                        </div>
                    </div>
                </div>


            </div>

        </div>
    }

    render() {

        return (
            <div>
                <style type="text/css">{`#tool-menus a{color:#757575;}`}</style>
                <div className="container clearfix" style={{width:'100%'}}>

                    <SplitPane split="vertical" onChange={ size => {this.props.setTextToolInfo({splitPaneSize:size})} }  size={this.state.hideLeftBox?0:this.state.splitPaneSize}>
                        <div className="leftBox">
                            <div className="leftBoxContainer">


                                <div className="text-option-item">

                                    <div
                                        style={{background: "#ffffff",padding: "1rem",marginBottom:"1rem",marginTop:"1rem"}}>

                                        <div className="text-option-item">
                                            <h5 className="title" style={{marginTop:'0'}}><FormattedMessage
                                                id="Add Text"/></h5>
                                            <RadioGroup disabled={this.state.isLoading} onChange={(e)=>{ this.props.setTextToolInfo({textUploadType:e.target.value});this.setState({textUploadType:e.target.value})}}
                                                        value={this.state.textUploadType}>
                                                <Radio className="gsd-check" value={0}>输入文本</Radio><br/>
                                                <Radio className="gsd-check" value={1}>上传文本文件</Radio><br/>
                                                <Radio className="gsd-check" disabled value={2}>通过url获取文本</Radio>
                                            </RadioGroup>
                                        </div>


                                        {this.state.textUploadType == 0 && <div className="text-option-item">

                                    <textarea disabled={this.state.isLoading} value={this.state.content} onChange={(e)=>this.handleInputChange(e)}
                                              className="form-control"
                                              rows="6"
                                              id="inputText"/>

                                        </div>
                                        }

                                        {this.state.textUploadType == 1 && <div className="text-option-item">

                                            <div className="upload-wrapper">
                                                <input disabled={this.state.isLoading} className="uploadFileInput" type="file" id="upload-text-file"
                                                       onChange={(e)=>this.onSelectFile(e)}/>
                                                <div><a className={this.state.isLoading?"btn btn-info btn-block btn-disabled":"btn btn-info btn-block"}><i
                                                    className="glyphicon glyphicon-upload"></i>上传文件</a></div>
                                            </div>
                                        </div>
                                        }


                                        <Divider />
                                        <div className="text-option-item" style={{marginTop:0,paddingTop:0}}>
                                            <h5 className="title"><FormattedMessage id="Max Word Count"/>&nbsp;<small>结果显示的最多词数</small></h5>

                                            <input disabled={this.state.isLoading} type="number" value={this.state.maxWord}
                                                   onChange={(e)=>this.setState({maxWord:e.target.value})}
                                                   className="form-control" rows="3"
                                                   id="inputText"/>
                                        </div>

                                    </div>


                                </div>

                                {this.state.fileList.length > 0 && <div>
                                    <Divider orientation="left">文档列表</Divider>
                                    <ul>
                                        <li >{this.state.fileList[0].name}&nbsp;<span
                                            onClick={()=>{this.removeItem(0)}}
                                            className="glyphicon glyphicon-remove"></span></li>
                                    </ul>
                                </div>
                                }


                                <div style={{textAlign:"right",marginTop:"5px"}}>
                                    <RunCmdBtn disable={this.state.isLoading}  onClick={()=>this.runCmd()}/>
                                </div>
                            </div>


                        </div>

                        <div className="rightBox">
                            <a className="left-right-toggle-icon" onClick={()=>this.toggleLeftBox()}><i className={this.state.hideLeftBox?"fa fa-arrow-circle-right":"fa fa-arrow-circle-left"}></i></a>
                            <div className="rightBoxContainer">
                                <div className="preview-div">
                                    <h5 style={{paddingLeft:this.state.hideLeftBox?"50px":"0"}}><FormattedMessage id="KeyWords Picker"/>&nbsp;{this.state.isLoading &&
                                    <CircularProgress color="secondary" style={{width:'1.5rem',height:'1.5rem'}}/>}</h5>
                                    {!!this.state.currentWordList && this.state.currentWordList.length > 0&&!this.state.isLoading && this.renderResult()}
                                    {(this.state.currentWordList.length == 0||this.state.isLoading) && <div className="preview-tip"><h4><i
                                        style={{background: "#000",color: "#ffffff",padding:'0 5px'}}
                                        className="fa fa-terminal"></i>
                                        &nbsp;
                                    <span style={{display:'inline-block',marginTop:'1rem'}}><FormattedMessage
                                        id="Preview Info Tip"/></span></h4></div>}
                                </div>
                            </div>
                        </div>
                    </SplitPane>


                </div>


            </div>

        )
    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        chaoxingData: state.chaoxingData
    }
}


const mapDispatchToProps = (dispatch, props) => {
    return { setTextToolInfo: (data)=>dispatch(setTextToolInfo(data))}
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(KeyWords)));
