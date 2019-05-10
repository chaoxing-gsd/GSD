/**
 * Created by Aaron on 2018/7/6.
 */
const initialState = {
    myNotesData: [],
    currentNoteData:{},
    pageInfos: {
        totalPage:0,
        currentPage:1,
        isAccessing: false,        //是否在从服务器获取数据
        isLoading: false,
        isDeleting: false,  //正在删除
        deleteFlag: false,   //删除成功标识
        isChanging:false,
        changeFlag:-1
    }
}

const myNotes = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MY_NOTES_DATA':
            return {...state, myNotesData: action.data.data,pageInfos: {...state.pageInfos, isLoading: false,totalPage:action.data.num}};
        case 'DELETE_MY_NOTES_DATA':
            var data = state.myNotesData.filter(item=> {
                var findIndex= action.dataIds.findIndex((value, index, arr)=> {
                    return value === item.id;
                })
                return findIndex<0;
            });
            return {...state, myNotesData: data, pageInfos: {...state.pageInfos, isDeleting: false,deleteFlag:true}};
        case 'SET_CURRENT_NOTES_DATA':
            return {...state, currentNoteData: action.data.data,pageInfos: {...state.pageInfos, isLoading: false,totalPage:action.data.num}};
        case 'SET_MY_NOTES_PAGEINFOS':
            return {...state, pageInfos: {...state.pageInfos, ...action.pageInfos}};
        case 'MY_NOTES_RECEIVE_ERROR':
            return {
                ...state,
                pageInfos: {
                    isAccessing: false,        //是否在从服务器获取数据
                }
            }

        default:
            return state
    }
}


module.exports = {myNotes}