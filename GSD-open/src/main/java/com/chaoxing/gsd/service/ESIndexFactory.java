package com.chaoxing.gsd.service;

import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.UnknownHostException;

import javax.annotation.PostConstruct;

/**
 * @Author: longrui
 * @text: 2018/4/19 18:09
 */
@Component
public class ESIndexFactory {
	
	// 集群名,默认值elasticsearch
	private static String ES_CLUSTER_NAME;
	
	// ES集群中某个节点
	private static String ES_HOSTNAME;
	
	// 连接端口号
	private static int ES_TCP_PORT;

	// TransportClient对象，用于连接ES集群
	private static volatile TransportClient client;

	// 单例模式，只初始化一次
	@SuppressWarnings("resource")
	public static TransportClient getClientInstance() {
		if (client == null) {
			synchronized (ESIndexFactory.class) {
				if (client == null) {
					try {
						Settings settings = Settings.builder().put("cluster.name", ES_CLUSTER_NAME).build();
						client = new PreBuiltTransportClient(settings).addTransportAddress(
								new InetSocketTransportAddress(InetAddress.getByName(ES_HOSTNAME), ES_TCP_PORT));
					} catch (UnknownHostException e) {
						e.printStackTrace();
					}
				}
			}
		}
		return client;
	}
	
	@PostConstruct
    public void init() {
		
    }

	@Value("${es_cluster_name}")
	public void setES_CLUSTER_NAME(String eS_CLUSTER_NAME) {
		ES_CLUSTER_NAME = eS_CLUSTER_NAME;
	}

	@Value("${es_hostname}")
	public void setES_HOSTNAME(String eS_HOSTNAME) {
		ES_HOSTNAME = eS_HOSTNAME;
	}

	@Value("${es_tcp_port}")
	public void setES_TCP_PORT(int eS_TCP_PORT) {
		ES_TCP_PORT = eS_TCP_PORT;
	}
	
}