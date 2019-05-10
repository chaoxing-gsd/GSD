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
import {Radio, Popover, Select,Divider} from 'antd';
import {fetchUrl} from '../../actions/fetchData';
import {setTextToolInfo} from '../../actions';
const RadioGroup = Radio.Group;

import SplitPane from 'react-split-pane';
import {INNER_SERVER_URL, TXT_SERVER_URL, UPLOAD_SERVER_URL} from  "../../config/constants";
import CircularProgress from '@material-ui/core/CircularProgress';
import swal from 'sweetalert2';
import RunCmdBtn from './runCmdBtn';
const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
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
const {Option, OptGroup} = Select;

const FONTS = [{value: '宋体', key: '宋体'},
    {value: '楷体', key: '楷体'},
    {value: '微软雅黑', key: '微软雅黑'},
    {value: '幼圆', key: '幼圆'},
    {value: '新宋体', key: '新宋体'},
    {value: 'Arial', key: 'Arial'},
    {value: 'Calibri', key: 'Calibri'},
    {value: 'Comic Sans MS', key: 'Comic Sans MS'},
    {value: 'Times New Roman', key: 'Times New Roman'},
    {value: 'Verdana', key: 'Verdana'}];

const IMAGE_SIZE = [{label: '640*480', value:{width: '640', height: '480'}},
    {label: '800*600', value:{width: '800', height: '600'}},
    {label: '800*800', value:{width: '800', height: '800'}},
    {label: '1024*768', value:{width: '1024', height: '768'}},
    {label: '1920*1080', value:{width: '1920', height: '1080'}}];

const IMAGE_TYPE = [{label: 'Apple Image', value: 'apple'},
    {label: 'Alice', value: 'alice'}, {label: 'Mickey Mouse', value: 'Mickey Mouse'}, {label: 'Stormtrooper', value: 'stormtrooper'}];

class WordCloud extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        onFilterSelect: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {
            yearchannelList: [],
            initFlag: false,
            type: 0,
            content: "",
            preViewImage: "",
            width: "640",
            height: "480",
            ttf_type: "宋体",
            imageType:"apple",
            maxWord:"200",
            maxFontSize:"0.1",
            scaleType:"log",
            isLoading:false,
            textUploadType:0,
            fileList:[],
            hideLeftBox:false,
            splitPaneSize:300

        };

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

    getWordCloudPicInfo = async(url)=> {
        var formdata = new FormData();
        var param = {};
        param['texturl'] = url;
        param['type'] = this.state.type + "";
        param['max_count'] = this.state.maxWord;
        param['ttf_type'] = this.state.ttf_type;
       // param['fig_width'] = this.state.width;
      //  param['fig_height'] = this.state.height;
       // param['scale'] = this.state.scaleType;//linear,log
        param['max_font_size'] = this.state.maxFontSize;
        param['mask'] = this.state.imageType;
        formdata.append("param", JSON.stringify(param));

        var response = await fetchUrl(TXT_SERVER_URL + `textnlp/api/getWordcloud`, "post", formdata, {});
        console.log(response);
        if (!!response) {
            if (!!response.statu) {

                this.setState({preViewImage: response.data.fig_url});
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
        document.title=this.props.intl.formatMessage({id: 'WORD_CLOUD'})+"-"+this.props.intl.formatMessage({id: 'Text Analysis'})+"-"+this.props.intl.formatMessage({id: 'PROJECT_NAME'});

    }

    componentWillReceiveProps(nextProps) {
        if(!!nextProps.chaoxingData.textToolInfos.fileList){
            this.setState({fileList:nextProps.chaoxingData.textToolInfos.fileList})
        }
        if(!!nextProps.chaoxingData.textToolInfos.content){
            this.setState({content:nextProps.chaoxingData.textToolInfos.content})
        }

    }

    onChangeType = (e) => {//用户改变统计方式
        this.setState({
            type: e.target.value,
        });
    }


    removeItem(index){//删除文件
        var fileList=this.state.fileList;
        fileList.splice(index,1);
        this.setState({fileList:fileList});
        this.props.setTextToolInfo({fileList:fileList});
        document.getElementById("upload-text-file").value="";
    }

    handleInputChange(e) {
        this.setState({content: e.target.value});
        this.props.setTextToolInfo({content:e.target.value})
    }

    onSelectFile=async(e)=>{//用户上传文件
        var files = document.getElementById("upload-text-file").files;
        if (files.length) {
            var file = files[0];
            var nameValue=document.getElementById("upload-text-file").value;
            var suffix=nameValue.substring(nameValue.lastIndexOf(".")+1);

            if(this.state.type==0){//词频统计只能用txt
                if(!!suffix&&suffix.toLowerCase()=='txt'){
                    var fileName=nameValue.substring(nameValue.lastIndexOf("\\")+1);
                    console.log(fileName);
                    var url=await this.uploadFile(file,fileName);
                    this.setState({fileList:[{url:url,name:fileName}]})
                    this.props.setTextToolInfo({fileList:[{url:url,name:fileName}]});
                }else{
                    swal({
                        title: this.props.intl.formatMessage({id: 'Only support Txt'}),
                        type: 'info',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                    })
                }
            }else{
                if(!!suffix&&suffix.toLowerCase()=='csv'){
                    var fileName=nameValue.substring(nameValue.lastIndexOf("\\")+1);
                    console.log(fileName);
                    var url=await this.uploadFile(file,fileName);
                    this.setState({fileList:[{url:url,name:fileName}]})
                    this.props.setTextToolInfo({fileList:[{url:url,name:fileName}]});
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
    }


    runCmd=async()=> {//用户点击运行


        if((!((/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/).test(this.state.maxFontSize)&&this.state.maxFontSize>0&&this.state.maxFontSize<=1))){
            swal({
                title: this.props.intl.formatMessage({id: 'Scale type value is error'}),
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
            return;
        }
        if(!(/^[0-9]*$/).test(this.state.maxWord)){
            swal({
                title: this.props.intl.formatMessage({id: 'Maxword value is error'}),
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
            return;
        }
        this.setState({isLoading:true});


        if(this.state.type==0&&this.state.textUploadType==0&&!!this.state.content){//先统计词频率,在绘图,用户输入文本生成
            var blob = new Blob([this.state.content], {type: "text/plain;charset=utf-8"});
            //var wordStream = URL.createObjectURL(blob);
            var timestamp = (new Date()).getTime();
            var fileName = timestamp + ".txt";
            var url=await this.uploadFile(blob,fileName);
            if(!!url){
                await this.getWordCloudPicInfo(url);
            }
        }else if(this.state.type==0&&this.state.textUploadType==1&&!!this.state.fileList.length>0){//用户上传文本解析
            await this.getWordCloudPicInfo(this.state.fileList[0].url);
        }else if(this.state.type==1&&this.state.textUploadType==0){//用户直接根据词权重绘图,需要先根据文本生成csv文件并上传
            try{
                var jsons=JSON.parse(this.state.content);

                var csvRows=[];
                var head = ["","segment","size"];
                csvRows.push(head.join(","));
                if (!!jsons && Object.keys(jsons).length > 0) {
                    var datas=Object.keys(jsons).reduce((arr,key,index)=>{
                        var obj=[];
                        obj.push(index);
                        obj.push(key);
                        obj.push(jsons[key]);
                        arr.push(obj.join(","));
                        return arr;
                    },[]);
                    csvRows=csvRows.concat(datas);
                }


                var csvString = csvRows.join('\n');
                // var BOM = '\uFEFF';
                // csvString = BOM + csvString;

                var blob = new Blob([csvString], {type: "text/plain;charset=utf-8"});
                var wordStream = URL.createObjectURL(blob);
                var timestamp = (new Date()).getTime();
                var fileName = timestamp + ".csv";
                var url=await this.uploadFile(blob,fileName);
                if(!!url){
                    await this.getWordCloudPicInfo(url);
                }


                // var a = document.createElement('a');
                // a.href = 'data:attachment/csv,' +  encodeURI(csvString);
                // a.target = '_blank';
                // a.download = 'errorList.csv';
                // document.body.appendChild(a);
                // console.log(jsons);

            }catch(e){
                swal({
                    title: this.props.intl.formatMessage({id: 'Text Content is Error'}),
                    type: 'info',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                }).then((result) => {

                })
            }
            //var content

        }else if(this.state.type==1&&this.state.textUploadType==1){
            await this.getWordCloudPicInfo(this.state.fileList[0].url);
        }else{
            swal({
                title: this.props.intl.formatMessage({id: 'Text Content is Null'}),
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
        }
        this.setState({isLoading:false});
    }

    loadTextTemplate(){

        this.setState({content:`{
            "name": "10",
            "name2": "10",
            "name3": "10"
        }`})
    }

    toggleLeftBox(){
        this.setState({hideLeftBox:!this.state.hideLeftBox});
    }

    render() {

        return (
            <div>
                <style type="text/css">{`#tool-menus a{color:#757575;}`}</style>
                <div className="container clearfix" style={{width:'100%'}}>

                    <SplitPane split="vertical"  onChange={ size => {this.props.setTextToolInfo({splitPaneSize:size})} }  size={this.state.hideLeftBox?0:this.state.splitPaneSize}>
                        <div className="leftBox">
                            <div className="leftBoxContainer">


                                <div className="text-option-item">
                                    <h5 className="title"><FormattedMessage id="Please Select Font"/></h5>

                                    <Select
                                        disabled={this.state.isLoading}
                                        onChange={(value)=>{this.setState({ttf_type:value})}}
                                        defaultValue={this.state.ttf_type}
                                        style={{ width: '100%' }}
                                    >
                                        <OptGroup label={<FormattedMessage id="Please Select Font"/>}>
                                            {FONTS.map(item=><Option key={item.value} value={item.value}>{item.value}</Option>)}
                                        </OptGroup>
                                    </Select>
                                </div>


                                {
                                //     <div className="text-option-item">
                                //     <h5 className="title"><FormattedMessage id="Image Size"/></h5>
                                //
                                //     <Select
                                //         onChange={(value)=>{console.log(value);this.setState({height:value.height,width:value.width})}}
                                //         defaultValue="640*480"
                                //         style={{ width: '100%' }}
                                //     >
                                //         <OptGroup label={<FormattedMessage id="Image Size"/>}>
                                //             {IMAGE_SIZE.map(item=><Option  value={item.value}>{item.label}</Option>)}
                                //         </OptGroup>
                                //     </Select>
                                // </div>
                                }




                                <div className="text-option-item">
                                    <h5 className="title"><FormattedMessage id="Image Type"/></h5>

                                    <Select
                                        disabled={this.state.isLoading}
                                        onChange={(value)=>{this.setState({imageType:value})}}
                                        placeholder={<FormattedMessage id="Image Type"/>}
                                        style={{ width: '100%' }}
                                    >
                                        <OptGroup label={<FormattedMessage id="Image Type"/>}>
                                            {IMAGE_TYPE.map(item=><Option key={item.value} value={item.value}><FormattedMessage
                                                id={item.label}/></Option>)}
                                        </OptGroup>
                                    </Select>
                                </div>


                                <div className="text-option-item">
                                    <h5 className="title"><FormattedMessage id="Statistics Type"/></h5>

                                    <RadioGroup  disabled={this.state.isLoading} onChange={(e)=>this.onChangeType(e)} value={this.state.type}>
                                        <Radio className="gsd-check" value={0}>先统计文章词频再绘图&nbsp;<Popover
                                            content={"添加一段文字,自动计算文章中的词频率,并绘制词云图"} trigger="hover">
                                            <i className="fa fa-question-circle"></i>
                                        </Popover></Radio>
                                        <Radio className="gsd-check" value={1}>直接根据词频数绘图&nbsp;<Popover
                                            content={"添加词频率数据,形如{name1:10,name2:20,name3:23},key为显示名称,value为权重"}
                                            trigger="hover"><i className="fa fa-question-circle"></i></Popover></Radio>
                                    </RadioGroup>
                                </div>

                                {
                                // <div className="text-option-item" >
                                //     <h5 className="title"><FormattedMessage id="Scale Type"/></h5>
                                //     <RadioGroup onChange={(e)=>this.setState({scaleType:e.target.value})} value={this.state.scaleType}>
                                //
                                //         <Radio className="gsd-check" value="log"><FormattedMessage
                                //             id="Log Scale"/></Radio>
                                //         <Radio className="gsd-check" value="linear"><FormattedMessage
                                //             id="Linear Scale"/></Radio>
                                //     </RadioGroup>
                                //
                                // </div>
}


                                <div className="text-option-item">
                                    <h5 className="title"><FormattedMessage id="Max Font Scale"/>&nbsp;<small><FormattedMessage id="Rang_0_to_1"/></small></h5>

                                    <input  disabled={this.state.isLoading} type="number" step="0.1" min="0" max="1" value={this.state.maxFontSize} className="form-control" onChange={(e)=>{this.setState({maxFontSize:e.target.value})}}/>
                                </div>


                                <div className="text-option-item">
                                    <h5 className="title"><FormattedMessage id="Max Word Count"/>&nbsp;<small><FormattedMessage id="Max_Word_Tip"/></small></h5>

                                   <input  disabled={this.state.isLoading} type="number" min="0" value={this.state.maxWord} className="form-control" onChange={(e)=>{this.setState({maxWord:e.target.value})}}/>
                                </div>

                                <div style={{background: "#ffffff",padding: "1rem",marginBottom:"1rem",marginTop:"1rem"}}>

                                    <div className="text-option-item">
                                        <h5 className="title" style={{marginTop:'0'}}><FormattedMessage id="Text Content"/></h5>
                                        <RadioGroup  disabled={this.state.isLoading} onChange={(e)=>{this.setState({textUploadType:e.target.value});this.props.setTextToolInfo({textUploadType:e.target.value})}}
                                                    value={this.state.textUploadType}>
                                            <div><Radio className="gsd-check" value={0}><FormattedMessage id="Input Text"/></Radio>{(this.state.textUploadType==0&&this.state.type==1)&&<a onClick={()=>this.loadTextTemplate()} > <FormattedMessage id="Load text template"/></a>}</div>
                                           <div> <Radio className="gsd-check" value={1}><FormattedMessage id="Upload Text"/></Radio>{(this.state.textUploadType==1&&this.state.type==1)&&<a target="_blank" href="/templates/wordcloudinput_template.csv" ><FormattedMessage id="Download csv template"/></a>} </div>
                                            <div> <Radio className="gsd-check" disabled value={2}><FormattedMessage id="Get Text from Url"/></Radio></div>
                                        </RadioGroup>
                                    </div>


                                    {this.state.textUploadType==0 && <div className="text-option-item" >

                                    <textarea onChange={(e)=>this.handleInputChange(e)} className="form-control"
                                              rows="6"
                                              disabled={this.state.isLoading}
                                              value={this.state.content}
                                              id="inputText"/>

                                    </div>
                                    }

                                    {this.state.textUploadType==1 && <div className="text-option-item" >

                                        <div className="upload-wrapper">
                                            <input disabled={this.state.isLoading}  className="uploadFileInput" type="file" id="upload-text-file" onChange={(e)=>this.onSelectFile(e)}/>
                                            <div><a className={this.state.isLoading?"btn btn-warning btn-block btn-disabled":"btn btn-warning btn-block"}><i className="glyphicon glyphicon-upload"></i>上传文件</a></div>
                                        </div>
                                    </div>
                                    }


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





                                <div style={{textAlign:"right",marginTop:"1.5rem"}}>


                                    <RunCmdBtn disable={this.state.isLoading}  onClick={()=>this.runCmd()}/>

                                  </div>
                            </div>


                        </div>

                        <div className="rightBox">
                            <a className="left-right-toggle-icon" onClick={()=>this.toggleLeftBox()}><i className={this.state.hideLeftBox?"fa fa-arrow-circle-right":"fa fa-arrow-circle-left"}></i></a>
                            <div className="rightBoxContainer">
                            <div className="preview-div">
                                <h5 style={{paddingLeft:this.state.hideLeftBox?"50px":"0"}}><FormattedMessage
                                    id="WORD_CLOUD"/>&nbsp;{this.state.isLoading&&<CircularProgress color="secondary" style={{width:'1.5rem',height:'1.5rem'}}/>}</h5>
                                {this.state.preViewImage&&!this.state.isLoading && <img style={{width:'100%'}} src={this.state.preViewImage}/>}
                                {(!this.state.preViewImage||this.state.isLoading) &&<div className="preview-tip"><h4><i style={{background: "#000",color: "#ffffff",padding:'0 5px'}} className="fa fa-terminal"></i>
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


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(WordCloud)));
