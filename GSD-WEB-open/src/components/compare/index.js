/**
 * Created by Aaron on 2018/10/9.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, Glyphicon} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import {connect} from 'react-redux'
import {INNER_SERVER_URL} from  "../../config/constants";
import {fetchUrl} from '../../actions/fetchData';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert2'
import {browserHistory} from 'react-router'
import CompareList from './compareList'
const styles = theme => ({
    rootPage: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        width: '100%',
        marginTop:"30px"
    },
    chip: {
        fontSize: "0.9rem",
        margin: theme.spacing.unit,
        backgroundColor: "#ffffff",
        color: "#d45f5f",
        border: "solid 1px #d45f5f",
        '&:hover': {
            fontSize: "0.9rem",
            color: '#ffffff',
            border: 'solid 1px #d45f5f00',
            backgroundColor: '#e88a8a',
            textDecoration: 'none'
        },
        '&:focus': {
            fontSize: "0.9rem",
            backgroundColor: "#ffffff",
            color: "#d45f5f",
            border: "solid 1px #d45f5f",
            textDecoration: 'none'
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
    chipSelected: {
        fontSize: "0.9rem",
        margin: theme.spacing.unit,
        backgroundColor: "#d45f5f",
        color: "#ffffff",
        border: "solid 1px #d45f5f",
        '&:hover': {
            fontSize: "0.9rem",
            color: '#ffffff',
            border: 'solid 1px #d45f5f00',
            backgroundColor: '#e88a8a',
            textDecoration: 'none'
        },
        '&:focus': {
            fontSize: "0.9rem",
            backgroundColor: "#d45f5f",
            color: "#ffffff",
            border: "solid 1px #d45f5f",
            textDecoration: 'none'
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
    buttonAdd:{
        backgroundColor: "#009688",
        textAlign:"center",
        display: "inline-block",
        fontSize:'12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#086d64"
        },
        color: "#ffffff",
    },
});


class CompareTags extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        intl: intlShape.isRequired
    }

    constructor(props) {
        super(props);
        this.cxId = null;
        this.isAdding = false
        this.state = {snakeOpen: false, tags: [],selectTagId:""}
    }


    removeTags=async(tagId)=>{
        swal({
            title: this.props.intl.formatMessage({id: 'TIP'}),
            text: this.props.intl.formatMessage({id: 'CONFIRM DELETE COMPARE TAGS'}),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'}),
            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
        }).then(async(result) => {
            if (result.value) {
                var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
                // for(var i=0;i<this.state.selectTags.length;i++){
                var postParam={};
                postParam["labelid"]=tagId;
                var response = await fetchUrl(INNER_SERVER_URL + `deleteLabel?labelid=`+tagId, "delete", JSON.stringify(postParam), header);
                if (!!response) {
                    if (!!response.statu) {
                        var tags=this.state.tags.filter(item=>item.id!=tagId);
                        this.setState({tags: tags,selectTagId:""});

                    } else {
                        swal({
                            title: response.msg,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                        });

                    }

                } else {
                    swal({
                        title: this.props.intl.formatMessage({id: 'Error Tip'}),
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                    });

                }
            }
        });

        //}


    }

    getUserTags = async(userId, header)=> {
        var response = await fetchUrl(INNER_SERVER_URL + `queryLabels?userid=` + userId, "get", null, header);
        if (!!response) {
            if (!!response.statu) {
                var labelId=this.props.location.query.labelId;
                labelId=!!labelId?labelId:(!!response.data.data&&response.data.data.length>0?response.data.data[0].id:"");
                this.setState({tags: response.data.data,selectTagId:labelId});

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
            swal({
                title: this.props.intl.formatMessage({id: 'Error Tip'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
        }
    }

    componentDidMount() {
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
            this.getUserTags(this.cxId, header);

        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userInfos.responseUserInfo.userid!=""&&nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: nextProps.userInfos.responseUserInfo.token};
            this.getUserTags(this.cxId, header);
        }

    }

    addUserTag = async(labelName,userId, header)=> {
        let formdata = new FormData();
        formdata.append("labelname",labelName);
        formdata.append("userid",userId);
        var response = await fetchUrl(INNER_SERVER_URL + `createLabel`, "post", formdata, header);
        var tags=this.state.tags.filter(item=>item.id!='newAdd');
        this.isAdding=false;
        if (!!response) {
            if (!!response.statu) {

                tags.push({labelname:labelName,id:response.data.id})
                this.setState({tags: tags});


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
            swal({
                title: this.props.intl.formatMessage({id: 'Error Tip'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
        }
    }


    addNewTag() {
        if (!this.isAdding) {
            this.isAdding = true;
            var tags = this.state.tags;
            tags = tags.concat({id: "newAdd"})
            this.setState({tags: tags});
        }


    }

    modifyCatGroup(value){
        if(!!value){
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
            this.addUserTag(value,this.cxId,header);
        }else{
            var tags=this.state.tags.filter(item=>item.id!='newAdd');
            this.isAdding=false;
            this.setState({tags:tags});
        }

    }

    onKeyupModify(e){
        if (e.keyCode == 13) {

            this.modifyCatGroup(e.target.value);

        }
    }

    onNewInputBlur(e){
        this.modifyCatGroup(e.target.value);
    }




    selectChip(tagId){

        // if(this.state.editMode){
        //     var tags=this.state.selectTags;
        //     var checked=tags.findIndex(sitem=>sitem==tagId)>=0;
        //     if(checked){
        //         tags=tags.filter(item=>item!=tagId);
        //
        //     }else {
        //         tags.push(tagId);
        //
        //     }
        //     this.setState({selectTags: tags});
        //
        // }else{
        //     this.setState({selectTagId: tagId});
        //
        // }
        this.setState({selectTagId: tagId});

    }

    renderChips() {
        const {classes} = this.props;
        var componentArr = [];
        if (!!this.state.tags && this.state.tags.length > 0) {


            var tagList = this.state.tags;

            componentArr = tagList.map((item, index)=> {
                   // var checked=this.state.selectTags.findIndex(sitem=>sitem==item.id)>=0;
                    if (item.id == "newAdd") {
                        return <span className="gsd-chip "><input autoFocus onBlur={(e)=>this.onNewInputBlur(e)} onKeyUp={(e)=>this.onKeyupModify(e)} type="text"
                                                                  style={{border:"none",boxShadow:'none',outline:0,width:'50px'}}/> </span>
                    } else return <Chip
                        key={item.id}
                        label={<span>{item.labelname}&nbsp;<i onClick={()=>this.removeTags(item.id)} className="glyphicon glyphicon-remove"></i></span>}
                        onClick={()=>this.selectChip(item.id)}
                        className={(this.state.selectTagId==item.id)?classes.chipSelected:classes.chip}
                        component="span"
                        clickable
                    />
                }) || [];
            return componentArr;

        }else{
            return <h4><small> <FormattedMessage id="NO_DATA"/></small></h4>
        }
    //     componentArr = componentArr.concat(<Chip
    //         onClick={()=>this.addNewTag()}
    //         key="add"
    //         label={<span><i className="fa fa-plus-square"></i>&nbsp;<FormattedMessage
    //     id="Add"
    // /></span>}
    //         className={classes.chip}
    //         component="span"
    //         clickable
    //     />)


    }


    renderOperation() {
        const {classes}=this.props;
       // const enabled=this.state.selectTags.length>0;
        return <span style={{marginLeft:'10px'}}>
            {
            //     !this.state.editMode&&<Button style={{marginRight:"10px"}} onClick={()=>this.setState({editMode:true,selectTags:[]})} variant="outlined"
            //                                 className={classes.recordBtn}
            //                                 size="small" target="_blank">
            //     <FormattedMessage id="Manage"/>
            // </Button>
            }

             { //this.state.editMode&&<Button style={{marginRight:"10px"}} onClick={()=>this.setState({editMode:false,selectedItem:[]})} variant="outlined"
            //                                className={classes.cancelBtn}
            //                                size="small" target="_blank">
            //     <FormattedMessage id="Cancel Manage"/>
            // </Button>
            }
            {
            //     this.state.editMode&&<Button  style={{marginRight:"10px"}} onClick={()=>this.addNewTag()} variant="outlined"
            //                                className={classes.buttonAdd}
            //                                size="small" target="_blank">
            //     <FormattedMessage id="Add"/>
            // </Button>
            }

            { <Button disabled={!!this.state.selectTagId} style={{marginRight:"10px"}} onClick={()=>this.removeTags()} variant="outlined"
                                           className={classes.recordBtn}
                                           size="small" target="_blank">
                <FormattedMessage id="DELETE"/>
            </Button>
            }




        </span>

    }


    render() {
        const {classes}=this.props;

        return (
            <div>
                <Grid>
                <Paper elevation={1} className={classes.rootPage}>
                    <h4 style={{margin:"10px 0 10px 0"}}><FormattedMessage id="Compare Tags"/>{
                        //this.renderOperation()
                    }</h4>



                {this.renderChips()}

                    <hr/>
<CompareList tagId={this.state.selectTagId}/>

                    </Paper>

                    </Grid>
            </div>
        );
    }

}


const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos
    }
}


export default connect(mapStateToProps)(withStyles(styles)(injectIntl(CompareTags)));

