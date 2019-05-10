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
import DownloadTagDialog from "../myIndexs/downloadTagsDialog";
import FilterDropDown from "../result/filterDropDown";
import ReactDOM from 'react-dom';
import Account from "../sys/Account";
import {getLocalUserInfo} from "../../utils/utils";
import {setSeverResponseUserInfos, userLogout} from "../../actions";
import {getBindedEmails} from "../../actions"

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
    inputConfig: {
        display: "inline-block",
        color: "#989696",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        marginLeft: "15px",
        maxWidth: "300px",
        width: "80%",
        height: "2.6em"
    },
    title:{
        '& h2': {
            color: "red",
            display: "inline",
            fontSize: "16px"
        },
    }
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
];

const bindEmailShow = false;   //是否绑定邮箱的提示只显示一次

class Personal extends Component {
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
            timeSort: 0,
            searchKey: "",            
            bindEmailShow: false
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
        var userInfo = getLocalUserInfo();
        if (!!userInfo && !!userInfo.userid) {
            this.props.setSeverResponseUserInfos({responseUserInfo: {...userInfo}});            
        }
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
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
            this.props.getBindedEmails(this.cxId,header);
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
        if(nextProps.userInfos.type == 'SET_BINDED_EMAILS'){
            if(nextProps.userInfos.bindedEmalis.length == 0 && !bindEmailShow){
                bindEmailShow = true;
                swal({
                    title: this.props.intl.formatMessage({id: 'TIP'}),
                    text: this.props.intl.formatMessage({id: 'EMAIL_IS_EMPTY'}),
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'}),
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                }).then((result) => {
                    this.setState({bindEmailShow: true});
                })
            }
        }        
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

    editMyNote(item) {
        //新建一个笔记编辑的页面
        window.open("/personalEdit?indexId=" + item.webpageId);
    }

    searchNote(){
        // this.state.searchKey 查询字段
        var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
        var type = this.props.type;
        this.props.getMyIndexsData(this.cxId, 1, header, this.props.type, 0, this.state.searchKey);
    }

    bindEmail(){        
        this.setState({bindEmailShow: !this.state.bindEmailShow});
    }

    orderOption(option) {
        console.log(option);
        this.setState({timeSort: option.value, currentPage: 1})
        var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
        this.props.getMyIndexsData(this.cxId, 1, header, this.props.type, option.value);
    }

    setSelectedItem(e, item) {
        if (e.target.checked) {
            var selectedIndexs = this.state.selectedRowKeys;
            selectedIndexs.push(item.webpageId);
            this.setState({"selectedRowKeys": selectedIndexs});
        } else {
            var selectedIndexs = this.state.selectedRowKeys;
            var filterDatas = selectedIndexs.filter(sitem=>sitem != item.webpageId);
            this.setState({"selectedRowKeys": filterDatas});
        }
    }

    rendereListItemResult() {
        const {classes} =this.props;
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
                    content = content.replace(/<h2>|<\/h2>/g,"");
                    arr.push(
                        <div
                            key={`list_${index}`}>
                            <Divider light/>
                            <ListItem >
                                <ListItemText primary={
                                  <Row>
                                    <div className="col-lg-1"><Checkbox checked={isChecked} onChange={(e)=>this.setSelectedItem(e,item)} className="gsd-check"/></div>
                                        <div className="col-lg-11">
                                            {/* <a href={item.url} target="_blank">{item.title}</a> */}
                                            <Glyphicon glyph="pencil" style={{fontSize:'1rem',marginRight:"10px",cursor:"pointer"}} onClick={()=>this.editMyNote(item)}/>
                                            <a href={item.url} target="_blank" dangerouslySetInnerHTML={{__html: item.title}} className={classes.title}></a>
                                            <span style={{display:'inline-block',marginLeft:'1rem'}}> 
                                                <div dangerouslySetInnerHTML={{__html: tagHtml}}></div>
                                            </span>
                                            <div className="content-desc">
                                            <p>{content} </p>
                                        </div>
                                    </div>
                                </Row>
                                }/>
                            </ListItem>
                        </div>);
                    return arr;
                }, [])
                }
                <Divider/>
            </List>
        }
        else if (dataList && dataList.length == 0)return <NoData/>;
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
        return content;
    }

    renderListItem() {
        const {classes} =this.props;
        return  <div className={classes.rootPage}
                    elevation={1}>
                    {this.renderToolBar()}
                    <div>
                        <input value={this.state.searchKey} 
                            onChange={()=>this.setState({searchKey:event.target.value})} 
                            className={classes.inputConfig} />
                        <Button onClick={()=>this.searchNote()} className={classes.buttonConfig} size="small">
                            <Glyphicon glyph="search" style={{fontSize:'1rem'}}/>
                        </Button>
                    </div>
                    {this.rendereListItemResult()}
                </div>;
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
                    id="DELETE"/>
                </Button>
                {
                    this.state.fullPage &&
                <Button onClick={()=>this.removeItemFromTag()} disabled={this.state.selectedRowKeys.length==0}
                        className={classes.buttonRemove} size="small">
                    <Glyphicon glyph="trash" style={{fontSize:'1rem'}}/>&nbsp;<FormattedMessage
                    id="Remove From Tag"/></Button>
                }
                {/* <Button disabled={this.state.selectedRowKeys.length!=1} onClick={()=>this.editMyNote()}
                        className={classes.buttonConfig} size="small"><Glyphicon glyph="pencil"
                                                                                 style={{fontSize:'1rem'}}/>&nbsp;
                    <FormattedMessage id="EDIT"/>
                </Button> */}
                {!this.state.fullPage&&
                    <div className="right-tools">
                        <Button onClick={()=>this.bindEmail()}
                            className={classes.buttonConfig} size="small"><Glyphicon glyph="envelope"
                                                                                    style={{fontSize:'1rem'}}/>&nbsp;
                        <FormattedMessage id="Bind_Email"/>
                        </Button>
                        <FilterDropDown iconClass="glyphicon glyphicon-filter"
                                            itemClick={(option)=>this.orderOption(option)}
                        name={<FormattedMessage id="Order by"/>}
                        options={orderOptions}/>
                    </div>
                }
            </div>
            <DownloadTagDialog updateDataList={(dataList,selected)=>{this.updateDataList(dataList,selected)}}
                               onClose={()=>this.setState({dialogOpenMode:false})}
                               selectedKeys={this.state.selectedRowKeys} dialogOpenMode={this.state.dialogOpenMode}
                               onDownload={(keys,type,fileName)=>this.downloadFile(keys,type,fileName)}/>
        </div>
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
        return  <div style={{display:"flex"}}>  
                    <div style={{marginTop:"30px"}}>
                        <img src="/sourceImages/nav.jpg"></img>
                    </div>
                    <div style={{flex:"1"}}>     
                        {
                            !this.state.bindEmailShow?
                            (
                                <Paper className={classes.root} elevation={1}>
                                    {this.renderListItem()}                        
                                    {this.renderLoadMore()}
                                </Paper>   
                            ):
                            (
                                <Paper className={classes.root} elevation={1}>
                                    <div className="clearfix">
                                        <div className="right-tools" style={{float:"left"}}>
                                            <Button onClick={()=>this.bindEmail()}
                                                className={classes.buttonConfig} size="small"><Glyphicon glyph="envelope"
                                                                                                        style={{fontSize:'1rem'}}/>&nbsp;
                                            <FormattedMessage id="Back"/>
                                            </Button>
                                        </div>
                                    </div>
                                    <Account personal={true}/>     
                                </Paper>  
                            )
                        }    
                    </div>
                </div>
    }
}

const mapStateToProps = (state, props) => {
    return {
        routing: state.routing,
        userInfos: state.userInfos,
        myIndexs: state.myIndexs,
        type : "webpage"
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getMyIndexsData: (userId, pageNum = 1, header, type = "", timeSort = 0 ,title ="") => {
            dispatch(getMyIndexsData(userId, pageNum, header, type, timeSort, title))
        },
        deleteMyIndexsData: (userId, noteIds, header) => dispatch(deleteMyIndexsData(userId, noteIds, header)),
        setSeverResponseUserInfos: (infos) => dispatch(setSeverResponseUserInfos(infos)),
        getBindedEmails: (userId,header) => dispatch(getBindedEmails(userId,header)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(Personal)))