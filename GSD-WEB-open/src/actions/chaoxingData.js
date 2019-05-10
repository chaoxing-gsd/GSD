/**
 * Created by Aaron on 2018/7/20.
 */
import {SSCHAOXING_SERVER_URL} from  "../config/constants";
import {fetchUrl,fetchJSONData} from './fetchData';




const setError=(dispatch,error="Some Error Happened")=>{
    console.error(error);

    dispatch({
        type: 'CHAOXING_RECEIVE_ERROR',
        error: error,
    })
}


const setPageInfos = (pageInfos) => ({
    type: 'SET_CHAOXING_PAGEINFOS',
    pageInfos
})


const setYearChannelData = (data) => ({
    type: 'SET_CHAOXING_TOOL_DATA',
    data
})



const getBaiKeData=(searchValue)=>dispatch=>{

    dispatch(setPageInfos({isAccessing: true}))
    return fetchUrl(SSCHAOXING_SERVER_URL()+"toolDatas?searchValue="+searchValue , "get").then(response => {
        console.log(response);
    
        if (!!response&&response.statu) {
            dispatch(setYearChannelData({data:response.data}));
    
        } else {
            dispatch(setPageInfos({
                isAccessing: false
            }));
        }
    
    }).catch(error => {
        setError(dispatch,error);
    
    })
}



const setTextToolInfo = (data) => ({
    type: 'SET_TEXT_TOOL_INFO',
    data
})





module.exports = {getBaiKeData,setTextToolInfo}