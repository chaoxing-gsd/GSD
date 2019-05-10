/**
 * Created by Aaron on 2018/7/13.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router';
import {checkIsMobile} from "../../utils/utils"
import {Grid, Row, Col} from 'react-bootstrap';
import {browserHistory} from 'react-router'
import {getResultByArguments, saveHistoryResourceRecord} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import Button from '@material-ui/core/Button';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {withStyles} from '@material-ui/core/styles';
import {getResourceLink, buildBaseArgument, buildClusters, buildChannels} from "../../utils/utils"
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import swal from 'sweetalert2'
import ChildClusterResultItem from './ChildClusterResultItem';
import ReactDOM from 'react-dom'
const CHILDREN_LIBS = {//后台暂时没有更改数据结构,前台记录
    "DT": [{//degree 1（学士），2（硕士），3（博士） ,choren语言分类 传1 中文，2英文
        degree: '1'
    }, {degree: '2'}, {degree: '3'}],
    "CP": [{"choren": "1"}, {"choren": "2"}]

};

const styles = theme => ({
    rootPage: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        width: '100%'
    },
    buttonAdd: {
        display: "inline-block",
        color: "#a2a1a1",
        border: "none",
        fontSize: "12px",
        minWidth: '30px',
        minHeight: "30px",
        '&:hover': {
            // backgroundColor: "#d45f5f",
            // color:"#ffffff"

        },
    },
    menuItem: {
        fontSize: "12px",
        padding: '0.2rem 1rem',
        color: "#6b6b67",
        '&:hover': {},
    },
});


class ClusterResultItem extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        classes: PropTypes.object.isRequired,
        theme: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.initSearchTitle;
        this.isloaded = false;
        this.state = {anchorEl: null};
        this.handleScroll = this.handleScroll.bind(this);

        this.cxId;
        this.header={};
    }

    handleScroll(e) {
        const {libId, type} =this.props;

        if (this.getOffsetTop() < 1500 && !this.isloaded) {
            this.isloaded = true;
            this.props.getResultByArguments(buildBaseArgument(this.props.searchResult.searchTitle, libId, type), libId, 0, 5, buildClusters(type), buildChannels(libId, type), type);
            this.props.getResultByArguments(buildBaseArgument(this.props.searchResult.searchTitle, libId, type), libId, 0, 5, buildClusters(type), buildChannels(libId, type), type,null,null,this.cxId,this.header);
        }
    }

    getOffsetTop() {
        var rect = ReactDOM.findDOMNode(this)
            .getBoundingClientRect();
        var clientHeight = document.body.clientHeight;
        var offsetTop = rect.top - clientHeight;
        return offsetTop;
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    componentDidMount() {
         //查看是否登陆
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            this.header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
        }

        this.initSearchTitle = this.props.searchResult.searchTitle;
        if (!!this.initSearchTitle) {
            const {libId, type} =this.props;
            //if(!this.props.searchResult.allSearchResult[libId])
            if (this.getOffsetTop() < 1500) {
                this.isloaded = true;
                this.props.getResultByArguments(buildBaseArgument(this.initSearchTitle, libId, type), libId, 0, 5, buildClusters(type), buildChannels(libId, type), type,null,null,this.cxId,this.header);
            }
        }
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.searchResult.searchTitle != this.props.searchResult.searchTitle) {
            const {libId, type} =this.props;
            this.isloaded = false;
            const searchValue = nextProps.searchResult.searchTitle;
            if (this.getOffsetTop() < 1500) {
                this.isloaded = true;
                this.props.getResultByArguments(buildBaseArgument(searchValue, libId, type), libId, 0, 5, buildClusters(type), buildChannels(libId, type), type,null,null,this.cxId,this.header);
            }
        }


    }


    toSecondeResultPage(channel, searchValue, type) {
        browserHistory.push('/ssearch?searchValue=' + searchValue + "&channel=" + channel + "&type=" + type);
        var header = {
            userid: this.props.userInfos.responseUserInfo.userid,
            token: this.props.userInfos.responseUserInfo.token
        };
        if (this.props.userInfos.isLogined)this.props.saveHistoryResourceRecord(this.props.userInfos.responseUserInfo.userid, searchValue, channel, "", "", header);
    }

    saveSourceClick(item, searchValue, channel, url) {

        if (this.props.userInfos.isLogined) {
            var header = {
                userid: this.props.userInfos.responseUserInfo.userid,
                token: this.props.userInfos.responseUserInfo.token
            };
            this.props.saveHistoryResourceRecord(this.props.userInfos.responseUserInfo.userid, searchValue, channel, item.basic_title || item.title, url, header);
        }
    }

    handleDropDownOpen(e) {
        this.setState({anchorEl: e.currentTarget});
    }

    sourceOperate(option) {
        this.setState({anchorEl: null});
        if (option.value == 0 || option.value == 1) {
            swal({
                title: this.props.intl.formatMessage({id: 'IsDeveloping'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
        }
    }

    renderPopTitle(item, link) {
        const {classes}=this.props;
        const {anchorEl}=this.state;
        const options = [
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
                // <Button compoment="a" href={link} target="_blank" className={classes.buttonAdd} variant="outlined"
                //         size="small"><i className="fa fa-eye"></i></Button>
            }

        </div>;
    }

    renderPopContent(content) {
        var description = !!content.basic_description ? (content.basic_description.length > 100 ? (content.basic_description.substring(0, 100) + "...") : content.basic_description) : "";
        return <div className="popContent">
            <p><span className="popTitleLabel"><FormattedMessage id="Author"/>:</span>{content.basic_creator}</p>
            <p><span className="popTitleLabel"><FormattedMessage id="Source"/>:</span>{content.basic_sourcename}</p>
            <p><span className="popTitleLabel"><FormattedMessage
                id="TYPE_NAME_keywordList"/></span>:{content.basic_keyword}</p>
            <p><span className="popTitleLabel"><FormattedMessage id="Publisher"/>:</span>{content.basic_publisher}</p>
            <p><span className="popTitleLabel"><FormattedMessage id="Category_no"/>:</span>{content.basic_category_no}
            </p>
            <p><span className="popTitleLabel"><FormattedMessage id="Publish_Time"/>:</span>{content.basic_date_time}
            </p>
            <p><span className="popTitleLabel"><FormattedMessage id="Description"/>:</span>{description}</p>
        </div>;
    }

    renderItemOperateButton(wikiUrl, libLink) {
        const {classes} =this.props;
        const {itemAnchorEl}=this.state;
        const options = [
            {value: "0", label: "Wiki"},
            {
                value: "1", label: <FormattedMessage
                id="View"
            />
            },

        ];
        return <div>
            <Button onClick={(e)=> this.setState({ itemAnchorEl: e.currentTarget})} className={classes.buttonAdd}
                    variant="outlined" size="small"><i className="glyphicon glyphicon-option-vertical"></i></Button>
            <Menu
                anchorEl={itemAnchorEl}
                open={Boolean(itemAnchorEl)}
                onClose={()=>{this.setState({ itemAnchorEl: null });}}
                PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: 80,
            },
          }}
            >
                {options.map(option => (
                    <MenuItem compoment="a" target="_blank" className={classes.menuItem} key={option.value}
                              onClick={()=>this.setState({ itemAnchorEl: null})}>
                        <a style={{color:"#6c6c68"}} target="_blank"
                           href={option.value==0?wikiUrl:libLink}>{option.label}</a>
                    </MenuItem>
                ))}
            </Menu>
        </div>

    }


    renderChildListMode() {
        const {libId, classes, type, index} =this.props;


    }

    renderListMode() {
        const {libId, classes, type, index} =this.props;
        const data = this.props.searchResult.allSearchResult[libId];
        const accesed = this.props.searchResult.allSearchResultAccessing[libId] === "stop";//true为获取到数据,false为取数据中
        const searchValue = this.props.searchResult.searchTitle;
        const noData = (!!data && ((!!data.content && data.content.length > 0) || (!!data.documentcontent && data.documentcontent.length > 0)) && accesed) || !accesed;//true则显示
        var locale = this.props.userInfos.language || 'auto';
        if (locale == 'auto') {
            var lang = navigator.language;
            var locale = "en";
            if (lang === "zh" || lang === "zh-CN" || lang === "zh-TW") {
                locale = "zh";
            }
        }

        var LIB_NAME = this.props.intl.formatMessage({id: libId});
        var wikiUrl = "";
        console.log(data);
        var gsdLib = !!data ? data.gsdLib : null;
        if (!!gsdLib && Object.keys(gsdLib).length > 0) {
            LIB_NAME = locale == 'zh' ? gsdLib.namecha : gsdLib.nameeng;
            wikiUrl = gsdLib.wiki;
        }

        if (libId === 'DT'||libId==='CP') {//包含子分类的
            var childLisbs = CHILDREN_LIBS[libId];

            if (!!childLisbs && childLisbs.length > 0) {
                var isOddNumber = childLisbs.length % 2 != 0;
                var compomentArray = childLisbs.reduce((arr, item, index)=> {
                    if (index + 1 == childLisbs.length && isOddNumber) {//最后一行只有一个子元素
                        arr.push(<div className="col-sm-12"><ChildClusterResultItem libId={libId} type={type} key={index}
                                                                                    degree={item.degree}
                                                                                    choren={item.choren}/></div>);
                    } else {
                        arr.push(<div className="col-sm-6"><ChildClusterResultItem libId={libId} type={type} key={index}
                                                                                   degree={item.degree}
                                                                                   choren={item.choren}/></div>);
                    }

                    return arr;
                }, []);


                return <div style={{overflow:'hidden'}}> <div className="row multi-child-cluster" >
                    <div className="result-total-title clearfix">
                        <div style={{textAlign:"left",marginTop:'20px',}}>
                            <span style={{float:"left",marginLeft:'45px'}}
                                  className={`type-logo type-${libId.replace(/,/g,"_")}-type-logo`}></span>
                            <span
                                style={{float:"left"}}>
                                <h4 className="title-name" style={{display:"inline-block",fontSize:"1.4rem",color: "#777171",marginLeft:'15px'}}>
                                    {LIB_NAME}
                                </h4>
                            </span>
                            {!!wikiUrl && <a href={wikiUrl} className="lib-toolLink" target="_blank" alt="wiki"><i
                                className="fa fa-wikipedia-w"></i></a>}
                        </div>
                    </div>
                    {compomentArray}</div></div>;
            }

        } else {
            return <div key={libId} style={{display:`${noData?"block":"none"}`}} className="cluster-item">

                <div className="cluster-item-wrapper"
                     style={{paddingTop:"25px",width:'100%'}}
                     elevation={1}>
                    {!accesed && <div style={{fontSize: 16, lineHeight: 1.5}}>
                        <SkeletonTheme color="#e0e0e0" highlightColor="#edecec">
                            <div style={{width:"30%"}}><h1><Skeleton/></h1></div>
                            <Skeleton count={4}/>
                        </SkeletonTheme>
                    </div>
                    }

                    {
                        accesed && !!data && (data.contentnum || data.documentnum) > 0 && <div className="row">

                            <div className="col-sm-12">

                                <div className="result-total-title clearfix">
                                    <div style={{textAlign:"left"}}><span style={{float:"left"}}
                                                                          className={`type-logo type-${libId.replace(/,/g,"_")}-type-logo`}></span>
                                        <a
                                            style={{float:"left"}}
                                            onClick={()=>this.toSecondeResultPage(libId,searchValue,type)}>
                                            <h4 className="title-name"
                                                style={{display:"inline-block",fontSize:"1.4rem"}}>
                                                {LIB_NAME}&nbsp;
                                                <small>{data.contentnum || data.documentnum}</small>
                                            </h4>
                                        </a>
                                        {!!wikiUrl &&
                                        <a href={wikiUrl} className="lib-toolLink" target="_blank" alt="wiki"><i
                                            className="fa fa-wikipedia-w"></i></a>}

                                        {
                                            //this.renderItemOperateButton("/wiki/" + libId, '/ssearch?searchValue=' + searchValue + "&channel=" + libId + "&type=" + type)
                                        }

                                    </div>

                                    {
                                        //<a className="wikilink" target="_blank" href={"/wiki/"+libId}>wiki</a>
                                    }
                                </div>

                                <div style={{paddingLeft:"3rem"}}>

                                    {

                                        (data.content || data.documentcontent || []).reduce((itemArr, item, itemIndex)=> {
                                            var sourceTitle = item.basic_title || (item.title || "").replace(/<\/?.+?>/g, "") || item.person_name;
                                            const matches = match(sourceTitle, searchValue);
                                            const parts = parse(item.basic_title || (item.title || "").replace(/<\/?.+?>/g, "") || item.person_name, matches);

                                            const matcheAuthor = match(item.basic_creator || item.edition || item.jiguan || item.basic_position, searchValue);
                                            const partAuthor = parse(item.basic_creator || item.edition || item.jiguan || item.basic_position, matcheAuthor);

                                            const matcheYear = match(item.basic_date_time || item.dynasty, searchValue);
                                            const partYear = parse(item.basic_date_time || item.dynasty, matcheYear);


                                            var link = getResourceLink(libId, item.basic_title_url || item.basic_link_url || item.person_id || item.primary_id, type,item.basic_title_url);

                                            itemArr.push(<div className="result-item" key={libId+itemIndex}><a
                                                onClick={()=>this.saveSourceClick(item,searchValue,libId,link)}
                                                href={link}
                                                target="_blank">    {parts.map((part, index) => {
                                                return part.highlight ? (
                                                    <span key={String(index)}
                                                          style={{ color:'#b53535',fontSize:'14px'}}>
                          <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
                        </span>
                                                ) : (
                                                    <strong key={String(index)}
                                                            style={{ fontWeight: '300',fontSize:'14px' }}>
                                                        <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
                                                    </strong>
                                                );
                                            })}</a>
                                                 {
                                                    libId == "gsd_baidutiku1" ?
                                                    (
                                                        <span style={{ fontWeight: '300',fontSize:'14px' }}>{item.basic_contributor +" "+ item.basic_category_no + " "+ item.basic_sourcename + " "+ item.basic_title1+ " "+ (item.basic_description||"")}</span>
                                                    )
                                                    :
                                                    (
                                                        null
                                                    )                                                    
                                                }
                                                <span
                                                    className="link-desc">{partAuthor.map((part, index) => {
                                                    return part.highlight ? (
                                                        <span key={String(index)}
                                                              style={{ color:'#b53535',fontSize:'13px'}}>
                          <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
                        </span>
                                                    ) : (
                                                        <span key={String(index)} style={{ fontSize:'13px' }}>
                                                    <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
                                                </span>
                                                    );
                                                })}&nbsp;&nbsp;{partYear.map((part, index) => {
                                                    return part.highlight ? (
                                                        <span key={String(index)}
                                                              style={{ color:'#b53535',fontSize:'13px'}}>
                           <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
                        </span>
                                                    ) : (
                                                        <span key={String(index)} style={{ fontSize:'13px' }}>
                                                    <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
                                                </span>
                                                    );
                                                })}</span>
                                            </div>)


                                            return itemArr;
                                        }, [])
                                    }
                                </div>
                            </div>

                        </div>
                    }
                </div>


            </div>;
        }

    }

    // renderTableMode() {
    //     const {libId, classes, type, index} =this.props;
    //     const data = this.props.searchResult.allSearchResult[libId];
    //     const accesed = this.props.searchResult.allSearchResultAccessing[libId] === "stop";//true为获取到数据,false为取数据中
    //     const searchValue = this.props.searchResult.searchTitle;
    //     const noData = (!!data && ((!!data.content && data.content.length > 0) || (!!data.documentcontent && data.documentcontent.length > 0)) && accesed) || !accesed;//true则显示
    //
    //
    //     var titleArr = [];
    //     var authorArr = [];
    //     var yearArr = [];
    //     var publisher = [];
    //     var itemSize = 0;
    //
    //
    //     if (!!data) {
    //         itemSize = (data.content || data.documentcontent || []).length > 2 ? (data.content || data.documentcontent || []).length : 2;
    //         (data.content || data.documentcontent || []).map((item, itemIndex)=> {
    //             var sourceTitle = item.basic_title || (item.title || "").replace(/<\/?.+?>/g, "") || item.person_name;
    //             const matches = match(sourceTitle, searchValue);
    //             const parts = parse(item.basic_title || (item.title || "").replace(/<\/?.+?>/g, "") || item.person_name, matches);
    //
    //             const matcheAuthor = match(item.basic_creator || item.edition || item.jiguan, searchValue);
    //             const partAuthor = parse(item.basic_creator || item.edition || item.jiguan, matcheAuthor);
    //
    //             const matcheYear = match(item.basic_date_time || item.dynasty, searchValue);
    //             const partYear = parse(item.basic_date_time || item.dynasty, matcheYear);
    //
    //             const matchePublisher = match(item.basic_publisher);
    //             const partPublisher = parse(item.basic_publisher, matchePublisher);
    //
    //
    //             var link = getResourceLink(libId, item.basic_title_url || item.person_id || item.primary_id, type);
    //             titleArr.push(<div className="result-item" key={"title"+link}><a
    //                 onClick={()=>this.saveSourceClick(item,searchValue,libId,link)} href={link}
    //                 target="_blank">    {parts.map((part, index) => {
    //                 return part.highlight ? (
    //                     <span key={String(index)} style={{ color:'#b53535',fontSize:'14px'}}>
    //                       <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
    //                     </span>
    //                 ) : (
    //                     <strong key={String(index)} style={{ fontWeight: '300',fontSize:'14px' }}>
    //                         <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
    //                     </strong>
    //                 );
    //             })}</a>
    //
    //             </div>)
    //
    //             authorArr.push(<div className="result-item" key={"author"+link}><span
    //                 className="link-desc">{partAuthor.map((part, index) => {
    //                 return part.highlight ? (
    //                     <span key={String(index)}
    //                           style={{ fontSize:'14px'}}>
    //                       <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
    //                     </span>
    //                 ) : (
    //                     <span key={String(index)} style={{ fontSize:'14px' }}>
    //                                          <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
    //                                             </span>
    //                 );
    //             })}</span></div>);
    //
    //             yearArr.push(<div className="result-item" key={"year"+link}><span>{partYear.map((part, index) => {
    //                 return part.highlight ? (
    //                     <span key={String(index)}
    //                           style={{ color:'#b53535',fontSize:'14px'}}>
    //                        <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
    //                     </span>
    //                 ) : (
    //                     <span key={String(index)} style={{ fontSize:'14px' }}>
    //                                                 <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
    //                                             </span>
    //                 );
    //             })}</span>
    //             </div>);
    //
    //             publisher.push(<div className="result-item"
    //                                 key={"publisher"+link}><span>{partPublisher.map((part, index) => {
    //                 return part.highlight ? (
    //                     <span key={String(index)}
    //                           style={{ color:'#b53535',fontSize:'14px'}}>
    //                      <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
    //                     </span>
    //                 ) : (
    //                     <span key={String(index)} style={{ fontSize:'14px' }}>
    //                                         <span dangerouslySetInnerHTML={{__html: part.text}}>{}</span>
    //                                             </span>
    //                 );
    //             })}</span>
    //             </div>);
    //
    //         });
    //     }
    //
    //
    //     return <div style={{display:`${noData?"block":"none"}`}} key={libId} className="cluster-item">
    //
    //         <div className="cluster-item-wrapper"
    //              style={{width:'100%'}}
    //              elevation={1}>
    //             {!accesed && <div style={{fontSize: 16, lineHeight: 1.5}}>
    //                 <SkeletonTheme color="#e0e0e0" highlightColor="#edecec">
    //                     <div style={{width:"30%"}}><h1><Skeleton/></h1></div>
    //                     <Skeleton count={4}/>
    //                 </SkeletonTheme>
    //             </div>
    //             }
    //
    //             {
    //                 accesed && !!data && (data.contentnum || data.documentnum) > 0 && <div className="row">
    //
    //                     <div className="col-md-2">
    //
    //                         <div className="lib-tr" style={{height:60*itemSize}}>
    //                             <div className="lib-tr-wrapper">
    //                                <span
    //                                    className={`type-logo type-${libId.replace(/,/g,"_")}-type-logo`}></span>
    //                                 <a
    //                                     target="_blank"
    //                                     href={'/ssearch?searchValue=' + searchValue + "&channel=" + libId + "&type=" + type}
    //                                     onClick={()=>this.toSecondeResultPage(libId,searchValue,type)}>
    //
    //                                     <h4 style={{color: "#797474"}} className="title-name">
    //                                         <FormattedMessage
    //                                             id={libId}/></h4><h4
    //                                     className="count-style"
    //                                     style={{color: "#797474"}}>{data.contentnum || data.documentnum}</h4></a>
    //                                 {
    //                                     //<a className="wikilink" target="_blank" href={"/wiki/"+libId}>wiki</a>
    //                                 }
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div className="col-md-3">
    //                         {titleArr}
    //
    //                     </div>
    //                     <div className="col-md-2">
    //                         {authorArr}
    //                     </div>
    //                     <div className="col-md-2">
    //                         {yearArr}
    //                     </div>
    //                     <div className="col-md-3">
    //                         {publisher}
    //                     </div>
    //
    //                 </div>
    //             }
    //         </div>
    //     </div>;
    // }

    render() {


        return this.renderListMode();


    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        searchResult: state.searchResult
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getResultByArguments: (argument, dataIndex, currentPage, pageSize, clusternames, channels, type = 0, degree, choren,userId,header)=>dispatch(getResultByArguments(argument, dataIndex, currentPage, pageSize, clusternames, channels, type, degree, choren,userId,header)),
        saveHistoryResourceRecord: (userId, searchValue, title1 = "", title2 = "", url = "", header)=>dispatch(saveHistoryResourceRecord(userId, searchValue, title1, title2, url, header))

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles, {withTheme: true})(ClusterResultItem)));
