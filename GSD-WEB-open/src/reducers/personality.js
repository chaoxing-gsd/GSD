/**
 * Created by Aaron on 2018/7/6.
 */
const initialState = {
    allLibs:{},
    myGroupTags:[
        {
            "categoryname" : "默认分组",
            "categoryid" : "默认分组"
        }
    ],
    currentSelTags:[],
    pageInfos:{
        isAccessing:false,        //是否在从服务器获取数据
        tabIndex:"0",
        editMode:false   //是否打开自定义设置页面
    }
}

const personality = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_GET_ALL_LIBS':
            return {...state,allLibs:{...action.data},pageInfos:{...state.pageInfos,isAccessing:false}};
        case 'SET_MY_GROUP_TAGS':
            return {...state,myGroupTags:action.data.data,pageInfos:{...state.pageInfos,isAccessing:false}};
        case 'SET_PAGEINFOS':
            return {...state,pageInfos:{...state.pageInfos,...action.pageInfos}};
        case 'REMOVE_GROUP_TAG':
            try{
                var localTagName=state.pageInfos.localTagName;
                if(action.index>=0&&!!state.pageInfos.localTagName&&state.pageInfos.localTagName==state.myGroupTags[action.index].categoryname){
                    localTagName="";
                }

                state.myGroupTags.splice(action.index,1);
                if(state.myGroupTags.length==0){
                    localTagName="";
                }
                return {...state,currentSelTags:[],myGroupTags:state.myGroupTags,pageInfos:{...state.pageInfos,isAccessing:false,tabIndex:"0",localTagName:localTagName}};
            }catch(e){
                console.log(e);
            }

        case 'ADD_NEW_TAB':
            return {...state,myGroupTags:state.myGroupTags.concat({type:"newTab"}),pageInfos:{...state.pageInfos,isAccessing:false}};
        case 'ADD_NEW_TAB_LOCAL':
            return {...state,myGroupTags:state.myGroupTags.concat(action.value),pageInfos:{...state.pageInfos}};
        case 'MODIFY_NEW_TAB_LOCAL':
            state.myGroupTags.splice(action.value.index,1,{...action.value});
            console.log(state.myGroupTags);
            return {...state,myGroupTags:state.myGroupTags,pageInfos:{...state.pageInfos}};
        case 'SET_CURRENT_SELECTED_TAGS':
            return {...state,currentSelTags:action.data.data,pageInfos:{...state.pageInfos,isAccessing:false}};
        case 'ADD_SELECTED_TAGS':
            return {...state,currentSelTags:state.currentSelTags.concat(action.libId),pageInfos:{...state.pageInfos,isAccessing:false}};
        case 'REMOVE_SELECTED_TAGS':

            return {...state,currentSelTags:state.currentSelTags.filter((item)=>item!=action.libId),pageInfos:{...state.pageInfos,isAccessing:false}};
        case 'RECEIVE_ERROR':
            return  {...state,
                pageInfos:{
                    ...state.pageInfos,
                    isAccessing:false,        //是否在从服务器获取数据
                }}
        default:
            return state
    }
}


module.exports = {personality}