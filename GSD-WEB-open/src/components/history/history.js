/**
 * Created by Aaron on 2018/7/22.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router';
import {Grid, Row, Col, Modal, Panel} from 'react-bootstrap';
import {browserHistory} from 'react-router'
import {getHistoryData, deleteSearchHistory} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {PreImage} from '../plugins'
import {Breadcrumb} from 'antd';
import ResultList from '../result/ResultList'
import FilterComp from "../result/filter"
import Paper from '@material-ui/core/Paper';
import Header from '../result/Header'
import {Timeline, Tag, Popover,Badge} from 'antd';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
const { CheckableTag } = Tag;
import swal from 'sweetalert2'
import {INNER_SERVER_URL} from  "../../config/constants";
import {fetchUrl} from '../../actions/fetchData';
import {getUserLanguageTag} from '../../utils/utils';
const styles = theme => ({
    rootPage: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        width: '100%',
        marginTop:'30px'
    },
    exportBtn: {
        color: "#ffffff",
        backgroundColor: "#2196F3",
        border: "none",
        fontSize: '12px',
        padding: "0.4rem 1rem",
        '&:hover': {
            backgroundColor: "#459ee4",
            color: "#ffffff",
        },
        '&:disabled': {
            backgroundColor: "#cccccc",
            color: "#ffffff",
        },
    },
    recordBtn: {
        color: "#ffffff",
        border: "none",
        backgroundColor: "#d45f5f",
        fontSize: '12px',
        padding: "0.4rem 1rem",
        '&:hover': {
            backgroundColor: "#ad2f2f",
            color: "#ffffff",
        },
        '&:disabled': {
            backgroundColor: "#cccccc",
            color: "#ffffff",
        },
    },
    cancelBtn:{
        color: "#868686",
        backgroundColor: "#ffffff",
        fontSize: '12px',
        padding: "0.4rem 1rem",
        '&:disabled': {
            backgroundColor: "#cccccc",
            color: "#ffffff",
        },
    },
});

const CSV_HEADER= {zh:['数据库','资源标题','关键词','资源链接','时间'],en:['database','title','searchword','url','time']};

class HistoryList extends Component {
    static propTypes = {
        intl: intlShape.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {selectedItem: [],editMode:false};
        this.cxId;

    }


    componentDidMount() {

        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header={userid:this.cxId,token:this.props.userInfos.responseUserInfo.token};
            this.props.getHistoryData(this.cxId,header);
        }
    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.userInfos.responseUserInfo.userid!=""&&nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header={userid:this.cxId,token:nextProps.userInfos.responseUserInfo.token};
            this.props.getHistoryData(this.cxId,header);
        }
    }



    renderOperation() {
        const {classes}=this.props;
        const enabled=this.state.selectedItem.length>0;
        return <div style={{margin:"5px 0 25px 0px"}}>
            { !this.state.editMode&&<Button style={{marginRight:"10px"}} onClick={()=>this.setState({editMode:true})} variant="outlined"
                      className={classes.recordBtn}
                      size="small" target="_blank">
                <FormattedMessage id="Manage"/>
            </Button>
            }

            { this.state.editMode&&<Button style={{marginRight:"10px"}} onClick={()=>this.setState({editMode:false,selectedItem:[]})} variant="outlined"
                                            className={classes.cancelBtn}
                                            size="small" target="_blank">
                <FormattedMessage id="Cancel Manage"/>
            </Button>
            }


            { this.state.editMode&&<Button disabled={!enabled} style={{marginRight:"10px"}} onClick={()=>this.deleteHistory()} variant="outlined"
                                            className={classes.recordBtn}
                                            size="small" target="_blank">
                <FormattedMessage id="DELETE"/>
            </Button>
            }

            { this.state.editMode&&<Button  disabled={!enabled}  style={{marginRight:"10px"}} onClick={()=>this.exportHitorys()} variant="outlined"
                                            className={classes.exportBtn}
                                            size="small" target="_blank">
                <FormattedMessage id="EXPORT"/>
            </Button>
            }

            {

        //     <Button disabled={!enabled} className={classes.historyBtn} size="small" variant="outlined"
        //                                                  compoment={!enabled?"button":"a"}
        //                                                       href={!enabled?null:`/search?searchValue=${this.state.selectedItem.split("_")[1]}`}
        //                                                  target="_blank">
        //     <FormattedMessage id="Search"/>
        // </Button>

            }

            {
            //     <Button style={{marginLeft:"10px"}} variant="outlined" disabled={!enabled} className={classes.recordBtn}
            //          size="small"
            //          href={!enabled?null:`/analyse?searchValue=${this.state.selectedItem.split("_")[1]}`}
            //          compoment={!enabled?"button":"a"} target="_blank">
            //     <FormattedMessage id="View Records"/>
            // </Button>
            }
            <span style={{fontSize:'12px',marginLeft:'10px'}}><FormattedMessage id="History Word Count"/></span>

        </div>

    }

    removeSearchHistory(sItem) {
        this.props.deleteSearchHistory(this.cxId, sItem);
    }


    exportHitorys=async()=>{

        var userId = this.props.userInfos.responseUserInfo.userid;
        var header={userid:this.cxId,token:this.props.userInfos.responseUserInfo.token};

        //csv头部
        var csvRows=[];
        var languageTag=getUserLanguageTag();
        var head = CSV_HEADER[languageTag];
        console.log(head);
        csvRows.push(head.join(","));


        var dataList={};
        for(var i=0;i< this.state.selectedItem.length;i++){
            var item=this.state.selectedItem[i];
            var array=item.split("_");
            let formdata = new FormData();
            formdata.append("userid",userId);
            formdata.append("content",array[1]);
            if(!!dataList[array[1]])continue;
            var response=await fetchUrl(INNER_SERVER_URL+"getsearchrecordbycontent" , "post",formdata,header);
            if (!!response&&response.statu) {
                dataList[array[1]]=Object.keys(response.data).reduce((sarr,item,sindex)=>{
                    sarr=sarr.concat(response.data[item].map(sitem=>{
                        var sDatas= Object.keys(sitem).map((ssitem,ssindex)=>{
                            if(ssindex==0){

                               return this.props.intl.formatMessage({id: sitem[ssitem]})
                            }
                            return !!sitem[ssitem]?sitem[ssitem].replace(/,/g, ' '):"";
                        });
                        console.log(sDatas);
                        sDatas.push(item);
                        console.log(sDatas);
                        return sDatas.join(",")
                    }));
                    return sarr;
                },[])


            } else {

            }
        }
        console.log(dataList);

        if (!!dataList && Object.keys(dataList).length > 0) {
            var results=Object.keys(dataList).reduce((arr,key,index)=>{
                var datas=dataList[key];
                arr=arr.concat(datas);

                return arr;
            },[]);
            console.log(results);
            csvRows=csvRows.concat(results);
        }

        console.log(csvRows);

        var csvString = csvRows.join('\n');
        var BOM = '\uFEFF';
        csvString = BOM + csvString;

        var a = document.createElement('a');
        a.href = 'data:attachment/csv,' +  encodeURI(csvString);
        a.target = '_blank';
        a.download = 'GSD搜索历史.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);


        // var textObj={};
        // this.state.selectedItem.forEach(item=>{
        //     var array=item.split("_");
        //     var list=textObj[array[0]]||[];
        //     list.push(array[1]);
        //     textObj[array[0]]=list;
        // });
        //
        // console.log(textObj);
        // var arrays=Object.keys(textObj).reduce((arr,key)=>{
        //     var list=textObj[key];
        //     if(!!list&&list.length>0){
        //         arr.push(key+":"+list.join(","));
        //     }
        //     return arr;
        // },[]);
        //
        // var eleLink = document.createElement('a');
        //
        // var timestamp = (new Date()).getTime();
        // var fileName=timestamp+".txt"
        // eleLink.download = fileName;
        // eleLink.style.display = 'none';
        // // 字符内容转变成blob地址
        // var blob = new Blob([arrays.join("\r\n")]);
        // eleLink.href = URL.createObjectURL(blob);
        // // 触发点击
        // document.body.appendChild(eleLink);
        // eleLink.click();
        // // 然后移除
        // document.body.removeChild(eleLink);
    }

    deleteHistory(){
        swal({
            title: this.props.intl.formatMessage({id: 'CONFIRM OPERATION'}),
            type: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'}),
            cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'})
        }).then((result) => {
            if(result.value){
                if (!!this.props.userInfos.responseUserInfo.userid) {
                    this.cxId = this.props.userInfos.responseUserInfo.userid;
                    var header={userid:this.cxId,token:this.props.userInfos.responseUserInfo.token};
                    this.state.selectedItem.forEach(item=>{
                        if(!!item){
                            var array=item.split("_");
                            var datetimetype=-1;
                            if(array[0]==='过去24h'){
                                datetimetype=0;
                            }
                            if(array[0]==='过去一周'){
                                datetimetype=1;
                            }
                            if(array[0]==='过去一个月'){
                                datetimetype=2;
                            }
                            if(array[0]==='更多'){
                                datetimetype=3;
                            }

                            this.props.deleteSearchHistory(this.cxId, array[1],datetimetype,header);
                        }

                    });

                }
            }
        })


    }

    handleTagChange(checked,item,sitem){
        if(this.state.editMode){
            if(checked){
                var selectedItem=this.state.selectedItem;
                selectedItem.push(item+"_"+sitem);
                this.setState({selectedItem:selectedItem})
            }else{
                var selectedItem=this.state.selectedItem;
                selectedItem=selectedItem.filter(aitem=>aitem!=(item+"_"+sitem));
                this.setState({selectedItem:selectedItem})
            }
        }else{
            browserHistory.push(`/analyse?searchValue=`+sitem);
        }


    }



    render() {

        const type = this.props.location.query.type;
        console.log(this.props.historyData.historyList);
        const {classes}=this.props;
        const timeKeys = Object.keys(this.props.historyData.historyList) || [];
        return (
            <div>




                    <Row>
                        <Col className="left-bar" sm={12} md={12} lg={12}>

                            <Paper elevation={1} className={classes.rootPage}>
                                <h4 style={{margin:"10px 0 30px 0"}}><FormattedMessage id="Search History"/></h4>
                                <div> {this.renderOperation()}
                                </div>

                                <Timeline>
                                    {!!timeKeys&&timeKeys.length>0&&timeKeys.map(item=> {
                                       // var keyWordsArr = this.props.historyData.historyList[item];
                                        var keyWordsArr = Object.keys(this.props.historyData.historyList[item]);

                                        return <Timeline.Item key={item} color="green"><p>{item}</p>
                                            {keyWordsArr.length > 0 && keyWordsArr.map(sitem=> {

                                               var value=this.props.historyData.historyList[item][sitem];
                                                var checked=this.state.selectedItem.findIndex(aitem=>aitem==item+"_"+sitem)>=0;
                                                return <CheckableTag className="historyTag"  checked={checked} key={item+"_"+sitem} onChange={(checked)=>this.handleTagChange(checked,item,sitem)} style={{margin:'5px 8px', borderColor:this.state.editMode?"#ec9b95":""}}
                                                            afterClose={() => this.removeSearchHistory(sitem.contentid)}>
                                                    <span className="historyTagItem">{sitem}</span><span className="num">({value})</span>
                                                </CheckableTag>
                                            })}
                                            {keyWordsArr.length == 0 && <span style={{color:"#b9b9b9"}}>无</span>}


                                        </Timeline.Item>
                                    })}
                                </Timeline>

                            </Paper>

                        </Col>

                    </Row>
                


            </div>

        )
    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,

        historyData: state.historyData
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getHistoryData: (userId,header)=>dispatch(getHistoryData(userId,header)),
        deleteSearchHistory: (userId, searchId,dateTimeType,header)=>dispatch(deleteSearchHistory(userId, searchId,dateTimeType,header))


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(injectIntl(HistoryList)));
