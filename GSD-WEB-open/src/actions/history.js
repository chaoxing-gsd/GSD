/**
 * Created by Aaron on 2018/7/22.
 */
/**
 * Created by Aaron on 2018/7/20.
 */
import {INNER_SERVER_URL} from  "../config/constants";
import {fetchUrl,fetchJSONData} from './fetchData';

import swal from 'sweetalert2'


const setError=(dispatch,error="Some Error Happened")=>{
    console.error(error);

    dispatch({
        type: 'HISTORY_RECEIVE_ERROR',
        error: error,
    })
}


const setPageInfos = (pageInfos) => ({
    type: 'SET_HISTORY_PAGEINFOS',
    pageInfos
})


const setHistoryData = (data) => ({
    type: 'SET_HISTORY_DATA',
    data
})


const setHistoryRecord = (data) => ({
    type: 'SET_HISTORY_RECORD',
    data
})


const removeHistoryRecord = (data) => ({
    type: 'REMOVE_HISTORY_RECORD',
    data
})


const saveHistoryData=(userId,searchValue,header)=>dispatch=>{
    
    dispatch(setPageInfos({isAccessing: true}))
    let formdata = new FormData();
    formdata.append("userid",userId);
    formdata.append("content",searchValue);
    return fetchUrl(INNER_SERVER_URL+"insertsearchcontent" , "post",formdata,header).then(response => {
        console.log(response);

        if (!!response&&response.statu) {
            // dispatch(setYearChannelData({data:response.data}));
            dispatch(setPageInfos({
                isAccessing: false
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


const saveHistoryResourceRecord=(userId,searchValue,title1="",title2="",url="",header)=>dispatch=>{

    dispatch(setPageInfos({isAccessing: true}))
    let formdata = new FormData();
    formdata.append("userid",userId);
    formdata.append("content",searchValue);
    formdata.append("title1",title1);
    formdata.append("title2",title2);
    formdata.append("url",url);
    return fetchUrl(INNER_SERVER_URL+"insertsearchrecord" , "post",formdata,header).then(response => {
        console.log(response);

        if (!!response&&response.statu) {
           // dispatch(setYearChannelData({data:response.data}));
            dispatch(setPageInfos({
                isAccessing: false
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



const getHistoryData=(userId,header)=>dispatch=>{

    dispatch(setPageInfos({isAccessing: true}))
    let formdata = new FormData();
    formdata.append("userid",userId);
    return fetchUrl(INNER_SERVER_URL+"getsearchcontentbyuserId" , "post",formdata,header).then(response => {

        if (!!response&&response.statu) {
            dispatch(setHistoryData({data:response.data}));


        } else {
            dispatch(setPageInfos({
                isAccessing: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}


const getHistoryRecord=(userId,content,header)=>dispatch=>{

    dispatch(setPageInfos({isAccessing: true}))
    let formdata = new FormData();
    formdata.append("userid",userId);
    formdata.append("content",content);
    return fetchUrl(INNER_SERVER_URL+"getsearchrecordbycontent" , "post",formdata,header).then(response => {

        if (!!response&&response.statu) {
            dispatch(setHistoryRecord({data:response.data}));


        } else {
            dispatch(setPageInfos({
                isAccessing: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}



const ifSearched=(userId,searchValue)=>dispatch=>{

    let formdata = new FormData();
    formdata.append("userid",userId);
    formdata.append("content",searchValue);
    return fetchUrl(INNER_SERVER_URL+"hascontent" , "post",formdata).then(response => {

        console.log(response);
        if (response==true) {
            dispatch(setPageInfos({
                isSearched: true
            }));


        } else {
            dispatch(setPageInfos({
                isSearched: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}


const deleteSearchHistory=(userId,searchId,datetimetype,header)=>dispatch=>{

    dispatch(setPageInfos({isAccessing: true}))
    return fetchUrl(INNER_SERVER_URL+"deleteSearchHistory?userid="+userId+"&searchcontent="+searchId+"&datetimetype="+datetimetype , "delete","",header).then(response => {

        if (!!response&&response.statu) {
            // dispatch(setPageInfos({
            //     isAccessing: false
            // }));
            dispatch(removeHistoryRecord({data:{searchId:searchId,datetimetype:datetimetype}}));


        } else {
            dispatch(setPageInfos({
                isAccessing: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}




module.exports = {saveHistoryData,getHistoryData,deleteSearchHistory,saveHistoryResourceRecord,ifSearched,getHistoryRecord}