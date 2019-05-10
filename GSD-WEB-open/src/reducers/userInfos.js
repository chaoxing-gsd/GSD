import {getUserLanguage} from '../utils/utils';
const initialState = {
  isLogined: false,
  language:getUserLanguage()||'auto',
  isPersonality:false,
  currentResultIndex:0,
  showToolsMode:false,
  registerInfos:{
    isExistPhoe:false,
    accessCodeStatu:false,     //时候在获取验证码
    isAccessing:false,        //是否在从服务器获取数据
    safetyCodeStatu:false,   //是否开启随机码dialog
    safetyCodeImg:null,    //随机码图片地址
    watingForCode:false  //开始等待手机验证码
  },
  loginInfos:{
    accessCodeStatu:false,     //时候在获取验证码
    isAccessing:false,        //是否在从服务器获取数据
    safetyCodeStatu:false,   //是否开启随机码dialog
    safetyCodeImg:null,    //随机码图片地址
    watingForCode:false  //开始等待手机验证码
  },
  responseUserInfo:{//服务器返回的用户信息
    "result": true,
    "userid": '',
    "uname": "",
    "dxfid": '',
    "phone": "",
    "roleid": "",
    "schoolid": '',
    "email": "",
    "realname": "",
    "status": ""
  },
  bindedEmalis:[],
  pageInfos:{
    isAccessing:false
  }

}

const userInfos = (state = initialState, action) => {
  switch (action.type) {
    case 'IS_LOGINED':
      return {
        ...state,
        isLogined: false
      }
    case 'SET_TOOL_MODE':
      return {
        ...state,
        showToolsMode: action.mode
      }
    case 'SET_USERINFOS':
      return Object.assign({},state,action.infos);
    case 'SET_CURRENT_RESULT_INDEX':
      return {...state,currentResultIndex:action.currentResultIndex};
    case 'SET_BINDED_EMAILS':
        return {...state,bindedEmalis:action.data,type:action.type};
          break;
    case 'SET_SERVER_USERINFOS':
      return {...state,isLogined:true,loginInfos:{isAccessing:false},...action.responseUserInfo};
    case 'SET_LOGININFOS':
      return {...state,loginInfos:{...state.loginInfos,...action.loginInfos}};
    case 'SET_REGISTERINFOS':
      return {...state,registerInfos:{...state.registerInfos,...action.registerInfos}};
    case 'SET_SYS_PAGEINFOS':
      return {...state,pageInfos:{...state.pageInfos,...action.pageInfos}};
      break;
    case 'ADD_LOCAL_EMAILS':
      return {...state,bindedEmalis:state.bindedEmalis.concat(action.data)};
          break;
    case 'REMOVE_LOCAL_EMAILS':
        var emailList=state.bindedEmalis.filter((item)=>{return !(item.mail==action.data.mail&&item.userid==action.data.userid)});
      return {...state,bindedEmalis:emailList};
          break;
    case 'RECEIVE_ERROR':
          return  {...state,
            loginInfos:{
              accessCodeStatu:false,
              isAccessing:false,
              safetyCodeStatu:false,
              safetyCodeImg:null},
            registerInfos:{
              isExistPhoe:false,
              accessCodeStatu:false,    
              isAccessing:false,     
              safetyCodeStatu:false,  
              safetyCodeImg:null,   
              watingForCode:false 
            },}
    case 'USER_LOG_OUT':
      return  initialState;
          
    default:
      return state
  }
}


module.exports = {userInfos}
