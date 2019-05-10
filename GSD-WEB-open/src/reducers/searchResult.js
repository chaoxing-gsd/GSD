/**
 * Created by Aaron on 2018/7/6.
 */
const initialState = {
    allSearchResult:{},
    allSearchResultAccessing:{},
    personalResult:{},
    personalResultAccessing:{},
    secondPageResult:{num:0,list:[]},
    jnPageResult:{num:0,list:[]},
    bkPageResult:{num:0,list:[]},
    searchTitle:"",
    pageInfos:{
        isAccessing:false,        //是否在从服务器获取数据
        allPageMode:"list",
        allPageFilterMode:"0",//0默认,1数据量降序,2数据量升序,
        editMyIndex:true,
        selectedMyIndex:[],
        selectAllMyIndex:false
    }
}

const searchResult = (state = initialState, action) => {
    switch (action.type) {
       case 'SET_SEARCH_RESULT':

            var searchResult=state.allSearchResult;
            searchResult[action.dataIndex]=action.data;
            var accessing={};
            accessing[action.dataIndex]="stop";
            return {...state,allSearchResult:searchResult,allSearchResultAccessing:{...state.allSearchResultAccessing,...accessing}};
        case 'SET_SINGLE_SEARCH_RESULT':
            if(action.dataIndex==2){//二级搜索页面
                // var list= action.data.content||action.data.documentcontent||action.data.list;
                // var num=action.data.contentnum||action.data.documentnum||action.data.num;
                // var dataList=state.secondPageResult.list.concat(list);
                return {...state,secondPageResult:action.data,pageInfos:{...state.pageInfos,isAccessing:false}};
            }
            if(action.dataIndex==3){//我的
                // var list= action.data.content||action.data.documentcontent||action.data.list;
                // var num=action.data.contentnum||action.data.documentnum||action.data.num;
                // var dataList=state.jnPageResult.list.concat(list);
                return {...state,jnPageResult:action.data,pageInfos:{...state.pageInfos,isAccessing:false}};
            }
            if(action.dataIndex==4){//图书
                // var list= action.data.content||action.data.documentcontent||action.data.list;
                // var num=action.data.contentnum||action.data.documentnum||action.data.num;
                // var dataList=state.bkPageResult.list.concat(list);
                return {...state,bkPageResult:action.data,pageInfos:{...state.pageInfos,isAccessing:false}};
            }
            // var list= action.data.content||action.data.documentcontent||action.data.list;
            // var num=action.data.contentnum||action.data.documentnum||action.data.num;
            // var dataList=state.secondPageResult.list.concat(list);
            return {...state,secondPageResult:action.data,pageInfos:{...state.pageInfos,isAccessing:false}};

        case 'SET_SEARCH_TITLE':
            return {...state,searchTitle:action.searchTitle};
        case 'DELETE_MY_INDEXS_DATA_IN_RESULT':
            var list= state.jnPageResult.content||state.jnPageResult.documentcontent||state.jnPageResult.list;
            var num=state.jnPageResult.contentnum||state.jnPageResult.documentnum||state.jnPageResult.num;
            var data = list.filter(item=> {
                var findIndex= action.dataIds.findIndex((value, index, arr)=> {
                    return value === item.webpageId;
                })
                console.log(findIndex);
                return findIndex<0;
            });
            return {...state,jnPageResult:{list:data,num:num-1||0},pageInfos:{...state.pageInfos,selectedMyIndex:[], isDeleting: false,deleteFlag:true}};
        case 'SEARCH_RESULT_ACCESSING':
            var accessing={};
            accessing[action.dataId]="accessing";
            return {...state,allSearchResultAccessing:{...state.allSearchResultAccessing,...accessing}};
        case 'SET_RESULT_PAGEINFOS':
            return {...state,pageInfos:{...state.pageInfos,...action.pageInfos}};
        case 'RECEIVE_ERROR':
            return  {...state,
                pageInfos:{
                    isAccessing:false,        //是否在从服务器获取数据
                }}

        default:
            return state
    }
}


module.exports = {searchResult}