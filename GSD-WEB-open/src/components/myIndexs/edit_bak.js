import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import {Glyphicon} from 'react-bootstrap';
import {Breadcrumb} from 'antd';
import Header  from "../header"
import {getIndexById, updateMyIndex,setSearchResultPageInfos} from "../../actions"
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {Table} from 'antd';
import {Editor} from 'react-draft-wysiwyg';
import {INNER_SERVER_URL} from  "../../config/constants";
import {fetchUrl} from '../../actions/fetchData';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {ContentState, EditorState, convertFromRaw, convertToRaw} from 'draft-js';
import Button from '@material-ui/core/Button';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import NativeSelect from '@material-ui/core/NativeSelect';
import CircularProgress from '@material-ui/core/CircularProgress';
import swal from 'sweetalert2'
import {Checkbox, Select} from 'antd'
import {Tabs} from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import MySource from "../mySource";

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
        textAlign: "center",
        display: "inline-block",
        backgroundColor: "#8c1515",
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


class EditIndexs extends Component {
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
        this.__editor;
    }


    componentDidMount() {
        if (!!this.props.myIndexs.myIndexsData && this.props.myIndexs.myIndexsData.length > 0) {
            var index = this.props.myIndexs.myIndexsData.find(item=>item.webpageId == this.props.location.query.indexId)
            const blocksFromHTML = htmlToDraft(`<p>${index.note}</p>`);
            if (blocksFromHTML && blocksFromHTML.contentBlocks != null) {
                let contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks);
                this.setState({
                    oldTitle: index.title, indexData: index, editorState: EditorState.createWithContent(
                        contentState)
                });
            } else {
                this.setState({oldTitle: index.title, indexData: index});
            }

        } else {
            if (!!this.props.userInfos.responseUserInfo.userid) {
                this.cxId = this.props.userInfos.responseUserInfo.userid;
                var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
                this.props.getIndexById(this.cxId, this.props.location.query.indexId, header);
            }

        }
        var from = this.props.location.query.from;
        if (from == 0) {//编辑普通的网页采集
            document.title = this.props.intl.formatMessage({id: 'My Collection Edit'}) + "-" + this.props.intl.formatMessage({id: 'PROJECT_NAME'});

        } else {
            document.title = this.props.intl.formatMessage({id: 'Reference Edit'}) + "-" + this.props.intl.formatMessage({id: 'PROJECT_NAME'});

        }

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
            //this.setState({oldTitle:nextProps.myIndexs.currentIndexData.title,indexData: nextProps.myIndexs.currentIndexData});
            const blocksFromHTML = htmlToDraft(`<p>${nextProps.myIndexs.currentIndexData.note}</p>`);
            var allTags = (nextProps.myIndexs.currentIndexData.tag || "").split("%%%") || [];
            if (allTags.length == 1) {
                if (allTags[0] == "") {
                    allTags = [];
                }
            }
            var tags = allTags.reduce((arr, item, index)=> {
                if (!!item)arr.push({key: item, value: item});
                return arr;
            }, []);
            if (blocksFromHTML && blocksFromHTML.contentBlocks != null) {
                let contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks);
                this.setState({
                    allTags: tags,
                    selectedTags: tags,
                    activeKey: nextProps.myIndexs.currentIndexData.document_type == 'literature' ? "2" : "1",
                    oldTitle: nextProps.myIndexs.currentIndexData.title,
                    indexData: nextProps.myIndexs.currentIndexData,
                    editorState: EditorState.createWithContent(
                        contentState)
                });
            } else {
                this.setState({
                    allTags: tags,
                    selectedTags: tags,
                    activeKey: nextProps.myIndexs.currentIndexData.document_type == 'literature' ? "2" : "1",
                    oldTitle: nextProps.myIndexs.currentIndexData.title,
                    indexData: nextProps.myIndexs.currentIndexData
                });
            }


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

    onEditorStateChange(editorState) {
        console.log(editorState)
        this.setState({
            editorState,
        });
    };

    saveData() {
        this.startSaving = true;
        var content = !!this.state.editorState && !!this.state.editorState.getCurrentContent() ? draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())) : "";
        console.log(this.state.indexData);
        console.log(content);
        var indexData = this.state.indexData;
        indexData["document_type"] = indexData["document_type"] || "webpage";
        var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
        console.log(this.state.selectedTags);
        var tag = this.state.selectedTags.map(item=>item.label).join("%%%");
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
        //this.setState({ [name]: event.target.value });
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


    handleDrop(e) {
        e.preventDefault();
        console.log(e);

        var files = e.dataTransfer.files;
        if (!!files && files.length > 0) {
        } else {
            var data=e.dataTransfer.getData('Data');
            if(!!data){
                var json = JSON.parse(data);
                console.log(json);
                this.__editor.insertImageAtCurrentCursorPosition(json.url);
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
                <Header/>
                <Grid style={{marginTop:"30px"}}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item href="/"><FormattedMessage id="HOME"/></Breadcrumb.Item>
                        <Breadcrumb.Item><FormattedMessage
                            id="EDIT"/></Breadcrumb.Item>
                    </Breadcrumb>
                    {

                        // from == 0 && <Breadcrumb separator=">">
                        //     <Breadcrumb.Item href="/"><FormattedMessage id="HOME"/></Breadcrumb.Item>
                        //     <Breadcrumb.Item
                        //         href={`/search?searchValue=${this.props.location.query.searchValue}`}><FormattedMessage
                        //         id="ALL_RESULT"/></Breadcrumb.Item>
                        //     <Breadcrumb.Item><FormattedMessage
                        //         id="EDIT"/></Breadcrumb.Item>
                        // </Breadcrumb>
                    }
                    {

                        // from == -1 && <Breadcrumb separator=">">
                        //     <Breadcrumb.Item href="/"><FormattedMessage id="HOME"/></Breadcrumb.Item>
                        //     <Breadcrumb.Item href={`/myProfile?tabIndex=1`}><FormattedMessage
                        //         id="MY_PROFILE"/></Breadcrumb.Item>
                        //     <Breadcrumb.Item><FormattedMessage
                        //         id="EDIT"/></Breadcrumb.Item>
                        // </Breadcrumb>
                    }


                    <div className="contianer">
                        <Paper className={classes.root} elevation={1}>
                            <Tabs className="gsd-tabs" activeKey={this.state.activeKey}
                                  onChange={(key)=>{this.setState({activeKey:key})}}>
                                <TabPane forceRender={true} tab={<FormattedMessage
                            id="Note"/>} key="1">

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

                                            <div style={{marginTop:"35px"}} onDragOver={(e)=>this.handleDragOver(e)}
                                                 onDragEnter={(e)=>this.handleDragEnter(e)}
                                                 onDragLeave={(e)=>this.handleDragLeave(e)}
                                                 onDrop={(e)=>this.handleDrop(e)}>
                                                <Editor
                                                    editorState={this.state.editorState}
                                                    ref= { (editor) => { this.__editor=editor } }
                                                    toolbarClassName="toolbarClass"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="richEditorClass"
                                                    onEditorStateChange={(editorState)=>this.onEditorStateChange(editorState)}
                                                > <textarea
                                                    disabled
                                                    value={JSON.stringify(this.state.editorState, null, 4)}
                                                /></Editor>
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


                                </TabPane>
                                <TabPane forceRender={true} tab={<FormattedMessage
                            id="Literature"/>} key="2">

                                    <form className={classes.container} noValidate autoComplete="off">
                                        <FormControl className={classes.margin} fullWidth>
                                            <InputLabel><FormattedMessage
                                                id="DOC_TYPE"
                                            /></InputLabel>
                                            <NativeSelect
                                                native="true"
                                                style={{width:'60%'}}
                                                value={this.state.indexData.message_type}
                                                onChange={(e)=>this.handleChange('message_type',e)}
                                                inputProps={{
              name: 'message_type',
              id: 'gsd-message_type',
            }}
                                            >
                                                <option value="BK">{this.props.intl.formatMessage({id: 'BK'})}</option>
                                                <option value="JN">{this.props.intl.formatMessage({id: 'JN'})}</option>

                                                <option value="DT">{this.props.intl.formatMessage({id: 'DT'})}</option>
                                                <option value="CP">{this.props.intl.formatMessage({id: 'CP'})}</option>
                                                <option value="PAT">{this.props.intl.formatMessage({id: 'PT'})}</option>
                                                <option value="ST">{this.props.intl.formatMessage({id: 'ST'})}</option>
                                                <option value="NP">{this.props.intl.formatMessage({id: 'NP'})}</option>
                                                <option value="TR">{this.props.intl.formatMessage({id: 'TR'})}</option>
                                                <option value="YB">{this.props.intl.formatMessage({id: 'YB'})}</option>
                                                <option
                                                    value="LAR">{this.props.intl.formatMessage({id: 'LAR'})}</option>
                                                <option
                                                    value="INF">{this.props.intl.formatMessage({id: 'INF'})}</option>
                                                <option
                                                    value="CAS">{this.props.intl.formatMessage({id: 'CAS'})}</option>
                                            </NativeSelect>
                                        </FormControl>

                                        <FormControl className={classes.margin} fullWidth>
                                            <InputLabel
                                                FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                htmlFor="title"
                                            >
                                                <FormattedMessage
                                                    id="TITLE"
                                                />
                                            </InputLabel>
                                            <Input value={this.state.indexData.title}
                                                   onChange={(e)=>this.handleTextChange(e,"title")}
                                                   error={this.state.titleError}
                                                   classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                   id="title"
                                            />
                                            {this.state.titleError && (<FormHelperText error={this.state.titleError}
                                                                                       id="title-error-text"><FormattedMessage
                                                id="TITLE NOT NULL"
                                            /></FormHelperText>)}
                                        </FormControl>


                                        <FormControl className={classes.margin} fullWidth>
                                            <InputLabel
                                                FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                htmlFor="author"
                                            >
                                                <FormattedMessage
                                                    id="Author"
                                                />
                                            </InputLabel>
                                            <Input value={this.state.indexData.author}
                                                   onChange={(e)=>this.handleTextChange(e,"author")}
                                                   classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                   id="author"
                                            />
                                        </FormControl>

                                        {this.state.indexData.message_type == "CP" &&
                                        <FormControl className={classes.margin} fullWidth>
                                            <InputLabel
                                                FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                htmlFor="author_unit"
                                            >
                                                <FormattedMessage
                                                    id="Author_Unit"
                                                />
                                            </InputLabel>
                                            <Input value={this.state.indexData.author_unit}
                                                   onChange={(e)=>this.handleTextChange(e,"author_unit")}
                                                   classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                   id="author_unit"
                                            />
                                        </FormControl>
                                        }

                                        {this.state.indexData.message_type == "TR" &&
                                        <FormControl className={classes.margin} fullWidth>
                                            <InputLabel
                                                FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                htmlFor="person_charge"
                                            >
                                                <FormattedMessage
                                                    id="FINISHER"
                                                />
                                            </InputLabel>
                                            <Input value={this.state.indexData.person_charge}
                                                   onChange={(e)=>this.handleTextChange(e,"person_charge")}
                                                   classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                   id="person_charge"
                                            />
                                        </FormControl>
                                        }

                                        <FormControl className={classes.margin} fullWidth>
                                            <InputLabel
                                                FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                htmlFor="digest"
                                            >
                                                <FormattedMessage
                                                    id="Digest"
                                                />
                                            </InputLabel>
                                            <Input value={this.state.indexData.digest}
                                                   onChange={(e)=>this.handleTextChange(e,"digest")}
                                                   classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                   id="digest"
                                            />
                                        </FormControl>

                                        <hr/>

                                        <h4><FormattedMessage
                                            id="Detail"
                                        /></h4>

                                        <div className="row">


                                            {this.state.indexData.message_type == "BK" &&
                                            <div className="col-sm-6"><FormControl className={classes.margin} fullWidth>
                                                <InputLabel
                                                    FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                    htmlFor="book_name"
                                                >
                                                    <FormattedMessage
                                                        id="Series"
                                                    />
                                                </InputLabel>
                                                <Input value={this.state.indexData.book_name}
                                                       onChange={(e)=>this.handleTextChange(e,"book_name")}
                                                       classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                       id="book_name"
                                                />
                                            </FormControl></div>}

                                            {this.state.indexData.message_type == "BK" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="Pub_date"
                                                    >
                                                        <FormattedMessage
                                                            id="Publish_Time1"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.Pub_date}
                                                           onChange={(e)=>this.handleTextChange(e,"Pub_date")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="Pub_date"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "BK" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="publishing_house"
                                                    >
                                                        <FormattedMessage
                                                            id="Publisher"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.publishing_house}
                                                           onChange={(e)=>this.handleTextChange(e,"publishing_house")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="publishing_house"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "BK" &&
                                            <div className="col-sm-6"><FormControl className={classes.margin} fullWidth>
                                                <InputLabel
                                                    FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                    htmlFor="subject_term"
                                                >
                                                    <FormattedMessage
                                                        id="Subject_Words"
                                                    />
                                                </InputLabel>
                                                <Input value={this.state.indexData.subject_term}
                                                       onChange={(e)=>this.handleTextChange(e,"subject_term")}
                                                       classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                       id="subject_term"
                                                />
                                            </FormControl></div>}


                                            {this.state.indexData.message_type == "BK" &&
                                            <div className="col-sm-6"><FormControl className={classes.margin} fullWidth>
                                                <InputLabel
                                                    FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                    htmlFor="book_num"
                                                >
                                                    <FormattedMessage
                                                        id="Cn_Category_no"
                                                    />
                                                </InputLabel>
                                                <Input value={this.state.indexData.subject_term}
                                                       onChange={(e)=>this.handleTextChange(e,"book_num")}
                                                       classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                       id="book_num"
                                                />
                                            </FormControl></div>}

                                            {this.state.indexData.message_type == "BK" &&
                                            <div className="col-sm-6"><FormControl className={classes.margin} fullWidth>
                                                <InputLabel
                                                    FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                    htmlFor="ISBN"
                                                >
                                                    ISBN
                                                </InputLabel>
                                                <Input value={this.state.indexData.ISBN}
                                                       onChange={(e)=>this.handleTextChange(e,"ISBN")}
                                                       classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                       id="ISBN"
                                                />
                                            </FormControl></div>}

                                            {this.state.indexData.message_type == "BK" &&
                                            <div className="col-sm-6"><FormControl className={classes.margin} fullWidth>
                                                <InputLabel
                                                    FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                    htmlFor="page_num"
                                                >
                                                    <FormattedMessage
                                                        id="PAGE_NUM"
                                                    />
                                                </InputLabel>
                                                <Input value={this.state.indexData.page_num}
                                                       onChange={(e)=>this.handleTextChange(e,"page_num")}
                                                       classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                       id="page_num"
                                                />
                                            </FormControl></div>}

                                            {this.state.indexData.message_type == "JN" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="journal_name"
                                                    >
                                                        <FormattedMessage
                                                            id="Journal_Name"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.journal_name}
                                                           onChange={(e)=>this.handleTextChange(e,"journal_name")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="journal_name"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "JN" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="english_journal_name"
                                                    >
                                                        <FormattedMessage
                                                            id="En_Journal_Name"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.english_journal_name}
                                                           onChange={(e)=>this.handleTextChange(e,"english_journal_name")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="english_journal_name"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "JN" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="year"
                                                    >
                                                        <FormattedMessage
                                                            id="YEAR"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.year}
                                                           onChange={(e)=>this.handleTextChange(e,"year")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="year"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "JN" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="journal_num"
                                                    >
                                                        <FormattedMessage
                                                            id="Journal_Num"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.journal_num}
                                                           onChange={(e)=>this.handleTextChange(e,"journal_num")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="journal_num"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "JN" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="ISSN"
                                                    >
                                                        ISSN
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.ISSN}
                                                           onChange={(e)=>this.handleTextChange(e,"ISSN")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="ISSN"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {(this.state.indexData.message_type == "JN" || this.state.indexData.message_type == "DT") &&
                                            <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="journal_type_num"
                                                    >
                                                        <FormattedMessage
                                                            id="Category_no"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.journal_type_num}
                                                           onChange={(e)=>this.handleTextChange(e,"journal_type_num")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="journal_type_num"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "JN" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="keyWord"
                                                    >
                                                        <FormattedMessage
                                                            id="TYPE_NAME_keywordList"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.keyWord}
                                                           onChange={(e)=>this.handleTextChange(e,"keyWord")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="keyWord"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "JN" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="DOI"
                                                    >
                                                        DOI
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.DOI}
                                                           onChange={(e)=>this.handleTextChange(e,"DOI")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="DOI"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "DT" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="degree_name"
                                                    >
                                                        <FormattedMessage
                                                            id="Degree_Name"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.degree_name}
                                                           onChange={(e)=>this.handleTextChange(e,"degree_name")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="degree_name"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "DT" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="degree_year"
                                                    >
                                                        <FormattedMessage
                                                            id="Degree_Year"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.degree_year}
                                                           onChange={(e)=>this.handleTextChange(e,"degree_year")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="degree_year"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "DT" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="degree_conferring_unit"
                                                    >
                                                        <FormattedMessage
                                                            id="Degree_Unit"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.degree_conferring_unit}
                                                           onChange={(e)=>this.handleTextChange(e,"degree_conferring_unit")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="degree_conferring_unit"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "DT" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="tutor_name"
                                                    >
                                                        <FormattedMessage
                                                            id="Degree_Teacher"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.tutor_name}
                                                           onChange={(e)=>this.handleTextChange(e,"tutor_name")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="tutor_name"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "CP" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="meeting_name"
                                                    >
                                                        <FormattedMessage
                                                            id="Meeting_Name"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.meeting_name}
                                                           onChange={(e)=>this.handleTextChange(e,"meeting_name")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="meeting_name"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "CP" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="meeting_Address"
                                                    >
                                                        <FormattedMessage
                                                            id="Meeting_Address"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.meeting_Address}
                                                           onChange={(e)=>this.handleTextChange(e,"meeting_Address")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="meeting_Address"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "CP" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="meetingYear"
                                                    >
                                                        <FormattedMessage
                                                            id="Meeting_Year"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.meetingYear}
                                                           onChange={(e)=>this.handleTextChange(e,"meetingYear")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="meetingYear"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "CP" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="conference_proceedings"
                                                    >
                                                        <FormattedMessage
                                                            id="Meeting_Record"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.conference_proceedings}
                                                           onChange={(e)=>this.handleTextChange(e,"conference_proceedings")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="conference_proceedings"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "PAT" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="inventor"
                                                    >
                                                        <FormattedMessage
                                                            id="Creator"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.inventor}
                                                           onChange={(e)=>this.handleTextChange(e,"inventor")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="inventor"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "PAT" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="application_date"
                                                    >
                                                        <FormattedMessage
                                                            id="Creator"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.application_date}
                                                           onChange={(e)=>this.handleTextChange(e,"application_date")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="application_date"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "PAT" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="Open_date"
                                                    >
                                                        <FormattedMessage
                                                            id="Open_Date"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.Open_date}
                                                           onChange={(e)=>this.handleTextChange(e,"Open_date")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="Open_date"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "PAT" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="proposer"
                                                    >
                                                        <FormattedMessage
                                                            id="Applyer"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.proposer}
                                                           onChange={(e)=>this.handleTextChange(e,"proposer")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="proposer"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "PAT" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="publication_number"
                                                    >
                                                        <FormattedMessage
                                                            id="Public No"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.publication_number}
                                                           onChange={(e)=>this.handleTextChange(e,"publication_number")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="publication_number"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "PAT" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="Patent_type"
                                                    >
                                                        <FormattedMessage
                                                            id="Patent_type"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.Patent_type}
                                                           onChange={(e)=>this.handleTextChange(e,"Patent_type")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="Patent_type"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "PAT" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="province_code"
                                                    >
                                                        <FormattedMessage
                                                            id="Province_Code"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.province_code}
                                                           onChange={(e)=>this.handleTextChange(e,"province_code")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="province_code"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "PAT" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="address"
                                                    >
                                                        <FormattedMessage
                                                            id="ADDRESS"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.address}
                                                           onChange={(e)=>this.handleTextChange(e,"address")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="address"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "PAT" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="legal_status"
                                                    >
                                                        <FormattedMessage
                                                            id="Legal Status"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.legal_status}
                                                           onChange={(e)=>this.handleTextChange(e,"legal_status")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="legal_status"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "TR" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="Complete_unit"
                                                    >
                                                        <FormattedMessage
                                                            id="Finiser_Unit"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.Complete_unit}
                                                           onChange={(e)=>this.handleTextChange(e,"Complete_unit")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="Complete_unit"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "TR" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="open_year"
                                                    >
                                                        <FormattedMessage
                                                            id="Open_Year"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.open_year}
                                                           onChange={(e)=>this.handleTextChange(e,"open_year")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="open_year"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "TR" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="project_year_num"
                                                    >
                                                        <FormattedMessage
                                                            id="Year_Num"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.project_year_num}
                                                           onChange={(e)=>this.handleTextChange(e,"project_year_num")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="project_year_num"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "YB" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="year_book_name"
                                                    >
                                                        <FormattedMessage
                                                            id="Yb_Name"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.year_book_name}
                                                           onChange={(e)=>this.handleTextChange(e,"year_book_name")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="year_book_name"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "ST" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="date_posted"
                                                    >
                                                        <FormattedMessage
                                                            id="Publish_Date"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.date_posted}
                                                           onChange={(e)=>this.handleTextChange(e,"date_posted")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="date_posted"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "ST" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="material_date"
                                                    >
                                                        <FormattedMessage
                                                            id="Release_Date"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.material_date}
                                                           onChange={(e)=>this.handleTextChange(e,"material_date")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="material_date"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "ST" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="release_unit"
                                                    >
                                                        <FormattedMessage
                                                            id="Release_Unit"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.release_unit}
                                                           onChange={(e)=>this.handleTextChange(e,"release_unit")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="release_unit"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "ST" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="standard_number"
                                                    >
                                                        <FormattedMessage
                                                            id="Standard_No"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.standard_number}
                                                           onChange={(e)=>this.handleTextChange(e,"standard_number")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="standard_number"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "ST" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="standard_state"
                                                    >
                                                        <FormattedMessage
                                                            id="Standard_State"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.standard_state}
                                                           onChange={(e)=>this.handleTextChange(e,"standard_state")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="standard_state"
                                                    />
                                                </FormControl>
                                            </div>}

                                            {this.state.indexData.message_type == "LAR" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="Issued_date"
                                                    >
                                                        <FormattedMessage
                                                            id="Issued_Date"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.Issued_date}
                                                           onChange={(e)=>this.handleTextChange(e,"Issued_date")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="Issued_date"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "LAR" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="promulgated_unit"
                                                    >
                                                        <FormattedMessage
                                                            id="Publish_Unit"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.promulgated_unit}
                                                           onChange={(e)=>this.handleTextChange(e,"promulgated_unit")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="promulgated_unit"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "LAR" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="scope_validity"
                                                    >
                                                        <FormattedMessage
                                                            id="Scope_Validity"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.scope_validity}
                                                           onChange={(e)=>this.handleTextChange(e,"scope_validity")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="scope_validity"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "LAR" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="Regulations_category"
                                                    >
                                                        <FormattedMessage
                                                            id="Regulations_Category"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.Regulations_category}
                                                           onChange={(e)=>this.handleTextChange(e,"Regulations_category")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="Regulations_category"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "LAR" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="reference_num"
                                                    >
                                                        <FormattedMessage
                                                            id="Reference_Num"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.reference_num}
                                                           onChange={(e)=>this.handleTextChange(e,"reference_num")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="reference_num"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "CAS" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="case_type"
                                                    >
                                                        <FormattedMessage
                                                            id="Case_Type"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.case_type}
                                                           onChange={(e)=>this.handleTextChange(e,"case_type")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="case_type"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "CAS" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="case_reason"
                                                    >
                                                        <FormattedMessage
                                                            id="Case_Reason"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.case_reason}
                                                           onChange={(e)=>this.handleTextChange(e,"case_reason")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="case_reason"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "NP" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="deputy_essay"
                                                    >
                                                        <FormattedMessage
                                                            id="Subtitle"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.deputy_essay}
                                                           onChange={(e)=>this.handleTextChange(e,"deputy_essay")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="deputy_essay"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "NP" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="NPn"
                                                    >
                                                        <FormattedMessage
                                                            id="Paper_Name"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.NPn}
                                                           onChange={(e)=>this.handleTextChange(e,"NPn")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="NPn"
                                                    />
                                                </FormControl>
                                            </div>}


                                            {this.state.indexData.message_type == "NP" && <div className="col-sm-6">
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="edition"
                                                    >
                                                        <FormattedMessage
                                                            id="Paper_Edition"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.indexData.edition}
                                                           onChange={(e)=>this.handleTextChange(e,"edition")}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="edition"
                                                    />
                                                </FormControl>
                                            </div>}


                                        </div>


                                        <div>


                                        </div>


                                    </form>
                                </TabPane>

                            </Tabs>

                            {
                                // <h4 style={{color:"#771b1b"}}><i className="glyphicon glyphicon-edit"></i>&nbsp;
                                //     <FormattedMessage id="Edit_Index"/>
                                //     <a target="_blank" href={this.state.indexData.url}
                                //        style={{fontSize:'1rem',float:'right'}}><i
                                //         className="glyphicon glyphicon-share-alt"></i>&nbsp;<FormattedMessage
                                //         id="ORIGINAL_URL"/></a></h4>
                            }

                            <div style={{marginTop:"20px",textAlign:"right"}}>
                                    <span><Checkbox checked={this.state.indexData.document_type=='literature'}
                                                    onChange={(e)=>this.toggleIndexType(e)} style={{marginLeft:"10px"}}
                                                    className="gsd-check"/><FormattedMessage
                                        id="Save as Literature"/></span>
                                <Button disabled={this.props.myIndexs.pageInfos.isChanging}
                                        onClick={()=>this.saveData()} style={{marginRight:"15px"}}
                                        variant="contained"
                                        color="primary" className={classes.okBtn}>
                                    {this.props.myIndexs.pageInfos.isChanging && <CircularProgress
                                        className={classes.removeProgress}
                                        size={18}
                                    />}<FormattedMessage id="Ok"/>
                                </Button>

                                <Button variant="outlined" color="primary" onClick={()=>{this.closeWindow()}}
                                        className={classes.cancelBtn}>
                                    <FormattedMessage id="CANCEL"/>
                                </Button>
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
            // var allTags = [];
            // //allTags=allTags.filter(item=>item.key.indexOf("@@@new@@@")<0);
            // allTags.push({key: "@@@new@@@" + value, value: value});
            // this.setState({allTags: allTags})
            this.setState({allTags: dataList})
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


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(EditIndexs)))
