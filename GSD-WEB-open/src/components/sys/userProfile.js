/**
 * Created by Aaron on 2018/6/20.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Glyphicon} from 'react-bootstrap';
import {connect} from 'react-redux'

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Zoom from '@material-ui/core/Slide';
import {getLocalUserInfo} from "../../utils/utils";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {browserHistory} from 'react-router'
import {setSeverResponseUserInfos, userLogout} from "../../actions"
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {withStyles} from '@material-ui/core/styles';
import swal from 'sweetalert2'
const ITEM_HEIGHT = 48;

const styles = theme => ({
    paper: {
        top: "36px!important",
        background:"#40403b"
    },
    menuItem: {
        fontSize: "1rem",
        padding: '0.5rem 1rem',
        color: "#cacac9",
        backgroundColor: "#40403b",
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#292828"
        },
    },

    buttonGear: {
        backgroundColor: "transparent",
        fontSize: '12px',
        '&:hover': {
            color: "#8c1515",
            backgroundColor: "transparent"
        },
        color: "#615858",
    },
    buttonGearReverse: {
        fontSize: '12px',
        backgroundColor: "transparent",
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "transparent"
        },
        color: "#c3c3be",
    }
});
const options = [
    // {
    //     icon: "bookmark", value: "myLiterature", label: <FormattedMessage
    //     id="My Literature"
    // />
    // },
    // {
    //     icon: "bookmark", value: "myIndexs", label: <FormattedMessage
    //     id="My Collect"
    // />
    // },
    // {
    //     icon: "hdd", value: "mySource", label: <FormattedMessage
    //     id="My Source"
    // />
    // },
    {
        icon: "wrench", value: "myProfile", label: <FormattedMessage
        id="MY_PROFILE"
    />
    },
    {
        icon: "log-out", value: "logout", label: <FormattedMessage
        id="Log_Out"
    />
    }

];

class UserDialog extends Component {


    constructor(props) {
        super(props);
        this.state = {anchorEl: null};

    }

    render() {
        const {classes, onClose, selectedValue, ...other} = this.props;

        return (<Dialog
            TransitionComponent={Zoom}
            {...other}
            onClose={()=>onClose()}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="simple-dialog-title"><FormattedMessage
                id="User_Setting"
            /></DialogTitle>
            <div>
                <List>
                    {
                        //     emails.map(email => (
                        //     <ListItem button onClick={() => this.handleListItemClick(email)} key={email}>
                        //         <ListItemAvatar>
                        //             <Avatar >
                        //                 <Glyphicon glyph="star" />
                        //             </Avatar>
                        //         </ListItemAvatar>
                        //         <ListItemText primary={email} />
                        //     </ListItem>
                        // ))
                    }
                    <ListItem button onClick={() => this.props.onLogOut()}>
                        <ListItemAvatar>
                            <Avatar style={{backgroundColor:"rgb(226, 35, 35)"}}>
                                <Glyphicon glyph="log-out"/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={   <FormattedMessage
                id="Log_Out"
            />}/>
                    </ListItem>
                </List>
            </div>
        </Dialog>);
    }

}

class UserProfile extends Component {
    static propTypes = {
        style: PropTypes.object,
        width: PropTypes.number,
        background: PropTypes.string

    }

    logOut() {

        this.props.userLogout();
        this.setState({openLoginDialog: false});
    }

    componentDidMount() {
        var userInfo = getLocalUserInfo();
        if (!!userInfo && !!userInfo.userid) {
            this.props.setSeverResponseUserInfos({responseUserInfo: {...userInfo}})
        }
    }

    constructor(props) {
        super(props);
        this.state = {openLoginDialog: false};
    }

    handleDialogOpen(e) {
        e.preventDefault();
        this.setState({anchorEl: e.currentTarget});
        if (!!this.props.onDialogToggle)this.props.onDialogToggle(true);
    }

    toPage(option) {
        if (option.value === "logout") {
            swal({
                title: this.props.intl.formatMessage({id: 'Log_Out'}),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'}),
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {
                if (result.value) {
                    this.logOut();
                }
            })
        } else {
            window.open("/"+option.value);
            //browserHistory.push(option.value);
        }

    }

    renderLoginedComponent() {
        const {style, width, background, classes}=this.props;
        const {anchorEl} = this.state;
        // return (<div style={style}> <UserDialog onLogOut={()=>this.logOut()} onClose={()=>this.setState({openLoginDialog:false})} open={this.state.openLoginDialog}/>
        //
        //         <Avatar onClick={()=>{this.setState({openLoginDialog:true})}} style={{backgroundColor:"#8c1515",marginTop:'-5px',fontSize:"0.9rem"}}>{this.props.userInfos.responseUserInfo.realname}</Avatar>
        //
        //
        // </div>);
        return <div style={style}><div variant="contained"  onClick={(e)=>this.handleDialogOpen(e)}
                                     className={!this.props.reverse?classes.buttonGear:classes.buttonGearReverse}
                                     size="small" color="default">
            <Glyphicon glyph="user" style={{fontSize:'1rem'}}/>&nbsp;
            <span>{this.props.userInfos.responseUserInfo.realname}</span><span className="caret"></span>
        </div>

            <Menu
                id="long-menu"
                classes={{paper:classes.paper}}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={()=>{this.setState({ anchorEl: null }); if(!!this.props.onDialogToggle)this.props.onDialogToggle(false);}}
                PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 150,
              top:36
            },
          }}
            >
                {options.map(option => (
                    <MenuItem className={classes.menuItem} selected={true} key={option.value} onClick={()=>this.toPage(option)}>
                        <Glyphicon style={{fontSize:'1rem',top:'0px'}} glyph={option.icon}/> &nbsp; {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    }

    closeDialog() {
        this.setState({openLoginDialog: false});
    }

    renderUnLoginComponent() {
        var b = new Buffer(window.location.href);
        var s = b.toString('base64');
        var loginUrl='/login?originalUrl='+encodeURIComponent(s);
        const {style, width, background,classes}=this.props;
        return (<div>
            <style type="text/css">{`
    .redBtn{
    font-size:12px;
    background-color: #8c1515;
    box-shadow:none;
    color:'#ffffff'
    }
    .MuiButton-containedPrimary-11:hover {
    background-color: #ab2323;
}
    `}</style>
            <div onClick={()=>{window.location.href=loginUrl}} className={!this.props.reverse?classes.buttonGear:classes.buttonGearReverse} color="primary">
                <FormattedMessage
                    id="LOGIN"
                />
            </div>

        </div>);
    }

    render() {

        return this.props.userInfos.isLogined ? this.renderLoginedComponent() : this.renderUnLoginComponent()

    }
}

const mapStateToProps = (state, props) => {

    return {
        userInfos: state.userInfos,
        routing: state.routing,
        ...props
    }
}


const mapDispatchToProps = (dispatch, props) => {
    return {
        setSeverResponseUserInfos: (infos) => dispatch(setSeverResponseUserInfos(infos)),
        userLogout: ()=>dispatch(userLogout())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(UserProfile)));


