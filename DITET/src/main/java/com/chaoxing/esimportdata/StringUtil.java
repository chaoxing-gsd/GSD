package com.chaoxing.esimportdata;

/**
 * @Author: longrui
 * @Date: 2018/3/14 10:33
 */
public class StringUtil {

	/**
	 * 判断字符串是否为空
	 *
	 * @param str
	 * @return
	 */
	public static Boolean isEmpty(String str) {
		return str == null || str.trim().equals("");
	}

}
