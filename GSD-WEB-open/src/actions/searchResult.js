/**
 * Created by Aaron on 2018/7/10.
 */
/**
 * Created by Aaron on 2018/7/6.
 */
import {INNER_SERVER_URL} from  "../config/constants";
import {fetchUrl,fetchText} from './fetchData';

import swal from 'sweetalert2'

const setSearchResultPageInfos = (pageInfos) => ({
    type: 'SET_RESULT_PAGEINFOS',
    pageInfos
})


const setSearchTitle = (searchTitle) => ({//设置全局搜索内容
    type: 'SET_SEARCH_TITLE',
    searchTitle
})

const setResultAccessing = (dataId) => ({
    type: 'SEARCH_RESULT_ACCESSING',
    dataId
})



const setSearchResult = (result) => ({//获取所有搜索结果
    type: 'SET_SEARCH_RESULT',
    data:result.data,
    dataIndex:result.dataIndex
})

const setSingleSearchResult = (result) => ({//获取所有搜索结果
    type: 'SET_SINGLE_SEARCH_RESULT',
    data:result.data,
    dataIndex:result.dataIndex
})


const setError=(dispatch,error="Some errors happend")=>{
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

const getSearchResult=(searchTitle,pageInfo)=>dispatch=>{

    dispatch(setSearchResultPageInfos({isAccessing: true}))
    let formdata = new FormData();
    formdata.append("content",searchTitle);


    return fetchUrl(INNER_SERVER_URL + "search", "post",formdata).then(response => {


        if (!!response&&response.statu) {


            dispatch(setSearchResult({data:response.data,dataIndex:0}));

        } else {
             dispatch(setSearchResultPageInfos({
                 isAccessing: false
             }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}



const getSearchResultByIds=(searchTitle,ids)=>dispatch=>{

    dispatch(setSearchResultPageInfos({isAccessing: true}))
    let formdata = new FormData();
    formdata.append("title",searchTitle);
    formdata.append("ids",ids.join(","));

    console.log(searchTitle);
    console.log(ids);


    return fetchUrl(INNER_SERVER_URL + "searchbytitleandids", "post",formdata).then(response => {

        if (!!response) {
            dispatch(setSearchResult({data:response,dataIndex:1}));

        } else {
            dispatch(setSearchResultPageInfos({
                isAccessing: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}


const getSearchResultListById=(searchTitle,id,currentPage,dataIndex)=>dispatch=>{

    dispatch(setSearchResultPageInfos({isAccessing: true}))
    let formdata = new FormData();
    formdata.append("content",searchTitle);
    formdata.append("documenttype",id);
    formdata.append("pagenum",currentPage);


    return fetchUrl(INNER_SERVER_URL + "searchtitlebypagenum", "post",formdata).then(response => {

        if (!!response&&response.statu) {
            dispatch(setSearchResult({data:response.data,dataIndex:dataIndex}));

        } else {
            dispatch(setSearchResultPageInfos({
                isAccessing: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}


const getResultByArguments=(argument,dataId,currentPage=1,pageSize=20,clusternames,channels,type,degree=null,choren=null,userId,header)=>dispatch=>{
    dispatch(setResultAccessing(dataId));
    if(type==2){//非超星数据查询
        let formdata = new FormData();
        formdata.append("content",argument);
        formdata.append("pagesize",pageSize);
        formdata.append("pagenum",currentPage);
        formdata.append("indexnames",dataId);
        formdata.append("field",'');

        return fetchUrl(INNER_SERVER_URL + "search2", "post",formdata).then(response => {
            if (!!response&&response.statu) {
                console.log(response);
                dispatch(setSearchResult({data:response.data[dataId],dataIndex:dataId}));

            } else {
                dispatch(setSearchResultPageInfos({
                    isAccessing: false
                }));
            }

        }).catch(error => {
            setError(dispatch,error);

        })
    }else if(type==3){  //我的笔记查询
        let formdata = new FormData();
        formdata.append("title",argument);
        formdata.append("pageSize",pageSize);
        formdata.append("pageNum",1);
        formdata.append("userId",userId);
        formdata.append("document_type","webpage");
        return fetchUrl(INNER_SERVER_URL + "es/searchmywebpage", "post",formdata,header).then(response => {
            if (!!response&&response.statu) {
                console.log(response);
                var data = {};
                data.content = [];
                data.contentnum = response.data.num;
                response.data.list.map(item=> {
                    data.content.push(
                        {
                            "basic_title":item.title.replace(/<h2>|<\/h2>/g,""),
                            "basic_title_url":item.url
                        }
                    )
                })
                dispatch(setSearchResult({data:data,dataIndex:dataId}));
            } else {
                dispatch(setSearchResultPageInfos({
                    isAccessing: false
                }));
            }
        }).catch(error => {
            setError(dispatch,error);
        })
    }
    else{
        let formdata = new FormData();
        formdata.append("argument",argument);
        formdata.append("pagesize",pageSize);
        formdata.append("pagenum",currentPage);
        formdata.append("channels",channels);
        formdata.append("clusternames",clusternames);
        if(!!degree) formdata.append("degree",degree);
        if(!!choren) formdata.append("choren",choren);
        return fetchUrl(INNER_SERVER_URL + "definedsearch", "post",formdata).then(response => {
            if (!!response&&response.statu) {
                var dataIndex=!!degree?(dataId+"_"+degree):(!!choren?dataId+"_"+choren:dataId)
                dispatch(setSearchResult({data:response.data,dataIndex:dataIndex}));

            } else {
                dispatch(setSearchResultPageInfos({
                    isAccessing: false
                }));
            }

        }).catch(error => {
            setError(dispatch,error);

        })
    }

}


const getSinglgPageResultByArguments=(argument,dataId,currentPage=1,pageSize=20,clusternames,channels,type,libId,userId,timeSort=0,header,degree=null,choren=null)=>dispatch=>{
    dispatch(setSearchResultPageInfos({isAccessing: true}))

    if(type==2){//第三方库查询
        let formdata = new FormData();
        formdata.append("content",argument);
        formdata.append("pagesize",pageSize);
        formdata.append("pagenum",currentPage);
        formdata.append("indexnames",libId);
        formdata.append("field",'');

        return fetchUrl(INNER_SERVER_URL + "search2", "post",formdata).then(response => {
            if (!!response&&response.statu) {
                console.log(response);
                dispatch(setSingleSearchResult({data:response.data[libId],dataIndex:dataId}));

            } else {
                dispatch(setSearchResultPageInfos({
                    isAccessing: false
                }));
            }

        }).catch(error => {
            setError(dispatch,error);

        })
    }else if(type==3){//查询自己的索引数据
        let formdata = new FormData();
        formdata.append("title",argument);
        formdata.append("pageSize",pageSize);
        formdata.append("pageNum",currentPage+1);
        formdata.append("userId",userId);
        formdata.append("document_type","webpage");
        if(timeSort!=0){
            formdata.append("sort","time");
            formdata.append("sortType",timeSort);
        }
        return fetchUrl(INNER_SERVER_URL + "es/searchmywebpage", "post",formdata,header).then(response => {
            if (!!response&&response.statu) {
                console.log(response);
                dispatch(setSingleSearchResult({data:response.data,dataIndex:dataId}));

            } else {
                dispatch(setSearchResultPageInfos({
                    isAccessing: false
                }));
            }

        }).catch(error => {
            setError(dispatch,error);

        })
    }
    else{
        let formdata = new FormData();
        formdata.append("argument",argument);
        formdata.append("pagesize",pageSize);
        formdata.append("pagenum",currentPage);
        formdata.append("channels",channels);
        formdata.append("clusternames",clusternames);
        if(!!degree) formdata.append("degree",degree);
        if(!!choren) formdata.append("choren",choren);
        return fetchUrl(INNER_SERVER_URL + "definedsearch", "post",formdata).then(response => {
            if (!!response&&response.statu) {
                var dataIndex=!!degree?(dataId+"_"+degree):(!!choren?dataId+"_"+choren:dataId)
                dispatch(setSingleSearchResult({data:response.data,dataIndex:dataIndex}));

            } else {
                dispatch(setSearchResultPageInfos({
                    isAccessing: false
                }));
            }

        }).catch(error => {
            setError(dispatch,error);

        })
    }

}




const downloadFiles=(webpageIds,userid,downloadType,originalName,header)=>dispatch=>{


    let formdata = new FormData();
    formdata.append("webpageIds",webpageIds);
    formdata.append("userId",userid);
    formdata.append("downloadType",downloadType);
    console.log("bbbbbbb");


    return fetchText(INNER_SERVER_URL + "es/downloadwebpage", "post",formdata,header).then((txt) => {

        var eleLink = document.createElement('a');

        var timestamp = (new Date()).getTime();
        var fileName=(originalName||timestamp)+(downloadType==1?".ris":".bib");
        eleLink.download = fileName;
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        var blob = new Blob([txt]);
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);

    }).catch(error => {
        setError(dispatch,error);

    })
}


const deleteLocalIndexsData = (dataIds) => ({
    type: 'DELETE_MY_INDEXS_DATA_IN_RESULT',
    dataIds
})



const deleteMyIndexsDataInSearchResult=(userId,indexId,header)=>dispatch=>{

    dispatch(setSearchResultPageInfos({isDeleting: true,deleteFlag:false}))
    let formdata = new FormData();
    formdata.append("userId",userId);
    formdata.append("documentIds",indexId);
    formdata.append("indexName","webpage");

    return fetchUrl(INNER_SERVER_URL + "es/deldocumentbyids", "post",formdata,header).then(response => {
        console.log(response);

        if (!!response&&response.statu) {
            dispatch(deleteLocalIndexsData(indexId));
        } else {
            dispatch(setSearchResultPageInfos({
                isDeleting: false,
                deleteFlag:false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}




module.exports = {getSearchResult,getSearchResultByIds,getSearchResultListById,getResultByArguments,setSearchTitle,getSinglgPageResultByArguments,setSearchResultPageInfos,downloadFiles,deleteMyIndexsDataInSearchResult}