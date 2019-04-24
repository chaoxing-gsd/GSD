package com.chaoxing.esimportdata;

import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexResponse;
import org.elasticsearch.action.admin.indices.exists.indices.IndicesExistsResponse;
import org.elasticsearch.action.admin.indices.mapping.put.PutMappingRequest;
import org.elasticsearch.client.ClusterAdminClient;
import org.elasticsearch.client.IndicesAdminClient;
import org.elasticsearch.client.Requests;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.springframework.beans.factory.annotation.Value;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;
import java.util.Map;

/**
 * @Author: longrui
 * @text: 2018/4/19 18:09
 */
public class ESIndexFactory {
	
	// 集群名,默认值elasticsearch
	@Value("${es_cluster_name}")
	private static String ES_CLUSTER_NAME;
	
	// ES集群中某个节点
	@Value("${es_hostname}")
	private static String ES_HOSTNAME;
	
	// 连接端口号
	@Value("${es_tcp_port}")
	private static int ES_TCP_PORT;

	// TransportClient对象，用于连接ES集群
	private static volatile TransportClient client;
	
	/** 统一文档的type值**/
	public final static String INDEX_TYPE = "table";

	// 单例模式，只初始化一次
	@SuppressWarnings("resource")
	public static TransportClient getClientInstance() {
		if (client == null) {
			synchronized (ESIndexFactory.class) {
				if (client == null) {
					try {
						Settings settings = Settings.builder().put("cluster.name", "yyyy").build();  // yyyy elasticsearch集群名称
						client = new PreBuiltTransportClient(settings).addTransportAddress(
								new InetSocketTransportAddress(InetAddress.getByName("xxx.xxx.xxx.xxx"), 9300)); // xxx.xxx.xxx.xxx 是elasticsearch服务器IP
					} catch (UnknownHostException e) {
						e.printStackTrace();
					}
				}
			}
		}
		return client;
	}

	/**
	 * 获取集群管理的ClusterAdminClient对象
	 */
	public static ClusterAdminClient getClusterAdminClient() {
		return getClientInstance().admin().cluster();
	}

	/**
	 * 获取索引管理的IndicesAdminClient
	 */
	public static IndicesAdminClient getAdminClient() {
		return getClientInstance().admin().indices();
	}

	/**
	 * 判定索引是否存在
	 *
	 * @param indexName
	 * @return
	 */
	public static boolean isExists(String indexName) {
		IndicesExistsResponse response = getAdminClient().prepareExists(indexName).get();
		return response.isExists() ? true : false;
	}

	/**
	 * 创建索引
	 *
	 * @param indexName
	 * @return
	 */
	public static boolean createIndex(String indexName) throws Exception {
		CreateIndexResponse createIndexResponse = getAdminClient().prepareCreate(indexName.toLowerCase()).get();
		setMapping(indexName);
		return createIndexResponse.isAcknowledged() ? true : false;
	}

	/**
	 * 创建索引
	 *
	 * @param indexName
	 *            索引名
	 * @param shards
	 *            分片数
	 * @param replicas
	 *            副本数
	 * @return
	 */
	public static boolean createIndex(String indexName, int shards, int replicas) throws Exception {
		Settings settings = Settings.builder().put("DefinedESIndex.number_of_shards", shards)
				.put("DefinedESIndex.number_of_replicas", replicas).build();
		CreateIndexResponse createIndexResponse = getAdminClient().prepareCreate(indexName.toLowerCase())
				.setSettings(settings).execute().actionGet();
		setMapping(indexName);
		return createIndexResponse.isAcknowledged() ? true : false;
	}

	/**
	 * 位索引indexName设置mapping
	 */
	public static void setMapping(String indices) throws Exception {
		XContentBuilder builder = XContentFactory.jsonBuilder().startObject().startObject("properties");
		Map<String, List<TableIndexMappingModel>> listMap = YAMlRead.getTabbleIndexMap();
		List<TableIndexMappingModel> tableIndexMappingList = listMap.get(indices);
		for (TableIndexMappingModel tableIndexMappingModel : tableIndexMappingList) {
			if (!StringUtil.isEmpty(tableIndexMappingModel.getIndex_field_name())) {
				builder.startObject(tableIndexMappingModel.getIndex_field_name());
				if (!StringUtil.isEmpty(tableIndexMappingModel.getIndex_field_type())) {
					builder.field("type", tableIndexMappingModel.getIndex_field_type());
				}
				if (!StringUtil.isEmpty(tableIndexMappingModel.getIndex())) {
					builder.field("index", "false".equals(tableIndexMappingModel.getIndex()) ? false : true);
				}
				if (!StringUtil.isEmpty(tableIndexMappingModel.getIndex_analyzer())) {
					builder.field("analyzer", tableIndexMappingModel.getIndex_analyzer());
				}
				if (!StringUtil.isEmpty(tableIndexMappingModel.getFielddata())) {
					builder.field("fielddata", tableIndexMappingModel.getFielddata());
				}
				builder.endObject();
			}
		}
		builder.endObject().endObject();
		PutMappingRequest mapping = Requests.putMappingRequest(indices).type(INDEX_TYPE).source(builder);
		getAdminClient().putMapping(mapping).actionGet();
	}

	/**
	 * 删除索引
	 *
	 * @param indexName
	 * @return
	 */
	public static boolean deleteIndex(String indexName) {
		DeleteIndexResponse deleteResponse = getAdminClient().prepareDelete(indexName.toLowerCase()).execute()
				.actionGet();
		return deleteResponse.isAcknowledged() ? true : false;
	}
}