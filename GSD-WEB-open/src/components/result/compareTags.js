/**
 * Created by Aaron on 2018/7/5.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, Glyphicon} from 'react-bootstrap'
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import {connect} from 'react-redux'
import {INNER_SERVER_URL} from  "../../config/constants";
import {fetchUrl} from '../../actions/fetchData';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert2'
import {browserHistory} from 'react-router'
const styles = theme => ({
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

    getUserTags = async(userId, header)=> {
        var response = await fetchUrl(INNER_SERVER_URL + `queryLabels?userid=` + userId, "get", null, header);
        if (!!response) {
            if (!!response.statu) {
                this.setState({tags: response.data.data});

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
                this.setState({tags: tags,selectTagId:response.data.id});


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

    bindCompareInfos=async() => {

        if(!this.state.selectTagId){
            swal({
                title: this.props.intl.formatMessage({id: 'UnSelect Tag'}),
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {


            })
            return;
        }
        //console.log();
        this.props.closeDialog();

        var infos=this.props.getLiteratureIds().map(item=>{
            var indexId=(item.proc_dxid||item.documentId||item.primary_id||item.person_id||item.webpageId);

            let formdata ={};
            formdata["labelid"]=this.state.selectTagId;
            formdata["literatureid"]= indexId;
            formdata["type"]= this.props.type;
            formdata["jsonbody"]= JSON.stringify(item);
            formdata["indexname"]= this.props.channel;
            return formdata;

        })
        //console.log(infos);

        this.cxId = this.props.userInfos.responseUserInfo.userid;
        var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token,"Content-Type":"application/json"};
        var response = await fetchUrl(INNER_SERVER_URL + `insertDetails`, "post", JSON.stringify(infos), header);

        if (!!response) {
            if (!!response.statu) {
                swal({
                    title: this.props.intl.formatMessage({id: 'Bind_Success'}),
                    type: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'}),
                    cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'})
                }).then((result) => {
                    if(result.value){
                        window.open("/myProfile?tabIndex=3&labelId="+this.state.selectTagId);
                    }

                })


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


    selectChip(tagId){
        console.log(tagId);
        this.setState({selectTagId:tagId});
    }

    renderChips() {
        const {classes} = this.props;
        var componentArr = [];
        if (!!this.state.tags && this.state.tags.length > 0) {


            var tagList = this.state.tags;

            componentArr = tagList.map((item, index)=> {
                    if (item.id == "newAdd") {
                        return <span className="gsd-chip "><input autoFocus onBlur={(e)=>this.onNewInputBlur(e)} onKeyUp={(e)=>this.onKeyupModify(e)} type="text"
                                                                 style={{border:"none",boxShadow:'none',outline:0,width:'50px'}}/> </span>
                    } else return <Chip
                        key={item.id}
                        label={item.labelname}
                        onClick={()=>this.selectChip(item.id)}
                        className={item.id==this.state.selectTagId?classes.chipSelected:classes.chip}
                        component="span"
                        clickable
                    />
                }) || [];


        }
        componentArr = componentArr.concat(<Chip
            onClick={()=>this.addNewTag()}
            key="add"
            label={<span><i className="fa fa-plus-square"></i>&nbsp;<FormattedMessage
        id="Add"
    /></span>}
            className={classes.chip}
            component="span"
            clickable
        />)
        return componentArr;
    }


    render() {
        const {classes}=this.props;

        return (
            <div style={{marginTop:'20px'}}>
                <h4><FormattedMessage
                    id="Compare Tags"
                /></h4>

                {this.renderChips()}
                <div style={{marginTop:"20px",textAlign:"right"}}>
                    <Button variant="contained" className={classes.buttonOk} onClick={()=>this.bindCompareInfos()} size="small"><FormattedMessage
                        id="Ok"/></Button>
                    &nbsp;
                    <Button size="small" style={{textAlign:"center",display:'inline-block'}} onClick={()=>this.props.closeDialog()}><FormattedMessage
                        id="CANCEL"/></Button>
                </div>
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

