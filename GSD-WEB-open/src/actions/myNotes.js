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
        type: 'MY_NOTES_RECEIVE_ERROR',
        error: error,
    })
}


const setPageInfos = (pageInfos) => ({
    type: 'SET_MY_NOTES_PAGEINFOS',
    pageInfos
})


const setMyNotesData = (data) => ({
    type: 'SET_MY_NOTES_DATA',
    data
})

const setCurrentNotesData = (data) => ({
    type: 'SET_CURRENT_NOTES_DATA',
    data
})


const deleteLocalNotesData = (dataIds) => ({
    type: 'DELETE_MY_NOTES_DATA',
    dataIds
})



const getMyNotesData=(userId)=>dispatch=>{

    dispatch(setPageInfos({isLoading: true}))
    let formdata = new FormData();
    formdata.append("userid",userId);
    formdata.append("title","");
    formdata.append("pagenum",20);
    formdata.append("pagesize",1);

    return fetchUrl(INNER_SERVER_URL + "findnote", "post",formdata).then(response => {
        console.log(response);

        if (!!response&&response.statu) {
            dispatch(setMyNotesData({data:response.data.list,num:response.data.num}));

        } else {
            dispatch(setPageInfos({
                isLoading: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}


const getNoteById=(userId,noteId)=>dispatch=>{

    dispatch(setPageInfos({isLoading: true}))
    let formdata = new FormData();
    formdata.append("userid",userId);
    formdata.append("id",noteId);

    return fetchUrl(INNER_SERVER_URL + "findnotebyid", "post",formdata).then(response => {
        console.log(response);

        if (!!response&&response.statu) {
            dispatch(setCurrentNotesData({data:response.data[0]}));

        } else {
            dispatch(setPageInfos({
                isLoading: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}


const deleteMyNotesData=(userId,noteId)=>dispatch=>{

    dispatch(setPageInfos({isDeleting: true,deleteFlag:false}))
    let formdata = new FormData();
    formdata.append("userid",userId);
    formdata.append("noteid",noteId);

    return fetchUrl(INNER_SERVER_URL + "delnote", "post",formdata).then(response => {
        console.log(response);

        if (!!response&&response.statu) {
            dispatch(deleteLocalNotesData(noteId));
        } else {
            dispatch(setPageInfos({
                isDeleting: false,
                deleteFlag:false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}



const updateMyNote=(userId,noteId,noteData,content)=>dispatch=>{

    console.log(noteData);
    dispatch(setPageInfos({isChanging:true,changeFlag:-1}))
    let formdata = new FormData();
    formdata.append("userid",userId);
    formdata.append("noteid",noteId);
    formdata.append("title",noteData.title);
    formdata.append("url",noteData.url);
    formdata.append("content",content);
    formdata.append("GBT_7714",noteData.gbt_7714);
    formdata.append("MLA",noteData.mla);
    formdata.append("APA",noteData.apa);

    return fetchUrl(INNER_SERVER_URL + "changenote", "post",formdata).then(response => {

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




module.exports = {getMyNotesData,deleteMyNotesData,getNoteById,updateMyNote}