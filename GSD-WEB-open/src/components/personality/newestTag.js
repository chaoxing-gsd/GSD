/**
 * Created by Aaron on 2018/7/5.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, Glyphicon} from 'react-bootstrap'
import {FormattedMessage,injectIntl} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux'
import {setPageInfos} from "../../actions";
import {fetchUrl} from '../../actions/fetchData';
import {INNER_SERVER_URL} from  "../../config/constants";
import swal from 'sweetalert2'
import { Tag } from 'antd';
const { CheckableTag } = Tag;

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        padding: "15px 20px"
    },
    okBtn: {
        fontSize: '13px',
        textAlign:"center",
        display: "inline-block",
        backgroundColor: "#d45f5f",
        '&:hover': {
            backgroundColor: "#b93939",
        },
    },
    cancelBtn: {
        fontSize: '13px',
        display: "inline-block",
        textAlign:"center",
        color: "#777777",
        borderColor: "transparent",
        '&:hover': {
            borderColor: "transparent",
        },

    },
    fabIcon: {
        textAlign:"center",
        marginLeft:"10px",
        marginBottom:"10px"
    },
});


class NewestTag extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {tagList:[],selectedTag:''}
    }





    componentDidMount() {
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: this.props.userInfos.responseUserInfo.token};
            this.getNewestTags(this.cxId,2, header);
            console.log(this.props.selectedTagName);
            this.setState({selectedTag:this.props.selectedTagName});
        }else{
            var chaoxing_user_libs_key = JSON.parse(window.localStorage.getItem("chaoxing_user_libs_key"));
            if(chaoxing_user_libs_key){
                if(chaoxing_user_libs_key.groupTag == "默认分组"){
                    window.localStorage.setItem("chaoxing_user_libs_key","");
                } 
            }                       
            //用户未登录时的默认自定义库分组
            // var chaoxing_user_libs_key = JSON.parse(window.localStorage.getItem("chaoxing_user_libs_key"));
            // if(chaoxing_user_libs_key){
            //     var array = {};
            //     array["默认分组"] = chaoxing_user_libs_key.libs;
            //     this.setState({tagList: array});
            //     this.props.setPageInfos({localTagName:"默认分组",selectedLibIds:chaoxing_user_libs_key.libs});
            // }            
        }
    }


    getNewestTags=async(userId,type=2,header)=>{
        this.setState({isLoading:true})
        var url="getLatestFiveCategory?userid=" + userId+"&type="+type;
        var response = await fetchUrl(INNER_SERVER_URL + url, "get", null, header);
        console.log(response);
        this.setState({isLoading:false});
        if (!!response) {
            if (!!response.statu) {
                this.setState({tagList: response.data});


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

    componentWillReceiveProps(nextProps) {

        if (nextProps.userInfos.responseUserInfo.userid!=""&&nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: nextProps.userInfos.responseUserInfo.token};
            this.getNewestTags(this.cxId,2, header);


        }
        if(this.props.personality.pageInfos.localTagName!=nextProps.personality.pageInfos.localTagName){
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            var header = {userid: this.cxId, token: nextProps.userInfos.responseUserInfo.token};
            if(this.cxId){
                this.getNewestTags(this.cxId,2, header);
            }            
        }
    }

    tagChange(checked,key){//tag点击修改
        if(checked){
            this.setState({selectedTag:key});
            var selectedLibIds=Object.keys(this.state.tagList).reduce((arr,skey,index)=>{
                if(key===skey){
                    var itemList=this.state.tagList[skey];
                    arr=arr.concat(itemList.map(sitem=>{return {id:sitem.categoryid2,type:sitem.type}}));
                }

                return arr;
            },[]);
            console.log(selectedLibIds);
            this.props.setPageInfos({localTagName:key,selectedLibIds:selectedLibIds});
            //this.props.setPageInfos({localTagName:key});
        }else{
            this.setState({selectedTag:""});
        }
    }

    render() {
        const {classes} = this.props;
        var tagKeys=Object.keys( this.state.tagList);
        return (
            <div className="newestTags">
                {
                    tagKeys.map(key=><CheckableTag className="gsd-tag" checked={this.props.personality.pageInfos.localTagName==key} key={key} onChange={(checked)=>this.tagChange(checked,key)} >{key}</CheckableTag>)
                }
            </div>
        );
    }

}


const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        personality:state.personality
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        setPageInfos: (pageInfos)=>dispatch(setPageInfos(pageInfos))


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(NewestTag)));

