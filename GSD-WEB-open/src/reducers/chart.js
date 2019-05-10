/**
 * Created by Aaron on 2018/7/6.
 */
const initialState = {
    yearChannelData:{},
    rankData:{},
    scatterFilter:{},
    clustersData:{},
    pageInfos:{
        isAccessing:false,        //是否在从服务器获取数据
    }
}

const chart = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_YEAR_CHANNEL_DATA':
            return {...state,yearChannelData:action.data.data,pageInfos:{...state.pageInfos,isYearChartAccessing:false}};
        case 'SET_RANK_DATA':
            return {...state,rankData:action.data.data,pageInfos:{...state.pageInfos,isRankChartAccessing:false}};
        case 'SET_SCATTER_FILTER':
            return {...state,scatterFilter:action.filters};
        case 'SET_CLUSTER_CHART_DATA':
            var accessName=action.data.clusterName+"ChartAccessing"
            var accessInfo={};
            accessInfo[accessName]=false;
            var clustersData={};
            clustersData[action.data.clusterName]=action.data.data[action.data.clusterName];
            return {...state,clustersData:{...state.clustersData,...clustersData},pageInfos:{...state.pageInfos,...accessInfo}};
        case 'SET_CHART_PAGEINFOS':
            return {...state,pageInfos:{...state.pageInfos,...action.pageInfos}};
        case 'CHART_RECEIVE_ERROR':
            return  {...state,
                pageInfos:{
                    isAccessing:false,        //是否在从服务器获取数据
                }}

        default:
            return state
    }
}


module.exports = {chart}