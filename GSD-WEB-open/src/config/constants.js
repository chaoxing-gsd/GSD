/**
 * Created by Aaron on 2018/6/29.
 */

// const LOGIN_SERVER_URL="https://passport2-api.chaoxing.com/";

const LOGIN_SERVER_URL=process.env.NODE_ENV === 'production'?"/apis/":"/apis/";
const INNER_SERVER_URL=process.env.NODE_ENV === 'production'?"/gsd-apis/":"/gsd-apis/";


const TXT_SERVER_URL=process.env.NODE_ENV === 'production'?"/txt-apis/":"/txt-apis/";

const UPLOAD_SERVER_URL=process.env.NODE_ENV === 'production'?"/chaoxing-file-apis/":"/chaoxing-file-apis/";


const CHAOXING_PAN=process.env.NODE_ENV === 'production'?"/chaoxing-pan/":"/chaoxing-pan/";


// const LOGIN_SERVER_URL=process.env.NODE_ENV === 'production'?"/apis/":"http://192.168.100.130:8080/gsd/";
// const INNER_SERVER_URL=process.env.NODE_ENV === 'production'?"/gsd-apis/":"http://192.168.100.130:8080/gsd/";

const SSCHAOXING_SERVER_URL=()=>{
    if (process.env.NODE_ENV === 'production') {
       return "/sschaoxing/";
    } else {
       return "http://localhost:7000/"
    }
}



const FILTER_RULES={
    "classfyList":"C",
    "authorList":"A",
};

export {LOGIN_SERVER_URL,INNER_SERVER_URL,FILTER_RULES,SSCHAOXING_SERVER_URL,UPLOAD_SERVER_URL,TXT_SERVER_URL,CHAOXING_PAN};


