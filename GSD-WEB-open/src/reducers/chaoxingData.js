/**
 * Created by Aaron on 2018/7/6.
 */
const initialState = {
    chaoxingToolData:{},
    textToolInfos:{},
    pageInfos:{
        isAccessing:false,        //是否在从服务器获取数据
    }
}

const chaoxingData = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CHAOXING_TOOL_DATA':
            return {...state,chaoxingToolData:action.data,pageInfos:{...state.pageInfos,isAccessing:false}};
        case 'SET_CHAOXING_PAGEINFOS':
            return {...state,pageInfos:{...state.pageInfos,...action.pageInfos}};
        case 'SET_TEXT_TOOL_INFO':
            return {...state,textToolInfos:{...state.textToolInfos,...action.data}};
        case 'CHAOXING_RECEIVE_ERROR':
            return  {...state,
                pageInfos:{
                    isAccessing:false,        //是否在从服务器获取数据
                }}

        default:
            return state
    }
}


module.exports = {chaoxingData}