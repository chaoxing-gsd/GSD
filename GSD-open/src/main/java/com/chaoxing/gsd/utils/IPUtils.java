package com.chaoxing.gsd.utils;

import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

/**
 * @author heyang
 * @date 2018/08/29
 * describe:调用百度api根据IP获取地理信息
 */
public class IPUtils {
    private static Logger logger = LoggerFactory.getLogger(IPUtils.class);

    public static Map<String,String>  getPointAndAddress(String ip) throws IOException {
        Map<String,String> map=new HashMap<String, String>();
        String url = "http://api.map.baidu.com/location/ip?ak=F454f8a5efe5e577997931cc01de3974&ip=" + ip;
        JSONObject json = readJsonFromUrl(url);
        JSONObject content = json.getJSONObject("content");
        if(null != content)
        {
        	JSONObject address_detail = content.getJSONObject("address_detail");
        	if(null != address_detail)
        	{
        		//获取城市
        		map.put("address", address_detail.getString("city"));
        	}
        	else
        	{
        		logger.warn("get address by ip: {} from baidu is error, address is empty.", ip);
        	}
        	
        	//获取经纬度
        	map.put("point", content.getJSONObject("point").toString());
        }
        else
        {
        	logger.error("get address by ip: {} from baidu is error, content is empty!!!", ip);
        }
        
        return map;
    }

    public static JSONObject readJsonFromUrl(String url) throws IOException, JSONException {
        InputStream is = new URL(url).openStream();
        try {
            BufferedReader rd = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
            StringBuilder sb = new StringBuilder();
            int cp;
            while ((cp = rd.read()) != -1) {
                sb.append((char) cp);
            }
            String jsonText= sb.toString();
            JSONObject json = JSONObject.parseObject(jsonText);
            return json;
        } finally {
            is.close();
        }
    }


}
