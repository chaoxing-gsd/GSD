import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import {withStyles} from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import {Glyphicon} from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import {Breadcrumb} from 'antd';
import Header  from "./header";
import {getBindedEmails, addLocalEmails, BindedEmail, removeLocalEmails, DeleteEmail} from "../actions"
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {browserHistory} from 'react-router'
import {Tabs, Divider, Tag} from 'antd';
import {isEmail} from '../utils/utils'
const TabPane = Tabs.TabPane;
import swal from 'sweetalert2'
const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        marginTop: "10px"
    },
    buttonAdd: {
        background: "#d86166",
        display: "inline-block",
        color: "#ffffff",
        border: "none",
        fontSize: "14px",
        '&:disabled': {
            backgroundColor: "#cccccc",
            // color:"#ffffff"

        },
        '&:hover': {
            backgroundColor: "#c34349",
            // color:"#ffffff"

        },
    },
    buttonMini: {
        display: "inline-block",
        color: "#4CAF50",
        border: "none",
        fontSize: "12px",
        minWidth: '30px',
        minHeight: "30px",
        marginTop: "4px",

        '&:hover': {
            // backgroundColor: "#d45f5f",
            // color:"#ffffff"

        },
    },
    buttonMiniCancel: {
        display: "inline-block",
        color: "#F44336",
        border: "none",
        fontSize: "12px",
        minWidth: '30px',
        minHeight: "30px",
        marginTop: "4px",

        '&:hover': {
            // backgroundColor: "#d45f5f",
            // color:"#ffffff"

        },
    },
});


class MyProfile extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {isEditing: false}
        this.cxId;

    }


    componentDidMount() {
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header={userid:this.cxId,token:this.props.userInfos.responseUserInfo.token};
            this.props.getBindedEmails(this.cxId,header);
        }

    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.userInfos.responseUserInfo.userid!=""&&nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header={userid:this.cxId,token:nextProps.userInfos.responseUserInfo.token};
            this.props.getBindedEmails(this.cxId,header);
        }

    }


    handleAddEmail(e) {
        this.setState({isEditing: true})
        this.props.addLocalEmails({"mail": "emails", userid: -1});
    }

    handleOk(e) {


        if (!!this.refs.newEmail.value) {
            if (isEmail(this.refs.newEmail.value)) {
                var header={userid:this.cxId,token:this.props.userInfos.responseUserInfo.token};
                this.props.BindedEmail(this.cxId, this.refs.newEmail.value,header);
                this.setState({isEditing: false})
            }else{
                swal({
                    title: this.props.intl.formatMessage({id: 'Email Error'}),
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                }).then((result) => {

                })
            }
        } else {
            swal({
                title: this.props.intl.formatMessage({id: 'EMAIL_IS_EMPTY'}),
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {

            })
        }
    }


    removeEmail(item) {
        var header={userid:this.cxId,token:this.props.userInfos.responseUserInfo.token};
        this.props.DeleteEmail(item.userid, item.mail,header)
    }

    cancelAddEmail() {
        this.setState({isEditing: false})
        this.props.removeLocalEmails({userid: -1, mail: "emails"})
    }

    onKeyupAdd(e) {
        if (e.keyCode == 13) {
            this.handleOk()
        }
    }

    renderNewMail() {
        const {classes} = this.props;

        return (<div className="row">
            <div className="col-sm-6">
                <input className="form-control" onKeyUp={(e)=>this.onKeyupAdd(e)} ref="newEmail" type="text"/>
            </div>
            <div className="col-sm-6">
                <Button onClick={(e)=>this.handleOk(e)}
                        className={classes.buttonMini} variant="outlined"
                        size="small"><i className="fa fa-check"></i></Button>
                <Button onClick={(e)=>this.cancelAddEmail(e)}
                        className={classes.buttonMiniCancel} variant="outlined"
                        size="small"><i className="fa fa-remove"></i></Button>
            </div>
        </div>);

    }


    renderMailItem(item) {
        const {classes} = this.props;
        return <div className="gsd-mails"><i className="fa fa-envelope"></i>&nbsp;&nbsp;{item.mail} <a
            className="remove-icon" onClick={(e)=>this.removeEmail(item)}
        ><i className="fa fa-trash-o"></i></a></div>;
    }


    render() {
        const {classes} = this.props;


        return (
            <div>
                <Header/>
                <Grid style={{marginTop:"30px"}}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item href="/"><FormattedMessage id="HOME"/></Breadcrumb.Item>
                        <Breadcrumb.Item href="/myProfile"><FormattedMessage id="MY_PROFILE"/></Breadcrumb.Item>
                        <Breadcrumb.Item><strong></strong><FormattedMessage
                            id="Bind_Email"/></Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={classes.root} elevation={1}>
                        <Tabs className="gsd-tabs" type="card">
                            <TabPane tab={<FormattedMessage
                  id="Bind_Email"/>} key="1">
                                <div style={{backgroundColor:"#ffffff",padding:'20px'}}>
                                    <Button disabled={this.state.isEditing} onClick={(e)=>this.handleAddEmail(e)}
                                            className={classes.buttonAdd} variant="outlined"
                                            size="small"><i className="fa fa-plus"></i></Button>

                                    <div style={{fontSize:'12px',display:'block',color:"rgb(103, 103, 103)",marginTop:"5px"}}><i className="fa fa-info-circle"></i>&nbsp;<FormattedMessage id="Bind Email Tip"/></div>

                                    {this.props.userInfos.bindedEmalis.length>0&&<div
                                        style={{marginTop:'20px'}}>{this.props.userInfos.bindedEmalis.map((item, index)=>
                                        <div key={index}>
                                            <div>{item.userid === -1 ? this.renderNewMail() : this.renderMailItem(item) }</div>
                                        </div>)}</div>}

                                    {this.props.userInfos.bindedEmalis.length==0&&<h5 style={{marginTop:'20px'}} style={{textAlign:'center'}}><FormattedMessage id="NO_DATA"/> </h5>}


                                </div>
                            </TabPane>

                        </Tabs>
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
        myIndexs: state.myIndexs
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getBindedEmails: (userId,header) => dispatch(getBindedEmails(userId,header)),
        addLocalEmails: (data) => dispatch(addLocalEmails(data)),
        BindedEmail: (userId, email,header)=>dispatch(BindedEmail(userId, email,header)),
        removeLocalEmails: (userId, email)=>dispatch(removeLocalEmails(userId, email)),
        DeleteEmail: (userId, email,header)=>dispatch(DeleteEmail(userId, email,header)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(MyProfile)))
