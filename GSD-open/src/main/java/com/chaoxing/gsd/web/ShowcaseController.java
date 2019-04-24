package com.chaoxing.gsd.web;

import java.util.Date;
import java.util.HashMap;

import javax.ws.rs.GET;

import com.chaoxing.gsd.web.res.BaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chaoxing.gsd.modules.service.RsService;
import com.chaoxing.gsd.service.SearchESIndexService;

/**
 * 展示台数据获取相关接口
 * 
 * @author winsl
 *
 */
@Controller
@RequestMapping("/gsd")
public class ShowcaseController {

	@Autowired
	private RsService rsService;

	@Autowired
	SearchESIndexService searchESIndexService;

	/**
	 * 获取用户的文献导出次数
	 * 
	 * @param userid
	 * @return
	 */
	@GET
	@RequestMapping("/getExportLiteratureRecordCount")
	@ResponseBody
	public BaseResponse getExportLiteratureRecordCount(@RequestParam(value = "userid", required = true) String userid) {
		BaseResponse rsp = rsService.getExportLiteratureRecordCount(userid);
		return rsp;
	}

	/**
	 * 获取用户的搜索次数
	 * 
	 * @param userid
	 * @return
	 */
	@GET
	@RequestMapping("/getSearchCount")
	@ResponseBody
	public BaseResponse getSearchCount(@RequestParam(value = "userid", required = true) String userid) {
		BaseResponse rsp = rsService.getSearchCount(userid);
		return rsp;
	}

	/**
	 * 获取用户的一些数据统计汇总
	 * 
	 * @param userid
	 * @return
	 */
	@GET
	@RequestMapping("/getStatisticsDataByUserId")
	@ResponseBody
	public BaseResponse getStatisticsDataByUserId(@RequestParam(value = "userid", required = true) String userid) {
		BaseResponse rsp = rsService.getStatisticsDataByUserId(userid);
		return rsp;
	}

	/**
	 * 获取一段时间内查询库的次数排名
	 * 
	 * @param startTime
	 *            开始时间
	 * @param endTime
	 *            结束时间
	 * @param limitSzie
	 *            取前几名
	 * @return
	 */
	@GET
	@RequestMapping("/getSearchCountRanking")
	@ResponseBody
	public BaseResponse getSearchCountRanking(
			@RequestParam(value = "startTime", required = true) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@RequestParam(value = "endTime", required = true) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime,
			@RequestParam(value = "limitSzie", required = true) Integer limitSzie) {
		BaseResponse rsp = rsService.getSearchCountRanking(startTime, endTime, limitSzie);
		return rsp;
	}

	/**
	 * 获取一段时间内gsd的访问量
	 * 
	 * @param keyType
	 *            时间类型（年月周日）
	 * @return
	 */
	@GET
	@RequestMapping("/getGsdVisitAmount")
	@ResponseBody
	public BaseResponse getGsdVisitAmount(@RequestParam(value = "keyType", required = true) String keyType) {
		BaseResponse rsp = rsService.getGsdVisitAmount(keyType);
		return rsp;
	}

	/**
	 * 从es中获取用户的日记数目
	 * 
	 * @param
	 * @return
	 */
	@GET
	@RequestMapping("/getPersonNoteSizeFromEs")
	@ResponseBody
	public BaseResponse getPersonNoteSizeFromEs(@RequestParam(value = "userid", required = true) String userid) {
		BaseResponse rsp = new BaseResponse();
		rsp.setStatu(true);
		rsp.setMsg("get person note size from es succ.");
		rsp.setData(new HashMap<String, Long>().put("num", searchESIndexService.getPersonNoteSizeFromEs(userid)));
		return rsp;
	}

	/**
	 * 从搜索记录表中获取搜索词次数排名及周增长率
	 * 
	 * @param offset
	 *            分页查询开始下标，0开始
	 * @param limit
	 *            一页查询限制次数
	 * @param isdesc
	 *            是否倒叙，0表示升序，1表示倒叙
	 * @return
	 */
	@GET
	@RequestMapping("/getCountOfSearch")
	@ResponseBody
	public BaseResponse getCountOfSearch(@RequestParam(value = "offset", required = true) Integer offset,
			@RequestParam(value = "limit", required = true) Integer limit,
			@RequestParam(value = "isdesc", required = false) Integer isdesc) {
		boolean is = false;
		if (null == isdesc || isdesc == 0) {
			is = true;
		}
		BaseResponse rsp = rsService.getCountOfSearch(offset, limit, is);
		return rsp;
	}
}
