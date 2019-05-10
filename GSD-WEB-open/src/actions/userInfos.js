import {LOGIN_SERVER_URL,INNER_SERVER_URL} from  "../config/constants";
import {setLocalUserInfo,removeUserInfo} from "../utils/utils";
import {fetchUrl,fetchText} from './fetchData';
import swal from 'sweetalert2'
import {isMobile,isEmail} from "../utils/utils";

import { browserHistory } from 'react-router'

const isLogined = () => ({
    type: 'IS_LOGINED',
})


const setUserInfos = (infos) => ({
    type: 'SET_USERINFOS',
    infos
})

const setToolMode = (statu) => ({
    type: 'SET_TOOL_MODE',
    mode:statu
})



const setLoginInfos = (loginInfos) => ({//设置登录状态
    type: 'SET_LOGININFOS',
    loginInfos
})


const setRegisterInfos = (registerInfos) => ({//设置登录状态
    type: 'SET_REGISTERINFOS',
    registerInfos
})

const setSysPageInfos = (pageInfos) => ({//设置登录状态
    type: 'SET_SYS_PAGEINFOS',
    pageInfos
})

const setCurrentResultIndex = (currentResultIndex) => ({//设置登录状态
    type: 'SET_CURRENT_RESULT_INDEX',
    currentResultIndex
})

const setBindedEmails = (data) => ({//设置登录状态
    type: 'SET_BINDED_EMAILS',
    data
})
const addLocalEmails = (data) => ({//设置登录状态
    type: 'ADD_LOCAL_EMAILS',
    data
})
const removeLocalEmails = (data) => ({//设置登录状态
    type: 'REMOVE_LOCAL_EMAILS',
    data
})
const setSeverResponseUserInfos = (responseUserInfo) => ({//设置服务器返回用户信息
    type: 'SET_SERVER_USERINFOS',
    responseUserInfo
})


const refreshRandomImage = ()=>dispatch=> {
    dispatch(setLoginInfos({safetyCodeImg: LOGIN_SERVER_URL + "num/code?" + new Date().getTime()}))
}


const isExistPhoe = (phone,randomCode="",getCodeFlag = false)=>  dispatch=> {//获取随机验证码
    console.log(typeof getCodeFlag);
    console.log(getCodeFlag);
    console.log(getCodeFlag);
    dispatch(setRegisterInfos({ isAccessing: true, accessCodeStatu: false,
        safetyCodeStatu: false,
        safetyCodeImg: null}))
    if(isMobile(phone)){
        return fetchUrl(LOGIN_SERVER_URL + "api/isExistPhoe?phone=" + phone, "get").then(response => {
            console.log(response);
            if (false === response.status) {//不存在手机号,发送验证码
                if(getCodeFlag)dispatch(getPhoneCode4Reg(phone,randomCode))//验证成功,发送验证
                else dispatch(setRegisterInfos({
                    isExistPhoe:false,
                    isAccessing: false,
                    accessCodeStatu: false,
                    safetyCodeStatu: false,
                    safetyCodeImg: null
                }));


            } else {
                dispatch(setRegisterInfos({
                    isExistPhoe:true,
                    isAccessing: false,
                    accessCodeStatu: false,
                    safetyCodeStatu: false,
                    safetyCodeImg: null
                }));
            }

        }).catch(error => {
            setError(dispatch,error);

        })
    } else if(isEmail(phone)){
        return fetchUrl(LOGIN_SERVER_URL + "isEmailExist?email=" + phone, "post").then(response => {
            console.log(response);
            if (true!= response&&"true"!=response) {//不存邮箱,发送验证码
                if(getCodeFlag)dispatch(getPhoneCode4Reg(phone,randomCode))//验证成功,发送验证
                else dispatch(setRegisterInfos({
                    isExistPhoe:false,
                    isAccessing: false,
                    accessCodeStatu: false,
                    safetyCodeStatu: false,
                    safetyCodeImg: null
                }));


            } else {
                dispatch(setRegisterInfos({
                    isExistPhoe:true,
                    isAccessing: false,
                    accessCodeStatu: false,
                    safetyCodeStatu: false,
                    safetyCodeImg: null
                }));
            }

        }).catch(error => {
            setError(dispatch,error);

        })
    }

}

const toShowCode = (value)=> dispatch=> {//验证手机是否存在
    dispatch(setLoginInfos({accessCodeStatu: true, isAccessing: true}))
    if(isMobile(value)){
        var url=LOGIN_SERVER_URL + "num/booleanCode?key=" + value;
        return fetchUrl(url, "post").then(response => {
            if (true === response) {//需要显示图片
                dispatch(setLoginInfos({
                    isAccessing: false,
                    accessCodeStatu: false,
                    safetyCodeStatu: true,
                    safetyCodeImg: LOGIN_SERVER_URL + "num/code?" + new Date().getTime()
                }));

            } else {
                dispatch(setLoginInfos({
                    isAccessing: false,
                    accessCodeStatu: false,
                    safetyCodeStatu: false,
                    safetyCodeImg: null
                }));
            }

        }).catch(error => {
            setError(dispatch,error);

        })
    }else{
        var url=LOGIN_SERVER_URL + "num/emailcode?email=" + value;
        return fetchText(url, "get").then(response => {
            console.log(response);
            if (true === response||"success"===response) {//需要显示图片
                dispatch(setLoginInfos({
                    isAccessing: false,
                    accessCodeStatu: true,
                    safetyCodeStatu: false,
                    safetyCodeImg:null,
                    watingForCode:true,
                }));

            } else {
                dispatch(setLoginInfos({
                    isAccessing: false,
                    accessCodeStatu: false,
                    safetyCodeStatu: false,
                    safetyCodeImg: null,
                    watingForCode:false
                }));
            }

        }).catch(error => {
            setError(dispatch,error);

        })
    }

}


const toShowCode4Register = (value)=> dispatch=> {//验证手机是否存在
    dispatch(setRegisterInfos({accessCodeStatu: true, isAccessing: true}))
    if(isMobile(value)){
        return fetchUrl(LOGIN_SERVER_URL + "num/booleanCode?key=" + value, "post").then(response => {
            if (true === response) {//需要显示图片
                dispatch(setRegisterInfos({
                    isAccessing: false,
                    accessCodeStatu: false,
                    safetyCodeStatu: true,
                    watingForCode:false,
                    safetyCodeImg: LOGIN_SERVER_URL + "num/code?" + new Date().getTime()
                }));

            } else {
                dispatch(setRegisterInfos({
                    isAccessing: false,
                    accessCodeStatu: false,
                    watingForCode:false,
                    safetyCodeStatu: false,
                    safetyCodeImg: null
                }));
            }

        }).catch(error => {
            setError(dispatch,error);

        })
    }

}

const getPhoneCode4Reg=(phone,randomCode="")=> async dispatch=>{
    dispatch(setRegisterInfos({
        isExistPhoe:false,
        isAccessing: false,
        accessCodeStatu: true,
        safetyCodeStatu: false,
        safetyCodeImg: null
    }));

    if(isMobile(phone)) {
        var codeResponse = await fetchUrl(LOGIN_SERVER_URL + "num/phonecode?phone=" + phone + "&code=" + randomCode + "&type=1", "get");
        if (!!codeResponse && codeResponse.result) {
            dispatch(setRegisterInfos({
                accessCodeStatu: true,
                isAccessing: false,
                safetyCodeStatu: false,
                safetyCodeImg: null,
                watingForCode: true
            }));
        } else {
            setError(dispatch, codeResponse.msg);
        }
    }else{

        var url=LOGIN_SERVER_URL + "num/emailcode?email=" + phone;
        return fetchText(url, "get").then(response => {
            console.log(response);
            if (true === response||"success"===response) {
                dispatch(setRegisterInfos({
                    isAccessing: false,
                    accessCodeStatu: true,
                    safetyCodeStatu: false,
                    safetyCodeImg:null,
                    watingForCode:true,
                }));

            } else {
                dispatch(setRegisterInfos({
                    isAccessing: false,
                    accessCodeStatu: false,
                    safetyCodeStatu: false,
                    safetyCodeImg: null,
                    watingForCode:false
                }));
            }

        }).catch(error => {
            setError(dispatch,error);

        })
    }
}

const setError=(dispatch,error="Some errors happend")=>{
    console.error(error);
    swal(
         error,
         '',
        'error'
    )
    dispatch({
        type: 'RECEIVE_ERROR',
        error: error,
    })
}

const checkPhoneNum = (phone, randomCode)=>async dispatch=> {//检测手机号,并获取验证码
    dispatch(setLoginInfos({accessCodeStatu: true, isAccessing: true, safetyCodeStatu: false}));
    try {
        var response = await fetchUrl(LOGIN_SERVER_URL + "isPhoneExist?phone=" + phone, "post");
        if (true === response) {//存在手机号,发送验证码
            var codeResponse = await fetchUrl(LOGIN_SERVER_URL + "num/phonecode?phone=" + phone + "&code=" + randomCode + "&type=1", "get");
            if(!!codeResponse&&codeResponse.result){
                dispatch(setLoginInfos({accessCodeStatu: true, isAccessing: false, safetyCodeStatu: false,safetyCodeImg:null,watingForCode:true}));
            }else{
                setError(dispatch,codeResponse.msg);
            }

        } else {
            setError(dispatch,'手机号不存在');
        }


    } catch (error) {
        console.error(error);
        setError(dispatch,error);
    }

}





// const getUserInfos= (uId) => async dispatch =>{
//     try{
//         var response = await fetchUrl("https://sso.chaoxing.com/apis/login/userLogin4Uname.do", "get");
//         if(!!response){
//
//         }
//     }catch (error) {
//         console.error(error);
//         setError(dispatch,error);
//     }
//
//
// }


const userLogin=(username,password,vcode,mode,isAuthLogin=false,originalUrl)=>async dispatch=>{
    dispatch(setLoginInfos({accessCodeStatu: true, isAccessing: true}));
    try{
        // var
        var response =null;

        let formdata = new FormData();
        formdata.append("username",username);
        formdata.append("password",password);
        if(!mode) {//使用验证码登录
            formdata.append("vercode", vcode);
        }

        response= await fetchUrl(INNER_SERVER_URL + `login`, "post",formdata);
        if(!!response){

            if(response.statu){
                console.log(response);
                dispatch(setSeverResponseUserInfos({responseUserInfo:{...response.data}}));
                setLocalUserInfo(response.data);
                if(!isAuthLogin){
                    if(!!originalUrl){
                        var b = new Buffer(decodeURIComponent(originalUrl), 'base64')
                        var s = b.toString('utf8');
                        window.location.href=s;
                    }else{
                        browserHistory.push("/");
                    }
                   }
                else{
                    window.location.href="/authLoginSuccess"
                }

            }else{
                setError(dispatch,response.errorMsg||response.msg);
            }

        }else{
            setError(dispatch,"服务器访问错误");
        }

        console.log(response);


    }catch(err){
        setError(dispatch,err);
    }

}



// const userLogin=(username,password,vcode,mode,isAuthLogin=false)=>async dispatch=>{
//     dispatch(setLoginInfos({accessCodeStatu: true, isAccessing: true}));
//     try{
//         // var
//         var response =null;
//         if(!mode){//使用验证码登录
//             response = await fetchUrl(LOGIN_SERVER_URL + "mylogin?msg="+username+"&vercode="+vcode, "post");
//             if(true===response.status||"true"===response.status){
//                 console.log(response);
//                 password=response.pwd;
//                 username=response.name;
//             }else{
//                 setError(dispatch,"服务器访问错误");
//             }
//
//         }
//
//         response= await fetchUrl(LOGIN_SERVER_URL + `api/login?name=${username}&pwd=${password}`, "post");
//         if(!!response){
//
//             if(response.result||"true"===response.status){
//                 dispatch(setSeverResponseUserInfos({responseUserInfo:{...response}}));
//                 setLocalUserInfo(response);
//                 if(!isAuthLogin)browserHistory.push("/");else{
//                     window.location.href="/authLoginSuccess"
//                 }
//             }else{
//                 setError(dispatch,response.errorMsg||response.msg);
//             }
//
//         }else{
//             setError(dispatch,"服务器访问错误");
//         }
//
//         console.log(response);
//
//
//     }catch(err){
//         setError(dispatch,err);
//     }
//
// }


const userRegister=(username,password,realName,vcode)=>async dispatch=>{
    dispatch(setRegisterInfos({accessCodeStatu: true, isAccessing: true}));
    try{
        // var

        let formdata = new FormData();
        formdata.append("uname",username);
        formdata.append("verCode",vcode);
        formdata.append("realname",realName);
        formdata.append("password",password);
        formdata.append("password2",password);
        formdata.append("fid","0");
        formdata.append("valEamil","1");
        formdata.append("fy","false");
        formdata.append("numcode","");


        //var response = await fetchUrl(LOGIN_SERVER_URL + `register3`, "post",formdata);

        var enc=""
        var response = await fetchText(LOGIN_SERVER_URL + `register3?refer=http://i.mooc.chaoxing.com`, "post",formdata,{});
        if(!!response){

            console.log(response);
            if(!!response&&response.indexOf("恭喜注册成功")>=0){
                swal({
                    title: "注册成功",
                    text: "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: "前往登录"
                }).then((result) => {
                    if (result.value) {
                        browserHistory.push("/login");
                    }
                })

            }else{
                setError(dispatch,"注册失败,信息填写错误!");
            }

        }else{
            setError(dispatch,"服务器访问错误");
        }

    }catch(err){
        setError(dispatch,err);
    }

}


const userLogout=()=>dispatch => {
    dispatch({
        type: 'USER_LOG_OUT'
    });
    removeUserInfo();
    window.location.reload();
}

const getBindedEmails = (userId,header)=>async dispatch=> {//检测手机号,并获取验证码
    dispatch(setSysPageInfos({isAccessing: true}));
    try {
        var response = await fetchUrl(INNER_SERVER_URL + "getBindMail?userid=" + userId, "get",null,header);
        if (!!response&&response.statu) {
            dispatch(setBindedEmails(response.data));

        } else {
            dispatch(setSysPageInfos({
                isAccessing: false
            }));
        }


    } catch (error) {
        console.error(error);
        setError(dispatch,error);
    }

}

const BindedEmail = (userId,email,header)=>async dispatch=> {//检测手机号,并获取验证码
    dispatch(setSysPageInfos({isAccessing: true}));
    try {
        let formdata = new FormData();
        formdata.append("userid",userId);
        formdata.append("mail",email);
        var response = await fetchUrl(INNER_SERVER_URL + "userBindMail", "post",formdata,header);
        if (!!response&&response.statu) {
            dispatch(setSysPageInfos({
                isAccessing: false
            }));
            dispatch(addLocalEmails({
                userid: userId,
                mail:email
            }));
            dispatch(removeLocalEmails({
                "mail":"emails",userid:-1
            }));

        } else {
            dispatch(setSysPageInfos({
                isAccessing: false
            }));
            setError(dispatch,response.msg);
        }


    } catch (error) {
        console.error(error);
        setError(dispatch,error);
    }

}


const DeleteEmail = (userId,email,header)=>async dispatch=> {//检测手机号,并获取验证码

    try {
        let formdata = new FormData();
        formdata.append("userid",userId);
        formdata.append("mail",email);
        var response = await fetchUrl(INNER_SERVER_URL + "deleteBindMail?userid="+userId+"&mail="+email, "post",null,header);
        if (!!response&&response.statu) {

            dispatch(removeLocalEmails({
                userid: userId,
                mail:email
            }));

        } else {
            dispatch(setSysPageInfos({
                isAccessing: false
            }));
        }


    } catch (error) {
        console.error(error);
        setError(dispatch,error);
    }

}




module.exports = {
    isLogined,
    setUserInfos,
    toShowCode,
    setLoginInfos,
    refreshRandomImage,
    checkPhoneNum,
    userLogin,
    userLogout,
    setSeverResponseUserInfos,
    isExistPhoe,
    setRegisterInfos,
    toShowCode4Register,
    userRegister,
    setCurrentResultIndex,
    setToolMode,
    getBindedEmails,
    addLocalEmails,
    BindedEmail,
    DeleteEmail,
    removeLocalEmails
}