package com.chaoxing.gsd.core.utils;
/**
 * 通用工具类
 * @author winsl
 *
 */
public class CommonUtil {
	
	public static final String PERCENTAGE_FLAG = "%";

	/**
	 * 给字符串添加百分号，有.则取其后两位
	 * @param str
	 * @return
	 */
	public static final String appendPercentage(String str)
	{
		String out = "";
		if(null != str)
		{
			int index = str.indexOf(".");
			if(index != -1)
			{
				if(index >= 4)
				{
					if('-' == str.charAt(0))
					{
						return "-100.00%";
					}
					return "100.00%";
				}
				// .是在最后
				if(index == str.length()-1)
				{
					return str.substring(0, str.length()-1).concat(PERCENTAGE_FLAG);
				}
				
				int len = index+3 <= str.length() ? index+3 : str.length();
				return str.substring(0, len).concat(PERCENTAGE_FLAG);
			}
			out = str.concat(PERCENTAGE_FLAG);
		}
		return out;
	}
	
	/*public static void main(String[] args) {
		System.out.println(appendPercentage("7.1"));
		System.out.println(appendPercentage("7.12"));
		System.out.println(appendPercentage("7.135"));
		System.out.println(appendPercentage("7000"));
		System.out.println(appendPercentage(null));
		System.out.println(appendPercentage("7."));
		System.out.println(CommonUtil.appendPercentage(String.valueOf(3 / (10*1d)*100)));
	}*/
}
