/**
 * Created by Aaron on 2018/7/6.
 */
const initialState = {
    myIndexsData: {"literature":[],"webpage":[]},
    currentIndexData:{},
    pageInfos: {
        "literature": {
            totalPage: 0,
            currentPage: 1,
            isAccessing: false,        //是否在从服务器获取数据
            isLoading: false,
            isDeleting: false,  //正在删除
            deleteFlag: false,   //删除成功标识
            isChanging: false,
            changeFlag: -1
        },
        "webpage":{
            totalPage: 0,
            currentPage: 1,
            isAccessing: false,        //是否在从服务器获取数据
            isLoading: false,
            isDeleting: false,  //正在删除
            deleteFlag: false,   //删除成功标识
            isChanging: false,
            changeFlag: -1
        },
    }
}

const myIndexs = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MY_INDEXS_DATA':
            var type=action.data.type;
            var myIndexsData=state.myIndexsData;
            myIndexsData[type]=action.data.data;

            var pageInfos=state.pageInfos;
            var pageTypeInfos= pageInfos[type];
            pageInfos[type]=Object.assign({},pageTypeInfos,{isLoading: false,totalPage:action.data.num});
            return {...state, myIndexsData:myIndexsData,pageInfos: pageInfos};
        case 'DELETE_MY_INDEXS_DATA':
            var type = state.pageInfos.type;
            var data = state.myIndexsData[type].filter(item=> {
                var findIndex= action.dataIds.findIndex((value, index, arr)=> {
                    return value === item.webpageId;
                })
                return findIndex<0;
            });
            state.pageInfos[type].isLoading = false;
            state.pageInfos[type].isDeleting = false;
            return {...state, myIndexsData: { webpage : data}, pageInfos: {...state.pageInfos, isDeleting: false,deleteFlag:true }};
        case 'SET_CURRENT_INDEXS_DATA':
            return {...state, currentIndexData: action.data.data,pageInfos: {...state.pageInfos, isLoading: false,totalPage:action.data.num}};
        case 'SET_MY_INDEXS_PAGEINFOS':
            var type=action.pageInfos.type;
            var pageInfos=action.pageInfos;
            var pageTypeInfos= pageInfos[type];
            pageInfos[type]=Object.assign({},pageTypeInfos,action.pageInfos);
            console.log(pageInfos);
            return {...state, pageInfos: pageInfos};
        case 'MY_INDEXS_RECEIVE_ERROR':
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


module.exports = {myIndexs}