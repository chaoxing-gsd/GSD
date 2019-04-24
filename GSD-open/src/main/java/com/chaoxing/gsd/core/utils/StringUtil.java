package com.chaoxing.gsd.core.utils;

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

    public static int strToInt(String str) {
        int num = 0;
        if (str == null) {
            str = "";
        }
        try {
            num = Integer.parseInt(str);
        } catch (Exception e) {
            num = 0;
        }
        return num;
    }
    
    /**
     * 当字符串为空或者null返回null
     * @param str
     * @return
     */
    public static String correct(String str)
    {
    	if(null == str || "".equals(str.trim()))
    	{
    		return null;
    	}
    	return str.trim();
    }
  
}
