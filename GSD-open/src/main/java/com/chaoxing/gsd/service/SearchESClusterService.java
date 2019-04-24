package com.chaoxing.gsd.service;

import com.alibaba.fastjson.JSON;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * @author heyang
 * @date 2018/08/27
 * describe:哈佛库获取聚类的类。
 */
@Service
public class SearchESClusterService {
    private static Logger logger = LoggerFactory.getLogger(SearchESClusterService.class);

    //检索方法
    public  Map<String ,Object>  search2(String[] indexNames ,String content,String field) {
        Map<String ,Object> map=new HashMap<>();
        try {
            for (String indexName:indexNames){
                map.put(indexName,searchES(indexName,content,field));
            }
        } catch (Exception e) {
        	logger.error("search2 from es index:{} error.", JSON.toJSONString(indexNames));
        }
        return map;
    }

    /**
     * ES搜索
     */
    public  Map<String, Map<Object, Long>> searchES(String indexName ,String content,String field)   {
        long begin = System.currentTimeMillis();

        ESHighlight esHighlight = new ESHighlight();
        List<String> groupList = new ArrayList<String>(Arrays.asList(new String[]{
                "gender","born_year","died_year","dynasty","jiguan","author","edition","collection","notes"}));
        logger.info("搜索耗时：" + (System.currentTimeMillis() - begin) + "毫秒");
        return getSearchHits(ESIndexFactory.getClientInstance(), esHighlight, groupList, indexName,content,field);
    }



    //设置高亮，排序，分组，分页
    private  Map<String, Map<Object, Long>> getSearchHits(TransportClient client, ESHighlight esHighlight, List<String> groupList,
                                      String indexName,String content,String field) {
        //配置搜索条件
        QueryBuilder qb = getQueryBuilder(content,field,indexName);
        SearchRequestBuilder searchRequestBuilder = client.prepareSearch(indexName).setQuery(qb);
        //分组
        for (String group : groupList) {
            searchRequestBuilder.addAggregation(AggregationBuilders.terms(group).field(group));
        }
        SearchResponse response = searchRequestBuilder.setSize(2).setFrom(0).execute().actionGet();
        Map<String, Map<Object, Long>> map=new HashMap<String, Map<Object, Long>>();
        for (String group : groupList) {
            map.put(group,TermsCollect(response, group));
        }
        return map;
    }


    private static Map<Object, Long> TermsCollect(SearchResponse response, String keywordTerm) {
        Map<Object, Long> map=new HashMap<Object, Long>();
        Terms terms = response.getAggregations().get(keywordTerm);
        List<? extends Terms.Bucket> buckets = terms.getBuckets();
        logger.info("【" + keywordTerm + "分组情况】");
        for (Terms.Bucket bucket : buckets) {
//            logger.info(bucket.getKey() + " " + bucket.getDocCount());
            map.put(bucket.getKey(),bucket.getDocCount());
        }
//        logger.info("");
        return map;
    }


    //boolQuery 组合查询，可以与(must)或(should)非(mustnot)
    private  QueryBuilder getQueryBuilder(String content,String field, String indexName) {
        QueryBuilder queryBuilder;
        if(field==null||field=="" || field.isEmpty()){
            queryBuilder = QueryBuilders.queryStringQuery(content);//在所有字段查询
        }else {
            queryBuilder = QueryBuilders.matchQuery(field,content);//模糊查询

        }
        return queryBuilder;
    }


}
