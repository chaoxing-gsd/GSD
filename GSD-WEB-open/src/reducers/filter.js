/**
 * Created by Aaron on 2018/7/6.
 */
const initialState = {
    clusters:[],
    secondPageFilter:{},
    pageInfos:{
        isAccessing:false,        //是否在从服务器获取数据
    }
}

const filter = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_FILTER_CLUSTER_RESULT':
            return {...state,clusters:action.data,pageInfos:{...state.pageInfos,isAccessing:false}};
        case 'SET_FILTER_PAGEINFOS':
            return {...state,pageInfos:{...state.pageInfos,...action.pageInfos}};
        case 'SET_SECONDPAGE_FILTER':
            return {...state,secondPageFilter:action.data};
        case 'RECEIVE_ERROR':
            return  {...state,
                pageInfos:{
                    isAccessing:false,        //是否在从服务器获取数据
                }}

        default:
            return state
    }
}


module.exports = {filter}