/**
 * Created by Aaron on 2018/7/6.
 */
import {INNER_SERVER_URL} from  "../config/constants";
import {fetchUrl} from './fetchData';

import swal from 'sweetalert2'

const setPageInfos = (pageInfos) => ({//设置登录状态
    type: 'SET_PAGEINFOS',
    pageInfos
})


const getAllLibTagsDispatch = (data) => ({//获取所有的lib
    type: 'SET_GET_ALL_LIBS',
    data
})


const getMyGroupTags = (data) => ({//获取我的分组信息
    type: 'SET_MY_GROUP_TAGS',
    data
})


const setMyGroupContainLibs = (data) => ({
    type: 'SET_CURRENT_SELECTED_TAGS',
    data
})


const AddGroupContainLibs = (libId) => ({
    type: 'ADD_SELECTED_TAGS',
    libId:libId
})

const RemoveGroupContainLibs = (libId) => ({
    type: 'REMOVE_SELECTED_TAGS',
    libId:libId
})

const removeTab=(index) => ({
    type: 'REMOVE_GROUP_TAG',
    index
})

const setError=(dispatch,error="Some Error Happened")=>{
    console.error(error);
    swal(
        error,
        '',
        'error'
    )
    dispatch({
        type: 'RECEIVE_ERROR',
        error: error,
    })
}

const getUserLibTags = (userId,header)=> dispatch=> {//获取用户自定义专业库
    dispatch(setPageInfos({isAccessing: true}))
    return fetchUrl(INNER_SERVER_URL + "getdefinedcategory?userid=" + userId, "get",null,header).then(response => {
        console.log(response)
        if (!!response&&response.statu) {
            dispatch(getMyGroupTags({
                data:response.data
            }));

        } else {
            dispatch(setPageInfos({
                isAccessing: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}


const deleteUserGroupTags = (userId,groupId,index,header)=> dispatch=> {//获取用户自定义专业库
    dispatch(setPageInfos({isAccessing: true}))
    let formdata = new FormData();
    formdata.append("userid",userId);
    formdata.append("categoryid",groupId);
    return fetchUrl(INNER_SERVER_URL + "delcategory" , "post",formdata,header).then(response => {
        console.log(response)
        if (!!response) {//需要显示图片
            dispatch(removeTab(index));

        } else {
            dispatch(setPageInfos({
                isAccessing: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}


const addNewTab=()=>dispatch =>{
    dispatch({
        type: 'ADD_NEW_TAB'
    })
}


const addNewTabLocal=(value)=>dispatch =>{
    dispatch({
        type: 'ADD_NEW_TAB_LOCAL',
        value
    })
}

const modifyTabLocal=(value)=>dispatch =>{
    dispatch({
        type: 'MODIFY_NEW_TAB_LOCAL',
        value
    })
}





const addUserLibTag = (userId,groupId,index,header)=> dispatch=> {//用户增加自定义标签

    dispatch(removeTab(index))
    dispatch(addNewTabLocal({categoryname:groupId}))
    dispatch(setPageInfos({isAccessing: true}))
    let formdata = new FormData();
    formdata.append("userid",userId);
    formdata.append("categoryname",groupId);
    return fetchUrl(INNER_SERVER_URL + "insertcategory", "post",formdata,header).then(response => {
        console.log(response);
        if (!!response&&response.statu){
            dispatch(modifyTabLocal({categoryname:response.data.categoryname,categoryid:response.data.categoryid,groupId:groupId,index:index}))
            dispatch(setPageInfos({
                isAccessing: false,
                tabIndex:index+""
            }));
            dispatch(setMyGroupContainLibs({
                data:[]
            }));


        } else {
            dispatch(removeTab(index))
            setError(dispatch,response.msg);
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}


const modifyUserLibTag = (userId,groupId,groupName,index,header)=> dispatch=> {//用户修改自定义标签
    dispatch(setPageInfos({isAccessing: true}))

    let formdata = new FormData();
    formdata.append("userid",userId);
    formdata.append("categoryid",groupId);
    formdata.append("categoryname",groupName);
    return fetchUrl(INNER_SERVER_URL + "renamecategory", "post",formdata,header).then(response => {
        console.log(response);
        if (!!response&&response.statu){
            dispatch(setPageInfos({
                isAccessing: false
            }));
            dispatch(modifyTabLocal({categoryname:groupName,groupId:groupId,index:index}))

        } else {
            //dispatch(removeTab(index))
            setError(dispatch,response.msg);
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}



const getAllLibTags = ()=> dispatch=> {//获取用所有专业库
    dispatch(setPageInfos({isAccessing: true}))
    return fetchUrl(INNER_SERVER_URL + "getalldefaultlib", "get").then(response => {
console.log(response);
        if (!!response&&response) {//需要显示图片
            dispatch(getAllLibTagsDispatch(response.data));

        } else {
            dispatch(setPageInfos({
                isAccessing: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}


const addGroupContainTags=(userId,groupId,libId,header)=>dispatch=>{
    dispatch(setPageInfos({isAccessing: true}))
    let formdata = new FormData();
    formdata.append("userid",userId);
    formdata.append("categoryid1",groupId);
    formdata.append("categoryid2",libId);
    console.log(userId+"::::"+groupId+"::::"+libId);
    if(groupId = "默认分组" && !userId){
        dispatch(AddGroupContainLibs(libId));
    }else{
        return fetchUrl(INNER_SERVER_URL + "insertgsd", "post",formdata,header).then(response => {
            if (!!response) {//需要显示图片
                dispatch(AddGroupContainLibs(libId));
            } else {
                dispatch(setPageInfos({
                    isAccessing: false
                }));
            }
        }).catch(error => {
            setError(dispatch,error);

        })
    }    
}


const removeGroupContainTags=(userId,groupId,libId,header)=>dispatch=>{
    dispatch(setPageInfos({isAccessing: true}))
    let formdata = new FormData();
    formdata.append("userid",userId);
    formdata.append("categoryid1",groupId);
    formdata.append("categoryid2",libId);
    console.log(userId+"::::"+groupId+"::::"+libId);
    if(groupId == "默认分组" && !userId){
        dispatch(RemoveGroupContainLibs(libId));
    }else{
        return fetchUrl(INNER_SERVER_URL + "delgsd", "post",formdata,header).then(response => {
            if (!!response) {//需要显示图片
                dispatch(RemoveGroupContainLibs(libId));

            } else {
                dispatch(setPageInfos({
                    isAccessing: false
                }));
            }
        }).catch(error => {
            setError(dispatch,error);

        })
    }    
}


const getGroupContainTags=(userId,groupId,header)=>dispatch=>{
    if(userId){
        dispatch(setPageInfos({isAccessing: true}))
        let formdata = new FormData();
        formdata.append("userid",userId);
        formdata.append("categoryid1",groupId);
        console.log(userId+"::::"+groupId+"::::");
        return fetchUrl(INNER_SERVER_URL + "getgsdbydefinedcategory", "post",formdata,header).then(response => {

            console.log(response);
            if (!!response&&response.statu) {//需要显示图片
                dispatch(setMyGroupContainLibs({
                    data:response.data
                }));

            } else {
                dispatch(setPageInfos({
                    isAccessing: false
                }));
            }

        }).catch(error => {
            setError(dispatch,error);

        })
    }    
}

module.exports = {getUserLibTags,getAllLibTags,addUserLibTag,deleteUserGroupTags,addNewTab,addGroupContainTags,removeTab,modifyUserLibTag,setPageInfos,getGroupContainTags,removeGroupContainTags}