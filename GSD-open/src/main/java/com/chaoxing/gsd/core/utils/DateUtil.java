package com.chaoxing.gsd.core.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 时间工具
 * 
 * @author winsl
 *
 */
public class DateUtil {

	private static final Logger logger = LoggerFactory.getLogger(DateUtil.class);
	
	/** 
	 * 获取过去第几天的日期 
	 * 
	 * @param past 
	 * @return 
	 */  
	public static final Date getPastDate(int past) {  
		Calendar calendar = Calendar.getInstance();  
		calendar.set(Calendar.DAY_OF_YEAR, calendar.get(Calendar.DAY_OF_YEAR) - past);  
		return calendar.getTime();  
	}  

	/**
	 * 获取今天时间段
	 * 
	 * @return
	 */
	public static final Date[] getTodayTime() {
		Date[] out = new Date[2];
		LocalDate date = LocalDate.now();

		String temp = date.getYear() + "-" + appendZero(String.valueOf(date.getMonthValue())) + "-"
				+ appendZero(String.valueOf(date.getDayOfMonth()));

		String date0 = temp + " 00:00:01";

		String date1 = temp + " 23:59:59";

		SimpleDateFormat sDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		try {
			out[0] = sDateFormat.parse(date0);
			out[1] = sDateFormat.parse(date1);
		} catch (ParseException px) {
			px.printStackTrace();
		}

		return out;
	}

	/**
	 * 一位时前补0
	 * 
	 * @param str
	 * @return
	 */
	private static final String appendZero(String str) {
		if (null != str && str.length() < 2) {
			return "0".concat(str);
		}
		return str;
	}

	/**
	 * 获取这周时间段
	 * 
	 * @return
	 */
	public static final Date[] getThisWeekTime() {
		Date[] out = new Date[2];
		Calendar calendar = Calendar.getInstance();
		calendar.setFirstDayOfWeek(Calendar.MONDAY);// 设置星期一为一周开始的第一天
		calendar.setMinimalDaysInFirstWeek(4);// 可以不用设置
		calendar.setTimeInMillis(System.currentTimeMillis());// 获得当前的时间戳
		int weekYear = calendar.get(Calendar.YEAR);// 获得当前的年
		int weekOfYear = calendar.get(Calendar.WEEK_OF_YEAR);// 获得当前日期属于今年的第几周

		calendar.setWeekDate(weekYear, weekOfYear, 2);// 获得指定年的第几周的开始日期
		long starttime = calendar.getTime().getTime();// 创建日期的时间该周的第一天，
		calendar.setWeekDate(weekYear, weekOfYear, 1);// 获得指定年的第几周的结束日期
		long endtime = calendar.getTime().getTime();
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		String dateStart = simpleDateFormat.format(starttime);// 将时间戳格式化为指定格式
		String dateEnd = simpleDateFormat.format(endtime);
		SimpleDateFormat sDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		try {
			out[0] = sDateFormat.parse(dateStart + " 00:00:01");
			out[1] = sDateFormat.parse(dateEnd + " 23:59:59");
		} catch (ParseException px) {
			px.printStackTrace();
		}
		return out;
	}

	/**
	 * 获取这个月时间段
	 * 
	 * @return
	 */
	public static final Date[] getThisMonthTime() {
		Date[] out = new Date[2];
		LocalDate date = LocalDate.now();

		String date0 = date.getYear()  + "-" + appendZero(String.valueOf(date.getMonthValue()))  + "-01 00:00:01";

		String date1 = date.getYear() + "-" + appendZero(String.valueOf(date.getMonthValue())) 
		+ "-" +getMonthMaxDay(date.getMonthValue(), date.getYear()) + " 23:59:59";

		SimpleDateFormat sDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		try {
			out[0] = sDateFormat.parse(date0);
			out[1] = sDateFormat.parse(date1);
		} catch (ParseException px) {
			px.printStackTrace();
		}
		return out;
	}
	
	/**
	 * 根据type获取一段时间
	 * @param keyType
	 * @return
	 */
	public static final Date[] getTimeFromNow(String keyType)
	{
		switch(keyType)
		{
		case "year":
			return DateUtil.getThisYearTime();
		case "month":
			return DateUtil.getThisMonthTime();
		case "week":
			return DateUtil.getThisWeekTime();
		case "day":
			return DateUtil.getTodayTime();
		}
		logger.error("exec method getTimeFromNow error, please cheack!!!");
		return null;
	}

	/**
	 * 获取一个月的最大天数
	 * @param month
	 * @param year
	 * @return
	 */
	public static final int getMonthMaxDay(int month, int year) {
		if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
			return 31;
		}
		if (month == 4 || month == 6 || month == 9 || month == 11) {
			return 30;
		}
		if (month == 2) {
			if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
				return 29;
			} else {
				return 28;
			}
		}
		return 30;
	}

	/**
	 * 获取这一年时间段
	 * 
	 * @return
	 */
	public static final Date[] getThisYearTime() {
		Date[] out = new Date[2];
		LocalDate date = LocalDate.now();

		String date0 = date.getYear() + "-01-01 00:00:01";

		String date1 = date.getYear() + "-12-31 23:59:59";

		SimpleDateFormat sDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		try {
			out[0] = sDateFormat.parse(date0);
			out[1] = sDateFormat.parse(date1);
		} catch (ParseException px) {
			px.printStackTrace();
		}
		return out;
	}
	
	/**
	 * 获取本月下所有天数key
	 * @return
	 */
	public static final List<String> getMonthDays()
	{
		List<String> out = new ArrayList<String>();
		LocalDate date = LocalDate.now();
		final String temp = date.getYear() + "-" + appendZero(String.valueOf(date.getMonthValue()))+ "-" ;
		StringBuilder builder = new StringBuilder();
		for(int i=1; i<=getMonthMaxDay(date.getMonthValue(), date.getYear()); i++)
		{
			builder.append(temp).append(appendZero(String.valueOf(i)));
			out.add(builder.toString());
			builder.delete(0, builder.length());
		}
		return out;
	}
	
	/**
	 * 获取本周下所有天数key
	 * @return
	 */
	public static final List<String> getWeekDays()
	{
		List<String> out = new ArrayList<String>();
		Calendar calendar = Calendar.getInstance();
		calendar.setFirstDayOfWeek(Calendar.MONDAY);// 设置星期一为一周开始的第一天
		calendar.setMinimalDaysInFirstWeek(4);// 可以不用设置
		calendar.setTimeInMillis(System.currentTimeMillis());// 获得当前的时间戳
		int weekYear = calendar.get(Calendar.YEAR);// 获得当前的年
		int weekOfYear = calendar.get(Calendar.WEEK_OF_YEAR);// 获得当前日期属于今年的第几周

		calendar.setWeekDate(weekYear, weekOfYear, 2);// 获得指定年的第几周的开始日期
		long starttime = calendar.getTime().getTime();// 创建日期的时间该周的第一天，
		calendar.setWeekDate(weekYear, weekOfYear, 1);// 获得指定年的第几周的结束日期
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		String dateStart = simpleDateFormat.format(starttime);// 将时间戳格式化为指定格式
		int start = getNumFromStr(dateStart.split("-")[2]);
		final String temp = dateStart.substring(0, 7);
		for(int i=start; i<= start+6; i++)
		{
			out.add(temp + "-" +appendZero(String.valueOf(i)));
		}
		return out;
	}
	
	/**
	 * 01型字符串转数字
	 * @param str
	 * @return
	 */
	private static final int getNumFromStr(String str)
	{
		if(str.length() == 2 && str.charAt(0) == '0')
		{
			return Integer.parseInt(String.valueOf(str.charAt(1)));
		}
		return Integer.parseInt(str);
	}
	
	/**
	 * 获取本年下所有月份key
	 * @return
	 */
	public static final List<String> getYearMonths()
	{
		List<String> out = new ArrayList<String>();
		LocalDate date = LocalDate.now();
		final String temp = date.getYear() + "-";
		for(int i=1; i<=12; i++)
		{
			out.add(temp + appendZero(String.valueOf(i)));
		}
		return out;
	}
	
	/**
	 * 获取本日下所有小时key
	 * @return
	 */
	public static final List<String> getDayHours()
	{
		List<String> out = new ArrayList<String>();
		LocalDate date = LocalDate.now();

		String temp = date.getYear() + "-" + appendZero(String.valueOf(date.getMonthValue())) + "-"
				+ appendZero(String.valueOf(date.getDayOfMonth()))+" ";
		for(int i=1; i<=24; i++)
		{
			out.add(temp + appendZero(String.valueOf(i)));
		}
		return out;
	}
	
	/**
	 * 通过一个具体时间，获取指定type的key
	 * @param date
	 * @param keyType
	 * @return
	 */
	public static final String getKey(Date date, String keyType)
	{
		String out = null;
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time = format.format(date);
		switch(keyType)
		{
		case "year":
			out = time.substring(0, 7);
			break;
		case "month":
			out = time.substring(0, 10);
			break;
		case "week":
			out = time.substring(0, 10);
			break;
		case "day":
			out = time.substring(0, 13);
			break;
		}
		return out;
	}
	
	/**
	 * 根据type获取key列表
	 * @param keyType
	 * @return
	 */
	public static final List<String> getMatchingKeys(String keyType)
	{
		List<String> out = null;
		switch(keyType)
		{
		case "year":
			return getYearMonths();
		case "month":
			return getMonthDays();
		case "week":
			return getWeekDays();
		case "day":
			return getDayHours();
		}
		return out;
	}
	
	/**
	 * 将timestamp转换成date
	 * @param old
	 * @param formatStr
	 * @return
	 */
	public static Date timeStampToDate(Date old, String formatStr)
	{
		SimpleDateFormat format = new SimpleDateFormat(formatStr);
		try {
			return format.parse(format.format(old));
		} catch (ParseException e) {
			logger.error("time stamp to date error: {}", e);
		}
		return old;
	}
	
	/**
	 * 将时间转字符串
	 * @param date
	 * @param formatStr
	 * @return
	 */
	public static String dateToString(Date date, String formatStr)
	{
		SimpleDateFormat format = new SimpleDateFormat(formatStr);
		return format.format(date);
	}
	
	/**
	 * 将字符串转时间
	 * @param dateStr
	 * @param formatStr
	 * @return
	 */
	public static Date stringToDate(String dateStr, String formatStr)
	{
		SimpleDateFormat format = new SimpleDateFormat(formatStr);
		try {
			return format.parse(dateStr);
		} catch (ParseException e) {
			logger.error("date to string error: {}", e);
		}
		return new Date();
	}
	/*private static void printDateArray(Date[] date)
	{
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		for(Date one : date)
		{
			System.out.println(format.format(one));
		}
		System.out.println("----------------");
	}
	
	private static void printKeyList(List<String> keys)
	{
		for(String one : keys)
		{
			System.out.println(one);
		}
		System.out.println("----------------");
	}

	public static void main(String[] args) throws ParseException {
		printDateArray(DateUtil.getTodayTime());
		printDateArray(DateUtil.getThisWeekTime());
		printDateArray(DateUtil.getThisMonthTime());
		printDateArray(DateUtil.getThisYearTime());
		
		printKeyList(DateUtil.getDayHours());
		printKeyList(DateUtil.getMonthDays());
		printKeyList(DateUtil.getWeekDays());
		printKeyList(DateUtil.getYearMonths());
		Date date = new Date();
		System.out.println(getKey(date, "year"));
		System.out.println(getKey(date, "month"));
		System.out.println(getKey(date, "week"));
		System.out.println(getKey(date, "day"));
		
		SimpleDateFormat sDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		
		System.out.println(sDateFormat.parse("2018-08-01 00:00:00").getTime());
		System.out.println(sDateFormat.parse("2018-08-24 00:00:00").getTime());
		
		Date[] date = new Date[2];
		date[0] = getPastDate(7);
		date[1] = getPastDate(14);
		printDateArray(date);
	}*/
}
