import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import {Glyphicon} from 'react-bootstrap';
import {Breadcrumb} from 'antd';
import Header  from "../header"
import {getNoteById,updateMyNote} from "../../actions"
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {Table} from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ContentState,EditorState,convertFromRaw,createFromText,convertFromHTML ,convertToRaw} from 'draft-js';
import Button from '@material-ui/core/Button';
import draftToHtml from 'draftjs-to-html';
import CircularProgress from '@material-ui/core/CircularProgress';
import swal from 'sweetalert2'

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        marginTop: "30px"
    },
    margin:{
        marginTop:"20px"
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
    cssLabelError:{
        color:"#3399cc"
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
        backgroundColor: "#8c1515",
        '&:hover': {
            backgroundColor: "#b93939",
        },
    },
    cancelBtn: {
        fontSize: '13px',
        display: "inline-block",
        textAlign:"center",
        color: "#777777",

    },
});





class EditNotes extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.startSaving=false;
        this.state = {oldTitle:"",noteData: {title:"",apa:"",mla:""},titleError:false,editorState: EditorState.createWithContent(
            ContentState.createFromBlockArray(
                convertFromHTML('<div>...</div>')
            ))}
        this.cxId;
    }


    componentDidMount() {
        if (!!this.props.myNotes.myNotesData&&this.props.myNotes.myNotesData.length>0) {
            var note = this.props.myNotes.myNotesData.find(item=>item.id == this.props.location.query.noteId)
            this.setState({oldTitle:note.title,noteData: note,editorState: EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML(`<div>${note.content}</div>`)
                ))});
        }else{
            if (!!this.props.userInfos.responseUserInfo.userid) {
                this.cxId = this.props.userInfos.responseUserInfo.userid;
                this.props.getNoteById(this.cxId,this.props.location.query.noteId);
            }

        }


    }



    componentWillReceiveProps(nextProps) {

        if (nextProps.userInfos.responseUserInfo.userid!=""&&nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            this.props.getNoteById(this.cxId,this.props.location.query.noteId);
        }
        if(nextProps.myNotes.currentNoteData!=null&&Object.keys(nextProps.myNotes.currentNoteData).length>0){
            this.setState({oldTitle:nextProps.myNotes.currentNoteData.title,noteData: nextProps.myNotes.currentNoteData, editorState:EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML(`<div>${nextProps.myNotes.currentNoteData.content}</div>`)
                ))});
        }
        if(!nextProps.myNotes.pageInfos.isChanging&&nextProps.myNotes.pageInfos.changeFlag==1&&this.startSaving){
            swal({
                title: this.props.intl.formatMessage({id: 'TIP'}),
                text: this.props.intl.formatMessage({id: 'SUCCESS'}),
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {
                if (result.value) {
                   history.go(-1);
                }
            })
        }
        if(!nextProps.myNotes.pageInfos.isChanging&&nextProps.myNotes.pageInfos.changeFlag==0&&this.startSaving){
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

    handleTextChange(e,name){
        this.setState({
            noteData:{...this.state.noteData,[name]: e.target.value.trim(),[`${name}Error`]:!e.target.value.trim()}
        });
        
    };

    onEditorStateChange(editorState){
        this.setState({
            editorState,
        });
    };

    saveData(){
        this.startSaving=true;
        var content=draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
        console.log(this.state.noteData)
        this.props.updateMyNote(this.cxId,this.props.location.query.noteId,this.state.noteData,content)
    }


    render() {
        const {classes} = this.props;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 14 },
        };

        return (
            <div>
                <Header/>
                <Grid style={{marginTop:"30px"}}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item href="/"><FormattedMessage id="HOME"/></Breadcrumb.Item>
                        <Breadcrumb.Item href="/myNotes"><FormattedMessage
                            id="MY_NOTE"/></Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.noteData.oldTitle}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="contianer">
                    <Paper className={classes.root} elevation={1}>
                        <h4 style={{color:"#771b1b"}}><i className="glyphicon glyphicon-edit" ></i>&nbsp;<FormattedMessage id="Edit_Note"/>
                            <a target="_blank" href={this.state.noteData.url} style={{fontSize:'1rem',float:'right'}}><i className="glyphicon glyphicon-share-alt"></i>&nbsp;<FormattedMessage id="ORIGINAL_URL"/></a></h4>
                        <form className={classes.container} noValidate autoComplete="off">
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
                                <Input value={this.state.noteData.title} onChange={(e)=>this.handleTextChange(e,"title")} error={this.state.titleError}
                                        classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                        id="title"
                                />
                                {this.state.titleError&&(<FormHelperText error={this.state.titleError} id="title-error-text"><FormattedMessage
                                    id="TITLE NOT NULL"
                                /></FormHelperText>)}
                            </FormControl>

                            <FormControl  style={{marginTop:"15px"}} fullWidth>
                                <InputLabel
                                    FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                    htmlFor="gbt"
                                >
                                    GB/T 7714
                                </InputLabel>
                                <Input value={this.state.noteData.gbt_7714} onChange={(e)=>this.handleTextChange(e,"gbt_7714")}
                                       classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                       id="gbt"
                                />
                            </FormControl>

                            <FormControl  style={{marginTop:"15px"}} fullWidth>
                                <InputLabel
                                    FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                    htmlFor="MLA"
                                >
                                    MLA
                                </InputLabel>
                                <Input value={this.state.noteData.mla} onChange={(e)=>this.handleTextChange(e,"mla")}
                                       classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                       id="MLA"
                                />

                            </FormControl>



                            <FormControl  style={{marginTop:"15px"}} fullWidth>
                                <InputLabel
                                    FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                    htmlFor="apa"
                                >
                                    APA
                                </InputLabel>
                                <Input value={this.state.noteData.apa} onChange={(e)=>this.handleTextChange(e,"apa")}
                                       classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                       id="apa"
                                />

                            </FormControl>
                            <div  style={{marginTop:"35px"}}>
                            <Editor
                                editorState={this.state.editorState}
                                toolbarClassName="toolbarClass"
                                wrapperClassName="wrapperClassName"
                                editorClassName="richEditorClass"
                                onEditorStateChange={(editorState)=>this.onEditorStateChange(editorState)}
                            > <textarea
                                disabled
                                value={JSON.stringify(this.state.editorState, null, 4)}
                            /></Editor>
                                </div>

                            <div style={{marginTop:"20px",textAlign:"right"}}>
                            <Button disabled={this.props.myNotes.pageInfos.isChanging} onClick={()=>this.saveData()} style={{marginRight:"15px"}} variant="contained"
                                    color="primary" className={classes.okBtn}>
                                {this.props.myNotes.pageInfos.isChanging&&<CircularProgress
                                    className={classes.removeProgress}
                                    size={18}
                                />}<FormattedMessage id="Ok"/>
                            </Button>

                            <Button variant="outlined" color="primary" onClick={()=>{history.go(-1)}} className={classes.cancelBtn}>
                                <FormattedMessage id="CANCEL"/>
                            </Button>
                                </div>
                            </form>


                    </Paper>

                        </div>
                </Grid>
            </div>
        );
    }

}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        myNotes:state.myNotes
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getNoteById:(userId,noteId) =>dispatch(getNoteById(userId,noteId)),
        updateMyNote:(userId,noteId,noteData,content) =>dispatch(updateMyNote(userId,noteId,noteData,content))


    }
}


export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(injectIntl(EditNotes)))
