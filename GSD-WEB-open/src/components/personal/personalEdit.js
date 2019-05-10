import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import {Glyphicon} from 'react-bootstrap';
import {Breadcrumb} from 'antd';
var JSONbig = require('json-bigint');
import {getIndexById, updateMyIndex,setSearchResultPageInfos} from "../../actions"
import FormControl from '@material-ui/core/FormControl';
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {Table} from 'antd';
import ReactUeditor from 'react-ueditor'
import {INNER_SERVER_URL,CHAOXING_PAN} from  "../../config/constants";
import {fetchUrl,fetchUrlText} from '../../actions/fetchData';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import swal from 'sweetalert2'
import {Checkbox, Select} from 'antd'
import {Tabs} from 'antd';
import {getLocalUserInfo} from "../../utils/utils";
import {setSeverResponseUserInfos, userLogout} from "../../actions";

const Option = Select.Option;
const TabPane = Tabs.TabPane;
import MySource from "../mySource";
var FILE_TYPE = {
    "101": "文档",
    "102": "文档",
    "103": "文档",
    "104": "文档",
    "105": "文档",
    "106": "文档",
    "107": "文档",
    "201": "图片",
    "202": "图片",
    "203": "图片",
    "204": "图片",
    "301": "视频",
    "401": "音频",
    "402": "音频",
    "403": "音频",
    "404": "音频",
    "405": "音频",
    "406": "音频",
    "407": "音频",
};
const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        marginTop: "30px"
    },
    margin: {
        marginTop: "20px"
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: "100%",
    },
    cssInput: {
        fontSize: "16px"
    },
    cssLabel: {
        fontSize: "14px",
        '&$cssFocused': {
            color: '#8c1515',
        }
    },
    cssLabelError: {
        color: "#3399cc"
    },
    cssFocused: {},
    cssUnderline: {
        '&:after': {
            borderBottomColor: '#8c1515',
        },
    },
    cssFocused: {},
    cssUnderline: {
        '&:after': {
            borderBottomColor: '#8c1515',
        },
    },
    okBtn: {
        fontSize: '13px',
        textAlign:"center",
        display: "inline-block",
        backgroundColor: "#F44336",
        '&:hover': {
            backgroundColor: "#b93939",
        },
    },
    cancelBtn: {
        fontSize: '13px',
        display: "inline-block",
        textAlign:"center",
        color: "#777777",
        border: "none",
        '&:hover': {
            border: "none",

        },

    },
});

class PersonalEdit extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.startSaving = false;
        this.state = {
            oldTitle: "",
            indexData: {title: "", author: "", digest: "", tag: ""},
            titleError: false,
            allTags: [],
            selectedTags: [],

            activeKey: "1"
        }
        this.cxId;
        this.content='';
        this.ueditor=null;
    }

    componentDidMount() {
        var userInfo = getLocalUserInfo();
        if (!!userInfo && !!userInfo.userid) {
            this.props.setSeverResponseUserInfos({responseUserInfo: {...userInfo}})
        }
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
            this.props.getIndexById(this.cxId, this.props.location.query.indexId, header);
        }
        var from = this.props.location.query.from;
        if (from == 0) {//编辑普通的网页采集
            document.title = this.props.intl.formatMessage({id: 'My Collection Edit'}) + "-" + this.props.intl.formatMessage({id: 'PROJECT_NAME'});
        } else {
            document.title = this.props.intl.formatMessage({id: 'Reference Edit'}) + "-" + this.props.intl.formatMessage({id: 'PROJECT_NAME'});
        }
    }

    updateEditorContent(content){
        this.content=content;
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


    componentWillReceiveProps(nextProps) {
        if (nextProps.userInfos.responseUserInfo.userid != "" && nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: nextProps.userInfos.responseUserInfo.token};
            this.props.getIndexById(this.cxId, this.props.location.query.indexId, header);
        }
        if (nextProps.myIndexs.currentIndexData != null && Object.keys(nextProps.myIndexs.currentIndexData).length > 0) {
            console.log(nextProps.myIndexs.currentIndexData);
            var allTags = (nextProps.myIndexs.currentIndexData.tag_text || "").split("%%%") || [];
            if (allTags.length == 1) {
                if (allTags[0] == "") {
                    allTags = [];
                }
            }
            var tags = allTags.reduce((arr, item, index)=> {
                if (!!item)arr.push({key: item, value: item});
                return arr;
            }, []);
            var url = "";
            if(nextProps.myIndexs.currentIndexData.note_text.indexOf(nextProps.myIndexs.currentIndexData.url) < 0){
                url = '<a href="'+ nextProps.myIndexs.currentIndexData.url +'">原文链接</a>';
            }            
            this.setState({
                        allTags: tags,
                        selectedTags: tags,
                        activeKey: nextProps.myIndexs.currentIndexData.document_type == 'literature' ? "2" : "1",
                        oldTitle: nextProps.myIndexs.currentIndexData.title,
                        indexData: nextProps.myIndexs.currentIndexData,
                        content:nextProps.myIndexs.currentIndexData.note_text + url
                    });
        }
        if (!nextProps.myIndexs.pageInfos.isChanging && nextProps.myIndexs.pageInfos.changeFlag == 1 && this.startSaving) {
            swal({
                title: this.props.intl.formatMessage({id: 'TIP'}),
                text: this.props.intl.formatMessage({id: 'SUCCESS'}),
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'}),
                timer: 2000
            }).then((result) => {
                this.closeWindow();
            })
        }
        if (!nextProps.myIndexs.pageInfos.isChanging && nextProps.myIndexs.pageInfos.changeFlag == 0 && this.startSaving) {
            swal({
                title: this.props.intl.formatMessage({id: 'TIP'}),
                text: this.props.intl.formatMessage({id: 'FAILED'}),
                type: 'erro',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            })
        }
    }

    handleTextChange(e, name) {
        this.setState({
            indexData: {
                ...this.state.indexData,
                [name]: e.target.value.trim(),
                [`${name}Error`]: !e.target.value.trim()
            }
        });

    };

    saveData(document_type) {
        this.startSaving = true;
        var content = this.content;
        console.log(this.state.indexData);
        console.log(content);
        var indexData = this.state.indexData;
        indexData["document_type"] = document_type==0?"webpage":"literature";
        var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
        console.log(this.state.selectedTags);
        var tag = this.state.selectedTags.map(item=>item.label?item.label:item.value).join("%%%");
        this.props.updateMyIndex(this.cxId, this.props.location.query.indexId, {
            ...this.state.indexData,
            note: content,
            tag: tag
        }, content, header)
    }

    handleChange(name, e) {
        console.log(e.target.value);
        this.setState({
            indexData: {...this.state.indexData, [name]: e.target.value.trim()}
        });
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDragEnter(e) {
        e.preventDefault();
    }


    handleDragLeave(e) {
        e.preventDefault();
    }

    videoHTML(videoUrl) {
        var timeId = (new Date()).getTime();
        return '<div><video id="edit_video' + timeId + '" class="video-js vjs-default-skin" ' +
            'controls preload="auto" width="500px" height="364px" ' +
            'data-setup=\'{}\'>' +
            '\t<source src="' + videoUrl + '" type="video/mp4" /> \n' +
            '\t\t<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>\n' +
            '</video></div><br/>';
    }

    voiceHTML(voiceUrl) {
        var timeId = (new Date()).getTime();
        return '<div><audio id="edit_voice' + timeId + '" class="video-js vjs-default-skin" ' +
            'controls preload="auto" width="500px" height="364px" ' +
            'data-setup=\'{}\'>' +
            '\t<source src="' + voiceUrl + '" type="audio/mp3" /> \n' +
            '\t\t<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>\n' +
            '</audio></div><div><br/></div>';
    }

    handleDrop=async(e)=> {
        e.preventDefault();
        console.log(e);
        var files = e.dataTransfer.files;
        if (!!files && files.length > 0) {
        } else {
            var dataStr=e.dataTransfer.getData('Data');
            if(!!dataStr){
                var data = JSON.parse(dataStr);
                document.getElementById("dropMask").style.display='none';
                var suffix=(data.suffix||"").toLowerCase();
                // var type = FILE_TYPE[data.filesmallclass] ? FILE_TYPE[data.filesmallclass] : "其他";
                var url = `api/getDownloadUrl?puid=${this.cxId}&fleid=${data.resid}`;
                var responseData = await fetchUrlText(CHAOXING_PAN + url, "post", null, {});
                var response = JSONbig.parse(responseData);
                if(response){
                    var uploadUrl = response.url;
                    var filename = data.name;
                    if (suffix=='mp4'||suffix=='wmv'||suffix=='avi'||suffix=='mpeg'||suffix=='mkv') {
                        this.ueditor.ueditor.execCommand('inserthtml', `<iframe  scrolling="no"  style="border:solid 1px #ccc;"  src="${data.preview}" frameborder="0" width="100%" height="320"></iframe>`);

                    } else if (suffix=='jpeg'||suffix=='jpg'||suffix=='png'||suffix=='gif') {
                        var imageHtml = "<img width='300px' src='" + uploadUrl + "'/><br/>";
                        //$('#gsd_content').wysiwyg();

                        this.ueditor.ueditor.execCommand('inserthtml', imageHtml);
                    }
                    else if (suffix == 'mp3'||suffix == 'm4a') {
                        var voiceHtml = this.voiceHTML(uploadUrl);
                        //$("#gsd_content").append(voiceHtml);
                        this.ueditor.ueditor.execCommand('inserthtml', voiceHtml);
                    } else {
                        this.ueditor.ueditor.execCommand('inserthtml', "<a href='" + uploadUrl + "'>" + filename + "</a><br/>");
                    }
                }



            }
        }
    }


    render() {
        const {classes} = this.props;
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 14},
        };

        var allTags = this.state.allTags;
        var selectedTags = this.state.selectedTags;
        var from = this.props.location.query.from || -1;
        return (
            <div>
                <Grid style={{marginTop:"30px"}}>
                    <div className="contianer">
                        <Paper className={classes.root} elevation={1}>
                            <Tabs className="gsd-tabs" activeKey={this.state.activeKey}
                                  onChange={(key)=>{this.setState({activeKey:key})}}>
                                <TabPane forceRender={true} tab={<FormattedMessage
                            id="gsd_notes"/>} key="1">
                                    <div>
                                        <div style={{marginTop:"20px"}}>
                                            <Button disabled={this.props.myIndexs.pageInfos.isChanging}
                                                    onClick={()=>this.saveData(0)} style={{marginRight:"15px"}}
                                                    variant="contained"
                                                    color="primary" className={classes.okBtn}>
                                                {this.props.myIndexs.pageInfos.isChanging && <CircularProgress
                                                    className={classes.removeProgress}
                                                    size={18}
                                                />}<FormattedMessage id="Save Note"/>
                                            </Button>
                                            <Button variant="outlined" color="primary" onClick={()=>{this.closeWindow()}}
                                                    className={classes.cancelBtn}>
                                                <FormattedMessage id="CANCEL"/>
                                            </Button>
                                        </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormControl className={classes.margin} fullWidth>
                                                <div
                                                    style={{    transform: "translate(0, 1.5px) scale(0.75)",transformOrigin: "top left"}}
                                                >
                                                    <FormattedMessage
                                                        id="TAG"
                                                    />
                                                </div>
                                                <Select
                                                    className="gsd-select"
                                                    mode="multiple"
                                                    labelInValue
                                                    placeholder={<FormattedMessage
                                                id="TAG"
                                            />}
                                                    value={selectedTags}
                                                    filterOption={false}
                                                    onSearch={(v)=>this.getTags(v)}
                                                    onChange={(v)=>this.handleChangeTag(v)}
                                                    style={{ width: '100%' }}
                                                >
                                                    {allTags.map((d, index)=> <Option key={d.key}>{d.value}</Option>)}
                                                </Select>
                                            </FormControl>
                                            <div style={{marginTop:"35px",position:'relative'}} >
                                                <div id="dropMask" onDragOver={(e)=>this.handleDragOver(e)}
                                                     onDragEnter={(e)=>this.handleDragEnter(e)}
                                                     onDragLeave={(e)=>this.handleDragLeave(e)}
                                                     onDrop={(e)=>this.handleDrop(e)}></div>
                                                <ReactUeditor
                                                    id="editor"
                                                    ref={ref=>{this.ueditor=ref;}}
                                                    config={{zIndex: 1001}}
                                                    onChange={(content)=>this.updateEditorContent(content)}
                                                    ueditorPath="/ueditor"
                                                    value={this.state.content}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6"
                                             style={{borderLeft: "solid 1px #e6e6e6",marginTop: "10px"}}>
                                            <h5 style={{marginTop: "20px",color: "#676565"}}><i
                                                className="fa fa-folder"></i>&nbsp;<FormattedMessage id='My Source'/>
                                            </h5>
                                            <MySource isSlider/>
                                        </div>
                                    </div>
                                </div>
                                </TabPane>
                            </Tabs>
                            <div style={{marginTop:"20px",textAlign:"right"}}>
                        </div>
                        </Paper>
                    </div>
                </Grid>
            </div>
        );
    }

    handleChangeTag = (value) => {
        this.setState({
            selectedTags: value
        });
    }

    getTags = async(value)=> {
        console.log(value);
        var isExist = false;
        let formdata = new FormData();
        formdata.append("content", value);
        formdata.append("indexName", "webpage");
        formdata.append("findfield", "tag");
        formdata.append("returnfield", "tag");
        formdata.append("userId", this.cxId);
        var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
        var response = await fetchUrl(INNER_SERVER_URL + `es/getfiled`, "post", formdata, header);
        console.log(response);
        if (!!response) {
            var dataList = [];
            if (!!response && response.statu) {
                dataList = response.data.reduce(function (arr, item, index) {
                    if (!!item && item.indexOf("%%%") > 0) {
                        var sarr = item.split("%%%");
                        arr = arr.concat(sarr.map(function (ssitem) {
                            if (ssitem == value)isExist = true;
                            return {key: ssitem + index, value: ssitem}
                        }));
                    } else {
                        if (item == value)isExist = true;
                        arr.push({key: item + index, value: item});
                    }
                    return arr;
                }, []);
            }
            if (!isExist && !!value.trim()) {
                dataList.push({key: "@@@new@@@" + value, value: value});
            }
            this.setState({allTags: dataList});
        }


    }

    toggleIndexType(e) {
        var indexData = this.state.indexData;
        if (e.target.checked) {
            indexData["document_type"] = "literature";
        } else {
            indexData["document_type"] = "webpage";
        }
        this.setState({indexData: indexData});
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
        getIndexById: (userId, indexId, header) =>dispatch(getIndexById(userId, indexId, header)),
        updateMyIndex: (userId, indexId, indexData, content, header) =>dispatch(updateMyIndex(userId, indexId, indexData, content, header)),
        setSearchResultPageInfos: (pageInfos) => dispatch(setSearchResultPageInfos(pageInfos)),
        setSeverResponseUserInfos: (infos) => dispatch(setSeverResponseUserInfos(infos)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(PersonalEdit)))
