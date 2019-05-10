import fetch from 'isomorphic-fetch'
import fetchJsonp from 'fetch-jsonp'
import en from '../../public/languages/en.json'
import zh from '../../public/languages/zh.json'
import {getCurrentLanguage,removeUserInfo} from "../utils/utils"
import swal from 'sweetalert2'
const languages={
  en:en,
  zh:zh
};




const fetchUrl = (api, method = 'get', params = null,headers={}): Promise<Action>  => {
    console.log(headers);

  return fetch(api, { method: method, body: params,credentials: 'include',"headers":headers})
      .then(response =>{

        if (!response.ok) {
            response.json().then(data=>{
                if(data.code==='4444'||data.code==='9999'||data.code==='5555'){
                    var errorMsg=languages[getCurrentLanguage()]["Tip"];
                    var errorTip=data.msg||languages[getCurrentLanguage()]["Login Invalidate"];
                    var ok=languages[getCurrentLanguage()]["Login Invalidate"];
                    swal({
                        title: errorMsg,
                        text: errorTip,
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: ok
                    }).then((result) => {
                        removeUserInfo();
                        var b = new Buffer(window.location.href);
                        var s = b.toString('base64');
                       window.location.href='/login?originalUrl='+encodeURIComponent(s);
                    })

                }else{
                    return Promise.reject(response.statu);
                }

            })
          //return Promise.reject(response.json());
        }
        return Promise.resolve(response.json());
      }).catch(error => {


        var errorMsg=languages[getCurrentLanguage()]["Error Tip"];
        //return Promise.reject(errorMsg);
      })
}

const fetchUrlText = (api, method = 'get', params = null,headers={}): Promise<Action>  => {
    console.log(headers);

    return fetch(api, { method: method, body: params,credentials: 'include',"headers":headers})
        .then(response =>{

            if (!response.ok) {
                response.json().then(data=>{
                    if(data.code==='4444'||data.code==='9999'||data.code==='5555'){
                        var errorMsg=languages[getCurrentLanguage()]["Tip"];
                        var errorTip=data.msg||languages[getCurrentLanguage()]["Login Invalidate"];
                        var ok=languages[getCurrentLanguage()]["Login Invalidate"];
                        swal({
                            title: errorMsg,
                            text: errorTip,
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: ok
                        }).then((result) => {
                            removeUserInfo();
                            var b = new Buffer(window.location.href);
                            var s = b.toString('base64');
                            window.location.href='/login?originalUrl='+encodeURIComponent(s);
                        })

                    }else{
                        return Promise.reject(response.statu);
                    }

                })
                //return Promise.reject(response.json());
            }
            return Promise.resolve(response.text());
        }).catch(error => {


            var errorMsg=languages[getCurrentLanguage()]["Error Tip"];
            //return Promise.reject(errorMsg);
        })
}


const fetchText = (api, method = 'get', params = null,headers={"Content-type":"text/plain;charset=utf-8"}): Promise<Action>  => {

  return fetch(api, { method: method, body: params,credentials: 'include',"headers":headers})
      .then(response =>{

        if (!response.ok) {
          return Promise.reject(response.status);
        }
        return Promise.resolve(response.text());
      }).catch(error => {
        console.log(error);
        var errorMsg=languages[getCurrentLanguage()]["Error Tip"];
        return Promise.reject(errorMsg);
      })
}

const fetchBlobText = (api, method = 'get', params = null,headers={"Content-type":"text/plain;charset=utf-8"}): Promise<Action>  => {

    return fetch(api, { method: method, body: params,credentials: 'include',"headers":headers})
        .then(response =>{

            if (!response.ok) {
                return Promise.reject(response.status);
            }
            return Promise.resolve(response.blob());
        }).catch(error => {
            console.log(error);
            var errorMsg=languages[getCurrentLanguage()]["Error Tip"];
            return Promise.reject(errorMsg);
        })
}


const fetchFile = (api, method = 'get', params = null): Promise<Action>  => {

  return fetch(api, { method: method, body: params,credentials: 'include'})
      .then(response =>{

        if (!response.ok) {
          return Promise.reject(response,response.status);
        }
        return Promise.resolve(response,response.blob());
      }).catch(error => {
        console.log(error);
        var errorMsg=languages[getCurrentLanguage()]["Error Tip"];
        return Promise.reject(errorMsg);
      })
}

const fetchJSONData=(url,callBackName="_jsonpSuggest")=>{
  console.log(url);
  return fetchJsonp(url, {
    jsonpCallbackFunction: callBackName
  }).then(function(response) {
    console.log(response);
    if (!response.ok) {
      return Promise.reject(response.status);
    }
    return Promise.resolve(response.json());
  }).catch(function(ex) {
    var errorMsg=languages[getCurrentLanguage()]["Error Tip"];
    return Promise.reject(errorMsg);
    console.log('parsing failed', ex)
  })
}

module.exports = {
  fetchUrl,
  fetchJSONData,
  fetchText,
  fetchFile,
    fetchBlobText,
    fetchUrlText
};
