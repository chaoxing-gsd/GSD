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
import {fetchUrl} from '../../actions/fetchData';
import SplitPane from 'react-split-pane';
import {INNER_SERVER_URL, TXT_SERVER_URL, UPLOAD_SERVER_URL} from  "../../config/constants";
import CircularProgress from '@material-ui/core/CircularProgress';
import swal from 'sweetalert2';
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/scatter';
import RunCmdBtn from './runCmdBtn';
import {setTextToolInfo} from '../../actions';

import 'echarts/lib/component/tooltip';

require('echarts');
require('echarts-gl');

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


class SimilarText extends Component {
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
            similarCoor: {},
            hideLeftBox: false,
            dim: 2,
            splitPaneSize: 300

        };

    }

    uploadContentAsFile(isLoading) {
        if(isLoading)return;
        if (!!this.state.content && !!this.state.content.trim()) {
            this.uploadTextFile();
        } else {
            swal({
                title: this.props.intl.formatMessage({id: 'Text Content is Null'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            });
        }


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
                var fileList = this.state.fileList;
                var index = fileList.length;
                fileList.push({name: originalName || fileName, url: url});
                this.setState({fileList: fileList, isFirstAdd: false, content: ''});
                this.props.setTextToolInfo({fileList: fileList});

            }
        }


    }

    getDocsimilar = async(url)=> {//获取相似度信息
        var formdata = new FormData();
        var param = {};
        param['texturl'] = this.state.fileList.map(item=>item.url);
        param['dim'] = this.state.dim + "";


        formdata.append("param", JSON.stringify(param));

        var response = await fetchUrl(TXT_SERVER_URL + `textnlp/api/getDocsimilar`, "post", formdata, {});
        if (!!response) {
            if (!!response.status) {

                this.setState({
                    similarData: this.generateMatrix(response.data.similarity),
                    similarCoor: response.data.t_sne
                })
                this.renderChar(response.data.t_sne, this.state.fileList);
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


    generateMatrix(data = []) {//构造相似度数据矩阵
        var matrixArray = {};
        !!data && data.length > 0 && data.forEach((item)=> {
            var key = Object.keys(item);
            if (!!key) {
                var key_arrys = key[0].split("_");
                var preDocItems = matrixArray[key_arrys[0]] || {};
                var afterDocItems = matrixArray[key_arrys[1]] || {};

                var value = item[key];

                preDocItems[key_arrys[1]] = value;
                afterDocItems[key_arrys[0]] = value;

                matrixArray[key_arrys[0]] = preDocItems;
                matrixArray[key_arrys[1]] = afterDocItems;

            }

        })
        return matrixArray;
    }


    render3DScatterChart(){
        // var myChart = echarts.init(document.getElementById("scatterChart"));
        //
        //
        // var yAxisLabelName='year';
        // if(!!filterData){
        //     switch (filterData.dimension) {
        //         case 'year':
        //             yAxisLabelName = this.props.intl.formatMessage({id: 'YEAR'})
        //             break;
        //         case 'author':
        //             yAxisLabelName = this.props.intl.formatMessage({id: 'AUTHOR'})
        //             break;
        //
        //     }
        // }
        //
        //
        //
        // var option = {
        //     tooltip: {
        //         show: true,
        //         formatter: function (params) {
        //             return params.data[0] + "<br/>" + params.data[1] + ":" + params.data[2];
        //         }
        //     },
        //     grid3D: {},
        //     xAxis3D: {
        //         type: 'category',
        //         name: this.props.intl.formatMessage({id: 'LibName'})
        //     },
        //     yAxis3D: {type: 'category', name: yAxisLabelName},
        //     zAxis3D: {name: this.props.intl.formatMessage({id: 'DATA_COUNT'})},
        //     dataset: {
        //         dimensions: [
        //             'label',
        //             !!filterData&&!!filterData.dimension?filterData.dimension:"year",
        //             'count',
        //             {name:  !!filterData&&!!filterData.dimension?filterData.dimension:"year", type: 'ordinal'}
        //         ],
        //         source: data
        //     },
        //     series: [
        //         {
        //             type: 'scatter3D',
        //             symbolSize: 8,
        //             coordinateSystem: "cartesian3D",
        //             itemStyle: {
        //                 color: "#3399cc"
        //             },
        //             encode: {
        //                 x: 'label',
        //                 y: 'year',
        //                 z: 'count',
        //                 tooltip: [0]
        //             }
        //         }
        //     ]
        // };
        //
        //
        // if (option && typeof option === "object") {
        //     myChart.setOption(option, true);
        //     myChart.on("click", (param)=>this.chartClick(param));
        // }
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
        document.title = this.props.intl.formatMessage({id: 'Text_Similar'}) + "-" + this.props.intl.formatMessage({id: 'Text Analysis'}) + "-" + this.props.intl.formatMessage({id: 'PROJECT_NAME'});

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
        this.setState({isLoading: true})
        if (this.state.fileList.length > 1) {
            this.setState({usedList:[].concat(this.state.fileList)});
            await this.getDocsimilar();
        } else {
            swal({
                title: this.props.intl.formatMessage({id: 'Need More Files'}),
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            })
        }

        this.setState({isLoading: false})

    }

    onSelectFile(e) {//选择文件
        var files = document.getElementById("upload-text-file").files;
        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var nameValue = file.name;
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
    }

    renderChar(dataList, fileList) {//渲染图表
        console.log(dataList);
        var myChart = echarts.init(document.getElementById("similarScatterGraph"));

        var items = Object.keys(dataList);
        var is3d=false;
        var datas = items.map((key, index)=>{
            is3d=dataList[key].length>2;
            return dataList[key].concat(fileList[index].name)
        });
        var option;
        if(is3d){
            option = {
                grid3D: {},
                xAxis3D: {
                    type: 'category'
                },
                yAxis3D: {},
                zAxis3D: {},
                dataset: {
                    dimensions: [
                        'x',
                        'y',
                        'z',
                        'name'
                    ],
                    source: datas
                },
                series: [
                    {
                        type: 'scatter3D',
                        symbolSize: 30,
                        encode: {
                            x: 'Country',
                            y: 'Life Expectancy',
                            z: 'Income',
                            tooltip: [0, 1, 2, 3, 4]
                        }
                    }
                ]
            }
        }else{
            option = {
                xAxis: {},
                yAxis: {},
                label: true,
                series: [{
                    symbolSize: 20,
                    label: {
                        emphasis: {
                            show: true,
                            formatter: function (param) {
                                return param.data[2];
                            },
                            position: 'top'
                        }
                    },
                    data: datas,
                    type: 'scatter'
                }]
            };
        }
        

        if (option && typeof option === "object") {
            myChart.setOption(option, true);

        }
    }

    renderScatterChart() {//相似度图表组件

        var visible=!!this.state.similarCoor&&Object.keys(this.state.similarCoor).length>0&&!this.state.isLoading;
        return <div
            style={{visibility:visible?"visible":"hidden",marginTop:"2.4rem",maxHeight:visible?'3000px':'0px',overflow:visible?"auto":'hidden'}}>
            <h5><FormattedMessage id="Similarity scatter"/></h5>
            <div style={{height:"450px",width:"100%",position:'relative'}} id="similarScatterGraph"></div>
        </div>
    }

    renderResultData() {//相似数据度组件

        return <div className="compare-table-container">
            <div style={{overflow:'auto',"position": "absolute", background: "#ffffff",left:"0",right: "0",height:this.state.usedList.length*25+90}}>
                <h5>相似度对比表</h5>
                <table className="table-style">
                    <tr>

                        <th>&nbsp;</th>
                        {
                            //渲染头部
                            this.state.usedList.map((item, index)=> {

                                return <th key={index} className="col-be-scroll headerTr">
                                    {item.name}
                                </th>
                            })
                        }
                    </tr>
                    {
                        //渲染内容
                        this.state.usedList.map((item, index)=> {

                            return <tr>
                                <td className="headerTr">{item.name}</td>
                                {this.state.usedList.map((sitem, sindex)=> {
                                    var sitemKey = "doc" + (index + 1);
                                    var valueObjs = this.state.similarData[sitemKey];
                                    if (index == sindex)return <td key={index+"_"+sindex} className="col-be-scroll">
                                        --</td>;
                                    else {
                                        var value = valueObjs["doc" + (1 + sindex)]
                                        return <td key={index+"_"+sindex} className="col-be-scroll">{value}</td>;
                                    }

                                })
                                }</tr>


                        })
                    }
                    {
                        // this.state.fileList.map((item, index)=> {
                        //
                        //     return <Panel header={item.name} key={index}>
                        //
                        //         {this.state.fileList.reduce((arr, sitem, sindex)=> {
                        //
                        //             var sitemKey = "doc" + (index + 1);
                        //             var valueObjs = this.state.similarData[sitemKey];
                        //             if (!!valueObjs) {
                        //                 if (index != sindex) {//不是当前文档
                        //                     var i = sindex + 1;
                        //                     var value = valueObjs["doc" + i]
                        //
                        //                     arr.push(<p key={index+"_"+sindex}><FormattedMessage
                        //                         id="Similarity to the article Value"
                        //                         values={{articleName:sitem.name,value:value}}/></p>)
                        //
                        //                 }
                        //             }
                        //
                        //
                        //             return arr;
                        //
                        //         }, [])}
                        //     </Panel> </Collapse>
                        // })

                    }
                </table>
            </div>
        </div>
    }

    toggleLeftBox() {
        this.setState({hideLeftBox: !this.state.hideLeftBox});
    }


    removeItem(index) {//移除文件列表
        var fileList = this.state.fileList;
        fileList.splice(index, 1);
        this.setState({fileList: fileList});
        this.props.setTextToolInfo({fileList: fileList});
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
                                    <h5 className="title"><FormattedMessage id="Add Text"/></h5>
                                    <div style={{background: "#ffffff",padding: "1rem",marginBottom:"1rem"}}>

                                        <div className="text-option-item">

                                            <RadioGroup disabled={this.state.isLoading}
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
                                            <a style={{marginTop:'1rem'}} onClick={()=>this.uploadContentAsFile(this.state.isLoading)}
                                               className={this.state.isLoading?"btn btn-info btn-block btn-disabled":"btn btn-info btn-block"}><i
                                                className="fa fa-plus-circle"></i>&nbsp;
                                                <FormattedMessage
                                                    id="Add Text"/></a>
                                        </div>
                                        }


                                        {this.state.textUploadType == 1 && <div className="text-option-item">

                                            <div className="upload-wrapper">
                                                <input disabled={this.state.isLoading}  className="uploadFileInput" type="file" id="upload-text-file"
                                                       multiple onChange={(e)=>this.onSelectFile(e)}/>
                                                <div><a className={this.state.isLoading?"btn btn-warning btn-block btn-disabled":"btn btn-warning btn-block"}><i
                                                    className="glyphicon glyphicon-upload"></i>上传文件</a></div>
                                            </div>
                                        </div>
                                        }


                                    </div>


                                </div>

                                <div className="text-option-item">
                                    <h5 className="title">可视化维度</h5>

                                    <RadioGroup disabled={this.state.isLoading} onChange={(e)=>this.setState({dim:e.target.value})}
                                                value={this.state.dim}>
                                        <Radio className="gsd-check" value={2}>2维</Radio>
                                        <Radio className="gsd-check" value={3}>3维</Radio>
                                    </RadioGroup>
                                </div>


                                {this.state.fileList.length > 0 && <div>
                                    <Divider orientation="left">文档列表</Divider>
                                    <ul>
                                        {this.state.fileList.map((item, index)=> {
                                            return <li key={index}>{item.name}&nbsp;<span
                                                onClick={()=>{this.removeItem(index)}}
                                                className="glyphicon glyphicon-remove"></span></li>
                                        })}
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
                                    <h5 style={{paddingLeft:this.state.hideLeftBox?"50px":"0"}}><FormattedMessage
                                        id="Text_Similar"/>&nbsp;{this.state.isLoading &&
                                    <CircularProgress color="secondary" style={{width:'1.5rem',height:'1.5rem'}}/>}
                                        <div>
                                            <small>将文本表示为向量，通过计算余弦相似度得到文本之间的相似度</small>
                                        </div>
                                    </h5>
                                    {!!this.state.similarData&&!this.state.isLoading && Object.keys(this.state.similarData).length > 0 &&
                                    <div
                                        style={{position:'relative',height:this.state.usedList.length*25+90}}>{this.renderResultData()}</div>}
                                    {this.renderScatterChart()}
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


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(SimilarText)));
