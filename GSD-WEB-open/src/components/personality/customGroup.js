/**
 * Created by Aaron on 2018/7/5.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, Glyphicon} from 'react-bootstrap'
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';
import Tabs from 'antd/lib/tabs';

import {addUserLibTag, getUserLibTags, deleteUserGroupTags,addNewTab,removeTab,modifyUserLibTag,setPageInfos,getGroupContainTags} from "../../actions";
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button';
import swal from 'sweetalert2'
import {browserHistory} from 'react-router'
import Input from '@material-ui/core/Input';
import {getUserLibs,isMobile} from "../../utils/utils"
import { Tooltip } from 'antd';

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    tabsRoot: {
        borderBottom: '1px solid rgb(232, 232, 232)',
        paddingRight: '50px'
    },
    tabsIndicator: {
        backgroundColor: '#ea7a7a',
    },
    tabRoot: {
        textTransform: 'initial',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing.unit * 4,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: '#ea7a7a',
            opacity: 1,
        },
        '&$tabSelected': {
            color: '#ea7a7a',
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: '#ea7a7a',
        },
    },
    tabSelected: {},
    typography: {
        padding: theme.spacing.unit * 3,
    },
    addIcon: {
        boxShadow: 'none',
        float: "right",
        width: '30px',
        height: '30px',
        minHeight: '30px',
        backgroundColor: "#d45f5f",
        color: "#ffffff",
        textAlign:"center",
        marginTop: "4px",
        display: "block",
        justifyContent: "center",

        '&:hover': {
            backgroundColor: "#ec8686",
        },

    },
    okIcon: {
        boxShadow: 'none',
        float: "right",
        width: '30px',
        height: '30px',
        textAlign:"center",
        minHeight: '30px',
        backgroundColor: "#4CAF50",
        color: "#ffffff",
        marginTop: "4px",

        '&:hover': {
            backgroundColor: "#69ca6d",
        },
    },
    buttonWrapper: {
        position: "absolute",
        right: "0",
        top: "0"
    }

});

class Personality extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        intl: intlShape.isRequired
    }

    constructor(props) {
        super(props);

        this.firstLoad=false;
        this.state = { addMode: false, newGroupName: "",editTagIndex:-1,currentIndex:0}
    }

    handleNewGroupName(e) {
        console.log(e);
        this.setState({newGroupName: e.target.value.trim()});
    }

    componentDidMount() {
        if(!!this.props.userInfos.responseUserInfo&&!!this.props.userInfos.responseUserInfo.userid){
            var header={userid:this.props.userInfos.responseUserInfo.userid,token:this.props.userInfos.responseUserInfo.token};
            this.props.getUserLibTags(this.props.userInfos.responseUserInfo.userid,header);
        }

    }


    addCatGroupOk(idx=-1) {
        var groupName=this.state.newGroupName;
        this.setState({addMode: false,newGroupName:""});
        var index=this.props.personality.myGroupTags.length-1||-1;
        if(!!groupName){
            var header={userid:this.props.userInfos.responseUserInfo.userid,token:this.props.userInfos.responseUserInfo.token};
            this.props.addUserLibTag(this.props.userInfos.responseUserInfo.userid, groupName,index,header);
        }
        else {
            index=idx||index+1;
            this.setState({addMode: false});
            this.props.removeTab(index);
        }
    }

    modifyCatGroup(idx,item){
        if(this.state.newGroupName!=item.categoryname){
            var header={userid:this.props.userInfos.responseUserInfo.userid,token:this.props.userInfos.responseUserInfo.token};
            this.props.modifyUserLibTag(this.props.userInfos.responseUserInfo.userid,item.categoryid,this.state.newGroupName,idx,header)
        }
        this.setState({editTagIndex:-1})
    }

    addCatGroup() {
        if (this.props.userInfos.isLogined) {
            this.setState({addMode: true,newGroupName:""});
            var index=this.props.personality.myGroupTags.length-1||0;
            this.props.addNewTab();


        } else {//用户没有登录
            swal({
                title: this.props.intl.formatMessage({id: 'NOT_LOGIN'}),
                text: this.props.intl.formatMessage({id: 'TO_LOGIN_TIP'}),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'}),
                confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
            }).then((result) => {
                if (result.value) {
                    browserHistory.push("/login");
                }
            })
        }
    }



    remove = (targetKey) => {
        swal({
            title: this.props.intl.formatMessage({id: 'CONFIRM OPERATION'}),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'}),
            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
        }).then((result) => {
            if (result.value) {
                var groupId = this.props.personality.myGroupTags[targetKey].categoryid;
                var header={userid:this.props.userInfos.responseUserInfo.userid,token:this.props.userInfos.responseUserInfo.token};
                this.props.deleteUserGroupTags(this.props.userInfos.responseUserInfo.userid, groupId, targetKey,header);
            }
        })



    }


    editTab=(index,item)=>{

        this.setState({editTagIndex:index,addMode: false,newGroupName:item.categoryname});
    }

    onKeyupModify(e,index,item){
        if (e.keyCode == 13) {
            this.modifyCatGroup(index,item);
        }
    }

    onTouchStart(e,index,item){
        this.touchTimeTick=setTimeout(()=>this.editTab(index,item),500);
    }

    onTouchMove(e){
        clearTimeout(this.touchTimeTick);
    }

    onTouchEnd(e){
        clearTimeout(this.touchTimeTick);
    }


    renderNormalTab(index,item){

        if( this.state.editTagIndex==index){
            return <Input autoFocus={true} type="text" onBlur={()=>this.modifyCatGroup(index,item)} onKeyUp={(e)=>this.onKeyupModify(e,index,item)}  className="newGroupTxt"
                          value={this.state.newGroupName} onChange={(e)=>this.handleNewGroupName(e)}
                          id="input-new-group"
            />
        } else{
            return  <Tooltip  key={`tip_${item.label}`} id="tooltip-bottom" title={<FormattedMessage id="DOUBLE_CLICK_TO_EDIT"/>}  placement="bottom">
                <div onTouchStart={(e)=>this.onTouchStart(e,index,item)} onTouchMove={(e)=>this.onTouchMove(e)} onTouchEnd={(e)=>this.onTouchEnd(e)} onDoubleClick={()=>this.editTab(index,item)}>{item.categoryname}&nbsp;&nbsp;<i onClick={()=>this.remove(index+"")} className="glyphicon glyphicon-remove"></i></div></Tooltip>;
        }

    }


    componentWillReceiveProps(nextProps) {
        if(!this.firstLoad&&this.props.personality.myGroupTags.length==0&&nextProps.personality.myGroupTags.length>0){
            var localUserLibs=getUserLibs();
            var currentTab;
            if(!!localUserLibs&&localUserLibs!=""){
                var localUserLibInfos=JSON.parse(localUserLibs);
                var tabIndex=nextProps.personality.myGroupTags.findIndex(v=>v.categoryname==localUserLibInfos.groupTag);
                currentTab=nextProps.personality.myGroupTags.find(v=>v.categoryname==localUserLibInfos.groupTag);
                this.props.setPageInfos({tabIndex:tabIndex+""});

            }else{
                currentTab=nextProps.personality.myGroupTags[0];
            }

            if(!!currentTab){//当前标签存在
                if(!!nextProps.userInfos.responseUserInfo&&!!nextProps.userInfos.responseUserInfo.userid){
                    var header={userid:nextProps.userInfos.responseUserInfo.userid,token:nextProps.userInfos.responseUserInfo.token};
                    this.props.getGroupContainTags(nextProps.userInfos.responseUserInfo.userid,currentTab.categoryid,header)
                }

            }
        }

    }




    renderMyGroupTags() {


        const {classes} = this.props;
        if (!!this.props.personality.myGroupTags && this.props.personality.myGroupTags.length > 0) {
           var tabs= this.props.personality.myGroupTags.reduce((arr, item, index)=> {
                if("newTab"===item.type){
                    arr.push(
                        <Tabs.TabPane key={index+""} closable={false} tab={<Input onBlur={(e)=> this.addCatGroupOk()} autoFocus={true} type="text" onKeyUp={(e)=>this.onKeyup(e)} className="newGroupTxt"
                                   value={this.state.newGroupName} onChange={(e)=>this.handleNewGroupName(e)}
                                   id="input-new-group"
                            />}>

                        </Tabs.TabPane>
                    );
                }else{
                    arr.push(<Tabs.TabPane closable={false}  tab={this.renderNormalTab(index,item)} key={index+""} ></Tabs.TabPane>);
                }

                return arr;
            }, []);

            return  <Tabs
                hideAdd
                className="group-tabs"
                onChange={(key)=>this.onChange(key)}
                type="editable-card"
                activeKey={this.props.personality.pageInfos.tabIndex}
                onEdit={(targetKey, action)=>this.onEdit(targetKey, action)}

            >{tabs}
                </Tabs>


        } else {
            return <div><h5 style={{color: "rgb(179, 179, 179)",margin:"14px 0"}}><Tooltip id="tooltip-icon" title={ <FormattedMessage id="ADD_TAG_TIPS"/>}><span>
                <FormattedMessage id="ADD_TAG_TIPS"/>
                </span></Tooltip></h5></div>;
        }
    }

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }

    onKeyup(e) {

        if (e.keyCode == 13) {
            this.addCatGroupOk();
        }
    }

    onChange = (tabIndex) => {
        this.props.setPageInfos({tabIndex:tabIndex+""});

        var currentTab=this.props.personality.myGroupTags[tabIndex];
        if(!!currentTab){//当前标签存在
            var header={userid:this.props.userInfos.responseUserInfo.userid,token:this.props.userInfos.responseUserInfo.token};
            this.props.getGroupContainTags(this.props.userInfos.responseUserInfo.userid,currentTab.categoryid,header)
        }
    }


    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root} style={{backgroundColor:"#ffffff"}}>

                <Row style={{margin:"0",position:"relative"}}>
                    {/* {!!this.props.userInfos.isLogined && <div style={{position:"relative",marginRight:"40px"}}>
                        {
                            this.renderMyGroupTags()
                        }
                    </div>}
                    {!this.props.userInfos.isLogined &&<div><h5 style={{color: "rgb(179, 179, 179)",margin:"14px 0"}}><FormattedMessage id="Login_to_config_tags"/> </h5></div>} */}

                    {
                        this.renderMyGroupTags()
                    }

                    <div className={classes.buttonWrapper}>
                        {!this.state.addMode &&
                        <Button disabled={this.state.addMode} onClick={()=>this.addCatGroup()} mini variant="fab"
                                className={classes.addIcon}> <Glyphicon glyph="plus"
                                                                        style={{top:"0px",left:"1px",textAlign:'center'}}/></Button>}
                        {this.state.addMode &&
                        <Button disabled={!this.state.addMode} onClick={()=>this.addCatGroupOk()} mini variant="fab"
                                className={classes.okIcon}> <Glyphicon glyph="ok"
                                                                       style={{top:"0px",left:"1px"}}/></Button>}</div>
                </Row>



            </div>
        );
    }

}


const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        personality: state.personality
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        addUserLibTag: (userId, groupId,index,header) => dispatch(addUserLibTag(userId, groupId,index,header)),
        getUserLibTags: (userId,header)=> dispatch(getUserLibTags(userId,header)),
        deleteUserGroupTags: (userId, groupId, index,header) => dispatch(deleteUserGroupTags(userId, groupId, index,header)),
        addNewTab:()=>dispatch(addNewTab()),
        removeTab:(index)=>dispatch(removeTab(index)),
        modifyUserLibTag:(userId,groupId,groupName,index,header)=>dispatch(modifyUserLibTag(userId,groupId,groupName,index,header)),
        setPageInfos:(pageInfos)=>dispatch(setPageInfos(pageInfos)),
        getGroupContainTags:(userId,groupId,header)=>dispatch(getGroupContainTags(userId,groupId,header))


    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(Personality)));

