/**
 * Created by Aaron on 2018/7/6.
 */
const initialState = {
    historyList:[],
    historyRecord:[],
    pageInfos:{
        isAccessing:false,        //是否在从服务器获取数据
        isSearched:false
    }
}

const historyData = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_HISTORY_DATA':
            return {...state,historyList:action.data.data,pageInfos:{...state.pageInfos,isAccessing:false}};
        case 'SET_HISTORY_PAGEINFOS':
            return {...state,pageInfos:{...state.pageInfos,...action.pageInfos}};
        case 'SET_HISTORY_RECORD':
            return {...state,historyRecord:action.data.data,pageInfos:{...state.pageInfos,isAccessing:false}};
        case 'REMOVE_HISTORY_RECORD':
                var datetimetype='';
            var dataList=state.historyList;
            if(action.data.data.datetimetype===0){
                datetimetype='过去24h';
            }
            if(action.data.data.datetimetype===1){
                datetimetype='过去一周';
            }
            if(action.data.data.datetimetype===2){
                datetimetype='过去一个月';
            }
            if(action.data.data.datetimetype===3){
                datetimetype='更多';
            }
            var list=state.historyList[datetimetype];
            if(!!list&&Object.keys(list).length>0){
                list[action.data.data.searchId]=null;
                delete list[action.data.data.searchId];
                dataList[datetimetype]=list;
            }
            console.log(dataList);
            
            return {...state,historyList:dataList,pageInfos:{...state.pageInfos,isAccessing:false}};
        case 'HISTORY_RECEIVE_ERROR':
            return  {...state,
                pageInfos:{
                    isAccessing:false,        //是否在从服务器获取数据
                }}

        default:
            return state
    }
}


module.exports = {historyData}