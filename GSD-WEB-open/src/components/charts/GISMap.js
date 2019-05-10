import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import {Glyphicon} from 'react-bootstrap';
import {Breadcrumb, Tooltip} from 'antd';
import {fetchText} from '../../actions/fetchData';
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {browserHistory} from 'react-router'
import CircularProgress from '@material-ui/core/CircularProgress';
import echarts from 'echarts';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import bmap from 'echarts/extension/bmap/bmap';
const PapaParse = require('papaparse/papaparse.min.js');
import Slide from '@material-ui/core/Slide';
var jschardet = require("jschardet");
import TextField from '@material-ui/core/TextField';
import {Slider} from 'antd'
import Button from '@material-ui/core/Button';
import swal from 'sweetalert2'
import FullScreenDatabaseSelector from './fullScreenDatabaseSelector'


function Transition(props) {
    return <Slide direction="up" {...props} />;
}


const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        marginTop: "30px"
    },
    closeBtn: {
        marginLeft: "15px",
        marginRight: "15px",
        display: 'inline-block',
        textAlign: 'center',
        fontSize: '16px',
        '&:hover': {
            color: "#ffffff",
        },
        color: "#ffffff"
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




const provinces = {
    '上海': 'data-1482909900836-H1BC_1WHg.json',
    '河北': 'data-1482909799572-Hkgu_yWSg.json',
    '山西': 'data-1482909909703-SyCA_JbSg.json',
    '内蒙古': 'data-1482909841923-rkqqdyZSe.json',
    '辽宁': 'data-1482909836074-rJV9O1-Hg.json',
    '吉林': 'data-1482909832739-rJ-cdy-Hx.json',
    '黑龙江': 'data-1482909803892-Hy4__J-Sx.json',
    '江苏': 'data-1482909823260-HkDtOJZBx.json',
    '浙江': 'data-1482909960637-rkZMYkZBx.json',
    '安徽': 'data-1482909768458-HJlU_yWBe.json',
    '福建': 'data-1478782908884-B1H6yezWe.json',
    '江西': 'data-1482909827542-r12YOJWHe.json',
    '山东': 'data-1482909892121-BJ3auk-Se.json',
    '河南': 'data-1482909807135-SJPudkWre.json',
    '湖北': 'data-1482909813213-Hy6u_kbrl.json',
    '湖南': 'data-1482909818685-H17FOkZSl.json',
    '广东': 'data-1482909784051-BJgwuy-Sl.json',
    '广西': 'data-1482909787648-SyEPuJbSg.json',
    '海南': 'data-1482909796480-H12P_J-Bg.json',
    '四川': 'data-1482909931094-H17eKk-rg.json',
    '贵州': 'data-1482909791334-Bkwvd1bBe.json',
    '云南': 'data-1482909957601-HkA-FyWSx.json',
    '西藏': 'data-1482927407942-SkOV6Qbrl.json',
    '陕西': 'data-1482909918961-BJw1FyZHg.json',
    '甘肃': 'data-1482909780863-r1aIdyWHl.json',
    '青海': 'data-1482909853618-B1IiOyZSl.json',
    '宁夏': 'data-1482909848690-HJWiuy-Bg.json',
    '新疆': 'data-1482909952731-B1YZKkbBx.json',
    '北京': 'data-1482818963027-Hko9SKJrg.json',
    '天津': 'data-1482909944620-r1-WKyWHg.json',
    '重庆': 'data-1482909775470-HJDIdk-Se.json',
    '香港': 'data-1461584707906-r1hSmtsx.json',
    '澳门': 'data-1482909771696-ByVIdJWBx.json'
};

const CSV_HEADER= ['id','label_name','province','city','lon','lat','tip'];

class GISMap extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.errorDataList={};
        this.state = {isParsing:true,secondPage:false,hideTool:false,baseInfo:{title:"统计热力图",max:1,min:0},isEditingInfo:false,downLoadDialog:false}
        this.cxId;
        this.myChart=null;
        this.mapDataName='';
        this.mapData='';
        this.csvParseProviceData=null;//csv解析后省份数据
        this.csvParseCityData=null;//csv解析后城市数据
        this.csvParseProviceMax=0;
        this.csvParseCityMax=0;
    }

    closeWindow() {
        if (navigator.userAgent.indexOf("MSIE") > 0) {//close IE
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                window.opener = null;
                window.close();
            } else {
                window.open('', '_top');
                window.top.close();
            }
        }
        else if (navigator.userAgent.indexOf("Firefox") > 0) {//close firefox
            window.location.href = 'about:blank ';
        } else {//close chrome;It is effective when it is only one.
            window.opener = null;
            window.open('', '_self');
            window.close();

        }
    }


    rerefreshMap(dataName,response,deep,_self,title=null,max=-1,min=-1){
        echarts.registerMap(dataName, response);
        _self.mapDataName=dataName;
        _self.mapData=response;
        var mapData=JSON.parse(response).features.map(function(item){
            var obj=Object.assign({});
            obj["name"]=item.properties.name;

            if(deep==0&&!!_self.csvParseProviceData){
                obj.value=_self.csvParseProviceData[obj["name"]]||0;
            }else if(deep==1&&!!_self.csvParseCityData){
                obj.value=_self.csvParseCityData[obj["name"]]||0;
            }else {
                obj.value = 0;
            }
            return obj
        });
        var option = {
            title: {
                text: title||'统计热力图',
                left: 'center',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                show: true,
                formatter: function(params) {
                    if (params.data) return params.name + '：' + params.data['value']
                },
            },
            visualMap: {
                type: 'continuous',
                text: ['', ''],
                showLabel: true,
                left: '50',
                min: min>0?min:0,
                max: max>0?max:((deep==0?this.csvParseProviceMax:this.csvParseCityMax)||100),
                inRange: {
                    color: ['#edfbfb', '#b7d6f3', '#40a9ed', '#3598c1', '#215096', ]
                },
                splitNumber: 0
            },

            series: [{
                name: dataName,
                type: 'map',
                mapType: dataName,
                roam: true,
                selectedMode: 'false',//是否允许选中多个区域
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                data:mapData
            }]
        };
        this.myChart.setOption(option);
        this.myChart.on("click", (param)=>this.chartClick(param));
        this.myChart.dispatchAction({
            type: 'restore'
        });

    }

    loadMapData(mapDataUrl,dataName,deep){
        console.log(mapDataUrl);
        var _self=this;
        if(this.state.isParsing&&deep==1)return;
        this.setState({isParsing:true})
        fetchText("/mapData/"+mapDataUrl).then(response => {
            _self.setState({isParsing:false})
            _self.rerefreshMap(dataName,response,deep,_self);
        }).catch(error => {

            _self.setState({isParsing:false})
        })


    }


    componentDidMount() {
        //this.initalECharts();
        this.myChart = echarts.init(document.getElementById('gsd-gsi-map'));
        this.loadMapData("data-1527045631990-r1dZ0IM1X.json","china",0);
        document.title=this.props.intl.formatMessage({id: 'GISMAP'})+"-"+this.props.intl.formatMessage({id: 'Data Visualization'})+"-"+this.props.intl.formatMessage({id: 'PROJECT_NAME'});

    }


    componentWillReceiveProps(nextProps) {


    }

    chartClick(params) {
        var name = params.name; //地区name
        var mapCode = provinces[name]; //地区的json数据
        if (!mapCode) {
            return;
        }
        this.setState({secondPage:true});
        this.loadMapData(mapCode, name,1);
    }

    buildChartData(csvData,special=false) {//special ture为演示数据处理
        console.log(csvData);

        var data={};
        this.csvParseCityMax=0;
        this.csvParseProviceData=0;
        this.csvParseProviceData={};
        this.csvParseCityData={};
        this.errorDataList={};
        if (!!csvData && csvData.length > 0) {

            for(var i=0;i<csvData.length;i++){
                try{
                    var provinceName=null;
                    var cityName=null;
                    if(special){
                        var arrs=csvData[i][0].split(",");
                        if(!!arrs&&arrs.length>3){
                            provinceName=arrs[2];
                            cityName=arrs[3];
                        }


                    }else{
                        provinceName=csvData[i][2];
                        cityName=csvData[i][3];
                    }

                    if(!!provinceName&&provinceName!=""){
                        provinceName=provinceName.substring(0,provinceName.length-1);
                        var value=this.csvParseProviceData[provinceName]||0;
                        value=value+1;
                        if(value>this.csvParseProviceMax)this.csvParseProviceMax=value;
                        this.csvParseProviceData[provinceName]=value;
                    }else{
                        this.errorDataList["row_"+i]=csvData;
                        this.errorDataList["rowinfo_"+i]="no province name";
                        continue;
                    }
                    if(!!cityName&&cityName!=""){
                        var value= this.csvParseCityData[cityName]||0;
                        value=value+1;
                        if(value>this.csvParseCityMax)this.csvParseCityMax=value;
                        this.csvParseCityData[cityName]=value;
                    }
                }catch(e){
                    this.errorDataList["row_"+i]=csvData;
                    this.errorDataList["rowinfo_"+i]="formater error";
                    //this.errorDataList.push(csvData[i]);
                }



            }
            this.setState({ isParsing: false });
        }



        var errorRowIndex=Object.keys(this.errorDataList);

        if(errorRowIndex.length>0&&!special){
            swal({
                title: this.props.intl.formatMessage({id: 'TIP'}),
                text: this.props.intl.formatMessage({id: 'Error Import List'}),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: this.props.intl.formatMessage({id: 'Download ErrorList'}),
                confirmButtonText: this.props.intl.formatMessage({id: 'Continue to render'})
            }).then((result) => {
                if (result.value) {
                    this.rerefreshMap(this.mapDataName,this.mapData,0,this);
                }else{
                    this.downloadErroList(csvData,this.errorDataList);
                }
                document.getElementById("gsd-csv-file").value="";
            })
        }else{
            this.rerefreshMap(this.mapDataName,this.mapData,0,this);
        }
    }

    downloadErroList(csvData,errorData){
        var csvRows=[];
        var head = CSV_HEADER;
        csvRows.push(head.join(","));
        if (!!csvData && csvData.length > 0) {
            var datas=csvData.reduce((arr,item,index)=>{
                if(!!errorData&&!!errorData["row_"+index]){
                    item.push(errorData["rowinfo_"+index]);
                }
                arr.push(item.join(","));
                return arr;
            },[]);
            csvRows=csvRows.concat(datas);
        }


        var csvString = csvRows.join('\n');
        var BOM = '\uFEFF';
        csvString = BOM + csvString;

        var a = document.createElement('a');
        a.href = 'data:attachment/csv,' +  encodeURI(csvString);
        a.target = '_blank';
        a.download = 'errorList.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);


    }

    reBackMap(){
        this.setState({secondPage:false});
        this.loadMapData('data-1527045631990-r1dZ0IM1X.json', 'china',0);
    }


    checkEncoding(base64Str){
        //这种方式得到的是一种二进制串
        var str = atob( base64Str.split(";base64,")[1] );
//        console.log(str);
        //要用二进制格式
        var encoding = jschardet.detect( str );
        encoding = encoding.encoding;
//        console.log( encoding );
        if( encoding == "windows-1252"){    //有时会识别错误（如UTF8的中文二字）
            encoding = "ANSI";
        }
        return encoding;
    }


    checkCsvFormater(csvHeader){//比较csv header,现在只要label_name,province,city位置与名称对应即可
        var head=CSV_HEADER;
        if(csvHeader[1]==head[1]&&csvHeader[2]==head[2]&&csvHeader[3]==head[3]){
            return true;
        }
        return false;



    }

    parseCsvFile() {
        this.setState({ isParsing: true });

        var _self = this;
        var data = [];
        var files = document.getElementById("gsd-csv-file").files;
        var regp = new RegExp(".*,\".*,.*\"$");
        if (files.length) {
            var file = files[0]
            var reader = new FileReader(); //new一个FileReader实例
            if (typeof FileReader == 'undefined') {
                alert("你的浏览器暂不支持该功能");
                file.setAttribute("disabled", "disabled");
                return;
            }
            reader.readAsDataURL(file);
            reader.onload = function (evt) {
                var data = evt.target.result;
                var encoding = _self.checkEncoding( data );
                console.log(encoding);
                 PapaParse.parse(file, {
                    encoding: encoding,
                    complete: function(results) {
                        var res = results.data;
                        if( res[ res.length-1 ] == ""){    //去除最后的空行
                            res.pop();
                        }




                        if(res.length>1){
                            if(_self.checkCsvFormater(res[0])){
                                _self.buildChartData(res.slice(1));

                            }else{
                                _self.setState({ isParsing: false });
                                swal({
                                    title: _self.props.intl.formatMessage({id: 'TIP'}),
                                    text: _self.props.intl.formatMessage({id: 'Formater Error'}),
                                    type: 'warning',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: _self.props.intl.formatMessage({id: 'Ok'})
                                }).then((result) => {
                                    document.getElementById("gsd-csv-file").value="";
                                })
                            }

                        }

                    },
                    error: (error)=>{console.log(error); _self.setState({ isParsing: false });}
                });


            }




        }

    }


    handleDialogClose = () => {
        this.setState({ isParsing: false });

    };

    exportImage(){
        // var img = new Image();
        // img.src = this.myChart.getDataURL({
        //     pixelRatio: 2,
        //     backgroundColor: '#2d2d2d'
        // });

        var eleLink = document.createElement('a');

        var timestamp = (new Date()).getTime();
        var fileName=timestamp+".png";
        eleLink.download = fileName;
        eleLink.style.display = 'none';


        eleLink.href = this.myChart.getDataURL({
            pixelRatio: 2,
            backgroundColor: '#2d2d2d'
        });
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);

    }

    toggleToolBar(state){
        this.setState({hideTool:state});
    }

    selectFromDb(){
        this.setState({isOpenSelectDialog:true});
    }



    saveBaseInfo(){
        var title=this.textTitle.value;
        var max=this.maxValue.value;
        var min=this.minValue.value;
        if(min>max){
            swal({
                title: this.props.intl.formatMessage({id: 'TIP'}),
                text: this.props.intl.formatMessage({id: 'Min Value is greater than Max Value'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {
                
            })
            this.setState({isEditingInfo:false});
            return;
        }
        this.rerefreshMap(this.mapDataName,this.mapData,0,this,title,max,min);
        this.setState({isEditingInfo:false,baseInfo:{title:title,max:max,min:min}});
    }

    updateBaseInfo(){
        this.setState({isEditingInfo:true});
    }

    rereshGraph(){
        this.setState({secondPage:false});
        this.mapDataName='';
        this.mapData='';
        this.csvParseProviceData=null;//csv解析后省份数据
        this.csvParseCityData=null;//csv解析后城市数据
        this.csvParseProviceMax=0;
        this.csvParseCityMax=0;
        this.loadMapData('data-1527045631990-r1dZ0IM1X.json', 'china',0);
        document.getElementById("gsd-csv-file").value="";
    }

    setAllData(item){
        var _self=this;
        this.setState({isParsing:false,isOpenSelectDialog:false})
        fetchText("/templates/all_data.json").then(response => {
            console.log(response);
            
            if(!!response){
                // var relArr = response.split("\r\n");
                // var data=[];
                // if(!!relArr && relArr.length > 1) {
                //     for(var key = 1, len = relArr.length; key < len; key++) {
                //         var values = relArr[key];
                //         if(!!values) {
                //             var obj = {};
                //             var objArr = values.split(",");
                //             data.push(objArr);
                //         }
                //     }

                // }
                //console.log(data);

                _self.buildChartData(JSON.parse(response).slice(1),true);
            }

        }).catch(error => {
            _self.setState({isParsing:false})
        })
    }


    render() {
        const {classes} = this.props;
        return (
            <div style={{width:'100%',height:"100%",backgroundColor:"#2d2d2d",position:"fixed",top:0,bottom:0}}>
                <div style={{position:"relative",width:'100%',height:'100%'}}>
                    <div className={this.state.hideTool?"gsd-gis-tool-dialog hideTool":"gsd-gis-tool-dialog"}>

                        <div className="tool-item" onClick={()=>this.updateBaseInfo()}>
                            <div className="toolIcon"><i className="fa fa-info-circle"></i></div>
                            <div><FormattedMessage
                                id="Base Info"/></div>
                        </div>



                        <a target="_blank" href="/templates/gis_template.csv"  className="tool-item" >
                            <div className="toolIcon"><i className="fa fa-file-o"></i></div>
                            <div><FormattedMessage
                                id="Download Template"/></div>
                        </a>

                        <div className="tool-item">
                            <input type="file" id="gsd-csv-file" className="uploadFileInput" accept="csv"
                                   onChange={()=>this.parseCsvFile()}/>
                            <div className="toolIcon"><i className="fa fa-file-excel-o"></i></div>
                            <div><FormattedMessage
                                id="UploadFile"/></div>
                        </div>


                        <div className="tool-item" onClick={()=>this.exportImage()}>
                            <div className="toolIcon"><i className="fa fa-cloud-download"></i></div>
                            <div><FormattedMessage
                                id="DownloadImage"/></div>
                        </div>

                        <div className="tool-item" onClick={()=>this.selectFromDb()}>
                            <div className="toolIcon"><i className="fa fa-database"></i></div>
                            <div><FormattedMessage
                                id="Select From Db"/></div>
                        </div>


                        <div className="tool-item last-tool-item" onClick={()=>this.rereshGraph()}>
                            <div className="toolIcon"><i className="fa fa-refresh"></i></div>
                            <div><FormattedMessage
                                id="Clear Data"/></div>
                        </div>


                        <a id="gsd-gis-tool-close" onClick={()=>this.toggleToolBar(true)}><i
                            className="fa fa-close"></i></a>

                        <a id="gsd-gis-tool-open" onClick={()=>this.toggleToolBar(false)}><i
                            className="fa fa-eye"></i></a>



                    </div>
                    {
                    //     <Tooltip
                    //     title={this.props.intl.formatMessage({id:"CLOSE_WINDOW"})}
                    //     placement="top">
                    //     <a className="full-window-close-btn" onClick={()=>this.closeWindow()}><i
                    //         className="fa fa-close"></i></a>
                    // </Tooltip>
                    }
                    {this.state.secondPage&&<Tooltip
                        title={this.props.intl.formatMessage({id:"Back"})}
                        placement="top">
                        <a onClick={()=>this.reBackMap()} className="map-size-reset-btn"><i
                            className="fa fa-mail-reply-all"></i></a>
                    </Tooltip>}
                    <div id="gsd-gsi-map" style={{width:'100%',height:"100%"}}></div>
                </div>
                <Dialog
                    disableBackdropClick={true}
                    onClose={()=>this.handleDialogClose()}
                    open={this.state.isParsing}

                >

                    <div style={{padding:"40px",textAlign:"center"}}><CircularProgress color="secondary"/></div>

                </Dialog>

                <FullScreenDatabaseSelector setAllData={(item)=>this.setAllData(item)} handleClose={()=>this.setState({isOpenSelectDialog:false})} open={this.state.isOpenSelectDialog}/>

                <Dialog
                    onClose={()=>this.handleDialogClose()}
                    open={this.state.downLoadDialog}

                >

                    <div style={{padding:"40px",textAlign:"center"}}>

                        <List component="nav">
                            <ListItem button>
                               <a>下载清单模板</a>
                            </ListItem>
                            <ListItem button>
                                <a>下载统计模板</a>
                            </ListItem>
                        </List>

                    </div>

                </Dialog>



                <Dialog
                    onClose={()=>this.setState({isEditingInfo:false})}
                    open={this.state.isEditingInfo}

                >

                    <div style={{padding:"20px",textAlign:"center"}}>

                        <h4 style={{textAlign:"left"}}><FormattedMessage id="Base Info"/></h4>

                        <div style={{minWidth:'230px'}}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="graph_title"
                                defaultValue={this.state.baseInfo.title}
                                inputRef={ref=>this.textTitle=ref}
                                label={<FormattedMessage id="TITLE"/>}
                                type="text"
                                fullWidth
                            />
                            <TextField
                            autoFocus
                            margin="dense"
                            defaultValue={this.state.baseInfo.min}
                            id="graph_min_value"
                            inputRef={ref=>this.minValue=ref}
                            label={<FormattedMessage id="Min Value"/>}
                            type="number"
                            fullWidth
                            />

                            <TextField
                                autoFocus
                                margin="dense"
                                id="graph_max_value"
                                defaultValue={this.state.baseInfo.max}
                                inputRef={ref=>this.maxValue=ref}
                                label={<FormattedMessage id="Max Value"/>}
                                type="number"
                                fullWidth
                            />



                            <div>
                                <div style={{pading:'0.8rem',textAlign:'right',marginTop:'20px'}} className="drawerAction">
                                    <Button onClick={()=>this.saveBaseInfo()} style={{marginRight:"15px"}} variant="contained"
                                            color="primary" className={classes.okBtn}>
                                        <FormattedMessage id="Ok"/>
                                    </Button>

                                    <Button variant="outlined" color="primary" onClick={()=>{this.setState({isEditingInfo:false})}}
                                            className={classes.cancelBtn}>
                                        <FormattedMessage id="CANCEL"/>
                                    </Button>

                                </div>

                            </div>

                            </div>


                    </div>

                </Dialog>
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
       

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(GISMap)))
