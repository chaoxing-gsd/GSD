package com.chaoxing.gsd.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * 配置项
 * @author winsl
 *
 */
@Component
public class PropertiesConf {

	/** ecache配置文件名称**/
	public static String ECACHE_CONF_FILE_NAME;
	
	/** 邮箱配置**/
	public static String STORE_PROTOCOL;
	
	public static String IMAP_HOST;
	
	public static String IMAP_PORT;
	
	public static String SMTP_HOST;
	
	public static String SMTP_PORT;
	
	public static String USER_NAME;
	
	public static String PSSWORD;
	
	public static String INQUIRY_MAILS;
	
	public static String CC_MAILS_TO;
	
	public static Properties properties;
	
	public static List<String> GSD_INQUIRY_MAIL;
	
	public static List<String> CC_MAIL_TO;
	
	public void setProperties() {
		PropertiesConf.properties = new Properties();
		properties.setProperty("mail.store.protocol", PropertiesConf.STORE_PROTOCOL);
		properties.setProperty("mail.imap.host", PropertiesConf.IMAP_HOST);
		properties.setProperty("mail.imap.port", PropertiesConf.IMAP_PORT);
		properties.setProperty("mail.smtp.host", PropertiesConf.SMTP_HOST);
		properties.setProperty("mail.smtp.port", PropertiesConf.SMTP_PORT);
		properties.setProperty("userName", PropertiesConf.USER_NAME);
		properties.setProperty("passWord", PropertiesConf.PSSWORD);
	}
	
	@PostConstruct
    public void init() {
		setCC_MAIL_TO();
		setGSD_INQUIRY_MAIL();
		setProperties();
    }
	
	public void setCC_MAIL_TO() {
		CC_MAIL_TO = new ArrayList<>();
		String[] ccmails = PropertiesConf.CC_MAILS_TO.split(";");
		for(String one : ccmails)
		{
			CC_MAIL_TO.add(one);
		}
	}

	public void setGSD_INQUIRY_MAIL() {
		GSD_INQUIRY_MAIL = new ArrayList<>();
		GSD_INQUIRY_MAIL.add(PropertiesConf.INQUIRY_MAILS);
	}

	@Value("${ecache_conf_file_name}")
	public void setEcache_conf_file_name(String ecache_conf_file_name) {
		PropertiesConf.ECACHE_CONF_FILE_NAME = ecache_conf_file_name;
	}
	
	@Value("${mail.store_protocol}")
	public void setStore_protocol(String store_protocol) {
		PropertiesConf.STORE_PROTOCOL = store_protocol;
	}

	@Value("${mail.imap_host}")
	public void setImap_host(String imap_host) {
		PropertiesConf.IMAP_HOST = imap_host;
	}

	@Value("${mail.imap_port}")
	public void setImap_port(String imap_port) {
		PropertiesConf.IMAP_PORT = imap_port;
	}

	@Value("${mail.smtp_host}")
	public void setSmtp_host(String smtp_host) {
		PropertiesConf.SMTP_HOST = smtp_host;
	}

	@Value("${mail.smtp_port}")
	public void setSmtp_port(String smtp_port) {
		PropertiesConf.SMTP_PORT = smtp_port;
	}

	@Value("${mail.user_name}")
	public void setUser_name(String user_name) {
		PropertiesConf.USER_NAME = user_name;
	}

	@Value("${mail.pssword}")
	public void setPssword(String pssword) {
		PropertiesConf.PSSWORD = pssword;
	}

	@Value("${mail.inquiry_mails}")
	public void setInquiry_mails(String inquiry_mails) {
		PropertiesConf.INQUIRY_MAILS = inquiry_mails;
	}

	@Value("${mail.cc_mails_to}")
	public void setCc_mails_to(String cc_mails_to) {
		PropertiesConf.CC_MAILS_TO = cc_mails_to;
	}
	
	
}
