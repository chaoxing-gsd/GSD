package com.chaoxing.gsd.service;

import com.chaoxing.gsd.core.utils.StringUtil;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * @author heyang
 * @date 2018/09/28
 * describe:
 */
@Service
public class EsService {

    public Map<Object, Object> searchClusters(String indexName,String field, String content, String firstGroup , String secondGroup,String thirdGroup)  {
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        if(null!=field && !StringUtil.isEmpty(field)){
            boolQuery.must(QueryBuilders.matchQuery(field,content));
        }else{
            boolQuery.must(QueryBuilders.queryStringQuery(content));
        }


        TermsAggregationBuilder teamAgg = AggregationBuilders.terms(firstGroup).field(firstGroup);
        if(null!=secondGroup&&!StringUtil.isEmpty(secondGroup)){
            TermsAggregationBuilder teamAgg2 = AggregationBuilders.terms(secondGroup).field(secondGroup);
            if(null!=thirdGroup&&!StringUtil.isEmpty(thirdGroup)){
                TermsAggregationBuilder teamAgg3 = AggregationBuilders.terms(thirdGroup).field(thirdGroup);
                teamAgg2.subAggregation(teamAgg3);
            }
            teamAgg.subAggregation(teamAgg2);
        }
        SearchResponse response = ESIndexFactory.getClientInstance().prepareSearch(indexName).setQuery(boolQuery).addAggregation(teamAgg).setSize(0).get();

        Map<Object, Object> map=new HashMap<Object, Object>();
        Terms terms = response.getAggregations().get(firstGroup);
        List<? extends Terms.Bucket> buckets = terms.getBuckets();
        for (Terms.Bucket bucket : buckets) {
            Map<Object, Object> map2=new HashMap<>();
            if(null!=secondGroup&&!StringUtil.isEmpty(secondGroup)){
                Map<Object, Object> map3=new HashMap<>();
                Terms terms2= bucket.getAggregations().get(secondGroup);
                List<? extends Terms.Bucket> buckets2 = terms2.getBuckets();
                for (Terms.Bucket bucket2 : buckets2) {
                    Map<Object, Object> map4=new HashMap<>();

                    if(null!=thirdGroup&&!StringUtil.isEmpty(thirdGroup)){
                        Map<Object, Object> map5=new HashMap<>();
                        Terms terms3= bucket2.getAggregations().get(thirdGroup);
                        List<? extends Terms.Bucket> buckets3 = terms3.getBuckets();
                        for (Terms.Bucket bucket3 : buckets3) {
                            map5.put(bucket3.getKeyAsString(),bucket3.getDocCount());
                        }
                        map4.put(thirdGroup,map5);
                    }
                    map4.put("count",bucket2.getDocCount());
                    map3.put(bucket2.getKeyAsString(),map4);
                }
                map2.put(secondGroup,map3);
            }
            map2.put("count",bucket.getDocCount());
            map.put(bucket.getKey(),map2);
        }
        return map;
    }


    public List<Map<String, Object>> searchClusters2(String indexName, String content, String firstGroup, String secondGroup, String thirdGroup) {
        List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        boolQuery.must(QueryBuilders.queryStringQuery(content));

        TermsAggregationBuilder teamAgg = AggregationBuilders.terms(firstGroup).field(firstGroup);
        TermsAggregationBuilder teamAgg2 = AggregationBuilders.terms(secondGroup).field(secondGroup);
        TermsAggregationBuilder teamAgg3 = AggregationBuilders.terms(thirdGroup).field(thirdGroup);
        teamAgg2.subAggregation(teamAgg3);
        teamAgg.subAggregation(teamAgg2);
        SearchResponse response = ESIndexFactory.getClientInstance().prepareSearch(indexName).setQuery(boolQuery).addAggregation(teamAgg).setSize(0).get();

        Terms terms = response.getAggregations().get(firstGroup);
        List<? extends Terms.Bucket> buckets = terms.getBuckets();
        for (Terms.Bucket bucket : buckets) {
            Terms terms2 = bucket.getAggregations().get(secondGroup);
            List<? extends Terms.Bucket> buckets2 = terms2.getBuckets();
            for (Terms.Bucket bucket2 : buckets2) {
                Terms terms3 = bucket2.getAggregations().get(thirdGroup);
                List<? extends Terms.Bucket> buckets3 = terms3.getBuckets();
                for (Terms.Bucket bucket3 : buckets3) {
                    Map<String, Object> temmap = new HashMap<String, Object>();
                    temmap.put(firstGroup, bucket.getKeyAsString());
                    temmap.put(secondGroup, bucket2.getKeyAsString());
                    temmap.put(thirdGroup, bucket3.getKeyAsString());
                    temmap.put("num", bucket3.getDocCount());
                    result.add(temmap);
                }
            }
        }
        return result;
    }





}
