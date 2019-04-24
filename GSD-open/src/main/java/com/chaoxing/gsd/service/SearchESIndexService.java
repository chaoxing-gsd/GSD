package com.chaoxing.gsd.service;

import com.alibaba.fastjson.JSON;
import com.chaoxing.gsd.core.utils.StringUtil;
import com.chaoxing.gsd.modules.entity.GsdLib;
import com.chaoxing.gsd.modules.service.RsService;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.text.Text;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * @Author: longrui
 * @Date: 2018/4/23 15:52 搜索记录并且获取聚类
 */
@Service
public class SearchESIndexService {

	@Autowired
	private RsService rsService;

	private static Logger logger = LoggerFactory.getLogger(SearchESIndexService.class);

	private static final String gsdindextype = "table";

	public static final String GSD_NOTES_ESINDEX_NAME = "gsd_notes";
	public static final String GSD_NOTES_ESINDEX_TYPE = "table";

	/**
	 * 从es索引中根据id查询唯一数据
	 * 
	 * @param index
	 * @param id
	 * @return
	 */
	public List<Map<String, Object>> searchInfoFromIndexById(String index, String id) {
		QueryBuilder qb = QueryBuilders.idsQuery(gsdindextype).addIds(id);
		SearchRequestBuilder builder = ESIndexFactory.getClientInstance().prepareSearch(index).setTypes(gsdindextype)
				.setQuery(qb).setFrom(0).setSize(12);
		SearchResponse response = builder.get();
		List<Map<String, Object>> result = new ArrayList<>();
		for (SearchHit hit : response.getHits()) {
			Map<String, Object> source = hit.getSource();
			if (!source.isEmpty()) {
				result.add(source);
			}
		}
		return result;
	}

	/**
	 * 从es中获取某人创建的笔记note数目
	 * 
	 * @param userId
	 * @return
	 */
	public long getPersonNoteSizeFromEs(String userId) {
		long out = 0l;
		BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
		boolQuery.must(QueryBuilders.matchQuery("userid", userId));

		// TODO 需要过滤出note字段不为空的
		// boolQuery.must(QueryBuilders.matchQuery("userId", userId));
		SearchRequestBuilder builder = ESIndexFactory.getClientInstance().prepareSearch(GSD_NOTES_ESINDEX_NAME)
				.setTypes(GSD_NOTES_ESINDEX_TYPE).setQuery(boolQuery);
		SearchResponse response = builder.get();
		out = response.getHits().totalHits;
		return out;
	}

	// 检索方法
	public Map<String, Object> search2(String[] indexNames, String content, String field, Integer pageSize,
			Integer pageNum) {
		Map<String, Object> map = new HashMap<>();
		try {
			for (String indexName : indexNames) {
				ESHighlight esHighlight = new ESHighlight();
				List<String> highlightFieldList = null;

				// 高亮显示部分
				highlightFieldList = esHighlight.setHighlightField(Arrays.asList(new String[] { field }));

				List<String> groupList = new ArrayList<String>(Arrays.asList(new String[] {}));
				SearchHits searchHits = getSearchHits(ESIndexFactory.getClientInstance(), esHighlight, groupList,
						indexName, content, field, pageSize, pageNum);
				List<Map<String, Object>> out = getResultList(highlightFieldList, searchHits.getHits(), "documentId");
				Map<String, Object> objectMap = new HashMap<String, Object>();
				objectMap.put("documentnum", searchHits.getTotalHits());
				objectMap.put("documentcontent", out);
				GsdLib gsdLib = rsService.getGsdLibByLibId(indexName);
				objectMap.put("gsdLib", gsdLib);
				map.put(indexName, objectMap);
			}

		} catch (Exception e) {
			logger.error("search2 from es index:{} error：{}.", JSON.toJSONString(indexNames), e);
		}
		return map;
	}

	// 设置检索条件，高亮，排序，分组，分页
	private SearchHits getSearchHits(TransportClient client, ESHighlight esHighlight, List<String> groupList,
			String indexName, String content, String field, Integer pageSize, Integer pageNum) {

		BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
		if (field != null && !field.isEmpty()) {
			boolQuery.must(QueryBuilders.matchQuery(field, content));
		} else {
			if (!StringUtil.isEmpty(content)) {
				boolQuery.must(QueryBuilders.queryStringQuery(content).minimumShouldMatch("30%"));
			} else {
				boolQuery.must(QueryBuilders.matchAllQuery());
			}
		}

		SearchRequestBuilder searchRequestBuilder = client.prepareSearch(indexName).setQuery(boolQuery);
		for (String group : groupList) {
			searchRequestBuilder.addAggregation(AggregationBuilders.terms(group).field(group));
		}

		SearchResponse response = searchRequestBuilder.highlighter(esHighlight.getHiBuilder()).setSize(pageSize)
				.setFrom(pageSize * pageNum).get();
		return response.getHits();
	}

	public static List<Map<String, Object>> getResultList(List<String> highlightFieldList, SearchHit[] hits, String type) {
		List<Map<String, Object>> source = new ArrayList<Map<String, Object>>();
		Map<String, Object> bean = null;
		Map<String, Object> sourceAsMap = null;
		String fieldName = null;
		StringBuilder sb = new StringBuilder("");
		Text[] text = null;

		HighlightField hf = null;

		for (SearchHit hit : hits) {
			sourceAsMap = hit.getSourceAsMap();
			bean = new HashMap<String, Object>();
			for (Map.Entry<String, Object> stringObjectEntry : sourceAsMap.entrySet()) {
				fieldName = stringObjectEntry.getKey();
				if (highlightFieldList.contains(fieldName)) {
					sb.delete(0, sb.length());
					hf = hit.getHighlightFields().get(fieldName);
					if (null != hf) {
						text = hf.getFragments();
						if (null != text) {
							for (Text str : text) {
								sb.append(str.string());
							}
							bean.put(fieldName, sb.toString());
						}
					}
					else
					{
						bean.put(fieldName, stringObjectEntry.getValue());
					}
				} else {
					bean.put(fieldName, stringObjectEntry.getValue());
				}
				bean.put(type, hit.getId());
			}
			source.add(bean);
		}
		return source;
	}

	public void delDocumentById(String indexName, String documentId) {
		ESIndexFactory.getClientInstance().prepareDelete(indexName, gsdindextype, documentId).get();
	}

	public List<Map<String, Object>> searchDocumentById(String indexName, String documentId) {
		QueryBuilder qb = QueryBuilders.idsQuery(gsdindextype).addIds(documentId);
		SearchResponse response = ESIndexFactory.getClientInstance().prepareSearch(indexName).setQuery(qb).get();
		List<Map<String, Object>> result = new ArrayList<>();
		for (SearchHit hit : response.getHits()) {
			Map<String, Object> source = hit.getSource();
			source.put("indexId", hit.getId());
			result.add(source);
		}
		return result;
	}

}
