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
        type: 'CHART_RECEIVE_ERROR',
        error: error,
    })
}


const setPageInfos = (pageInfos) => ({
    type: 'SET_CHART_PAGEINFOS',
    pageInfos
})


const setYearChannelData = (data) => ({
    type: 'SET_YEAR_CHANNEL_DATA',
    data
})

const setChartData = (data) => ({
    type: 'SET_CLUSTER_CHART_DATA',
    data
})


const setRankChannelData = (data) => ({
    type: 'SET_RANK_DATA',
    data
})


const getYearChannelListData=(searchValue)=>dispatch=>{

    dispatch(setPageInfos({isYearChartAccessing: true}))
    let formdata = new FormData();
    formdata.append("argument",`Z=${searchValue}`);
    formdata.append("clusternames","yearchannelList");

    return fetchUrl(INNER_SERVER_URL + "searchclusters", "post",formdata).then(response => {
        console.log(response);

        if (!!response&&response.statu) {
            dispatch(setYearChannelData({data:response.data}));

        } else {
            dispatch(setPageInfos({
                isYearChartAccessing: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}


const getRankListData=(searchValue)=>dispatch=>{

    dispatch(setPageInfos({isRankChartAccessing: true}))
    let formdata = new FormData();
    formdata.append("argument",`Z=${searchValue}`);
    formdata.append("clusternames","channelList");

    return fetchUrl(INNER_SERVER_URL + "searchclusters", "post",formdata).then(response => {
        console.log(response);

        if (!!response&&response.statu) {
            dispatch(setRankChannelData({data:response.data}));

        } else {
            dispatch(setPageInfos({
                isRankChartAccessing: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}


const getClusterData=(searchValue,clusterName)=>dispatch=>{
    var accessName=clusterName+"ChartAccessing"
    var pageInfoObj={};
    pageInfoObj[accessName]=true;

    dispatch(setPageInfos(pageInfoObj))
    let formdata = new FormData();
    formdata.append("argument",`Z=${searchValue}`);
    formdata.append("clusternames",clusterName);

    return fetchUrl(INNER_SERVER_URL + "searchclusters", "post",formdata).then(response => {
        console.log(response);

        if (!!response&&response.statu) {
            dispatch(setChartData({data:response.data,clusterName:clusterName}));

        } else {
            pageInfoObj[accessName]=false;
            dispatch(setPageInfos(pageInfoObj));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}






const getClusterSummaryData=(argument,dataId,clusternames,channels,type,libId)=>dispatch=>{
    // dispatch(setSearchResultPageInfos({isAccessing: true}))
    //
    // if(type==2){//ctext库接入
    //     let formdata = new FormData();
    //     formdata.append("content",argument);
    //     formdata.append("pagesize",pageSize);
    //     formdata.append("pagenum",currentPage);
    //     formdata.append("indexnames",libId);
    //     formdata.append("field",'');
    //     return fetchUrl(INNER_SERVER_URL + "search2", "post",formdata).then(response => {
    //         if (!!response&&response.statu) {
    //             console.log(response);
    //             dispatch(setSingleSearchResult({data:response.data[libId],dataIndex:dataId}));
    //
    //         } else {
    //             dispatch(setSearchResultPageInfos({
    //                 isAccessing: false
    //             }));
    //         }
    //
    //     }).catch(error => {
    //         setError(dispatch,error);
    //
    //     })
    // }else if(type==3){//查询自己的索引数据
    //     let formdata = new FormData();
    //     formdata.append("title",argument);
    //     formdata.append("pagesize",pageSize);
    //     formdata.append("pagenum",currentPage);
    //     formdata.append("indexnames",libId);
    //     formdata.append("userid",userId);
    //     return fetchUrl(INNER_SERVER_URL + "searchwebpage", "post",formdata).then(response => {
    //         if (!!response&&response.statu) {
    //             console.log(response);
    //             dispatch(setSingleSearchResult({data:response.data[libId],dataIndex:dataId}));
    //
    //         } else {
    //             dispatch(setSearchResultPageInfos({
    //                 isAccessing: false
    //             }));
    //         }
    //
    //     }).catch(error => {
    //         setError(dispatch,error);
    //
    //     })
    // }
    // else{
    //     let formdata = new FormData();
    //     formdata.append("argument",argument);
    //     formdata.append("clusternames",clusternames);
    //     return fetchUrl(INNER_SERVER_URL + "searchclusters", "post",formdata).then(response => {
    //         if (!!response&&response.statu) {
    //             dispatch(setSingleSearchResult({data:response.data,dataIndex:dataId}));
    //
    //         } else {
    //             dispatch(setSearchResultPageInfos({
    //                 isAccessing: false
    //             }));
    //         }
    //
    //     }).catch(error => {
    //         setError(dispatch,error);
    //
    //     })
    // }

}



const setScatterFilter = (filters) => ({
    type: 'SET_SCATTER_FILTER',
    filters
})






module.exports = {getYearChannelListData,getRankListData,getClusterData,setScatterFilter,getClusterSummaryData}