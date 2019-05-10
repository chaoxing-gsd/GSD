/**
 * Created by Aaron on 2018/7/10.
 */
/**
 * Created by Aaron on 2018/7/6.
 */
import {INNER_SERVER_URL} from  "../config/constants";
import {fetchUrl} from './fetchData';

import swal from 'sweetalert2'


const setError=(dispatch,error="Some Error Happened")=>{
    console.error(error);
    swal(
        error,
        '',
        'error'
    )
    dispatch({
        type: 'MY_INDEXS_RECEIVE_ERROR',
        error: error,
    })
}


const setPageInfos = (pageInfos) => ({
    type: 'SET_MY_INDEXS_PAGEINFOS',
    pageInfos
})


const setMyIndexsData = (data) => ({
    type: 'SET_MY_INDEXS_DATA',
    data
})

const setCurrentIndexsData = (data) => ({
    type: 'SET_CURRENT_INDEXS_DATA',
    data
})


const deleteLocalIndexsData = (dataIds) => ({
    type: 'DELETE_MY_INDEXS_DATA',
    dataIds
})



const getMyIndexsData=(userId,pageNum=1,header,type="",timeSort=0,title="")=>dispatch=>{

    dispatch(setPageInfos({isLoading: true,type:type}))
    dispatch(setPageInfos({isLoading: true,type:type,isDeleting:false}))
    let formdata = new FormData();
    formdata.append("userId",userId);
    formdata.append("pageNum",pageNum);
    formdata.append("pageSize",20);
    formdata.append("document_type",type);
    formdata.append("title",title);

    if(timeSort!=0){
        formdata.append("sort","time");
        formdata.append("sortType",timeSort);
    }

    console.log(header);
    return fetchUrl(INNER_SERVER_URL + "es/searchmywebpage", "post",formdata,header).then(response => {
        console.log(response);

        if (!!response&&response.statu) {
            dispatch(setMyIndexsData({data:response.data.list,num:response.data.num,type:type}));

        } else {
            dispatch(setPageInfos({
                isLoading: false,
                type:type
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}


const getIndexById=(userId,indexId,header)=>dispatch=>{

    dispatch(setPageInfos({isLoading: true}))
    let formdata = new FormData();
    formdata.append("userId",userId);
    formdata.append("indexId",indexId);
    formdata.append("indexName","webpage");
    formdata.append("indexName","gsd_notes");

    return fetchUrl(INNER_SERVER_URL + "es/searchindexbyid", "post",formdata,header).then(response => {
        console.log(response);

        if (!!response&&response.statu) {
            dispatch(setCurrentIndexsData({data:response.data[0]}));

        } else {
            dispatch(setPageInfos({
                isLoading: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}




const deleteMyIndexsData=(userId,indexId,header)=>dispatch=>{

    dispatch(setPageInfos({isDeleting: true,deleteFlag:false}))
    dispatch(setPageInfos({isDeleting: true,deleteFlag:false,type:"webpage"}))
    let formdata = new FormData();
    formdata.append("userId",userId);
    formdata.append("documentIds",indexId);
    formdata.append("indexName","webpage");

    return fetchUrl(INNER_SERVER_URL + "es/deldocumentbyids", "post",formdata,header).then(response => {
        console.log(response);

        if (!!response&&response.statu) {
            dispatch(deleteLocalIndexsData(indexId));
        } else {
            dispatch(setPageInfos({
                isDeleting: false,
                deleteFlag:false,
                type:"webpage"
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}



const updateMyIndex=(userId,indexId,indexData,content,header)=>dispatch=>{

    console.log(indexData);
    dispatch(setPageInfos({
        isChanging:true,
        changeFlag:-1
    }));
    let formdata = new FormData();
    formdata.append("userId",userId);
    formdata.append("userid",userId);
    formdata.append("webpageid ",indexId);
    for(var key in indexData){
        formdata.append(key,indexData[key]);
    }
   // formdata.append("note",content);

    console.log(formdata);

    return fetchUrl(INNER_SERVER_URL + "es/changewebpage", "post",formdata,header).then(response => {

        if (!!response&&response.statu) {
            dispatch(setPageInfos({
                isChanging:false,
                changeFlag:1
            }));
        } else {
            dispatch(setPageInfos({
                isChanging:false,
                changeFlag:0
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}




module.exports = {getMyIndexsData,deleteMyIndexsData,getIndexById,updateMyIndex}