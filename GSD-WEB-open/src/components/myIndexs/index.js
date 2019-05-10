import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import {Glyphicon} from 'react-bootstrap';
import {Breadcrumb} from 'antd';
import CompareTags  from "../result/compareTags"
import {getMyIndexsData, deleteMyIndexsData, downloadFiles} from "../../actions"
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {browserHistory} from 'react-router'
import {Menu} from 'antd';
import {INNER_SERVER_URL} from  "../../config/constants";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import swal from 'sweetalert2'
import {Pagination} from 'antd';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {Tooltip, Checkbox} from 'antd';
import {fetchUrl} from '../../actions/fetchData';
import NoData from "../NoData"
import Dialog from '@material-ui/core/Dialog';
import Badge from '@material-ui/core/Badge';
import DownloadTagDialog from "./downloadTagsDialog";
import FilterDropDown from "../result/filterDropDown";
import ReactDOM from 'react-dom'

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        marginTop: "30px"
    },
    buttonRemove: {
        marginLeft: "15px",
        display: 'inline-block',
        textAlign: 'center',
        fontSize: '12px',
        minWidth: '45px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#b53737"
        },
        '&:disabled': {
            color: "#ffffff",
            backgroundColor: "#d8d5d5",

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
        color: "#989696",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        minWidth: '45px',
        marginLeft: "15px"
    },
    buttonConfig1: {
        display: "inline-block",
        color: "#a09d9d",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        minWidth: '45px',
        marginLeft: "15px"
    },
    badge: {
        backgroundColor: "#d45f5f"
    },
    badgeHide: {
        display: "none"
    },
    buttonOk: {
        backgroundColor: "#d45f5f",
        textAlign: "center",
        display: "inline-block",
        fontSize: '12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#b93939"
        },
        color: "#ffffff",
    },
    buttonOk1: {
        backgroundColor: "#03A9F4",
        textAlign: "center",
        display: "inline-block",
        fontSize: '12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#36b5ef"
        },
        color: "#ffffff",
    },
});

const orderOptions = [
    {
        value: "0", label: <FormattedMessage
        id="Order by"
    />
    },
    {
        value: "1", label: <FormattedMessage
        id="Time Desc"
    />
    },
    {
        value: "2", label: <FormattedMessage
        id="Time Asc"
    />
    },

];


const dowloadTypeOptions = [
    {value: "1", label: "RIS"},
    {value: "2", label: "BIB"},
];
const TEXT_TOOL_MENUS = [
    {id: 'menu-txt-06', name: 'WORD_CLOUD', href: 'wordCloud'},
    {id: 'menu-txt-07', name: 'N-gram', href: 'ngRam'},
    {id: 'menu-txt-01', name: 'Text_Similar', href: 'similarText'},
    {id: 'menu-txt-02', name: 'Thesaurus Words', href: 'similarWord'},
    {id: 'menu-txt-03', name: 'KeyWords Picker', href: 'keyWords'},
    {id: 'menu-txt-04', name: 'Part of speech', href: 'wordTag'},
    // {id:'menu-txt-05',name:'Reg Text',href:'#'},


];

class MyIndexs extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.fullPage=false;
        this.state = {
            fullPage: false,
            selectedRowKeys: [],
            selectedTagId:"",
            indexList: [],
            currentPage: 1,
            selectAllBtnShow: true,
            openTagDialog: false,
            openImportTextToolDialog: false,
            dialogOpenMode: false,
            timeSort: 0
        }
        this.cxId;
        this.loadMoreRef;
        this.isLoadingMore = false;//加载更多
        this.offsetTop = 0;//上一次滑动位移
        this.handleScroll = this.handleScroll.bind(this);
    }

    handleScroll(e) {

        if (!this.fullPage) {//标签数据模式
            var offset = this.getOffsetTop();
            if (this.offsetTop != null && this.offsetTop > offset) {//向下滑动
                this.isLoadingMore = true;
            } else {
                if (!this.props.myIndexs.pageInfos[this.props.type].isLoading)this.isLoadingMore = false;
            }
            if (!this.props.myIndexs.pageInfos[this.props.type].isLoading&&!!this.props.userInfos.responseUserInfo.userid && offset <= 30 && this.props.myIndexs.pageInfos[this.props.type].totalPage > this.state.indexList.length && this.state.currentPage * 20 <= this.props.myIndexs.pageInfos[this.props.type].totalPage) {

                this.cxId = this.props.userInfos.responseUserInfo.userid;
                var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
                this.props.getMyIndexsData(this.cxId, this.state.currentPage + 1, header, this.props.type, this.state.timeSort);
                this.setState({currentPage: this.state.currentPage + 1});
            }
            this.offsetTop = offset;
        }

    }

    getOffsetTop() {
        var rect = ReactDOM.findDOMNode(this.loadMoreRef)
            .getBoundingClientRect();
        var clientHeight = document.body.clientHeight;
        var offsetTop = rect.top - clientHeight;
        return offsetTop;
    }


    componentDidMount() {

        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
            //var type = this.props.route.path == "myLiterature" ? "literature" : "";
            this.props.getMyIndexsData(this.cxId, this.state.currentPage, header, this.props.type);
        }
        window.addEventListener('scroll', this.handleScroll);
    }


    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.userInfos.responseUserInfo.userid != "" && nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: nextProps.userInfos.responseUserInfo.token};
            var type = this.props.type;
            var timeSort = this.state.timeSort;
            this.props.getMyIndexsData(this.cxId, this.state.currentPage, header, type);
        }

        if (nextProps.myIndexs.pageInfos[this.props.type].isLoading == false ) {//数据加载完成
            if (this.isLoadingMore) {

                var oldDataList = this.state.indexList;
                var list = oldDataList.concat(nextProps.myIndexs.myIndexsData[this.props.type] || [])
                console.log(list);
                this.setState({indexList: list || []});
            } else {
                this.setState({indexList: nextProps.myIndexs.myIndexsData[this.props.type]|| []});
            }

            this.isLoadingMore = false;
        }
    }


    removeNotes() {
        swal({
            title: this.props.intl.formatMessage({id: 'TIP'}),
            text: this.props.intl.formatMessage({id: 'CONFIRM OPERATION'}),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'}),
            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
        }).then((result) => {
            if (result.value) {
                var selectedRowKeys = this.state.selectedRowKeys;
                this.props.deleteMyIndexsData(this.cxId, selectedRowKeys, {
                    userid: this.cxId,
                    token: this.props.userInfos.responseUserInfo.token
                });
                this.setState({selectedRowKeys: []})
            }
        })

    }


    removeItemFromTag(){
        swal({
            title: this.props.intl.formatMessage({id: 'TIP'}),
            text: this.props.intl.formatMessage({id: 'Remove From Tag Tip'}),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'}),
            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
        }).then(async(result) => {
            if (result.value) {


                var header = {
                    userid: this.cxId,
                    token: this.props.userInfos.responseUserInfo.token,
                    "Content-Type": "application/json"
                };

                var infos = this.state.selectedRowKeys.map(item=> {

                    let formdata = {};
                    formdata["labelid"] = this.state.selectedTagId;
                    formdata["literatureid"] = item;
                    return formdata;

                })
                var response = await fetchUrl(INNER_SERVER_URL + `/deleteDownDetails `, "delete", JSON.stringify(infos), header);
                if (!!response) {
                    if (!!response.statu) {
                        var dataList = this.state.indexList;
                        dataList = dataList.filter(aitem=>this.state.selectedRowKeys.findIndex(bitem=>bitem == aitem.webpageId) == -1);
                        this.setState({indexList: dataList, selectedRowKeys: []})


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
        })
    }

    editMyNote() {
       // window.open("/editMyIndexs?indexId=" + this.state.selectedRowKeys[0]);
        window.open("/personalEdit?indexId=" + this.state.selectedRowKeys[0]);
    }


    downloadFile(keys, type, fileName) {
        var header = {
            userid: this.props.userInfos.responseUserInfo.userid,
            token: this.props.userInfos.responseUserInfo.token
        };
        //console.log(this.state.selectedRowKey);
        console.log(keys);
        if (!!keys && keys.length > 0) {
            this.props.downloadFiles(keys, this.props.userInfos.responseUserInfo.userid, type == 'RIS' ? 1 : 2, fileName, header);
        } else {
            swal({
                title: this.props.intl.formatMessage({id: 'No Refrences'}),
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            })
        }

    }

    updateDataList(dataList, selectedTagId) {
        if (!!selectedTagId) {
            this.fullPage=true;
            this.isLoadingMore=false;
            this.setState({indexList: dataList||[],timeSort:0, currentPage: 1, fullPage: true, selectedRowKeys: [],selectedTagId:selectedTagId})
        }
        else {
            this.fullPage=false;
            this.setState({fullPage: false, selectedRowKeys: [], indexList: [], currentPage: 1,selectedTagId:'',timeSort:0});
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
            this.isLoadingMore=false;
            //var type = this.props.route.path == "myLiterature" ? "literature" : "";
            this.props.getMyIndexsData(this.cxId, 1, header, this.props.type,0);
        }
    }


    renderToolBar() {
        const {classes} = this.props;
        return <div>
            <div className="clearfix">

                {
                    (this.state.selectedRowKeys.length == 0 || this.state.selectedRowKeys.length < this.state.indexList.length) &&
                    <Button className={classes.buttonConfig}
                            style={{marginLeft:'1rem'}}
                            onClick={()=>this.selectAll()}
                            size="small"
                    ><i className="fa fa-check-circle-o"/>&nbsp;<FormattedMessage id="Select_ALL"/>
                    </Button>


                }

                {
                    (this.state.selectedRowKeys.length == this.state.indexList.length) && this.state.indexList.length > 0 &&
                    <Button className={classes.buttonConfig} style={{marginLeft:'1rem'}}
                            onClick={()=>this.unSelectAll()}
                            size="small"
                    ><i className="fa fa-circle-o"/>&nbsp;<FormattedMessage id="UnSelect_ALL"/>
                    </Button>


                }

                <Button onClick={()=>this.removeNotes()} disabled={this.state.selectedRowKeys.length==0}
                        className={classes.buttonRemove} size="small">

                    {this.props.myIndexs.pageInfos[this.props.type].isDeleting && <CircularProgress
                        className={classes.removeProgress}
                        size={18}
                    />}<Glyphicon glyph="trash" style={{fontSize:'1rem'}}/>&nbsp;<FormattedMessage
                    id="DELETE"/></Button>


                {this.state.fullPage &&
                <Button onClick={()=>this.removeItemFromTag()} disabled={this.state.selectedRowKeys.length==0}
                        className={classes.buttonRemove} size="small">
                    <Glyphicon glyph="trash" style={{fontSize:'1rem'}}/>&nbsp;<FormattedMessage
                    id="Remove From Tag"/></Button>}


                <Button disabled={this.state.selectedRowKeys.length!=1} onClick={()=>this.editMyNote()}
                        className={classes.buttonConfig} size="small"><Glyphicon glyph="pencil"
                                                                                 style={{fontSize:'1rem'}}/>&nbsp;
                    <FormattedMessage id="EDIT"/></Button>


                {/* {
                    <Badge classes={{badge:this.state.selectedRowKeys.length>0?classes.badge:classes.badgeHide}}
                           badgeContent={this.state.selectedRowKeys.length} color="primary"><Button
                        className={classes.buttonConfig1}
                        size="samll"
                        disabled={this.state.selectedRowKeys.length==0}
                        onClick={()=>this.setState({openTagDialog:true})}
                        variant="outlined" size="small">
                        <i className="fa fa-tasks"> </i>&nbsp;<FormattedMessage id="Add to Compare"/>
                    </Button>
                    </Badge>
                }


                {
                    <Badge classes={{badge:this.state.selectedRowKeys.length>0?classes.badge:classes.badgeHide}}
                           badgeContent={this.state.selectedRowKeys.length} color="primary"><Button
                        className={classes.buttonConfig1}
                        size="samll"
                        disabled={this.state.selectedRowKeys.length==0}
                        onClick={()=>this.setState({openImportTextToolDialog:true})}
                        variant="outlined" size="small">
                        <i className="fa fa-file-text"> </i>&nbsp;<FormattedMessage id="Import To Text Tools"/>
                    </Button>
                    </Badge>
                }

                {

                    <Button
                        className={classes.buttonConfig1}
                        size="samll"
                        onClick={()=>this.setState({dialogOpenMode:!this.state.dialogOpenMode})}
                        variant="outlined" size="small">
                        <Glyphicon
                            glyph="download-alt"/>&nbsp;<FormattedMessage id="Show Download Refrences Tag"/>
                    </Button>
                } */}

                {
                    // showExportBtn&&<Button onClick={()=>this.downLoadFiles()} disabled={this.state.selectedRowKeys.length==0} variant="contained"
                    //         className={classes.buttonExport}
                    //         size="small"><Glyphicon glyph="download-alt" style={{fontSize:'1rem',top:'0px'}}/>&nbsp;
                    //     <span><FormattedMessage id="EXPORT"/></span></Button>
                }
                {

                    // <Badge classes={{badge:this.state.selectedRowKeys.length>0?classes.badge:classes.badgeHide}}
                    //        badgeContent={this.state.selectedRowKeys.length} color="secondary">
                    //     <FilterDropDown
                    //         compomentStyle={classes.buttonConfig1}
                    //                     disabled={this.state.selectedRowKeys.length==0}
                    //                     hideSelectedLabel
                    //                     itemClick={(option)=>this.downloadFile(option)}
                    //                     name={<span><Glyphicon
                    //         glyph="download-alt"/>&nbsp;<FormattedMessage id="Download_Doc"/></span>}
                    //                     options={dowloadTypeOptions}/>
                    // </Badge>
                }

                {!this.state.fullPage&&<div className="right-tools"><FilterDropDown iconClass="glyphicon glyphicon-filter"
                                                             itemClick={(option)=>this.orderOption(option)}
                                                             name={<FormattedMessage id="Order by"/>}
                                                             options={orderOptions}/>
                </div>}

            </div>

            <DownloadTagDialog updateDataList={(dataList,selected)=>{this.updateDataList(dataList,selected)}}
                               onClose={()=>this.setState({dialogOpenMode:false})}
                               selectedKeys={this.state.selectedRowKeys} dialogOpenMode={this.state.dialogOpenMode}
                               onDownload={(keys,type,fileName)=>this.downloadFile(keys,type,fileName)}/>


        </div>

    }


    selectAll(e) {
        var dataList = this.state.indexList.map(item=> {
            return item.webpageId
        });
        this.setState({"selectedRowKeys": dataList, selectAllBtnShow: false})
    }

    unSelectAll() {

        this.setState({selectAllBtnShow: true, selectedRowKeys: []});

    }

    orderOption(option) {
        console.log(option);
        this.setState({timeSort: option.value, currentPage: 1})
        var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
        //var type = this.props.route.path == "myLiterature" ? "literature" : "";
        this.props.getMyIndexsData(this.cxId, 1, header, this.props.type, option.value);
    }

    setSelectedItem(e, item) {

        if (e.target.checked) {
            var selectedIndexs = this.state.selectedRowKeys;
            selectedIndexs.push(item.webpageId);
            this.setState({"selectedRowKeys": selectedIndexs})
        } else {
            var selectedIndexs = this.state.selectedRowKeys;
            var filterDatas = selectedIndexs.filter(sitem=>sitem != item.webpageId);
            this.setState({"selectedRowKeys": filterDatas})

        }


    }

    toImportTextTool(type) {//引入到文本工具中去

        if (!!this.state.selectedTextToolItem) {
            var data = this.state.resultDataList;

            var dataList = this.state.indexList;
            var _self = this;
            var dataList = dataList.filter(item=> {
                var indexId = (item.proc_dxid || item.documentId || item.primary_id || item.person_id || item.webpageId);
                return _self.state.selectedRowKeys.findIndex(sitem=>sitem == indexId) >= 0;
                // return item;
            });


            var strList = dataList.map(item=> {
                if (type == 0) {
                    return item.note;
                } else {
                    return item.email_content;
                }
            });
            var b = new Buffer(JSON.stringify(strList));
            var s = b.toString('base64');
            console.log(s);
            var href = TEXT_TOOL_MENUS.find(sitem=>sitem.id == this.state.selectedTextToolItem.key).href;

            window.open("toolPages/" + href + "?t=" + encodeURIComponent(s))
            this.setState({selectedTextToolItem: null, openImportTextToolDialog: false});

        } else {
            swal({
                title: this.props.intl.formatMessage({id: 'Please Select Tool'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'}),
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            })
        }
    }

    renderContent(item) {
        var content = "";
        if (!!item.author) {
            content += "【" + this.props.intl.formatMessage({id: 'Author'}) + "】:" + item.author + " ";
        }
        if (!!item.book_name) {
            content += "【" + this.props.intl.formatMessage({id: 'Series'}) + "】:" + item.book_name + " ";
        }
        if (!!item.Pub_date) {
            content += "【" + this.props.intl.formatMessage({id: 'Publish_Time1'}) + "】:" + item.Pub_date + " ";
        }
        if (!!item.publishing_house) {
            content += "【" + this.props.intl.formatMessage({id: 'Publisher'}) + "】:" + item.publishing_house + " ";
        }
        if (!!item.page_num) {
            content += "【" + this.props.intl.formatMessage({id: 'PAGE_NUM'}) + "】:" + item.page_num + " ";
        }
        if (!!item.ISBN) {
            content += "【ISBN】:" + item.ISBN + " ";
        }
        if (!!item.subject_term) {
            content += "【" + this.props.intl.formatMessage({id: 'Subject_Words'}) + "】:" + item.subject_term + " ";
        }
        if (!!item.book_num) {
            content += "【" + this.props.intl.formatMessage({id: 'Cn_Category_no'}) + "】:" + item.book_num + " ";
        }
        if (!!item.title) {
            content += "【" + this.props.intl.formatMessage({id: 'TITLE'}) + "】:" + item.title + " ";
        }
        if (!!item.journal_name) {
            content += "【" + this.props.intl.formatMessage({id: 'Journal_Name'}) + "】:" + item.journal_name + " ";
        }
        if (!!item.english_journal_name) {
            content += "【" + this.props.intl.formatMessage({id: 'En_Journal_Name'}) + "】:" + item.english_journal_name + " ";
        }
        if (!!item.year) {
            content += "【" + this.props.intl.formatMessage({id: 'YEAR'}) + "】:" + item.year + " ";
        }
        if (!!item.journal_num) {
            content += "【" + this.props.intl.formatMessage({id: 'Journal_Num'}) + "】:" + item.journal_num + " ";
        }
        if (!!item.ISSN) {
            content += "【ISSN】:" + item.ISSN + " ";
        }
        if (!!item.journal_type_num) {
            content += "【" + this.props.intl.formatMessage({id: 'Category_no'}) + "】:" + item.journal_type_num + " ";
        }
        if (!!item.keyWord) {
            content += "【" + this.props.intl.formatMessage({id: 'TYPE_NAME_keywordList'}) + "】:" + item.keyWord + " ";
        }
        if (!!item.DOI) {
            content += "【DOI】:" + item.DOI + " ";
        }
        if (!!item.deputy_essay) {
            content += "【" + this.props.intl.formatMessage({id: 'Subtitle'}) + "】:" + item.deputy_essay + " ";
        }
        if (!!item.NPn) {
            content += "【" + this.props.intl.formatMessage({id: 'Paper_Name'}) + "】:" + item.NPn + " ";
        }
        if (!!item.edition) {
            content += "【" + this.props.intl.formatMessage({id: 'Paper_Edition'}) + "】:" + item.edition + " ";
        }
        if (!!item.degree_name) {
            content += "【" + this.props.intl.formatMessage({id: 'Degree_Name'}) + "】:" + item.degree_name + " ";
        }
        if (!!item.degree_year) {
            content += "【" + this.props.intl.formatMessage({id: 'Degree_Year'}) + "】:" + item.degree_year + " ";
        }
        if (!!item.degree_conferring_unit) {
            content += "【" + this.props.intl.formatMessage({id: 'Degree_Unit'}) + "】:" + item.degree_conferring_unit + " ";
        }
        if (!!item.tutor_name) {
            content += "【" + this.props.intl.formatMessage({id: 'Degree_Teacher'}) + "】:" + item.tutor_name + " ";
        }
        if (!!item.author_unit) {
            content += "【" + this.props.intl.formatMessage({id: 'Author_Unit'}) + "】:" + item.author_unit + " ";
        }
        if (!!item.meeting_name) {
            content += "【" + this.props.intl.formatMessage({id: 'Meeting_Name'}) + "】:" + item.meeting_name + " ";
        }
        if (!!item.meeting_Address) {
            content += "【" + this.props.intl.formatMessage({id: 'Meeting_Address'}) + "】:" + item.meeting_Address + " ";
        }
        if (!!item.meetingYear) {
            content += "【" + this.props.intl.formatMessage({id: 'Meeting_Year'}) + "】:" + item.meetingYear + " ";
        }
        if (!!item.conference_proceedings) {
            content += "【" + this.props.intl.formatMessage({id: 'Meeting_Record'}) + "】:" + item.conference_proceedings + " ";
        }

        if (!!item.inventor) {
            content += "【" + this.props.intl.formatMessage({id: 'Creator'}) + "】:" + item.inventor + " ";
        }


        // inventor: $("#gsd_pt_creator").val(),
        // application_date: $("#gsd_pt_application_date").val(),
        // Open_date: $("#gsd_pt_open_date").val(),
        // proposer: $("#gsd_pt_applyer").val(),
        // publication_number: $("#gsd_pt_open_num").val(),
        // Patent_type: $("#gsd_pt_type").val(),
        // province_code: $("#gsd_pt_province_code").val(),
        // Address: $("#gsd_pt_address").val(),
        // legal_status: $("#gsd_pt_legal_statu").val(),
        //
        // person_charge: $("#gsd_tr_finisher").val(),
        // Complete_unit: $("#gsd_tr_finisher_unit").val(),
        // open_year: $("#gsd_tr_year").val(),
        // project_year_num: $("#gsd_tr_year_no").val(),
        //
        // date_posted: $("#gsd_st_publish_date").val(),
        // material_date: $("#gsd_st_apply_date").val(),
        // release_unit: $("#gsd_st_publish_unit").val(),
        // standard_number: $("#gsd_st_no").val(),
        // standard_state: $("#gsd_st_statu").val(),
        //
        // Issued_date: $("#gsd_law_publish_date").val(),
        // promulgated_unit: $("#gsd_law_publish_unit").val(),
        // scope_validity: $("#gsd_law_range").val(),
        // Regulations_category: $("#gsd_law_type").val(),
        // reference_num: $("#gsd_law_no").val(),
        //
        // digest: $("#gsd_abstract").val(),
        // year_book_name: $("#gsd_yb_name").val(),
        //
        // case_type: $("#gsd_case_type").val(),
        // case_reason: $("#gsd_case_reason").val(),
        //
        // message_type: $("#gsd_type option:selected").val(),
        // document_type: saveType,
        // email_content: $("#gsd_all_info").val()
        return content;
    }

    rendereListItemResult() {
      
        var dataList = this.state.indexList;
        if (!!dataList && dataList.length > 0) {

            return <List component="nav">

                { dataList.reduce((arr, item, index)=> {
                    var isChecked = this.state.selectedRowKeys.findIndex(sitem=>sitem == item.webpageId) >= 0;
                    var tagHtml;
                    if (!!item.tag) {
                        var tags = item.tag.split('%%%');
                        tagHtml = tags.map(item=> {
                            return `<span class="smallTag">${item}</span>`;
                        }).join("");
                    }
                    var content = this.renderContent(item);
                    if (!!content && content.length > 100) {
                        content = content.substring(0, 100) + "...";
                    }
                    arr.push(
                        <div
                            key={`list_${index}`}>
                            <Divider light/>
                            <ListItem >
                                <ListItemText primary={
                                  <Row>
                                  <div className="col-lg-1"><Checkbox checked={isChecked} onChange={(e)=>this.setSelectedItem(e,item)} className="gsd-check"/></div>
<div className="col-lg-11"><a href={item.url} target="_blank">{item.title}</a><span style={{display:'inline-block',marginLeft:'1rem'}}> <div dangerouslySetInnerHTML={{__html: tagHtml}}></div></span>
                                            <div className="content-desc">

 <p>{content} </p>
</div>


                                            </div>

                                </Row>
                                }/>

                            </ListItem></div>);
                    return arr;
                }, [])
                }

                <Divider/>


            </List>


        }

        else if (!this.props.myIndexs.pageInfos[this.props.type].isLoading && !!dataList && dataList.length == 0)return <NoData/>;
    }

    renderListItem() {

        const {classes} =this.props;

        return <div className={classes.rootPage}
                    elevation={1}>
            {this.renderToolBar()}
            {this.rendereListItemResult()}


        </div>;


    }


    getLiteratureIds() {

        var data = this.state.selectedRowKeys;

        var dataList = this.state.indexList
        var _self = this;
        var dataList = dataList.filter(item=> {
            var indexId = (item.proc_dxid || item.documentId || item.primary_id || item.person_id || item.webpageId);
            return _self.state.selectedRowKeys.findIndex(sitem=>sitem == indexId) >= 0;
            // return item;
        })
        return dataList;
        //return this.state.selectedDataList;
    }

    renderLoadMore() {//加载更多

        var hasMore = this.state.indexList.length < this.props.myIndexs.pageInfos[this.props.type].totalPage;
        var noData = !this.props.myIndexs.pageInfos[this.props.type].isLoading && !!this.state.indexList && this.state.indexList.length == 0;
        return <div ref={(ref)=>this.loadMoreRef=ref}
                    style={{textAlign:'center',visibility:noData||this.state.fullPage?'hidden':"visible"}}>

            {!this.props.myIndexs.pageInfos[this.props.type].isLoading &&
            <div style={{display:!hasMore?"block":'none',marginTop:'1rem'}} ref={(ref)=>this.loadMoreBtn=ref}><h4
                style={{textAlign:'center'}}><a style={{color:"#888",borderColor:"#ffffff"}}
                                                className="btn btn-default"><FormattedMessage id="The Last Data"/></a>
            </h4></div>}
            {!this.props.myIndexs.pageInfos[this.props.type].isLoading &&
            <div style={{display:!hasMore?"none":'block',marginTop:'1rem'}} ref={(ref)=>this.loadMoreBtn=ref}><h4
                style={{textAlign:'center'}}><a className="btn btn-default"><FormattedMessage id="Load More"/></a></h4>
            </div>}


        </div>

    }

    render() {
        const {classes} = this.props;

        var nameId = this.props.route.path == "myLiterature" ? "MY_INDEX" : "My Collect";
        return (
            <div>
                <Paper className={classes.root} elevation={1}>
                    {this.renderListItem()}
                    {this.renderLoadMore()}
                </Paper>

                <Dialog onClose={()=>{this.setState({openTagDialog:false});}} open={this.state.openTagDialog}>
                    <div style={{padding:'15px',minWidth:'300px'}}>
                        <CompareTags type="3" channel="webpage" getLiteratureIds={()=>this.getLiteratureIds()}
                                     closeDialog={()=>{this.setState({openTagDialog:false});}}/>
                    </div>
                </Dialog>

                <Dialog onClose={()=>{this.setState({openImportTextToolDialog:false});}}
                        open={this.state.openImportTextToolDialog}>
                    <div style={{padding:'15px',minWidth:'300px'}}>


                        <div>
                            <h4><FormattedMessage id="Text_Tool"/></h4>
                            <Menu
                                style={{ width: '100%',    borderRight: 'none'}}
                                mode="inline"
                                onSelect={(item, key, selectedKeys )=>{

                            this.setState({selectedTextToolItem:item})}}
                            >
                                {
                                    TEXT_TOOL_MENUS.map(item=> <Menu.Item
                                        disabled={item.id!="menu-txt-01"?(this.state.selectedRowKeys.length==1?false:true):(this.state.selectedRowKeys.length>1?false:true)}
                                        key={item.id}><a><FormattedMessage id={item.name}/></a></Menu.Item>)

                                }
                            </Menu>
                            <div style={{marginTop:"20px",textAlign:"right"}}>
                                <Button variant="contained" className={classes.buttonOk}
                                        onClick={()=>this.toImportTextTool(0)} size="small"><FormattedMessage
                                    id="Import Note To Text Tools"/></Button>
                                &nbsp;
                                <Button variant="contained" className={classes.buttonOk1}
                                        onClick={()=>this.toImportTextTool(1)} size="small"><FormattedMessage
                                    id="Import All To Text Tools"/></Button>
                                &nbsp;
                                <Button size="small"
                                        style={{textAlign:"center",display:'inline-block',border: "solid 1px #afaaaa"}}
                                        onClick={()=>{this.setState({openImportTextToolDialog:false,selectedTextToolItem:null});}}><FormattedMessage
                                    id="CANCEL"/></Button>
                            </div>
                        </div>

                    </div>
                </Dialog>

            </div>
        );
    }

}

const mapStateToProps = (state, props) => {    
    if(!state.myIndexs.pageInfos[props.type]){
        state.myIndexs.pageInfos[props.type] = {};
        state.myIndexs.pageInfos[props.type].isDeleting = false;
    }
    return {
        routing: state.routing,
        userInfos: state.userInfos,
        myIndexs: state.myIndexs
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getMyIndexsData: (userId, pageNum = 1, header, type = "", timeSort = 0) => {
            console.log(header);
            dispatch(getMyIndexsData(userId, pageNum, header, type, timeSort))
        },
        deleteMyIndexsData: (userId, noteIds, header) => dispatch(deleteMyIndexsData(userId, noteIds, header)),
        downloadFiles: (webpageIds, userid, downloadType, fileName, header)=> {
            dispatch(downloadFiles(webpageIds, userid, downloadType, fileName, header));
        }

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(MyIndexs)))
