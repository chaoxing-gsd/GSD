package com.chaoxing.gsd.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * 根据文件名获取文件小类型名称
 * @author winsl
 *
 */
public class FileTypeUtil {
	
	/** 所有的资源小类类型**/
	public static final Map<String, String> ALL_SMALL_CLASS = new HashMap<String, String>();
	
	static
	{
		/**
		 101 pdf 102 txt 103 doc 104 docx 105 ppt 106 xls 107 xlsx
		 201 jpg 202 png 203 bmp 204 gif
		 301 mp4 302 avi 303 mov 304 rmvb
		 401 mp3 402 wav 403 m4a 404 amr 
		 405 3gp 406 ape 407 flac
		 */
		ALL_SMALL_CLASS.put("pdf", "101");ALL_SMALL_CLASS.put("txt", "102");ALL_SMALL_CLASS.put("doc", "103");
		ALL_SMALL_CLASS.put("docx", "104");ALL_SMALL_CLASS.put("ppt", "105");ALL_SMALL_CLASS.put("xls", "106");
		ALL_SMALL_CLASS.put("xlsx", "107");ALL_SMALL_CLASS.put("jpg", "201");ALL_SMALL_CLASS.put("png", "202");
		ALL_SMALL_CLASS.put("bmp", "203");ALL_SMALL_CLASS.put("gif", "204");ALL_SMALL_CLASS.put("mp4", "301");
		ALL_SMALL_CLASS.put("avi", "302");ALL_SMALL_CLASS.put("mov", "303");ALL_SMALL_CLASS.put("rmvb", "304");
		ALL_SMALL_CLASS.put("mp3", "401");ALL_SMALL_CLASS.put("wav", "402");ALL_SMALL_CLASS.put("m4a", "403");
		ALL_SMALL_CLASS.put("amr", "404");ALL_SMALL_CLASS.put("3gp", "405");ALL_SMALL_CLASS.put("ape", "406");
		ALL_SMALL_CLASS.put("flac", "407");
	}

	public static final String getSamllClass(String fileName)
	{
		if(null != fileName && fileName.contains("."))
		{
			return ALL_SMALL_CLASS.get(fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase());
		}
		return null;
	}
}
