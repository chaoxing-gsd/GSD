/**
 * Created by Aaron on 2018/6/21.
 */


const languageKey="chaoxing_user_language"
const userInfoKey="chaoxing_user_infos"
const userInfoTimeKey="chaoxing_user_login_time"
const USER_LIBS_KEY="chaoxing_user_libs_key"
const USER_RESULT_TAB_INDEX="chaoxing_result_tab_index"


const BASE_LINK = {
    "BK": "http://ss.chaoxing.com/",
    "JN": "http://qikan.chaoxing.com/",
    "DT": "http://ss.chaoxing.com/",
    "PT": "http://ss.chaoxing.com/",
    "ST": "http://ss.chaoxing.com/",
    "VI": "http://ss.chaoxing.com/",
    "NP": "http://ss.chaoxing.com/",
    "CP": "http://ss.chaoxing.com/",
    "TR": "http://ss.chaoxing.com/",
    "28": "http://ss.chaoxing.com/",
    "46": "http://ss.chaoxing.com/",
    "47": "http://ss.chaoxing.com/",
    "9,24": "http://ss.chaoxing.com/",
    "48": "http://ss.chaoxing.com/",
    "textref_ctext":"http://api.ctext.org/getlink?if=en&urn={primary_id}&redirect=1",
    "textref_kanripo":"http://kanripo.org/ed/{primary_id}/",
    "textref_zhonghuajingdian":"http://www.gujilianhe.com/pages/productmetadata/form/list?id={primary_id}",
    "textref_cbta":"http://cbetaonline.dila.edu.tw/{primary_id}",
    "biogref_dnb":"http://archive.ihp.sinica.edu.tw/ttscgi/ttsquerynew?0:0:mctauac:%28{person_id}%29@NO",
    "biogref_ddbc":"http://authority.dila.edu.tw/person/?fromInner={person_id}",
    "biogref_cbdb":"http://cbdb.fas.harvard.edu/cbdbapi/person.php?id={person_id}&o=html"

};

const LINK_REC = {
    "BK": (url, id)=> {
        return url + "detail_" + id
    },
    "JN": (url, id)=> {
        return url + "detail_" + id
    },
    "DT": (url, id)=> {
        return url + "detail_" + id
    },
    "PT": (url, id)=> {
        return url + "detail_" + id
    },
    "ST": (url, id)=> {
        return url + "detail_" + id
    },
    "VI": (url, id)=> {
        return url + "detail_" + id
    },
    "NP": (url, id)=> {
        return url + "detail_" + id
    },
    "TR": (url, id)=> {
        return url + "detail_" + id
    },
    "CP": (url, id)=> {
        return url + "detail_" + id
    },
    "28": (url, id)=> {
        return url + "detail_" + id
    },
    "46": (url, id)=> {
        return url + "detail_" + id
    },
    "47": (url, id)=> {
        return url + "detail_" + id
    },
    "9,24": (url, id)=> {
        return url + "detail_" + id
    },
    "48": (url, id)=> {
        return url + "detail_" + id
    },
    "textref_ctext":(url,id)=>{
        return url.replace("{primary_id}",id)
    },
    "textref_kanripo":(url,id)=>{
        return url.replace("{primary_id}",id)
    },
    "textref_zhonghuajingdian":(url,id)=>{
        return url.replace("{primary_id}",id)
    },
    "textref_cbta":(url,id)=>{
        return url.replace("{primary_id}",id)
    },
    "biogref_dnb":(url,id)=>{
        return url.replace("{person_id}",id)
    },
    "biogref_ddbc":(url,id)=>{
        return url.replace("{person_id}",id)
    },
    "biogref_cbdb":(url,id)=>{
        return url.replace("{person_id}",id)
    },

};

var SOURCE_TYPE = {
    "BK":"图书",
    "JN":"期刊",
    "DT":"学位论文",
    "NP":"报纸",
    "CP":"会议论文",
    "PT":"专利",
    "ST":"标准",
    "TR":"科技成果" ,
    "YB":"年鉴",
    "LAR":"法律法规" ,
    "INF":"信息资讯" ,
    "CAS":"案例"
}

const CHINESENAME_TO_ID = {//库中文名转换为ID
    "图书":"BK",
    "期刊":"JN",
    "学位":"DT",
    "学位论文":"DT",
    "专利":"PT",
    "标准":"ST",
    "音视频":"VI",
    "报纸":"NP",
    "科技成果":"TR",
    "会议":"CP",
    "会议论文":"CP",
    "年鉴":"28",
    "法律法规":"46",
    "案例":"47",
    "信息资讯":"9,24",
    "特色库":"48"
};


const FILTER_LABELS={
    //"areaList":"A",
    "yearList":"Y",
    "authorList":"A",
    "keywordList":"K",
    "authorcompyList":"O"

};


const getUserResultTabIndex=()=>{
    var index;
    index = localStorage.getItem(USER_RESULT_TAB_INDEX);
    return !!index?parseInt(index):0;
}


const setUserResultTabIndex=(index)=>{
    localStorage.setItem(USER_RESULT_TAB_INDEX,index);

}




const getUserLanguage=()=>{
    var lang;
    lang = localStorage.getItem(languageKey);
    return lang||'auto';
}




const setUserLanguage=(lang)=>{
    localStorage.setItem(languageKey,lang);

}


const getUserLanguageTag=()=>{
    var locale;
    locale = localStorage.getItem(languageKey)||'auto';
    if(locale=='auto') {
        var lang = navigator.language;
        var locale = "en";
        if (lang === "zh" || lang === "zh-CN" || lang === "zh-TW") {
            locale = "zh";
        }
    }
    return locale;
}


const setLocalUserInfo=(userInfo)=>{
    if(!!userInfo){
        localStorage.setItem(userInfoKey,JSON.stringify(userInfo));
        localStorage.setItem(userInfoTimeKey,(new Date()).getTime());
    }

}

const removeUserInfo=()=>{
    localStorage.removeItem(userInfoKey);
    localStorage.removeItem(USER_LIBS_KEY);
    localStorage.removeItem(userInfoTimeKey);

}

const getLocalUserInfo=()=>{
    var userInfo;
    userInfo = localStorage.getItem(userInfoKey)||"{}";
    if(!!userInfo){
        var json=JSON.parse(userInfo);
        var timeouthours=json["timeouthours"]||24;
        var startTime=localStorage.getItem(userInfoTimeKey);
        if(!!startTime){
            var nowTime=(new Date()).getTime();
            var isExpire=(nowTime-startTime)/1000>=24*60*60;
            if(isExpire){//超时了
                removeUserInfo();
                return {};
            }

        }else{
            return {};
        }

    }

    return JSON.parse(userInfo);
}


const getUserLibs=()=>{//用户保存的专业库
    var libs;
    libs = localStorage.getItem(USER_LIBS_KEY);
    return libs||"";
}


const setUserLibs=(libInfos)=>{
    localStorage.setItem(USER_LIBS_KEY,libInfos);

}


const getCurrentLanguage=()=>{
    var locale=getUserLanguage();
    if(locale=='auto'){
        var lang=navigator.language;
        var locale = "en";
        if (lang === "zh" ||lang === "zh-CN"||lang==="zh-TW") {
            locale = "zh";
        }
    }
    return locale;
}

const isMobile=(phoneNum)=>{
    var phoneReg=/^1\d{10}$/;
    if (!phoneReg.test(phoneNum)) {
        return false;
    } else {
        return true;
    }

}


const isEmail=(email)=>{
    var emailReg=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!emailReg.test(email)) {
        return false;
    } else {
        return true;
    }
}


const checkPassComplex=(pass)=>{
    if(pass.length < 6){
        return 0;
    }
    var ls = 0;
    if(pass.match(/([a-z])+/)){
        ls++;
    }

    if(pass.match(/([0-9])+/)){
        ls++;
    }

    if(pass.match(/([A-Z])+/)){
        ls++;
    }
    if(pass.match(/[^a-zA-Z0-9]+/)){
        ls++;
    }
    return ls
}



const checkIsMobile =()=> {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|MicroMessenger/i.test(navigator.userAgent);
};


const getResourceLink=(libId, link,type=0,url="")=>{

    var baseLink = BASE_LINK[libId];
    if(type==0||type==1){
        if (!!baseLink && !!link) {
            var detailId = link.indexOf("/")>=0?link.substring(link.lastIndexOf("/") + 1):link;
            return !!LINK_REC[libId]?LINK_REC[libId](baseLink, detailId):"javascript:void(0);";

        }
    }else if(type==2){
        if (!!baseLink && !!link) {
            return !!LINK_REC[libId]?LINK_REC[libId](baseLink, link):"javascript:void(0);";

        }else{
            return link;
        }
    }else if(type==3){
        return url;
    }


    return "javascript:void(0);";

}


const buildBaseArgument=(searchValue,libId,type)=> {

    if (type == 0) {//超星数据源查询方法
        if(!!searchValue){
            var wordArray=searchValue.split(/\s+/);
            if(wordArray.length>1){
                searchValue=wordArray.reduce((arr,item,index)=>{
                    if(!!item.trim())arr.push("Z="+item);
                    return arr;
                },[]).join(" AND ");
                return `${libId}(${searchValue})`;
            }
            return `${libId}(Z=${searchValue})`;
        }
        return "";


    } else if (type == 1) {//channel查询方法
        if(!!searchValue){
            return `Z=${searchValue}`
        }else return "";

    } else if(type==2||type==3){ //自定义查询方法,个人索引库
        return searchValue;
    }

}

const buildClusters=(type) =>{
    if (type == 1) {
        return "channelList";
    }
    return "";
}


const buildChannels=(libId,type) =>{
    if (type == 1) {
        return libId;

    }
    return "";
}



const buildFilterArgument=(filterData,type) =>{
    var filterArgument="";
    if (type ==0) {//超星的过滤条件拼接
        if(!!filterData){
            var filterKeys=Object.keys(filterData);
            if(!!filterKeys){
                filterArgument=filterKeys.reduce((arr,key,index)=>{
                    var filterLabel=FILTER_LABELS[key];
                    if(!!filterLabel){
                        if(filterData[key].length>0){
                            var dataList = filterData[key].reduce((sarr,sitem,sindex)=>{
                                sarr.push(`${filterLabel}=${sitem}`)
                                return sarr;
                            },[]).join(" OR ");
                            arr.push(dataList);
                        }

                        return arr;
                    }
                    return arr;

                },[]).join(" AND ");
            }
        }

        return filterArgument.trim();

    }

    return filterArgument.trim();
}



const checkFilterData=(filterData)=>{

}


export {CHINESENAME_TO_ID,getUserLanguageTag,getUserResultTabIndex,setUserResultTabIndex,getUserLibs,setUserLibs,getCurrentLanguage,getUserLanguage, setUserLanguage,isMobile,setLocalUserInfo,getLocalUserInfo,removeUserInfo,checkIsMobile,isEmail,checkPassComplex,getResourceLink,buildBaseArgument,buildClusters,buildChannels,buildFilterArgument,FILTER_LABELS}