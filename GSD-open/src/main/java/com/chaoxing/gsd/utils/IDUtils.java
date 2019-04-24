package com.chaoxing.gsd.utils;

import java.util.Random;

/**
 * @author heyang
 * @date 2018/08/27
 * describe:各种id生成策略
 */
public class IDUtils {

	//生成token
	public static  String maketoken(){
		long millis = System.currentTimeMillis();
		Random random = new Random();
		int end3 = random.nextInt(999);
		//如果不足三位前面补0
		String str = millis + String.format("%03d", end3);
		System.out.println(str);
		return str;
	}


}
