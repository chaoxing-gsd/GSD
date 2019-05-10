/**
 * Created by Aaron on 2018/7/12.
 */
import {INNER_SERVER_URL} from  "../config/constants";
import {fetchUrl} from './fetchData';

import swal from 'sweetalert2'

const setPageInfos = (pageInfos) => ({//设置登录状态
    type: 'SET_FILTER_PAGEINFOS',
    pageInfos
})


const setFilterClusterResult = (result) => ({//获取所有搜索结果
    type: 'SET_FILTER_CLUSTER_RESULT',
    data:result.data,
    dataIndex:result.dataIndex
})

const setSecondPageFilter = (filterData) => ({//设置登录状态
    type: 'SET_SECONDPAGE_FILTER',
    data:filterData
})




const setError=(dispatch,error="Some Error Happened")=>{
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

const getAllCluster=(argument)=>dispatch=>{

    dispatch(setPageInfos({isAccessing: true}))
    let formdata = new FormData();
    formdata.append("argument",argument);


    return fetchUrl(INNER_SERVER_URL + "searchallcluster", "post",formdata).then(response => {

        if (!!response) {

            dispatch(setFilterClusterResult({data:response}));

        } else {
            dispatch(setPageInfos({
                isAccessing: false
            }));
        }

    }).catch(error => {
        setError(dispatch,error);

    })
}







module.exports = {getAllCluster,setSecondPageFilter}