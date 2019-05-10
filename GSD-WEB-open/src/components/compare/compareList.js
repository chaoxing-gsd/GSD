import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router';
import {browserHistory} from 'react-router'
import {getGroupContainTags, getSearchResult, setToolMode} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {Breadcrumb} from 'antd';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {Tooltip, Checkbox} from 'antd';
import {INNER_SERVER_URL} from  "../../config/constants";
import swal from 'sweetalert2'
import {fetchUrl} from '../../actions/fetchData';
import {withStyles} from '@material-ui/core/styles';
import {Grid, Row, Col} from 'react-bootstrap'
import Button from '@material-ui/core/Button';
import {Glyphicon} from 'react-bootstrap';
import {getResourceLink,getUserLanguageTag} from "../../utils/utils"
import ChooseFiledsDialog from "../result/chooseFiledsDialog"
import OrderField from "../plugins/orderField"
import {Dropdown, Menu} from 'antd';


const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        marginTop: "0px"
    },
    buttonList: {
        display: "inline-block",
        color: "#a09d9d",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        borderRight: "0px",
        minWidth: '45px',
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
    },
    buttonListSelected: {
        display: "inline-block",
        color: "#ffffff",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        borderRight: "0px",
        minWidth: '45px',
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        backgroundColor: "#a09d9d",
        boxShadow: "inset -1px 0px 10px #7b7676",
        '&:hover': {
            backgroundColor: "#b9b3b3",
            boxShadow: "inset -1px 0px 10px # 504e4e"
        },

    },
    buttonTable: {
        display: "inline-block",
        color: "#a09d9d",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        borderTopLeftRadius: "0px",
        borderBottomLeftRadius: "0px",
        minWidth: '45px'
    },
    buttonTableSelected: {
        display: "inline-block",
        color: "#ffffff",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        borderTopLeftRadius: "0px",
        borderBottomLeftRadius: "0px",
        minWidth: '45px',
        backgroundColor: "#a09d9d",
        boxShadow: "inset -1px 0px 10px #7b7676",
        '&:hover': {
            backgroundColor: "#b9b3b3",
            boxShadow: "inset -1px 0px 10px # 504e4e"
        },
    },
    buttonRemove: {
        marginLeft: "15px",
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
    buttonEdit: {

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
        color: "#a09d9d",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        minWidth: '45px',
        '&:disabled': {
            backgroundColor: "rgba(0, 0, 0, 0.12)",
            // color:"#ffffff"

        },
    },
    badge: {
        backgroundColor: "#d45f5f"
    },
    badgeHide: {
        display: "none"
    }
});

class CompareList extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            filterData: {},
            dataList: [],
            selectedRowKeys: [],
            mode: 'table',
            orderActivityKey:{},
            filedSetting: {},
            selectedFileds: [],
            dropDownVisible: false
        };

    }


    getCompareDataList = async(userId, labelId = this.props.tagId, header)=> {
        //var labelId=this.props.tagId;
        if (!!labelId) {
            try {
                var response = await fetchUrl(INNER_SERVER_URL + `/queryDetails?labelid=` + labelId, "get", null, header);
                if (!!response) {
                    if (!!response.statu) {
                        console.log(response);
                        this.setState({
                            dataList: response.data.data,
                            filedSetting: response.data.showsetting,

                        });
                        var filedSetting = response.data.showsetting;
                        if (!!filedSetting && !!filedSetting.filedsnamecn&&!!filedSetting.filedids) {
                            var fieldsArr=filedSetting.filedids.split("|");
                            var fields = filedSetting.filedsnamecn.split("|").map((item, index)=> {

                                var arr = item.split(",");

                                return {chname: arr[0],filed:fieldsArr[index], enname: arr[1], percent: arr[2], show: arr[3]};

                            });
                            this.setState({selectedFileds: fields});
                            //this.setSelectedFileds(fields);
                        } else {

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
                    this.setState({
                        dataList: [],
                        filedSetting: {},
                        selectedFileds: []

                    });
                }
            } catch (e) {
                console.log(e);
                this.setState({
                    dataList: [],
                    filedSetting: {},
                    selectedFileds: []

                });
            }


        }

    }


    updateCompareTags = async(userId, labelId = this.props.tagId, header, filedSetting)=> {
        console.log("updateCompareTags");
        let formdata = new FormData();
        formdata.append("labelid", labelId);
        formdata.append("filedsnamecn", filedSetting.filedsnamecn);
        formdata.append("filedids", filedSetting.filedids);
        //var labelId=this.props.tagId;
        if (!!labelId) {
            var response = await fetchUrl(INNER_SERVER_URL + `/updateLabelShowSetting`, "post", formdata, header);
            if (!!response) {
                if (!!response.statu) {

                }

            }
        }

    }


    setSelectedFileds(fileds, filedSetting) {

        this.setState({selectedFileds: fileds, filedSetting: filedSetting});
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
            this.updateCompareTags(this.cxId, this.props.tagId, header, filedSetting);

        }

    }


    componentDidMount() {
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
            this.getCompareDataList(this.cxId, this.props.tagId, header);

        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userInfos.responseUserInfo.userid != "" && nextProps.tagId != this.props.tagId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: nextProps.userInfos.responseUserInfo.token};
            this.getCompareDataList(this.cxId, nextProps.tagId, header);
        }

    }

    removeDataComfirmed = async(selectedIndexs)=> {
        this.cxId = this.props.userInfos.responseUserInfo.userid;
        var header = {
            userid: this.cxId,
            token: this.props.userInfos.responseUserInfo.token,
            "Content-Type": "application/json"
        };
        var infos = selectedIndexs.map(item=> {

            let formdata = {};
            formdata["labelid"] = this.props.tagId;
            formdata["literatureid"] = item;
            return formdata;

        })
        var response = await fetchUrl(INNER_SERVER_URL + `/deleteDetails `, "delete", JSON.stringify(infos), header);
        if (!!response) {
            if (!!response.statu) {
                var dataList = this.state.dataList;
                dataList = dataList.filter(aitem=>selectedIndexs.findIndex(bitem=>bitem == aitem.literatureid) == -1);
                this.setState({dataList: dataList, selectedRowKeys: []})


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

        }

    }


    removeDatas = async()=> {
        var _self = this;
        var selectedIndexs = this.state.selectedRowKeys || [];
        if (selectedIndexs.length > 0) {
            swal({
                title: this.props.intl.formatMessage({id: 'TIP'}),
                text: this.props.intl.formatMessage({id: 'CONFIRM OPERATION'}),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'}),
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {
                if (result) {
                    _self.removeDataComfirmed(selectedIndexs);
                }
            })


        }

    }


    removeTags() {

    }

    selectAll(e) {
        if (e.target.checked) {
            var selectedIndexs = this.state.dataList.map(item=>item.literatureid);
            this.setState({selectedRowKeys: selectedIndexs})
        } else {
            this.setState({selectedRowKeys: []})

        }
    }

    setSelectedItem(e, item) {
        if (e.target.checked) {
            var selectedIndexs = this.state.selectedRowKeys || [];
            selectedIndexs.push(item.literatureid);
            this.setState({selectedRowKeys: selectedIndexs})
        } else {
            var selectedIndexs = this.state.selectedRowKeys || [];
            var filterDatas = selectedIndexs.filter(sitem=>sitem != item.literatureid);
            this.setState({selectedRowKeys: filterDatas})

        }
    }

    toCompareTags() {
        swal({
            title: this.props.intl.formatMessage({id: 'TIP'}),
            text: "文献对比功能开发中...",
            type: 'info',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
        });
    }

    renderToolBar() {
        const {classes} = this.props;
        return <div className="clearfix">

            <Button onClick={()=>this.removeDatas()} disabled={this.state.selectedRowKeys.length==0} variant="contained"
                    className={classes.buttonRemove} size="small"><Glyphicon glyph="trash"
                                                                             style={{fontSize:'1rem'}}/>&nbsp;
                <FormattedMessage
                    id="DELETE"/></Button>


            {
                // <Dropdown overlay={this.renderDropFieldMenu(hideComArrs)}
                //           onVisibleChange={(flag)=>this.setState({dropDownVisible:flag})}
                //           visible={this.state.dropDownVisible}
                // >
                //
                //
                //     <Button onClick={()=>this.removeDatas()}
                //             className={classes.buttonConfig} size="small"><i
                //         className="glyphicon glyphicon-triangle-bottom"
                //         style={{fontSize:'1rem'}}/>&nbsp;<FormattedMessage
                //         id="Switch Fields"/></Button>
                //
                // </Dropdown>
            }

            <div className="btn-group" style={{float:"right"}}>

                <Tooltip title={<FormattedMessage id="List_Mode"/>} placement="bottom">
                    <Button variant="outlined" size="small" onClick={()=>this.setState({mode:"list"})}
                            className={this.state.mode=="list"?classes.buttonListSelected:classes.buttonList}>
                        <i className="glyphicon glyphicon-th-list"></i>
                    </Button></Tooltip>
                <Tooltip title={<FormattedMessage id="Table_Mode"/>} placement="bottom"><Button
                    onClick={()=>this.setState({mode:"table"})} variant="outlined" size="small"
                    className={this.state.mode=="table"?classes.buttonTableSelected:classes.buttonTable}>
                    <i className="glyphicon glyphicon-th-large"></i>
                </Button></Tooltip>
            </div>

        </div>

    }

    renderDropFieldMenu(hideComArrs) {
        const menu = (
            <Menu>
                {hideComArrs}
            </Menu>
        );
        return menu;
    }

    handleFieldClick(item, checked, showLength) {
        this.setState({dropDownVisible: false});
        var isFirst = true;
        var selectedFileds = this.state.selectedFileds.map((sitem, index)=> {
            if (showLength >= 5 && checked && isFirst && sitem.show == 1) {
                sitem.show = 0;
                isFirst = false;
            }

            if (sitem.filed === item.filed) {
                if (checked) {
                    sitem.show = 1;
                } else {
                    sitem.show = 0;
                }

            }
            return sitem;
        })

        this.setState({selectedFileds: selectedFileds});

    }

    renderHeader(showComArrs) {
        var activityKey="gsd-lib"==this.state.orderActivityKey.id?this.state.orderActivityKey.key:"-1";
        if (!!this.state.selectedFileds && this.state.selectedFileds.length > 0) {
            return <div className="row">
                <div className="col-lg-1"><Checkbox className="gsd-check" onChange={(e)=>this.selectAll(e)}/></div>
                {showComArrs}
                <div className="col-lg-1"><OrderField activityOrderType={activityKey}  handleOrderChange={(type)=>this.orderField(type,"gsd-lib")}> <FormattedMessage id="DATA_SOURCE"/></OrderField>
                </div>


            </div>
        }
    }


    renderTableItems(dataItem, libId, type) {
        if (!!this.state.selectedFileds && this.state.selectedFileds.length > 0) {
            var comArr = this.state.selectedFileds.reduce((arr, item, index)=> {
                var isTitle = false;
                var imgUrl = null;
                if (item.filed === 'basic_title' || item.filed === 'title' || item.filed === 'person_name') {
                    isTitle = true;
                    var link = getResourceLink(libId, dataItem.basic_title_url || dataItem.basic_link_url || dataItem.person_id || dataItem.primary_id, type, dataItem.url);
                }
                if (item.filed === 'basic_cover_url') {
                    imgUrl = !!dataItem.basic_cover_url ? dataItem.basic_cover_url.indexOf("/images") == 0 ? null : dataItem.basic_cover_url : null;
                }

                if (item.show == 1 && arr.length < 5) {
                    var itemData=!!dataItem[item.filed]?dataItem[item.filed]:'--';
                    arr.push(<div key={index} className="col-lg-2">
                        <div className="table-item">{isTitle ?
                            <a href={link} target="_blank">{itemData}</a> : (!!imgUrl ?
                            <img style={{"width":"100%"}} src={imgUrl}/> : itemData)}</div>
                    </div>);

                }
                return arr;
            }, [])
            console.log(comArr);
            return comArr;
        }
    }

    toUnicode(theString) {
        var unicodeString = '';
        for (var i = 0; i < theString.length; i++) {
            var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
            while (theUnicode.length < 4) {
                theUnicode = '0' + theUnicode;
            }
            theUnicode = '\\u' + theUnicode;
            unicodeString += theUnicode;
        }
        return unicodeString;
    }


    orderField(type, field) {
        console.log(field);
        this.setState({orderActivityKey:{id:field,key:type}});
       
        var factor=type==1?1:-1;
        var dataList = this.state.dataList;
        if (!!dataList && dataList.length > 0) {
            console.log(dataList);
            dataList.sort((v1, v2)=> {
                try {
                    var value1,value2;
                    if(field=='gsd-lib'){//数据库比较
                        value1 = this.toUnicode(v1.indexname);
                        value2 = this.toUnicode(v2.indexname);

                    }else{
                        var json1 = JSON.parse(v1.jsonbody);
                        var json2 = JSON.parse(v2.jsonbody);
                        value1 = !!json1[field]?this.toUnicode(json1[field]):"-";
                        value2 = !!json2[field]?this.toUnicode(json2[field]):"-";
                    }

                    if (!!value1 && !!value2) {
                        if (value1 < value2) {
                            return 1*factor;
                        } else if (value1 > value2) {
                            return -1*factor;
                        } else {
                            return 0;
                        }
                    } else if (!!value1) {
                        return -1*factor;
                    } else {
                        return 0;
                    }


                } catch (e) {
                    return 0;
                }

            });
            console.log(dataList);
            this.setState({dataList});
        }
    }

    renderTableItem() {

        const {classes} =this.props;
        var dataList = this.state.dataList;
        if (!!dataList && dataList.length > 0) {
            var showComArrs = [];
            var hideComArrs = [];
            var langualgeTag=getUserLanguageTag();

            if (!!this.state.selectedFileds && this.state.selectedFileds.length > 0) {


                this.state.selectedFileds.forEach((item, index)=> {
                    var filedName=langualgeTag=='zh'?item.chname:item.enname;
                    if (item.show == 1 && showComArrs.length < 5) {
                        var activityKey=item.filed==this.state.orderActivityKey.id?this.state.orderActivityKey.key:"-1";
                        showComArrs.push(<div key={index} className="col-lg-2"><OrderField  activityOrderType={activityKey}
                            handleOrderChange={(type)=>this.orderField(type,item.filed)}> {filedName}</OrderField>
                        </div>);
                        // hideComArrs.push(<Menu.Item key={index}
                        //                             onClick={()=>this.handleFieldClick(item,false,showComArrs.length)}>{item.chname}
                        //     <small>&nbsp;<i className="fa fa-check" style={{color:"#F44336"}}></i></small>
                        // </Menu.Item>);
                    } else {
                        // hideComArrs.push(<Menu.Item key={index}
                        //                             onClick={()=>this.handleFieldClick(item,true,showComArrs.length)}>{item.chname}</Menu.Item>);
                    }

                })
            }
            return <div className={classes.rootPage}
                        elevation={1}>
                {this.renderToolBar()}

                <List component="nav">
                    <ListItem >
                        <ListItemText primary={
                    this.renderHeader(showComArrs)
                    }/>
                    </ListItem>
                    { dataList.reduce((arr, sitem, index)=> {


                        console.log(sitem);
                        try {
                            var item = JSON.parse(sitem.jsonbody);


                            var libId = sitem.indexname;
                            var type = sitem.type;


                            var isChecked = this.state.selectedRowKeys.findIndex(aitem=>aitem == sitem.literatureid) >= 0;
                            console.log(isChecked);
                            arr.push(
                                <div
                                    key={`list_${index}`}>
                                    <Divider light/>
                                    <ListItem >
                                        <ListItemText primary={
                                  <Row>
                                  <div className="col-lg-1"><Checkbox checked={isChecked} onChange={(e)=>this.setSelectedItem(e,sitem)} className="gsd-check"/></div>

                                  {
                                  this.renderTableItems(item,libId,type)
                                  }
{
// <div className="col-lg-2"><a href={link} target="_blank">{title}</a></div>
// <div className="col-lg-2">{author}</div>
//  <div className="col-lg-2">{year}</div>
//   <div className="col-lg-2">{publisher}</div>
//     <div className="col-lg-2">{sourceName}</div>
    }
        <div className="col-lg-1">{this.props.intl.formatMessage({id: libId})}</div>
                                </Row>
                                }/>

                                    </ListItem></div>);
                        } catch (e) {

                        }
                        return arr;

                    }, [])
                    }

                    <Divider light/>


                </List>

            </div>


        }


    }


    renderListItem() {

        const {classes} =this.props;
        var dataList = this.state.dataList;
        if (!!dataList && dataList.length > 0) {

            return <div className={classes.rootPage}
                        elevation={1}>
                {this.renderToolBar()}

                <List component="nav">

                    { dataList.reduce((arr, sitem, index)=> {
                        try {

                            var item = JSON.parse(sitem.jsonbody);
                            var title = item.basic_title || (item.title || "").replace(/<\/?.+?>/g, "") || item.person_name;
                            var author = item.basic_creator || item.edition || item.jiguan || item.author;
                            var year = item.basic_date_time || item.dynasty || item.year;
                            var description = !!(item.basic_description || item.digest) ? ((item.basic_description || item.digest).length > 100 ? ((item.basic_description || item.digest).substring(0, 100) + "...") : (item.basic_description || item.digest)) : "";
                            if (!description) {
                                description = "";
                                description += !!item.author ? (item.author + "") : "";
                                description += !!item.collection ? (item.collection + "") : "";
                                description += !!item.notes ? (item.notes + "") : "";
                                description += !!item.edtion ? (item.edtion + "") : "";
                            }
                            if (!description) {
                                description = "";
                                description += !!item.gender ? (item.gender + " ") : "";
                                description += !!item.born_year ? this.props.intl.formatMessage({id: 'Born Year'}) + item.born_year : "";
                                description += !!item.died_year ? "  " + this.props.intl.formatMessage({id: 'Died Year'}) + item.died_year : "";

                            }
                            var libId = sitem.indexname;
                            var type = sitem.type;
                            var link = getResourceLink(libId, item.basic_title_url || item.basic_link_url || item.person_id || item.primary_id, type, item.url);
                            var indexId = (item.proc_dxid || item.documentId || item.primary_id || item.person_id || item.webpageId);
                            var imgUrl = !!item.basic_cover_url ? item.basic_cover_url.indexOf("/images") == 0 ? null : item.basic_cover_url : null;
                            var isChecked = this.state.selectedRowKeys.findIndex(aitem=>aitem == sitem.literatureid) >= 0;
                            arr.push(
                                <div
                                    key={`list_${index}`}>
                                    <Divider light/>
                                    <ListItem >
                                        <ListItemText primary={
                                  <Row>
                                   <div className="col-lg-1"><Checkbox checked={isChecked} onChange={(e)=>this.setSelectedItem(e,sitem)} className="gsd-check"/></div>
     {!!imgUrl&&<Col xs={2} sm={2} md={2}>
                                  {!!imgUrl&&<img style={{"width":"100%"}} src={imgUrl}/>}

</Col>}
<Col xs={!!imgUrl?8:11} sm={!!imgUrl?8:11} md={!!imgUrl?8:11} style={{minHeight:'100px'}}>
<div className=""><a href={link} target="_blank">{title}</a>&nbsp;<span className="link-desc">{author} {year}</span></div>
 <div className="content-desc">{description}</div>
 </Col>
                                </Row>
                                }/>

                                    </ListItem></div>);
                        } catch (e) {

                        }
                        return arr;
                    }, [])
                    }

                    <Divider light/>


                </List>

            </div>


        }


    }


    render() {

        const {classes} =this.props;
        //var dataList = this.state.dataList;


        return (
            <div>


                {this.props.tagId && <ChooseFiledsDialog filedSetting={this.state.filedSetting}
                                                         setSelectedFileds={(fields,setting)=>this.setSelectedFileds(fields,setting)}
                                                         closeDialog={()=>{this.setState({openFiledsDialog:false})}}/>}
                {
                    // <Dialog onClose={()=>{this.setState({openFiledsDialog:false});}} open={this.state.openFiledsDialog}
                    //         disableBackdropClick={true} disableEscapeKeyDown={true}>
                    //     <div style={{padding:'15px',minWidth:'300px'}}>
                    //         <ChooseFiledsDialog filedSetting={this.state.filedSetting}
                    //                             setSelectedFileds={(fields)=>this.setSelectedFileds(fields)}
                    //                             closeDialog={()=>{this.setState({openFiledsDialog:false})}}/>
                    //     </div>
                    // </Dialog>
                }


                <Row>
                    <Col >
                        <div>


                        </div>


                        {this.props.tagId && <div className={classes.root} elevation={1}>
                            {this.state.mode == 'list' && this.renderListItem()}
                            {this.state.mode == 'table' && this.renderTableItem()}
                        </div>
                        }


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
        personality: state.personality
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {}
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(CompareList)));
