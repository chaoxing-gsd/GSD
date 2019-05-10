/**
 * Created by Aaron on 2018/7/10.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {checkIsMobile} from "../../utils/utils"
import {Row,Col, Glyphicon} from 'react-bootstrap';
import ReactDOM from 'react-dom'
import {withStyles} from '@material-ui/core/styles';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {getSinglgPageResultByArguments,saveHistoryResourceRecord,setSearchResultPageInfos,deleteMyIndexsDataInSearchResult} from "../../actions";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {browserHistory} from 'react-router'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {Tooltip,Checkbox,Menu} from 'antd';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import {Pagination} from 'antd';
import {getResourceLink, buildBaseArgument, buildClusters, buildChannels, buildFilterArgument} from "../../utils/utils"
import NoData from "../NoData"
import Dialog from '@material-ui/core/Dialog';
import CompareTags from "./compareTags";
import swal from 'sweetalert2'
import FilterComp from "./filter"
const SubMenu = Menu.SubMenu;

const TEXT_TOOL_MENUS=[
    {id:'menu-txt-06',name:'WORD_CLOUD',href:'wordCloud'},
    {id:'menu-txt-07',name:'N-gram',href:'ngRam'},
    {id:'menu-txt-01',name:'Text_Similar',href:'similarText'},
    {id:'menu-txt-02',name:'Thesaurus Words',href:'similarWord'},
    {id:'menu-txt-03',name:'KeyWords Picker',href:'keyWords'},
    {id:'menu-txt-04',name:'Part of speech',href:'wordTag'},
    // {id:'menu-txt-05',name:'Reg Text',href:'#'},


];

const REPEAT_SKELETON = 4;
const styles = theme => ({
    rootPage: {
        ...theme.mixins.gutters(),
        width: '100%',
        backgroundColor:"#ffffff"
    },
    buttonAdd: {
        float: "right",
        display: "inline-block",
        color: "#d45f5f",
        border: "none",
        fontSize: "12px",
        minWidth: '30px',
        minHeight: "30px",
        '&:hover': {
            // backgroundColor: "#d45f5f",
            // color:"#ffffff"

        },
    },
    buttonEdit: {
        display: "block",
        color: "#989898",
        border: "none",
        fontSize: "12px",
        minWidth: '30px',
        minHeight: "30px",
        '&:hover': {
            // backgroundColor: "#d45f5f",
             color:"#d45f5f"

        },
    },
    menuItem: {
        fontSize: "12px",
        padding: '0.2rem 1rem',
        color: "#6b6b67",
        '&:hover': {},
    },
    btnStyle: {
        display: "inline-block",
        color: "#a09d9d",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        minWidth:'45px',
        '&:hover': {
            // backgroundColor: "#d45f5f",


        },
        '&:disabled': {
            backgroundColor: "#e2e2e2",
            color: "#d4d3d3",
            cursor: "not-allowed"

        },
    },
    buttonOk:{
        backgroundColor: "#d45f5f",
        textAlign:"center",
        display: "inline-block",
        fontSize:'12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#b93939"
        },
        color: "#ffffff",
    },
    buttonOk1:{
        backgroundColor: "#03A9F4",
        textAlign:"center",
        display: "inline-block",
        fontSize:'12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#36b5ef"
        },
        color: "#ffffff",
    },
    badge:{
        backgroundColor:"#d45f5f"
    },
    badgeHide:{
        display:"none"
    }
});


class SingleResultPageList extends Component {
    static propTypes = {
        wrapperStyle: PropTypes.object,
        intl: intlShape.isRequired,
        classes: PropTypes.object.isRequired,
        theme: PropTypes.object.isRequired,
        filterData: PropTypes.object
        // onChange: PropTypes.func,


    }


    constructor(props) {
        super(props);
        this.initSearchTitle;
        this.filterData = {};
        this.offsetTop=null;//用于记录上次滚动距离,判断上滑还下滑
        this.userId=null;
        this.loadMoreRef=null;
        this.isLoadingMore=false;//加载更多
        this.state = {currentPage: 0,isEnded:false,isloaded:false, pageSize: 20,anchorEl:null,selectedDataList:[],openTagDialog:false,resultDataList:[]};
        this.scrollPage = this.scrollPage.bind(this);
        this.timeSort=0;//时间排序 1降序,2升序
    }
    handleDropDownOpen(e) {
        this.setState({anchorEl: e.currentTarget});
    }
    sourceOperate(option) {
        this.setState({anchorEl: null});

    }
    renderPopTitle(item, link) {
        const {classes,type}=this.props;
        const {anchorEl}=this.state;
        const options = type==3?[

            {
                value: "2", label: <FormattedMessage
                id="View"
            />
            },

        ]:[
            {
                value: "0", label: <FormattedMessage
                id="Add_Note"
            />
            },
            {
                value: "1", label: <FormattedMessage
                id="Add_Index"
            />
            },
            {
                value: "2", label: <FormattedMessage
                id="View"
            />
            },

        ];
        var sourceTitle = item.basic_title || (item.title || "").replace(/<\/?.+?>/g, "") || item.person_name;
        return <div className="popTitle clearfix">
            <span className="popTitleText">{sourceTitle}</span>
            {
                // <Button  compoment="a" href={link} target="_blank" className={classes.buttonAdd} variant="outlined"
                //          size="small"><i className="fa fa-eye"></i></Button>
            }
        </div>;
    }


    renderSkeletons() {
        const {classes} = this.props;
        var skeletons = [];
        return <div className={classes.rootPage} key={`result_0`} elevation={1}>

            { (() => {
                for (var i = 0; i < REPEAT_SKELETON; i++) {
                    skeletons.push(
                        <div key={`skeleton_${i}`} style={{fontSize: 16, lineHeight: 2}}>
                            <Divider light/>
                            <SkeletonTheme color="#e0e0e0" highlightColor="#edecec">
                                <div style={{width: "30%"}}><h1
                                    style={{marginBottom:'0',marginTop:i>0?'20px':'10px'}}><Skeleton/></h1></div>
                                <Skeleton count={2}/>
                            </SkeletonTheme>
                        </div>);

                }
                skeletons.push(<Divider key={`divider`} light/>);
                return skeletons;
            })()
            }


        </div>

    }

    getOffsetTop() {
        var rect = ReactDOM.findDOMNode(this.loadMoreBtn)
            .getBoundingClientRect();
        var clientHeight = document.body.clientHeight;
        var offsetTop = rect.top - clientHeight;
        return offsetTop;
    }


    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollPage);
    }
    componentDidMount() {

        const {libId, type, queryType} =this.props;
        if(type==3){//自定义库,需要登录信息
            if(!!this.props.userInfos.responseUserInfo&&!!this.props.userInfos.responseUserInfo.userid){
                this.userId=this.props.userInfos.responseUserInfo.userid;
                this.getResultDatas(this.userId);
            }
        }else{
            this.getResultDatas(this.userId);
        }
        window.addEventListener('scroll', this.scrollPage);


    }


    getResultDatas(userId="",pageNum=this.state.currentPage,timeSort=this.timeSort) {

        this.initSearchTitle = this.props.searchResult.searchTitle;
        this.filterData = Object.assign({}, this.props.filter.secondPageFilter);
        if (!!this.initSearchTitle) {
            const {libId, type, queryType,degree,choren} =this.props;
            var queryArgument = buildBaseArgument(this.initSearchTitle, libId, type);
            console.log(buildFilterArgument(this.props.filter.secondPageFilter, type));

            var header={userid:this.props.userInfos.responseUserInfo.userid,token:this.props.userInfos.responseUserInfo.token};
            this.props.getSinglgPageResultByArguments(queryArgument, queryType,pageNum, this.state.pageSize, buildClusters(type), buildChannels(libId, type),type,libId,userId,timeSort,header,degree,choren);
        }
    }


    componentWillReceiveProps(nextProps) {
        var nextFilter = nextProps.filter.secondPageFilter;
        console.log(nextFilter);
        console.log(this.filterData);
        const {libId, type, queryType,degree,choren} =this.props;
        if(this.userId==null&&!!nextProps.userInfos.responseUserInfo.userid){
            this.userId=nextProps.userInfos.responseUserInfo.userid;
        }

        if (nextProps.searchResult.searchTitle != this.props.searchResult.searchTitle || (!!nextFilter && buildFilterArgument(this.filterData,type) != buildFilterArgument(nextFilter,type))) {

            const searchValue = nextProps.searchResult.searchTitle;
            var filterArgument = buildFilterArgument(nextFilter, type);
            console.log(filterArgument);
           
            var queryArgument = buildBaseArgument(searchValue, libId, type) + (!!filterArgument ? (" AND (" + filterArgument + ")") : "");
            console.log(queryArgument);
            this.filterData = Object.assign({}, nextFilter);
            var header={userid:nextProps.userInfos.responseUserInfo.userid,token:nextProps.userInfos.responseUserInfo.token};
            this.setState({currentPage:0});
            this.timeSort=nextProps.searchResult.pageInfos.timeSort;
            this.props.getSinglgPageResultByArguments(queryArgument, queryType, 0, this.state.pageSize, buildClusters(type), buildChannels(libId, type),type,libId,nextProps.userInfos.responseUserInfo.userid,this.timeSort,header,degree,choren);
        }
        if(type==3){
            console.log("dddddd");
            if(this.userId==null&&!!nextProps.userInfos.responseUserInfo.userid){
                this.userId=nextProps.userInfos.responseUserInfo.userid;
                this.setState({currentPage:0});
                this.getResultDatas(this.userId,0);
            }else{
                if(nextProps.searchResult.pageInfos.timeSort!=this.timeSort){
                    this.timeSort=nextProps.searchResult.pageInfos.timeSort;
                    this.setState({currentPage:0});
                    this.getResultDatas(this.userId,0,this.timeSort);
                }
            }
            
        }

        if(nextProps.searchResult.pageInfos.isDeleting==false&&this.props.searchResult.pageInfos.isDeleting==true){//我的删除相应
            if (queryType == 3) {
                data = nextProps.searchResult.jnPageResult || {};
                this.setState({resultDataList:data});
            }
        }
        if(nextProps.searchResult.searchTitle!=this.props.searchResult.searchTitle){
            this.setState({currentPage:0,isEnded:false,isloaded:false,resultDataList:{num:0,list:[]}})
        }
        if(nextProps.searchResult.pageInfos.isAccessing==false&&this.props.searchResult.pageInfos.isAccessing==true){//数据加载完成

            var data={};
            if (queryType == 2) {//二级页面数据
                data = nextProps.searchResult.secondPageResult || {};

            } else if (queryType == 3) {//期刊
                data = nextProps.searchResult.jnPageResult || {};
            } else if (queryType == 4) {//图书
                data = nextProps.searchResult.bkPageResult || {};
            }

            if(this.isLoadingMore){

                var oldDataList = this.state.resultDataList.content||this.state.resultDataList.documentcontent||this.state.resultDataList.list||[];
                var list=oldDataList.concat(data.content||data.documentcontent||data.list)
                var num=data.contentnum||data.documentnum||data.num

                this.setState({resultDataList:{num:num,list:list}});
            }else{
                var num=data.contentnum||data.documentnum||data.num;
                var list=data.content||data.documentcontent||data.list;
                var isEnded=num==list.length;
                this.setState({resultDataList:data,isEnded:isEnded});
            }

            this.isLoadingMore=false;
        }
        if(nextProps.searchResult.pageInfos.openTagDialog){
            this.setState({openTagDialog:true,selectedDataList:nextProps.searchResult.pageInfos.selectedMyIndex.map(item=>item.webpageId)})
        }
        if(nextProps.searchResult.pageInfos.openImportTextToolDialog){
            this.setState({openImportTextToolDialog:true,selectedDataList:nextProps.searchResult.pageInfos.selectedMyIndex.map(item=>item.webpageId)})
        }
        if(nextProps.searchResult.pageInfos.selectALLIndex){
            var dataList = this.state.resultDataList.content||this.state.resultDataList.documentcontent||this.state.resultDataList.list;
            this.setState({selectedDataList:dataList.map(item=>item.webpageId)})
            this.props.setSearchResultPageInfos({selectALLIndex:false,selectedMyIndex:dataList,currentTotal:dataList.length})
        }
        if(nextProps.searchResult.pageInfos.unSelectALLIndex){
            var dataList = this.state.resultDataList.content||this.state.resultDataList.documentcontent||this.state.resultDataList.list;
            this.setState({selectedDataList:[]})
            this.props.setSearchResultPageInfos({unSelectALLIndex:false,selectedMyIndex:[],currentTotal:dataList.length})
        }
    }


    selectAll(){
        var dataList = this.state.resultDataList.content||this.state.resultDataList.documentcontent||this.state.resultDataList.list;
        this.setState({selectedDataList:dataList.map(item=>{
            var indexId=(item.proc_dxid||item.documentId||item.primary_id||item.person_id||item.webpageId);
            return indexId;
        })})
        this.props.setSearchResultPageInfos({selectALLIndex:false,selectedMyIndex:dataList})
    }

    unSelectAll(){
        this.setState({selectedDataList:[]})
        this.props.setSearchResultPageInfos({unSelectALLIndex:false,selectedMyIndex:[]})
    }

    saveSourceClick(item,searchValue,channel,url){
        console.log(item);
        var header={userid:this.props.userInfos.responseUserInfo.userid,token:this.props.userInfos.responseUserInfo.token};
        if(this.props.userInfos.isLogined)this.props.saveHistoryResourceRecord(this.props.userInfos.responseUserInfo.userid,searchValue,channel,item.basic_title||item.title,url,header);
    }


    setSelectedItem(e,item){
        var data = this.state.resultDataList;

        var dataList = data.content||data.documentcontent||data.list;
        if(e.target.checked){
            var selectedIndexs=this.props.searchResult.pageInfos.selectedMyIndex||[];
            selectedIndexs.push(item);
            this.props.setSearchResultPageInfos({selectedMyIndex:selectedIndexs,currentTotal:dataList.length})
        }else{
            var selectedIndexs=this.props.searchResult.pageInfos.selectedMyIndex||[];
            var filterDatas=selectedIndexs.filter(sitem=>sitem.webpageId!=item.webpageId);
            this.props.setSearchResultPageInfos({selectedMyIndex:filterDatas,currentTotal:dataList.length})

        }


    }

    setSinglePageSelectedItemByListItem(item){
        const {queryType} =this.props;
        if(queryType==3)return;//搜索首页不需要这个点击事件
        var selectedDataList=this.state.selectedDataList;
        var itemId=item.proc_dxid||item.documentId||item.primary_id||item.person_id||item.webpageId;
        var find=selectedDataList.find(sitem=>sitem==itemId);
        if(!!find){//取消选择
            var filterDatas=selectedDataList.filter(sitem=>sitem!=itemId);
            this.setState({selectedDataList:filterDatas});
        }else{//加入选择
            //selectedDataList.push(item);
            this.setState({selectedDataList:selectedDataList.concat(itemId)});
        }
    }
    setSinglePageSelectedItem(e,item){
        console.log(item);
        var selectedDataList=this.state.selectedDataList;
        if(e.target.checked) {
          //  selectedDataList.push(item);
            var itemId=item.proc_dxid||item.documentId||item.primary_id||item.person_id||item.webpageId;
            this.setState({selectedDataList:selectedDataList.concat(itemId)});
        }
        else{
            var itemId=item.proc_dxid||item.documentId||item.primary_id||item.person_id||item.webpageId;
            var filterDatas=selectedDataList.filter(sitem=>sitem!=itemId);
            this.setState({selectedDataList:filterDatas});

        }
        console.log(selectedDataList);
    }


    deleteSource(item){
        var _self=this;
        console.log(this.userId)
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
                var selectedRowKeys = item.webpageId;

                _self.props.deleteMyIndexsDataInSearchResult(_self.userId, [selectedRowKeys], {
                    userid: _self.userId,
                    token: _self.props.userInfos.responseUserInfo.token
                });
            }
        })
    }

    editMyNote(item) {
        window.open("/personalEdit?indexId=" + item.webpageId);
    }


//     renderSecondTablePage(data){
//         const {libId, classes, type} =this.props;
//         var dataList = data.content||data.documentcontent||data.list;
//         var searchValue = this.props.searchResult.searchTitle;
//         var isEditing=this.props.searchResult.pageInfos.editMyIndex&&type==3;
//         if (!!dataList && dataList.length > 0) {
//
//             return <div className={classes.rootPage}
//                         elevation={1}>
//                 <div className="cluster-header"><div className="row">
//                     <div className="col-md-3"><span className="th-header"><FormattedMessage
//                         id="Title"
//                     /></span></div>
//                     <div className="col-md-2"><span className="th-header"><FormattedMessage
//                         id="Author"
//                     /></span></div>
//                     <div className="col-md-2"><span className="th-header"><FormattedMessage
//                         id="Publish_Time"
//                     /></span></div>
//                     <div className="col-md-2"><span className="th-header"><FormattedMessage
//                         id="DOC_TYPE"
//                     /></span></div>
//                     <div className="col-md-3"><span className="th-header"><FormattedMessage
//                         id="Publisher"
//                     /></span></div>
//
//                 </div>
//                 </div>
//                 <List component="nav">
//                     { dataList.reduce((arr, item, index)=> {
//                         const matches = match(item.basic_title||(item.title||"").replace(/<\/?.+?>/g,"")||item.person_name, searchValue);
//                         const parts = parse(item.basic_title||(item.title||"").replace(/<\/?.+?>/g,"")||item.person_name, matches);
//
//                         const matcheAuthor = match(item.basic_creator||item.edition||item.jiguan||item.author, searchValue);
//                         const partAuthor = parse(item.basic_creator||item.edition||item.jiguan||item.author, matcheAuthor);
//
//                         const matcheYear = match(item.basic_date_time||item.dynasty||item.year, searchValue);
//                         const partYear = parse(item.basic_date_time||item.dynasty||item.year, matcheYear);
//
//                         var description=!!(item.basic_description||item.digest)?((item.basic_description||item.digest).length>40?((item.basic_description||item.digest).substring(0,40)+"..."):(item.basic_description||item.digest)):"";
//                         if(!description){
//                             description="";
//                             description+=!!item.author?(item.author+""):"";
//                             description+=!!item.collection?(item.collection+""):"";
//                             description+=!!item.notes?(item.notes+""):"";
//                             description+=!!item.edtion?(item.edtion+""):"";
//                         }
//                         if(!description){
//                             description="";
//                             description+=!!item.gender?(item.gender+" "):"";
//                             description+=!!item.born_year?this.props.intl.formatMessage({id: 'Born Year'})+item.born_year:"";
//                             description+=!!item.died_year?"  "+this.props.intl.formatMessage({id: 'Died Year'})+item.died_year:"";
//
//                         }
//                         const matcheDess = match(description, searchValue);
//                         const partDess = parse(description, matcheDess);
//                         var imgUrl=!!item.basic_cover_url?item.basic_cover_url.indexOf("/images")==0?null:item.basic_cover_url:null;
//                         //var link = getResourceLink(libId, item.basic_title_url);
//                         var link = getResourceLink(libId, item.basic_title_url|| item.basic_link_url||item.person_id||item.primary_id,type,item.url);
//                         //var isChecked=this.props.searchResult.pageInfos.selectedMyIndex.findIndex(sitem=>sitem.webpageId==item.webpageId)>=0;
//
//                         arr.push(
//                             <div className="singleResultList" key={"table"+index} style={{position:"relative"}}>
//
//                                 <Divider light/>
//                                 <ListItem key={`list_${index}`}>
//                                     <ListItemText primary={
//                                   <Row>
//                                    <Col  md={3}>
//
//                                   <a onClick={()=>this.saveSourceClick(item,searchValue,libId,link)}
//                                 target="_blank" style={{marginRight:"5px"}} href={link}>    {parts.map((part, index) => {
//                                 return part.highlight ? (
//                                     <span key={String(index)} style={{ color:'#b53535',fontSize:'14px'}}>
//               <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
//             </span>
//                                 ) : (
//                                     <strong key={String(index)} style={{ fontWeight: 'bold',fontSize:'14px' }}>
//                                        <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
//                                     </strong>
//                                 );
//                             })}</a>
//                                    </Col>
//
//                                     <Col  md={2}>
//                                      <span>{partAuthor.map((part, index) => {
//                                 return part.highlight ? (
//                                     <span key={String(index)} style={{ color:'#b53535',fontSize:'13px'}}>
//               {part.text}
//             </span>
//                                 ) : (
//                                     <span key={String(index)} style={{ fontSize:'13px' }}>
//                                         {part.text}
//                                     </span>
//                                 );
//                             })}
//                             </span>
//
//
//                                     </Col>
//
//                                      <Col  md={2}>
//                                      <span>{partYear.map((part, index) => {
//                                 return part.highlight ? (
//                                     <span key={String(index)} style={{ color:'#b53535',fontSize:'13px'}}>
//               {part.text}
//             </span>
//                                 ) : (
//                                     <span key={String(index)} style={{ fontSize:'13px' }}>
//                                         {part.text}
//                                     </span>
//                                 );
//                             })}
//                             </span>
//
//                                      </Col>
//
//                                      <Col md={2}>
//                                      <FormattedMessage id={item.message_type}/>
//                                      </Col>
//                        <Col  md={3}>
//
//
//                                             <div >
//                                            {partDess.map((part, index) => {
//                                 return part.highlight ? (
//                                     <span key={String(index)} style={{ color:'#b53535',fontSize:'14px'}}>
//               {part.text}
//             </span>
//                                 ) : (
//                                     <span key={String(index)} style={{ fontSize:'14px' }}>
//                                         {part.text}
//                                     </span>
//                                 );
//                             })}
// </div></Col>
//                                 </Row>
//                                 }/>
//
//                                 </ListItem></div>);
//                         return arr;
//                     }, [])
//                     }
//
//                     <Divider light/>
//
//
//                 </List>
//
//             </div>
//
//
//         }
//
//         else if(!this.props.searchResult.pageInfos.isAccessing&&(!!dataList&&dataList.length==0)) return <NoData/>;
//     }

    renderMyPage(data){
        const {libId, classes, type,queryType} =this.props;
        var dataList = data.content||data.documentcontent||data.list;
        var searchValue = this.props.searchResult.searchTitle;
        var isEditing=this.props.searchResult.pageInfos.editMyIndex&&type==3&&libId!="gsd_notes";
        if (!!dataList && dataList.length > 0) {

            return <div className={classes.rootPage}
                        elevation={1}>
                {this.renderToolBars()}
                <div style={{color:"#9a9a9a",fontSize:"13px"}}><FormattedMessage
                    id="SEARCH_RESULT_NUM"
                    values={{
        resultNum: <span style={{color:"#b53535"}}>{data.contentnum||data.documentnum||data.num}</span>
    }}
                /></div>
                <List component="nav">
                    { dataList.reduce((arr, item, index)=> {
                        const matches = match(item.basic_title||(item.title||"").replace(/<\/?.+?>/g,"")||item.person_name, searchValue);
                        const parts = parse(item.basic_title||(item.title||"").replace(/<\/?.+?>/g,"")||item.person_name, matches);


                        var description="";
                        if(!!item.url){
                            var reg = /^http(s)?:\/\/(.*?)\//

                            description=reg.exec(item.url||"")[2];
                        }



                        var tagHtml="";
                        if(!!item.tag){
                            var tags=item.tag.split('%%%');
                            tagHtml=tags.reduce((arr,item)=>{
                                if(!!item&&item!="null"){
                                    arr.push(`<span class="smallTag">${item}</span>`);
                                }
                                return arr;
                            },[]).join("");
                        }

                        const matcheDess = match(description, searchValue);
                        const partDess = parse(description, matcheDess);


                        var imgUrl=!!item.basic_cover_url?item.basic_cover_url.indexOf("/images")==0?null:item.basic_cover_url:null;
                        //var link = getResourceLink(libId, item.basic_title_url);
                        var link = getResourceLink(libId, item.basic_title_url||item.basic_link_url||item.person_id||item.primary_id,type,item.url);
                        var isChecked=this.props.searchResult.pageInfos.selectedMyIndex.findIndex(sitem=>sitem.webpageId==item.webpageId)>=0;
                        var indexId=(item.proc_dxid||item.documentId||item.primary_id||item.person_id||item.webpageId);
                        var isCheckedToCompare=this.state.selectedDataList.findIndex(sitem=>sitem==indexId)>=0;
                        arr.push(
                            <div className={!isCheckedToCompare?"singleResultList":"singleResultList active"} key={`list_${index}`} onClick={(e)=>this.setSinglePageSelectedItemByListItem(item)}>
                                <Divider light/>
                                <ListItem >
                                    <ListItemText primary={
                                  <Row>
{queryType!=3&&<div className="singlePage-checkbox"><Checkbox  checked={isCheckedToCompare}  onChange={(e)=>this.setSinglePageSelectedItem(e,item)} style={{marginLeft:"10px"}} className="gsd-check"/></div>}
                                  {!!imgUrl&&<Col xs={4} sm={3} md={2}>
                                  {!!imgUrl&&<img style={{"width":"100%"}} src={imgUrl}/>}

</Col>}
  {/* <Col  sm={!!imgUrl?9:11} smOffset={!!imgUrl?0:1} style={{"paddingLeft":isEditing?'0px':'0'}}> */}
  <Col  sm={!!imgUrl?9:11} style={{"paddingLeft":isEditing?'0px':'0'}}>
  <div className={isEditing?"list-edit-col aviliable":"list-edit-col"}><Checkbox style={{marginLeft:"10px"}} checked={isChecked} onChange={(e)=>this.setSelectedItem(e,item)} className="gsd-check"/>
  {
  // <Button  className={classes.buttonEdit} compoment="a" target="_blank" href={"/editMyIndexs?indexId="+item.webpageId} variant="outlined"
  //                   size="small"><FormattedMessage id="EDIT"/></Button>
  //                   <Button  className={classes.buttonEdit} onClick={()=>this.deleteSource(item)} variant="outlined"
  //                   size="small"><FormattedMessage id="DELETE"/></Button>
                    }
  </div>
  <a onClick={()=>this.saveSourceClick(item,searchValue,libId,link)}
                                target="_blank" style={{marginRight:"5px"}} href={link}>    {parts.map((part, index) => {
                                return part.highlight ? (
                                    <span key={String(index)} style={{ color:'#b53535',fontSize:'14px'}}>
             <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
            </span>
                                ) : (
                                    <strong key={String(index)} style={{ fontWeight: 'bold',fontSize:'14px' }}>
                                    <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
                                    </strong>
                                );
                            })}</a>
                                        <span
                                            className="link-desc">{item.time}


                            </span>



                                            <div className="content-desc">
                                           <span style={{marginRight:'3px'}}>{partDess.map((part, index) => {
                                return part.highlight ? (
                                    <span key={String(index)} style={{ color:'#b53535',fontSize:'14px'}}>
           <span dangerouslySetInnerHTML={{__html: part.text}}></span>
            </span>
                                ) : (
                                    <span key={String(index)} style={{ fontSize:'14px' }}>
                                        <span dangerouslySetInnerHTML={{__html: part.text}}></span>
                                    </span>
                                );
                            })}</span>
                             <span style={{display:'inline-block'}}> <div dangerouslySetInnerHTML={{__html: tagHtml}}></div></span>
</div></Col>
                                </Row>
                                }/>

                                </ListItem></div>);
                        return arr;
                    }, [])
                    }

                    <Divider/>


                </List>

            </div>


        }

        else if(!this.props.searchResult.pageInfos.isAccessing&&!!dataList&&dataList.length==0) return <NoData/>;
    }



    renderSecondDeepPage(data) {

        const {libId, classes, type,queryType} =this.props;
        var dataList = data.content||data.documentcontent||data.list;
        var searchValue = this.props.searchResult.searchTitle;
        var isEditing=this.props.searchResult.pageInfos.editMyIndex&&type==3&&libId!="gsd_notes";
        if (!!dataList && dataList.length > 0) {

            return <div className={classes.rootPage}
                          elevation={1}>
                {this.renderToolBars()}
                <div style={{color:"#9a9a9a",fontSize:"13px"}}><FormattedMessage
                    id="SEARCH_RESULT_NUM"
                    values={{
        resultNum: <span style={{color:"#b53535"}}>{data.contentnum||data.documentnum||data.num}</span>
    }}
                /></div>
                <List component="nav">
                    { dataList.reduce((arr, item, index)=> {
                        const matches = match(item.basic_title||(item.title||"").replace(/<\/?.+?>/g,"")||item.person_name, searchValue);
                        const parts = parse(item.basic_title||(item.title||"").replace(/<\/?.+?>/g,"")||item.person_name, matches);

                        const matcheAuthor = match(item.basic_creator||item.edition||item.jiguan||item.author, searchValue);
                        const partAuthor = parse(item.basic_creator||item.edition||item.jiguan||item.author, matcheAuthor);

                        const matcheYear = match(item.basic_date_time||item.dynasty||item.year||item.basic_position, searchValue);
                        const partYear = parse(item.basic_date_time||item.dynasty||item.year||item.basic_position, matcheYear);



                        var description=!!(item.basic_description||item.digest)?((item.basic_description||item.digest).length>100?((item.basic_description||item.digest).substring(0,100)+"..."):(item.basic_description||item.digest)):"";
                        if(!description){
                            description="";
                            description+=!!item.author?(item.author+""):"";
                            description+=!!item.collection?(item.collection+""):"";
                            description+=!!item.notes?(item.notes+""):"";
                            description+=!!item.edtion?(item.edtion+""):"";
                        }
                        if(!description){
                            description="";
                            description+=!!item.gender?(item.gender+" "):"";
                            description+=!!item.born_year?this.props.intl.formatMessage({id: 'Born Year'})+item.born_year:"";
                            description+=!!item.died_year?"  "+this.props.intl.formatMessage({id: 'Died Year'})+item.died_year:"";

                        }

                        if(!!item.basic_interesets){
                            description+='<br/>'+item.basic_interesets;
                        }
                        if(!!item.basic_orcid){
                            description+='<br/>'+'orcid:'+item.basic_orcid;
                        }

                        if(!!item.basic_publicationnumber){
                            description+='<br/>'+'publicationnumber:'+item.basic_publicationnumber;
                        }
                        if(!!item.basic_scopusID){
                            description+='<br/>'+'scopusID:'+item.basic_scopusID;
                        }

                        var tagHtml="";
                        if(!!item.tag){
                            var tags=item.tag.split('%%%');
                            tagHtml=tags.reduce((arr,item)=>{
                                if(!!item&&item!="null"){
                                    arr.push(`<span class="smallTag">${item}</span>`);
                                }
                                return arr;
                            },[]).join("");
                        }

                        const matcheDess = match(description, searchValue);
                        const partDess = parse(description, matcheDess);


                        var imgUrl=!!item.basic_cover_url?item.basic_cover_url.indexOf("/images")==0?null:item.basic_cover_url:null;
                        //var link = getResourceLink(libId, item.basic_title_url);
                        var link = getResourceLink(libId, item.basic_title_url||item.basic_link_url||item.person_id||item.primary_id,type,item.url);
                        var isChecked=this.props.searchResult.pageInfos.selectedMyIndex.findIndex(sitem=>sitem.webpageId==item.webpageId)>=0;
                        var indexId=(item.proc_dxid||item.documentId||item.primary_id||item.person_id||item.webpageId);
                        var isCheckedToCompare=this.state.selectedDataList.findIndex(sitem=>sitem==indexId)>=0;
                        arr.push(
                            <div className={!isCheckedToCompare?"singleResultList":"singleResultList active"} key={`list_${index}`} onClick={(e)=>this.setSinglePageSelectedItemByListItem(item)}>
                                <Divider light/>
                                <ListItem >
                                    <ListItemText primary={
                                  <Row>
{queryType!=3&&libId!="gsd_notes"&&<div className="singlePage-checkbox"><Checkbox  checked={isCheckedToCompare}  onChange={(e)=>this.setSinglePageSelectedItem(e,item)} style={{marginLeft:"10px"}} className="gsd-check"/></div>}
                                  {!!imgUrl&&<Col xs={4} sm={3} md={2}>
                                  {!!imgUrl&&<img style={{"width":"100%"}} src={imgUrl}/>}

</Col>}
  {/* <Col  sm={!!imgUrl?9:11} smOffset={!!imgUrl?0:1} style={{"paddingLeft":isEditing?'0px':'0'}} className={libId=="gsd_notes"?"marL0":""}> */}
  <Col  sm={!!imgUrl?9:11} style={{"paddingLeft":isEditing?'0px':'0'}} className={libId=="gsd_notes"?"marL0":""}>
  <div className={isEditing?"list-edit-col aviliable":"list-edit-col"}><Checkbox style={{marginLeft:"10px"}} checked={isChecked} onChange={(e)=>this.setSelectedItem(e,item)} className="gsd-check"/>
  {
  // <Button  className={classes.buttonEdit} compoment="a" target="_blank" href={"/editMyIndexs?indexId="+item.webpageId} variant="outlined"
  //                   size="small"><FormattedMessage id="EDIT"/></Button>
  //                   <Button  className={classes.buttonEdit} onClick={()=>this.deleteSource(item)} variant="outlined"
  //                   size="small"><FormattedMessage id="DELETE"/></Button>
                    }
  </div>
  {libId=="gsd_notes"&&<Glyphicon glyph="trash" style={{fontSize:'1rem',marginRight:"10px",cursor:"pointer"}} onClick={()=>this.deleteSource(item)}/>}
  {libId=="gsd_notes"&&<Glyphicon glyph="pencil" style={{fontSize:'1rem',marginRight:"10px",cursor:"pointer"}} onClick={()=>this.editMyNote(item)}/>}  
  <a onClick={()=>this.saveSourceClick(item,searchValue,libId,link)}
                                target="_blank" style={{marginRight:"5px"}} href={link}>    {parts.map((part, index) => {
                                return part.highlight ? (
                                    <span key={String(index)} style={{ color:'#b53535',fontSize:'14px'}}>
            <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
            </span>
                                ) : (
                                    <strong key={String(index)} style={{ fontWeight: 'bold',fontSize:'14px' }}>
                                     <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
                                    </strong>
                                );
                            })}</a>
                                {
                                    libId == "gsd_baidutiku1" ?
                                    (
                                        <span style={{ fontWeight: 'bold',fontSize:'14px' }}>{item.basic_contributor +" "+ item.basic_category_no + " "+ item.basic_sourcename + " "+ item.basic_title1+ " "+ (item.basic_description||"")}</span>
                                    )
                                    :
                                    (
                                        null
                                    )                                                    
                                }
                                        <span
                                            className="link-desc">{partAuthor.map((part, index) => {
                                return part.highlight ? (
                                    <span key={String(index)} style={{ color:'#b53535',fontSize:'13px'}}>
              {part.text}
            </span>
                                ) : (
                                    <span key={String(index)} style={{ fontSize:'13px' }}>
                                        {part.text}
                                    </span>
                                );
                            })}

                            &nbsp;&nbsp;{partYear.map((part, index) => {
                                return part.highlight ? (
                                    <span key={String(index)} style={{ color:'#b53535',fontSize:'13px'}}>
              {part.text}
            </span>
                                ) : (
                                    <span key={String(index)} style={{ fontSize:'13px' }}>
                                        {part.text}
                                    </span>
                                );
                            })}
                            </span>

                            <span style={{display:'inline-block'}}> <div dangerouslySetInnerHTML={{__html: tagHtml}}></div></span>

                                            <div className="content-desc">
                                           {partDess.map((part, index) => {
                                return part.highlight ? (
                                    <span key={String(index)} style={{ color:'#b53535',fontSize:'14px'}}>
           <span dangerouslySetInnerHTML={{__html: part.text}}></span>
            </span>
                                ) : (
                                    <span key={String(index)} style={{ fontSize:'14px' }}>
                                        <span dangerouslySetInnerHTML={{__html: part.text}}></span>
                                    </span>
                                );
                            })}
</div></Col>
                                </Row>
                                }/>

                                </ListItem></div>);
                        return arr;
                    }, [])
                    }

                    <Divider light/>


                </List>

            </div>


        }

        else if(!this.props.searchResult.pageInfos.isAccessing&&!!dataList&&dataList.length==0) return <NoData/>;
    }


    onPageChange(pageNum) {

        if (this.props.searchResult.pageInfos.isAccessing)return;

        this.setState({currentPage: pageNum - 1});
        this.getResultDatas(this.userId,pageNum - 1);
    }

    renderLoadMore(){
        const {queryType} = this.props;
        var total=this.state.resultDataList.contentnum||this.state.resultDataList.documentnum||this.state.resultDataList.num
        var dataList = this.state.resultDataList.content||this.state.resultDataList.documentcontent||this.state.resultDataList.list;
        var visble=true;
        if(total<=this.state.currentPage*this.state.pageSize){
            visble=false;
        }
       
        var noData=!this.props.searchResult.pageInfos.isAccessing&&(!!dataList&&dataList.length==0);

        if (queryType == 2 || queryType == 3 || queryType == 4) {//需要分页
            return <div ref={(ref)=>this.loadMoreRef=ref} style={{visibility:noData?"hidden":"visible"}}>
                <div style={{display:this.state.isEnded&&visble?"block":'none',marginTop:'1rem'}} ref={(ref)=>this.loadMoreBtn=ref}><h4 style={{textAlign:'center'}}><a style={{color:"#888",borderColor:"#ffffff"}} className="btn btn-default"><FormattedMessage id="The Last Data"/></a></h4></div>
                <div style={{display:this.state.isEnded&&visble?"none":'block',marginTop:'1rem'}} ref={(ref)=>this.loadMoreBtn=ref}><h4 style={{textAlign:'center'}}><a className="btn btn-default"><FormattedMessage id="Load More"/></a></h4></div></div>
        }
        return null;

    }

    scrollPage(e){
        var offset=this.getOffsetTop();
        if(this.offsetTop!=null&&this.offsetTop>offset){//向下滑动
            console.log(offset);
            this.isLoadingMore=true;
            var total=this.state.resultDataList.contentnum||this.state.resultDataList.documentnum||this.state.resultDataList.num||0;
            var dataList = this.state.resultDataList.content||this.state.resultDataList.documentcontent||this.state.resultDataList.list||[];
            if(offset<=100&&total>dataList.length&&this.state.currentPage*this.state.pageSize<=total&&!this.props.searchResult.pageInfos.isAccessing){
                this.setState({currentPage:this.state.currentPage+1});
                this.getResultDatas(this.userId);
            }

            if(total<=dataList.length||total<=this.state.currentPage*this.state.pageSize){
                this.setState({isEnded:true});
            }
        }else{
            if(!this.props.searchResult.pageInfos.isAccessing)this.isLoadingMore=false;
        }
        this.offsetTop=offset;



        // // console.log(this.getOffsetTop());
        // if(this.getOffsetTop()>400){//开始加载新数据
        //     if (this.props.searchResult.pageInfos.isAccessing)return;
        //     const {queryType} = this.props;
        //     var data;
        //     if (queryType == 2) {//二级页面数据
        //         data = this.props.searchResult.secondPageResult || {};
        //
        //     } else if (queryType == 3) {//期刊
        //         data = this.props.searchResult.jnPageResult || {};
        //
        //     } else if (queryType == 4) {//图书
        //         data = this.props.searchResult.bkPageResult || {};
        //     }
        //     var dataList = data.content||data.documentcontent||data.list;
        //     var num=data.contentnum||data.documentnum||data.num;
        //     if(dataList.length<=num){
        //         this.getResultDatas(this.userId,this.state.currentPage+1);
        //         this.setState({currentPage: this.state.currentPage+1});
        //     }else{
        //         this.setState({isEnded:true});
        //     }
        //
        // }
    }
    // renderPagination() {
    //     const {queryType} = this.props;
    //     var data;
    //     if (queryType == 2) {//二级页面数据
    //         data = this.props.searchResult.secondPageResult || {};
    //
    //     } else if (queryType == 3) {//期刊
    //         data = this.props.searchResult.jnPageResult || {};
    //
    //     } else if (queryType == 4) {//图书
    //         data = this.props.searchResult.bkPageResult || {};
    //     }
    //     if (queryType == 2 || queryType == 3 || queryType == 4) {//需要分页
    //         // var pageNum=parseInt((data.num||0)/20)+1;
    //         if (!!data && (data.contentnum||data.documentnum||data.num) > 0) {
    //             return <Pagination style={{marginTop:'20px'}} className="gsd-pagination" showQuickJumper current={this.state.currentPage+1}
    //                                total={data.contentnum||data.documentnum||data.num} pageSize={20}
    //                                onChange={(pageNumber)=>this.onPageChange(pageNumber)}/>;
    //         }
    //     }
    //     return null;
    // }

    renderSearchResult() {
        const {queryType} = this.props;
        // var dataList;
        // if (queryType == 2) {//二级页面数据
        //     dataList = this.props.searchResult.secondPageResult || {};
        //     return this.renderSecondDeepPage(dataList);
        // } else if (queryType == 3) {//期刊
        //     dataList = this.props.searchResult.jnPageResult || {};
        //     return this.props.searchResult.pageInfos.allPageMode === "list" ?this.renderSecondDeepPage(dataList):this.renderSecondTablePage(dataList);;
        // } else if (queryType == 4) {//图书
        //     dataList = this.props.searchResult.bkPageResult || {};
        //     return this.renderSecondDeepPage(dataList);
        // }

        if (queryType == 3){//我的页面
            return this.renderMyPage(this.state.resultDataList);
        }else{
            return this.renderSecondDeepPage(this.state.resultDataList);
        }


    }

    getLiteratureIds(){

        var data = this.state.resultDataList;

        var dataList = data.content||data.documentcontent||data.list;
        var _self=this;
        var dataList=dataList.filter(item=>{
            var indexId=(item.proc_dxid||item.documentId||item.primary_id||item.person_id||item.webpageId);
            return _self.state.selectedDataList.findIndex(sitem=>sitem==indexId)>=0;
           // return item;
        })
        return dataList;
        //return this.state.selectedDataList;
    }

    renderToolBars(){
        const {libId, classes, type} =this.props;
        var data = this.state.resultDataList;

        var dataList = data.content||data.documentcontent||data.list;
        console.log(dataList.length);
        console.log(this.state.selectedDataList.length);
        return (<div className="singlePage-toolbar" style={{paddingTop:type!=3?'30px':'0'}}>

            {
                type!=3&&(this.state.selectedDataList.length==0||dataList.length>this.state.selectedDataList.length)&&
                <Button className={classes.btnStyle}
                        style={{marginLeft:'1rem'}}
                        onClick={()=>this.selectAll()}
                        size="small"
                ><i className="fa fa-check-circle-o"/>&nbsp;<FormattedMessage id="Select_ALL"/>
                </Button>


            }

            {
                type!=3&&(dataList.length==this.state.selectedDataList.length)&&
                <Button className={classes.btnStyle} style={{marginLeft:'1rem'}}
                        onClick={()=>this.unSelectAll()}
                        size="small"
                ><i className="fa fa-circle-o"/>&nbsp;<FormattedMessage id="UnSelect_ALL"/>
                </Button>


            }



            {/* {type!=3&&
            <Badge classes={{badge:this.state.selectedDataList.length>0?classes.badge:classes.badgeHide}} badgeContent={this.state.selectedDataList.length} color="primary"><Button
            className={classes.btnStyle}
            style={{marginLeft:'1rem'}}
            disabled={this.state.selectedDataList.length==0}
            onClick={()=>this.setState({openTagDialog:!this.state.openTagDialog})}
            variant="outlined" size="small">
            <i className="fa fa-tasks"> </i>&nbsp;<FormattedMessage id="Add to Compare"/>
        </Button>
                </Badge>
       } */}

            {(type==1||type==0)&&<FilterComp location={this.props.location} />}


            <Dialog onClose={()=>{this.setState({openTagDialog:false});this.props.setSearchResultPageInfos({openTagDialog:false})}}  open={this.state.openTagDialog}>
                <div style={{padding:'15px',minWidth:'300px'}}>
                    <CompareTags type={type} channel={libId} getLiteratureIds={()=>this.getLiteratureIds()} closeDialog={()=>{this.setState({openTagDialog:false});this.props.setSearchResultPageInfos({openTagDialog:false})}}/>
                </div>
                </Dialog>

            <Dialog onClose={()=>{this.setState({openImportTextToolDialog:false});this.props.setSearchResultPageInfos({openImportTextToolDialog:false})}}  open={this.state.openImportTextToolDialog}>
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
                                TEXT_TOOL_MENUS.map(item=>  <Menu.Item disabled={item.id!="menu-txt-01"?(this.state.selectedDataList.length==1?false:true):(this.state.selectedDataList.length>1?false:true)} key={item.id}><a><FormattedMessage id={item.name}/></a></Menu.Item>)

                            }
                        </Menu>
                        <div style={{marginTop:"20px",textAlign:"right"}}>
                            <Button variant="contained" className={classes.buttonOk} onClick={()=>this.toImportTextTool(0)} size="small"><FormattedMessage
                                id="Import Note To Text Tools"/></Button>
                            &nbsp;
                            <Button variant="contained" className={classes.buttonOk1} onClick={()=>this.toImportTextTool(1)} size="small"><FormattedMessage
                                id="Import All To Text Tools"/></Button>
                            &nbsp;
                            <Button size="small" style={{textAlign:"center",display:'inline-block',border: "solid 1px #afaaaa"}} onClick={()=>{this.setState({openImportTextToolDialog:false,selectedTextToolItem:null});this.props.setSearchResultPageInfos({openImportTextToolDialog:false})}}><FormattedMessage
                                id="CANCEL"/></Button>
                        </div>
                    </div>

                </div>
            </Dialog>


        </div>)
    }


    toImportTextTool(type){//引入到文本工具中去

        this.props.setSearchResultPageInfos({openImportTextToolDialog:false});
        console.log(this.state.selectedTextToolItem);
        if(!!this.state.selectedTextToolItem){
            var data = this.state.resultDataList;

            var dataList = data.content||data.documentcontent||data.list;
            var _self=this;
            var dataList=dataList.filter(item=>{
                var indexId=(item.proc_dxid||item.documentId||item.primary_id||item.person_id||item.webpageId);
                return _self.state.selectedDataList.findIndex(sitem=>sitem==indexId)>=0;
                // return item;
            });


            var strList=dataList.map(item=>{
                if(type==0){
                    return item.note;
                }else{
                    return item.email_content;
                }
            });
            console.log(strList);
            var b = new Buffer(JSON.stringify(strList));
            var s = b.toString('base64');
            console.log(s);
            var href=TEXT_TOOL_MENUS.find(sitem=>sitem.id==this.state.selectedTextToolItem.key).href;

            window.open("toolPages/"+href+"?t="+encodeURIComponent(s))
            this.setState({selectedTextToolItem:null,openImportTextToolDialog:false});

        }else{
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

    render() {


        return (
            <div style={{width:'100%'}}>


                {<div>{this.renderSearchResult()} </div>  }
                {this.props.searchResult.pageInfos.isAccessing && <div>{this.renderSkeletons()}</div>  }
                {
                    this.renderLoadMore()
                     //this.renderPagination()
                }
            </div>

        );
    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        searchResult: state.searchResult,
        filter: state.filter
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getSinglgPageResultByArguments: (argument, dataIndex, currentPage, pageSize, clusternames, channels,type=0,libId,userId,timeSort=0,header,degree=null,choren=null)=>dispatch(getSinglgPageResultByArguments(argument, dataIndex, currentPage, pageSize, clusternames, channels,type,libId,userId,timeSort,header,degree,choren)),
        saveHistoryResourceRecord:(userId,searchValue,title1="",title2="",url="",header)=>dispatch(saveHistoryResourceRecord(userId,searchValue,title1,title2,url,header)),
        setSearchResultPageInfos:(pageInfos)=>dispatch(setSearchResultPageInfos(pageInfos)),
        deleteMyIndexsDataInSearchResult: (userId, noteIds, header) => dispatch(deleteMyIndexsDataInSearchResult(userId, noteIds, header)),

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles, {withTheme: true})(SingleResultPageList)));
