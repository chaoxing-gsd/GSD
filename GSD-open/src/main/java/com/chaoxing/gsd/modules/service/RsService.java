package com.chaoxing.gsd.modules.service;

import com.alibaba.fastjson.JSON;
import com.chaoxing.gsd.core.utils.CommonUtil;
import com.chaoxing.gsd.core.utils.DateUtil;
import com.chaoxing.gsd.modules.entity.*;
import com.chaoxing.gsd.modules.mapper.*;
import com.chaoxing.gsd.service.SearchESIndexService;
import com.chaoxing.gsd.web.res.BaseResponse;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class RsService {

	private static final Logger logger = LoggerFactory.getLogger(RsService.class);

	@Autowired
	private DefinedCategoryMapper definedCategoryMapper;

	@Autowired
	private GsdMapper gsdMapper;

	@Autowired
	private GsdLibMapper gsdLibMapper;

	@Autowired
	private GsdUser2Mapper gsdUser2Mapper;

	@Autowired
	private GsdIndexMapper gsdIndexMapper;

	@Autowired
	private ExportLiteratureRecordMapper epLiteratureRecord;

	@Autowired
	private ExportLiteratureRecordDetailMapper epLiteratureRecordDetail;

	@Autowired
	SearchESIndexService searchESIndexService;

	// 浏览记录
	@Autowired
	private SearchRecordMapper searchRecordMapper;

	// 搜索内容
	@Autowired
	private SearchContentMapper sc;

	@Transactional
	public BaseResponse deleteSearchHistory(String userid, String searchcontent, String datetimetype) {
		BaseResponse out = new BaseResponse();
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userid", userid);
		para.put("searchcontent", searchcontent);
		para.put("datetimetype", datetimetype);

		// 先删除搜索记录
		sc.deleteSearchHistory(para);

		// 再删除浏览记录
		searchRecordMapper.deleteSearchHistory(para);

		out.setStatu(true);
		out.setMsg("delete search history succ.");
		return out;
	}

	public BaseResponse getLatestFiveCategory(String userId, String type) {
		BaseResponse out = new BaseResponse();
		Map<String, List<Gsd>> resp = new HashMap<String, List<Gsd>>();
		List<DefinedCategory> data = null;

		if ("1".equals(type)) {
			// 根据用户id查询最近创建的5个专业库查询标签
			data = definedCategoryMapper.getLastFiveCategory(userId);
		}
		if ("2".equals(type)) {
			// 根据用户id查询最近使用的5个专业库查询标签
			data = definedCategoryMapper.getLastestFiveCategory(userId);
		}

		// 查询其下所包含的库信息

		if (null != data && data.size() > 0) {
			// 查询详情
			String temp = "";
			for (DefinedCategory one : data) {
				temp += "'" + one.getCategoryid() + "',";
			}
			temp = temp.substring(0, temp.length() - 1);
			Map<String, Object> para = new HashMap<String, Object>();
			para.put("userid", userId);
			para.put("alltype", temp);
			List<Gsd> allGsd = gsdMapper.getSpecailGsd(para);
			List<Gsd> gsdTemp = null;
			if (null != allGsd && allGsd.size() > 0) {
				for (int i = 0, k = 0; i < data.size(); i++) {
					gsdTemp = new ArrayList<Gsd>();
					resp.put(data.get(i).getCategoryname(), gsdTemp);
					for (int j = k; j < allGsd.size(); j++) {
						if (allGsd.get(j).getCategoryid1().equals(data.get(i).getCategoryid())) {
							gsdTemp.add(allGsd.get(j));
						} else {
							k = j;
							break;
						}
					}
				}
			}
		}
		out.setStatu(true);
		out.setData(resp);
		out.setMsg("get latest five categorys succ.");
		return out;
	}

	public HashMap<String, Object> getLib() {
		HashMap<String, Object> map = new HashMap<String, Object>();
		HashSet<String> selfcategorynames = gsdLibMapper.getSelfcategorynames();
		for (String selfcategoryname : selfcategorynames) {
			List<GsdLib> gsdlibs = gsdLibMapper.getAllLib(selfcategoryname);
			map.put(selfcategoryname, gsdlibs);
		}
		return map;
	}

	// 查找第三方库索引id
	public List<String> getSanfangIndexNames() {
		List<String> indexNames = gsdLibMapper.getSanfangIndexNames();
		return indexNames;
	}

	public GsdLib getGsdLibByLibId(String libId) {
		return gsdLibMapper.getGsdLibByLibId(libId);
	}

	public List<DefinedCategory> getCategoryByUserid(String userid) {
		return definedCategoryMapper.getCategoryByUserid(userid);
	}

	public com.chaoxing.gsd.web.res.BaseResponse insertCategory(String userid, String categoryname) {
		com.chaoxing.gsd.web.res.BaseResponse resp = new com.chaoxing.gsd.web.res.BaseResponse();
		DefinedCategory definedCategory = new DefinedCategory();
		definedCategory.setUserid(userid);
		definedCategory.setCategoryname(categoryname);
		long t1 = System.currentTimeMillis();
		String categoryid = String.valueOf(t1);
		definedCategory.setCategoryid(categoryid);
		DefinedCategory d = definedCategoryMapper.getCategoryByUseridAndName(definedCategory);
		if (d != null) {
			resp.setMsg("不可以重复添加");
			resp.setStatu(false);
			return resp;
		} else {
			definedCategoryMapper.insertCategory(definedCategory);
			resp.setStatu(true);
			resp.setData(definedCategory);
			return resp;
		}

	}

	public com.chaoxing.gsd.web.res.BaseResponse reNameCategory(String userid, String categoryid, String categoryname) {
		com.chaoxing.gsd.web.res.BaseResponse resp = new com.chaoxing.gsd.web.res.BaseResponse();
		DefinedCategory definedCategory = new DefinedCategory();
		definedCategory.setUserid(userid);
		definedCategory.setCategoryid(categoryid);

		// 更新label的版本
		definedCategoryMapper.updateOperatTime(definedCategory);

		definedCategory.setCategoryname(categoryname);
		DefinedCategory d = definedCategoryMapper.getCategoryByUseridAndName(definedCategory);

		if (d != null) {
			resp.setMsg("不能重复命名");
			resp.setStatu(false);
			return resp;
		} else {
			definedCategoryMapper.changeCategoryName(definedCategory);
			resp.setStatu(true);
			return resp;
		}
	}

	public void delCategory(String userid, String categoryid) {
		DefinedCategory definedCategory = new DefinedCategory();
		definedCategory.setUserid(userid);
		definedCategory.setCategoryid(categoryid);
		definedCategoryMapper.delCategory(definedCategory);
	}

	public com.chaoxing.gsd.web.res.BaseResponse insertGsd(Gsd gsd) {
		com.chaoxing.gsd.web.res.BaseResponse resp = new com.chaoxing.gsd.web.res.BaseResponse();

		// 更新label的版本
		DefinedCategory definedCategory = new DefinedCategory();
		definedCategory.setUserid(gsd.getUserid());
		definedCategory.setCategoryid(gsd.getCategoryid1());
		definedCategoryMapper.updateOperatTime(definedCategory);

		List<Gsd> list = gsdMapper.getGsd(gsd);
		if (list.size() == 0) {
			gsdMapper.insertGsd(gsd);
			resp.setStatu(true);
		} else {
			resp.setMsg("不能重复添加");
			resp.setStatu(false);
		}
		return resp;
	}

	public List<String> getCategoryid2(Gsd gsd) {
		return gsdMapper.getCategoryid2(gsd);
	}

	public void delGsd(Gsd gsd) {
		gsdMapper.delGsd(gsd);

		// 更新label的版本
		DefinedCategory definedCategory = new DefinedCategory();
		definedCategory.setUserid(gsd.getUserid());
		definedCategory.setCategoryid(gsd.getCategoryid1());
		definedCategoryMapper.updateOperatTime(definedCategory);
	}

	public void delAllContent(String userid) {
		sc.delAllContent(userid);
	}

	public void delContent(String userid, String content, String contentid) {
		SearchContent s = new SearchContent();
		s.setUserid(userid);
		s.setContent(content);
		s.setContentid(contentid);
		sc.delContent(s);

	}

	public void insertSearchContent(String userid, String content) {
		long t1 = System.currentTimeMillis();
		String contentid = String.valueOf(t1);
		SearchContent s = new SearchContent();
		s.setUserid(userid);
		s.setContent(content);
		s.setContentid(contentid);
		sc.insertSearchContent(s);
	}

	public Map<String, Object> getSearchContentByUserId(String userid) {
		long startTime = System.currentTimeMillis();
		Map<String, Object> result = new LinkedHashMap<String, Object>();
		SearchRecord para = new SearchRecord();
		para.setUserid(userid);
		List<SearchRecord> SearchContents = searchRecordMapper.get24HoursSearchRecordNum(para);
		Map<String, Integer> map = new HashMap<String, Integer>();
		for (SearchRecord content : SearchContents) {
			map.put(content.getContent(), content.getId());
		}
		result.put("过去24h", map);

		SearchContents = searchRecordMapper.getLastWeekSearchRecordNum(para);
		Map<String, Integer> map3 = new HashMap<String, Integer>();
		for (SearchRecord content : SearchContents) {
			map3.put(content.getContent(), content.getId());
		}
		result.put("过去一周", map3);

		SearchContents = searchRecordMapper.getLastMonthSearchRecordNum(para);
		Map<String, Integer> map4 = new HashMap<String, Integer>();
		for (SearchRecord content : SearchContents) {
			map4.put(content.getContent(), content.getId());
		}
		result.put("过去一个月", map4);

		SearchContents = searchRecordMapper.getMoreSearchRecordNum(para);
		Map<String, Integer> map5 = new HashMap<String, Integer>();
		for (SearchRecord content : SearchContents) {
			map5.put(content.getContent(), content.getId());
		}
		result.put("更多", map5);

		logger.info("getSearchContentByUserId id: {} toast time is: {}", userid,
				System.currentTimeMillis() - startTime);
		return result;
	}

	public boolean hasContent(String userid, String content) {
		SearchContent s = new SearchContent();
		s.setUserid(userid);
		s.setContent(content);
		List<SearchContent> list = sc.getSearchContentByContent(s);
		if (list.size() == 0) {
			return false;
		} else {
			return true;
		}
	}

	public void insertSearchRecord(SearchRecord searchRecord) {
		searchRecordMapper.insertSelective(searchRecord);
	}

	public void delSearchRecordByUserId(String userid) {
		searchRecordMapper.delSearchRecordByUserId(userid);
	}

	public void delSearchRecordByContent(String userid, String content) {
		SearchRecord searchRecord = new SearchRecord();
		searchRecord.setUserid(userid);
		searchRecord.setContent(content);
		searchRecordMapper.delSearchRecordByContent(searchRecord);
	}

	public Map<String, Object> getsearchrecordByContent(String userid, String content) {
		SearchRecord searchRecord = new SearchRecord();
		searchRecord.setUserid(userid);
		searchRecord.setContent(content);
		Map<String, Object> result = new LinkedHashMap<String, Object>();
		List<SearchRecord> list1 = searchRecordMapper.get24HoursSearchRecord(searchRecord);
		result.put("过去24h", list1);
		List<SearchRecord> list2 = searchRecordMapper.getLastWeekSearchRecord(searchRecord);
		result.put("过去一周", list2);
		List<SearchRecord> list3 = searchRecordMapper.getLastMonthSearchRecord(searchRecord);
		result.put("过去一个月", list3);
		List<SearchRecord> list4 = searchRecordMapper.getMoreSearchRecord(searchRecord);
		result.put("更多", list4);
		return result;
	}

	// 用户设置
	public void openSearch(String userid) {
		GsdUser2 user = gsdUser2Mapper.find(userid);
		if (user == null) {
			GsdUser2 gu = new GsdUser2();
			gu.setOpensearchrecord(true);
			gu.setSharewebpage(false);
			gu.setUserid(userid);
			gsdUser2Mapper.insert(gu);
		} else {
			gsdUser2Mapper.open(userid);
		}
	}

	public void closeSearch(String userid) {
		GsdUser2 user = gsdUser2Mapper.find(userid);
		if (user == null) {
			GsdUser2 gu = new GsdUser2();
			gu.setOpensearchrecord(false);
			gu.setSharewebpage(false);
			gu.setUserid(userid);
			gsdUser2Mapper.insert(gu);
		} else {
			gsdUser2Mapper.close(userid);
		}
	}

	public void openShareWebpage(String userid) {
		GsdUser2 user = gsdUser2Mapper.find(userid);
		if (user == null) {
			GsdUser2 gu = new GsdUser2();
			gu.setOpensearchrecord(false);
			gu.setSharewebpage(true);
			gu.setUserid(userid);
			gsdUser2Mapper.insert(gu);
		} else {
			gsdUser2Mapper.openShareWebpage(userid);
		}
	}

	public void closeShareWebpage(String userid) {
		GsdUser2 user = gsdUser2Mapper.find(userid);
		if (user == null) {
			GsdUser2 gu = new GsdUser2();
			gu.setOpensearchrecord(false);
			gu.setSharewebpage(false);
			gu.setUserid(userid);
			gsdUser2Mapper.insert(gu);
		} else {
			gsdUser2Mapper.closeShareWebpage(userid);
		}
	}

	public List<GsdUser2> findShareWebpageUsers() {
		return gsdUser2Mapper.findShareWebpageUsers();
	}

	public GsdUser2 findUserSetting(String userid) {
		return gsdUser2Mapper.find(userid);
	}

	/**
	 * 保存文献导出记录信息
	 * 
	 * @param userId
	 *            用户id
	 * @param literatureId
	 *            文献id
	 */
	@Transactional
	public void toSaveExportLiteratureRecord(String userId, String[] literatureId) {
		// 先记录总体得到记录id
		// TODO
		ExportLiteratureRecord bean = new ExportLiteratureRecord();
		bean.setUserid(userId);
		epLiteratureRecord.insertOne(bean);

		ExportLiteratureRecord out = epLiteratureRecord.getLastestRecord(userId);

		Long recordId = null;
		ExportLiteratureRecordDetail temp = null;
		if (null != out && (recordId = out.getRecordid()) != null) {
			// 再记录详情
			if (null != literatureId) {
				for (String one : literatureId) {
					temp = new ExportLiteratureRecordDetail();
					temp.setUserid(userId);
					temp.setRecordid(recordId);
					temp.setLiteratureid(one);
					epLiteratureRecordDetail.insertOne(temp);
				}
			}
		} else {
			logger.warn("Get latest export literature record wrong!");
		}
	}

	/**
	 * 获取用户文献次数
	 * 
	 * @param userId
	 *            用户id
	 * @return
	 */
	public BaseResponse getExportLiteratureRecordCount(String userId) {
		BaseResponse resp = new BaseResponse();
		Map<String, Integer> out = new HashMap<String, Integer>();
		int num = epLiteratureRecordDetail.getRecordCount(userId);
		out.put("num", num);
		resp.setStatu(true);
		resp.setMsg("Get export literature record count succ.");
		resp.setData(out);
		return resp;
	}

	/**
	 * 获取用户搜索次数
	 * 
	 * @param userId
	 *            用户id
	 * @return
	 */
	public BaseResponse getSearchCount(String userId) {
		BaseResponse resp = new BaseResponse();
		Map<String, Integer> out = new HashMap<String, Integer>();
		int num = sc.getSearchCount(userId);
		out.put("num", num);
		resp.setStatu(true);
		resp.setMsg("Get search count succ.");
		resp.setData(out);
		return resp;
	}

	/**
	 * 获取用户检索汇总数据并集
	 * 
	 * @param userId
	 *            用户id
	 * @return
	 */
	public BaseResponse getStatisticsDataByUserId(String userId) {
		BaseResponse resp = new BaseResponse();
		Map<String, Integer> out = new HashMap<String, Integer>();
		int lrdnum = epLiteratureRecordDetail.getRecordCount(userId);

		int scnum = sc.getSearchCount(userId);

		long notenum = searchESIndexService.getPersonNoteSizeFromEs(userId);

		out.put("lrdnum", lrdnum);
		out.put("scnum", scnum);
		out.put("notenum", (int) notenum);
		resp.setStatu(true);
		resp.setMsg("Get statistics data by userid succ.");
		resp.setData(out);
		return resp;
	}

	/**
	 * 获取一段时间内查询库的次数排名
	 * 
	 * @param startTime
	 * @param endTime
	 * @param limitSzie
	 * @return
	 */
	public BaseResponse getSearchCountRanking(Date startTime, Date endTime, int limitSzie) {
		BaseResponse resp = new BaseResponse();
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("startTime", startTime);
		para.put("endTime", endTime);
		para.put("limitSzie", limitSzie);
		List<SearchRecord> rankingData = searchRecordMapper.getSearchCountRanking(para);
		para.clear();
		para.put("rankingData", rankingData);
		resp.setStatu(true);
		resp.setMsg("Get search count ranking succ.");
		resp.setData(para);
		return resp;
	}

	/**
	 * 获取一段时间内访问gsd的情况
	 * 
	 * @param keyType
	 * @return
	 */
	public BaseResponse getGsdVisitAmount(String keyType) {
		BaseResponse resp = new BaseResponse();
		Map<String, Object> para = new HashMap<String, Object>();
		Date[] dates = DateUtil.getTimeFromNow(keyType);
		if (null == dates || dates.length != 2) {
			logger.error("getGsdVisitAmount method exec error, dates is error!!!");
			resp.setStatu(false);
			resp.setMsg("Get search count ranking succ.");
			return resp;
		}
		Date startTime = dates[0], endTime = dates[1];
		para.put("startTime", startTime);
		para.put("endTime", endTime);
		List<SearchRecord> data = searchRecordMapper.getGsdVisitAmount(para);
		List<Integer> out = new ArrayList<Integer>();
		List<String> allKeys = DateUtil.getMatchingKeys(keyType);
		if (null != data && data.size() > 0 && null != allKeys) {
			Map<String, Integer> allData = new HashMap<>();
			for (int k = 0; k < allKeys.size(); k++) {
				allData.put(allKeys.get(k), 0);
			}
			String keyTemp = null;
			for (int i = 0; i < data.size(); i++) {
				keyTemp = DateUtil.getKey(data.get(i).getCreated(), keyType);
				if (allData.containsKey(keyTemp)) {
					allData.put(keyTemp, allData.get(keyTemp) + 1);
				} else {
					logger.error("getGsdVisitAmount method exec error, please check!!!");
				}
			}

			// 统计输出
			for (int p = 0; p < allKeys.size(); p++) {
				out.add(allData.get(allKeys.get(p)));
			}
		}
		resp.setStatu(true);
		resp.setMsg("Get gsd visit amount succ.");
		resp.setData(out);
		return resp;
	}

	/**
	 * 从搜索记录中排序分页获取关键字搜索次数
	 * 
	 * @param offset
	 * @param limit
	 * @param isDesc
	 *            是否升序
	 * @return
	 */
	public BaseResponse getCountOfSearch(int offsetInfo, int limitInfo, boolean isDesc) {
		BaseResponse resp = new BaseResponse();
		String descInfo = isDesc ? "asc" : "desc";
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("descInfo", descInfo);
		para.put("limitInfo", limitInfo);
		para.put("offsetInfo", offsetInfo);
		List<SearchContent> data = sc.getCountOfSearch(para);

		para.clear();

		// 前后两周的时间点
		Date temp = DateUtil.getPastDate(7);
		para.put("bWeekStart", DateUtil.getPastDate(14));
		para.put("bWeekEnd", temp);
		para.put("aWeekStart", temp);
		para.put("aWeekEnd", new Date());
		logger.info("para is :{}", JSON.toJSONString(para));
		SearchContent scTemp = null;

		// 获得每一个搜索关键字的周增长率
		for (SearchContent one : data) {

			// 填充查询关键字
			logger.info("content is :{}", one.getContent());
			para.put("content", one.getContent());
			scTemp = sc.getWeekIncreaseOfSearch(para);
			if (null != scTemp && null != scTemp.getWeekIncrease()) {
				one.setWeekIncrease(CommonUtil.appendPercentage(scTemp.getWeekIncrease()));
			} else {
				one.setWeekIncrease(CommonUtil.appendPercentage("0.00"));
			}
		}
		resp.setStatu(true);
		resp.setMsg("Get count of search succ.");
		resp.setData(data);
		return resp;
	}

	public List<Map<String, Object>> getGPSMessage() {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		Set<String> addresses = searchRecordMapper.getAddress();
		for (String address : addresses) {
			Map<String, Object> map = new HashMap<>();
			map.put("address", address);
			Integer count = searchRecordMapper.getCountByAddress(address);
			map.put("count", count);
			List<String> points = searchRecordMapper.getPointByAddress(address);
			for (String point : points) {
				if (point != null) {
					map.put("point", point);
					break;
				}
			}
			list.add(map);
		}
		return list;
	}

	// 用户提交库相关操作
	@Transactional
	public void insertGsdindex(GsdIndex gsdIndex) {
		gsdIndexMapper.insertSelective(gsdIndex);
		
		// TODO 将库信息直接入gsdlib
		GsdLib record = new GsdLib();
		record.setCategoryid("Textref");
		record.setSelfcategoryname("系统库");
		record.setLibid(gsdIndex.getName());
		record.setNamecha(gsdIndex.getDomainname());
		record.setNameeng(" ");
		record.setType(2);
		record.setWiki(gsdIndex.getWiki());
		
		gsdLibMapper.insertSelective(record);
	}

	public PageInfo<GsdIndex> SelectUserIndex(String userId, Integer pageNum, Integer pageSize) {
		PageHelper.startPage(pageNum, pageSize);
		List<GsdIndex> list = gsdIndexMapper.SelectUserIndex(userId);
		PageInfo<GsdIndex> pageInfo = new PageInfo<>(list);
		return pageInfo;
	}

	public PageInfo<GsdIndex> SelectAllIndex(Integer pageNum, Integer pageSize) {
		PageHelper.startPage(pageNum, pageSize);
		List<GsdIndex> list = gsdIndexMapper.SelectAllIndex();
		PageInfo<GsdIndex> pageInfo = new PageInfo<>(list);
		return pageInfo;
	}
}
