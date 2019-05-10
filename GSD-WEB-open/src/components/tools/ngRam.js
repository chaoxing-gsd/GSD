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
import {Divider, Radio, Collapse} from 'antd';
import {fetchUrl, fetchBlobText} from '../../actions/fetchData';
import SplitPane from 'react-split-pane';
import {INNER_SERVER_URL, TXT_SERVER_URL, UPLOAD_SERVER_URL} from  "../../config/constants";
import CircularProgress from '@material-ui/core/CircularProgress';
import swal from 'sweetalert2';
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
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


class NgRam extends Component {
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
            resultData: [],
            similarData: [],
            cahr: true,
            hideLeftBox: false,
            splitPaneSize: 300,
            minnum: 2,
            segment: true,
            value: 2

        };

    }


    uploadTextFile = async(originalFile = null, originalName = null)=> {
        var formdata = new FormData();
        if (!!originalFile) {
            formdata.append('file', originalFile, originalName);
        } else {
            var blob = new Blob([this.state.content], {type: "text/plain;charset=utf-8"});
            //var wordStream = URL.createObjectURL(blob);
            var timestamp = (new Date()).getTime();
            var fileName = timestamp + ".txt";

            formdata.append('file', blob, fileName);

        }
        var response = await fetchUrl(UPLOAD_SERVER_URL + `upload`, "post", formdata, {});
        if (!!response) {
            console.log(response);
            if (response.status == 'success' || response.status == 'exist') {
                var url = "http://cs.ananas.chaoxing.com/download/" + response.objectid;
                var fileList = [];
                fileList.push({name: originalName || fileName, url: url});
                this.setState({fileList: fileList, isFirstAdd: false, content: ''});
                this.props.setTextToolInfo({fileList: fileList});

            }
        }
        document.getElementById("upload-text-file").value="";
    }

    getDocsimilar = async(url)=> {//获取相似度信息
        var formdata = new FormData();
        var param = {};
        param['texturl'] = this.state.fileList.map(item=>item.url);
        param['minnum'] = this.state.minnum + "";
        param['segment'] = this.state.segment + "";
        param['value'] = this.state.value + "";
        param['char'] = this.state.cahr + "";

        formdata.append("param", JSON.stringify(param));

        var response = await fetchUrl(TXT_SERVER_URL + `textnlp/api/getNgram`, "post", formdata, {});
        if (!!response) {
            if (!!response.status) {

                this.setState({similarData: response.data})

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
        if (!!this.props.chaoxingData.textToolInfos.textUploadType) {
            this.setState({textUploadType: this.props.chaoxingData.textToolInfos.textUploadType})
        }
        if (!!this.props.chaoxingData.textToolInfos.fileList) {
            this.setState({fileList: this.props.chaoxingData.textToolInfos.fileList})
        }
        if (!!this.props.chaoxingData.textToolInfos.content) {
            this.setState({content: this.props.chaoxingData.textToolInfos.content})
        }
        if (!!this.props.chaoxingData.textToolInfos.splitPaneSize) {
            this.setState({splitPaneSize: this.props.chaoxingData.textToolInfos.splitPaneSize})
        }
        document.title = "N-gram-" + this.props.intl.formatMessage({id: 'Text Analysis'}) + "-" + this.props.intl.formatMessage({id: 'PROJECT_NAME'});


    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.chaoxingData.textToolInfos.fileList) {
            this.setState({fileList: nextProps.chaoxingData.textToolInfos.fileList})
        }
        if (!!nextProps.chaoxingData.textToolInfos.content) {
            this.setState({content: nextProps.chaoxingData.textToolInfos.content})
        }
    }


    handleInputChange(e) {
        this.setState({content: e.target.value});
        this.props.setTextToolInfo({content: e.target.value});
    }

    runCmd = async()=> {//运行脚本
        if (!(/^[0-9]*$/).test(this.state.minnum)) {
            swal({
                title: this.props.intl.formatMessage({id: 'Minum value is error'}),
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
            return;
        }
        if (!(/^[0-9]*$/).test(this.state.value)) {
            swal({
                title: this.props.intl.formatMessage({id: 'Search Length value is error'}),
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
            return;
        }
        this.setState({isLoading: true})

        if (this.state.textUploadType == 0) {
            if (!!this.state.content) {
                var blob = new Blob([this.state.content], {type: "text/plain;charset=utf-8"});
                //var wordStream = URL.createObjectURL(blob);
                var timestamp = (new Date()).getTime();
                var fileName = timestamp + ".txt";

                var formdata = new FormData();
                if (!!blob) {
                    formdata.append('file', blob, fileName);
                    var response = await fetchUrl(UPLOAD_SERVER_URL + `upload`, "post", formdata, {});
                    console.log(response);
                    if (!!response) {
                        console.log(response);
                        if (response.status == 'success' || response.status == 'exist') {
                            var url = "http://cs.ananas.chaoxing.com/download/" + response.objectid;
                            var fileList = [{name: fileName, url: url}];
                            this.setState({fileList: fileList,usedList:[].concat(fileList)});
                            this.props.setTextToolInfo({fileList: fileList});


                        }
                    }
                }
                this.setState({resultContent: this.state.content});
                await this.getDocsimilar();
            } else {
                swal({
                    title: this.props.intl.formatMessage({id: 'Text Content is Null'}),
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                });
            }
        } else {

            if (this.state.fileList.length > 0) {
                await this.getDocsimilar();
            } else {
                swal({
                    title: this.props.intl.formatMessage({id: 'UploadList is empty'}),
                    type: 'info',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                })
            }


        }

        this.setState({isLoading: false})

    }

    onSelectFile(e) {//选择文件
        var files = document.getElementById("upload-text-file").files;
        if (files.length>0) {
            var file = files[0];
            var nameValue = document.getElementById("upload-text-file").value;
            var suffix = nameValue.substring(nameValue.lastIndexOf(".") + 1);
            if (!!suffix && suffix.toLowerCase() == 'txt') {
                var fileName = nameValue.substring(nameValue.lastIndexOf("\\") + 1);
                console.log(fileName);
                this.uploadTextFile(file, fileName);
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


    renderScatterChart() {//相似度图表组件

        return <div
            style={{display:!!this.state.similarCoor&&Object.keys(this.state.similarCoor).length>0?"block":"none"}}>
            <h5><FormattedMessage id="Similarity scatter"/></h5>
            <div style={{height:"400px",width:"100%"}} id="similarScatterGraph"></div>
        </div>
    }


    changeCollapseKey(key) {
        console.log(key);
        this.setState({resultContent: null});
        if (!!key) {
            this.readFormText(key);
        }
    }


    readFormText(index) { //从文件中读取文本信息
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
        // var response = fetchBlobText(url + "?mt=text/plain").then(blob => {
        //     var reader = new FileReader();
        //     reader.onload = function (e) {
        //         var text = reader.result;
        //         console.log(text);
        //         _self.setState({resultContent: text});
        //     }
        //     reader.readAsText(blob, 'utf-8')
        // });


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

    rendrResultContentWrapper(index) {
        const {classes} =this.props;
        var i = index + 1;
        console.log(this.state.similarData);
        return <div>

            <div className="row">
                <div className="col-sm-12">
                    {
                        this.state.resultContent && <div elevation={1} className={classes.root}>
                            <div style={{padding:'1rem'}}>{this.renderResultContent()}</div>
                        </div>
                    }

                </div>

            </div>


        </div>;
    }


    renderResultData() {//相似数据度组件

        return <div style={{marginTop:'2rem'}}>
            <Collapse bordered={false} onChange={(key)=>this.changeCollapseKey(key)} accordion>

                {

                    <Panel header={"正文内容"} key={0}>

                {this.rendrResultContentWrapper(0)}
                    </Panel>
                }


            </Collapse>
            <div >

                <div className="row">
                    <div className="col-sm-12">
                        <div style={{marginTop:'1rem'}}>

                            {
                                Object.keys(this.state.similarData).length >=  1 && <div
                                    style={{marginTop:'1rem',marginTop: "1rem",background:"#ffffff",overflow: "hidden",padding: "15px"}}>

                                    <h3>分词列表</h3>         <Divider/>
                                    <ul className="gsd-menu-list">
                                        <li className="header">
                                            <div className="row"><span className="col-sm-4 headerTr">分词</span><span
                                                className="col-sm-8 headerTr">频率</span></div>
                                        </li>
                                        {
                                            this.state.similarData["doc_1"].map((sitem, sindex)=> {
                                                var key = Object.keys(sitem)[0];
                                                var keys = key.split("_");

                                                return <li
                                                    key={"similary_word_"+sindex}>
                                                    <div style={{padding:'0.5rem 0',cursor:'pointer'}}>
                                                        <div className="row"><span
                                                            className="col-sm-4">{keys[0]}&nbsp;{keys[1]}</span><span
                                                            className="col-sm-8">{sitem[key][0]}</span></div>

                                                    </div>

                                                </li>
                                            })
                                        }

                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </div>
    }

    toggleLeftBox() {
        this.setState({hideLeftBox: !this.state.hideLeftBox});
    }


    removeItem(index) {//移除文件列表
        this.setState({fileList: []});
        this.props.setTextToolInfo({fileList: []});
        document.getElementById("upload-text-file").value = "";
    }

    render() {

        return (
            <div>
                <style type="text/css">{`#tool-menus a{color:#757575;}`}</style>
                <div className="container clearfix" style={{width:'100%'}}>

                    <SplitPane split="vertical" onChange={ size => {this.props.setTextToolInfo({splitPaneSize:size})} }
                               size={this.state.hideLeftBox?0:this.state.splitPaneSize}>
                        <div className="leftBox">
                            <div className="leftBoxContainer">


                                <div className="text-option-item">
                                    <h5 className="title"><FormattedMessage id="Ignore Punctuatio"/></h5>

                                    <RadioGroup  disabled={this.state.isLoading} onChange={(e)=>this.setState({cahr:e.target.value})}
                                                value={this.state.cahr}>
                                        <Radio className="gsd-check" value={true}><FormattedMessage
                                            id="Ignore"/></Radio>
                                        <Radio className="gsd-check" value={false}><FormattedMessage
                                            id="UnIgnore"/></Radio>
                                    </RadioGroup>
                                </div>


                                <div className="text-option-item">
                                    <h5 className="title"><FormattedMessage id="Min Frequency"/>&nbsp;
                                        <small><FormattedMessage id="Min_Frequency_Tip"/></small>
                                    </h5>

                                    <input  disabled={this.state.isLoading} type="number" min="0" value={this.state.minnum} className="form-control"
                                           onChange={(e)=>{this.setState({minnum:e.target.value})}}/>
                                </div>

                                <div className="text-option-item">
                                    <h5 className="title"><FormattedMessage id="If Segment"/></h5>

                                    <RadioGroup  disabled={this.state.isLoading} onChange={(e)=>this.setState({segment:e.target.value})}
                                                value={this.state.segment}>
                                        <Radio className="gsd-check" value={true}><FormattedMessage id="Yes"/></Radio>
                                        <Radio className="gsd-check" value={false}><FormattedMessage id="No"/></Radio>
                                    </RadioGroup>
                                </div>

                                <div className="text-option-item">
                                    <h5 className="title"><FormattedMessage id="Search Length"/>&nbsp;
                                        <small><FormattedMessage id="Search_Lenth_Tip"/></small>
                                    </h5>

                                    <input  disabled={this.state.isLoading} type="number" min='0' value={this.state.value} className="form-control"
                                           onChange={(e)=>{this.setState({value:e.target.value})}}/>
                                </div>

                                <div className="text-option-item">
                                    <h5 className="title"><FormattedMessage id="Add Text"/></h5>
                                    <div style={{background: "#ffffff",padding: "1rem",marginBottom:"1rem"}}>

                                        <div className="text-option-item">

                                            <RadioGroup
                                                disabled={this.state.isLoading}
                                                onChange={(e)=>{this.props.setTextToolInfo({textUploadType:e.target.value});this.setState({textUploadType:e.target.value})}}
                                                value={this.state.textUploadType}>
                                                <Radio className="gsd-check" value={0}>输入文本</Radio><br/>
                                                <Radio className="gsd-check" value={1}>上传文本文件</Radio><br/>
                                                <Radio className="gsd-check" disabled value={2}>通过url获取文本</Radio>
                                            </RadioGroup>
                                        </div>


                                        {this.state.textUploadType == 0 && <div className="text-option-item">

                                    <textarea value={this.state.content} onChange={(e)=>this.handleInputChange(e)}
                                              className="form-control"
                                              rows="6"
                                              id="inputText"/>
                                            {

                                                // <a style={{marginTop:'1rem'}} onClick={()=>this.uploadTextFile()}
                                                //    className="btn btn-info btn-block"><i className="fa fa-plus-circle"></i>&nbsp;
                                                //     <FormattedMessage
                                                //         id="Add Text"/></a>
                                            }
                                        </div>
                                        }

                                        {this.state.textUploadType == 1 && <div className="text-option-item">

                                            <div className="upload-wrapper">
                                                <input className="uploadFileInput"  disabled={this.state.isLoading} type="file" id="upload-text-file"
                                                       onChange={(e)=>this.onSelectFile(e)}/>
                                                <div><a className={this.state.isLoading?"btn btn-warning btn-block btn-disabled":"btn btn-warning btn-block"}><i
                                                    className="glyphicon glyphicon-upload"></i>上传文件</a></div>
                                            </div>
                                        </div>
                                        }


                                    </div>


                                </div>

                                {this.state.fileList.length > 0 && <div>
                                    <Divider orientation="left">文档列表</Divider>
                                    <ul>
                                        <li key={this.state.fileList[0].url}>{this.state.fileList[0].name}&nbsp;<span
                                            onClick={()=>{this.removeItem(0)}}
                                            className="glyphicon glyphicon-remove"></span></li>
                                    </ul>
                                </div>
                                }


                                <div style={{textAlign:"right",marginTop:"5px"}}>

                                    <RunCmdBtn disable={this.state.isLoading} onClick={()=>this.runCmd()}/>

                                </div>
                            </div>


                        </div>

                        <div className="rightBox">
                            <a className="left-right-toggle-icon" onClick={()=>this.toggleLeftBox()}><i
                                className={this.state.hideLeftBox?"fa fa-arrow-circle-right":"fa fa-arrow-circle-left"}></i></a>

                            <div className="rightBoxContainer">
                                <div className="preview-div">
                                    <h5 style={{paddingLeft:this.state.hideLeftBox?"50px":"0"}}>
                                        N-gram&nbsp;{this.state.isLoading &&
                                    <CircularProgress color="secondary" style={{width:'1.5rem',height:'1.5rem'}}/>}
                                        <div>
                                            <small>
                                                N-gram是一种基于统计语言模型的算法。将文本里面的内容按照字节进行大小为N的滑动窗口操作，形成了长度是N的字节片段序列，每一个字节片段称为gram，对所有gram的出现频度进行统计，并且按照事先设定好的阈值进行过滤，形成关键gram列表。
                                            </small>
                                        </div>
                                    </h5>
                                    {!!this.state.similarData&&!this.state.isLoading && Object.keys(this.state.similarData).length > 0 &&
                                    <div>{this.renderResultData()}</div>}
                                    {(Object.keys(this.state.similarData).length == 0||this.state.isLoading) &&
                                    <div className="preview-tip"><h4><i
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
    return {
        setTextToolInfo: (data)=>dispatch(setTextToolInfo(data))


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(NgRam)));
