package com.chaoxing.gsd.modules.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.chaoxing.gsd.bean.CompareSetStrcut;
import com.chaoxing.gsd.core.utils.CommonUtil;
import com.chaoxing.gsd.core.utils.StringUtil;
import com.chaoxing.gsd.modules.entity.LiteratureCompDetail;
import com.chaoxing.gsd.modules.entity.LiteratureCompLabel;
import com.chaoxing.gsd.modules.entity.LiteratureCompLibFiled;
import com.chaoxing.gsd.modules.entity.LiteratureCompShowSet;
import com.chaoxing.gsd.modules.entity.LiteratureDetail;
import com.chaoxing.gsd.modules.mapper.LiteratureCompDetailMapper;
import com.chaoxing.gsd.modules.mapper.LiteratureCompShowSetMapper;
import com.chaoxing.gsd.modules.mapper.LiteratureCompLabelMapper;
import com.chaoxing.gsd.modules.mapper.LiteratureCompLibFiledMapper;
import com.chaoxing.gsd.modules.mapper.LiteratureDetailMapper;
import com.chaoxing.gsd.service.SearchESIndexService;
import com.chaoxing.gsd.web.res.BaseResponse;

/**
 * 文献对比服务
 * 
 * @author winsl
 *
 */
@Service
public class LiteratureCompService {

	private static Logger logger = LoggerFactory.getLogger(LiteratureCompService.class);

	@Autowired
	private LiteratureCompLabelMapper literatureCompLabelMapper;

	@Autowired
	private LiteratureCompDetailMapper literatureCompDetailMapper;

	@Autowired
	private LiteratureDetailMapper literatureDetailMapper;

	@Autowired
	private SearchESIndexService searchESIndexService;

	@Autowired
	private LiteratureCompShowSetMapper literatureCompShowSetMapper;

	@Autowired
	private LiteratureCompLibFiledMapper literatureCompLibFiledMapper;

	private static final Set<String> INNER_DATA = new LinkedHashSet<String>();
	static {
		INNER_DATA.add("0");
		INNER_DATA.add("1");
	}

	/**
	 * 创建标签
	 * 
	 * @param labelName
	 * @param userId
	 * @return
	 */
	public BaseResponse createLabel(String labelName, String userId) {
		BaseResponse out = new BaseResponse();
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userid", userId);
		para.put("labelname", labelName);

		// 先查询名称是否存在
		LiteratureCompLabel data = literatureCompLabelMapper.getCount(para);
		if (null != data && data.getId() == 0) {
			LiteratureCompLabel record = new LiteratureCompLabel();
			record.setLabelname(labelName);
			record.setUserid(userId);
			record.setVersion(String.valueOf(System.currentTimeMillis()));
			literatureCompLabelMapper.insert(record);

			// 插入成功则查询标签id返回
			data = literatureCompLabelMapper.getIdByUseridName(para);
		} else {
			logger.error("createLabel error!!!");
			out.setStatu(false);
			out.setMsg("labelName is exist or db error!!!");
			return out;
		}
		out.setStatu(null == data ? false : true);
		out.setData(data);
		out.setMsg("createLabel succ.");
		return out;
	}

	/**
	 * 删除标签及标签下文献对比详情
	 * 
	 * @param labelId
	 * @return
	 */
	@Transactional
	public BaseResponse deleteLabel(int labelId) {
		BaseResponse out = new BaseResponse();
		literatureCompLabelMapper.deleteByPrimaryKey(labelId);
		literatureCompDetailMapper.deleteAllByLabelId(labelId);
		out.setStatu(true);
		out.setMsg("deleteLabel succ.");
		return out;
	}

	/**
	 * 更新标签
	 * 
	 * @param labelId
	 * @param labelName
	 * @return
	 */
	public BaseResponse updateLabel(int labelId, String labelName) {
		BaseResponse out = new BaseResponse();
		LiteratureCompLabel data = new LiteratureCompLabel();
		data.setId(labelId);
		data.setLabelname(labelName);
		try {
			literatureCompLabelMapper.updateByPrimaryKeySelective(data);
		} catch (Exception e) {
			logger.warn("update comp label error, label name: {} is repeat!!!", labelName);
			out.setStatu(false);
			out.setMsg("updateLabel fail, labelName is repeat!!!");
			return out;
		}
		out.setStatu(true);
		out.setMsg("updateLabel succ.");
		return out;
	}

	/**
	 * 更新文献对比列展示设置
	 * 
	 * @param labelId
	 * @param filedsnamecn
	 * @param filedids
	 * @return
	 */
	public BaseResponse updateLabelShowSetting(int labelId, String filedsnamecn, String filedids) {
		BaseResponse out = new BaseResponse();
		LiteratureCompShowSet data = new LiteratureCompShowSet();
		data.setFiledids(filedids);
		data.setFiledsnamecn(filedsnamecn);
		data.setLabelid(labelId);
		literatureCompShowSetMapper.updateByPrimaryKeySelective(data);
		out.setStatu(true);
		out.setMsg("updateLabelShowSetting succ.");
		return out;
	}

	/**
	 * 查询用户下所有标签
	 * 
	 * @param userId
	 * @return
	 */
	public BaseResponse queryLabels(String userId) {
		BaseResponse out = new BaseResponse();
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userid", userId);
		List<LiteratureCompLabel> data = literatureCompLabelMapper.selectByUserId(para);
		para.clear();
		para.put("data", data);
		out.setStatu(true);
		out.setData(para);
		out.setMsg("queryLabels succ.");
		return out;
	}

	/**
	 * 插入文献对比详情
	 * 
	 * @param data
	 * @return
	 */
	@Transactional
	public BaseResponse insertDetails(List<LiteratureCompDetail> data) {
		BaseResponse out = new BaseResponse();
		if (null != data) {
			LiteratureDetail temp = null;
			Set<Integer> lableIds = new LinkedHashSet<Integer>();
			for (LiteratureCompDetail record : data) {
				lableIds.add(record.getLabelid());

				// 是超星库对比需要保存条目数据
				if (INNER_DATA.contains(record.getType())) {
					temp = new LiteratureDetail();
					temp.setLiteratureid(record.getLiteratureid());
					temp.setContent(record.getJsonbody());
					insertIntoLiteratureDetail(temp);
				}
				try {
					literatureCompDetailMapper.insert(record);
				} catch (Exception e) {
					// 不走事务，忽略重复的文献添加到同个文献标签下
					logger.warn("labelid: {}, literatureid:{} is not unique!!!", record.getLabelid(),
							record.getLiteratureid());
				}
			}

			// 更新对应label id的版本字段
			LiteratureCompLabel para = null;
			for (Integer one : lableIds) {
				para = new LiteratureCompLabel();
				para.setId(one);
				para.setVersion(String.valueOf(System.currentTimeMillis()));
				literatureCompLabelMapper.updateByPrimaryKeySelective(para);
			}
		}
		out.setStatu(true);
		out.setMsg("insertDetails succ.");
		return out;
	}

	/**
	 * 插入文献简报
	 * 
	 * @param bean
	 */
	public void insertIntoLiteratureDetail(LiteratureDetail bean) {
		try {
			literatureDetailMapper.insert(bean);
		} catch (Exception e) {
			logger.warn("insertIntoLiteratureDetail wrong at primary key!!!");
		}
	}

	/**
	 * 删除文献对比详情
	 * 
	 * @param data
	 * @return
	 */
	public BaseResponse deleteDetails(List<LiteratureCompDetail> data) {
		BaseResponse out = new BaseResponse();
		Map<String, Object> para = new HashMap<String, Object>();
		if (null != data) {
			Set<Integer> lableIds = new LinkedHashSet<Integer>();
			for (LiteratureCompDetail one : data) {
				lableIds.add(one.getLabelid());
				para.put("labelid", one.getLabelid());
				para.put("literatureid", one.getLiteratureid());
				literatureCompDetailMapper.deleteByLabelId(para);
			}

			// 更新对应label id的版本字段
			LiteratureCompLabel temp = null;
			for (Integer one : lableIds) {
				temp = new LiteratureCompLabel();
				temp.setId(one);
				temp.setVersion(String.valueOf(System.currentTimeMillis()));
				literatureCompLabelMapper.updateByPrimaryKeySelective(temp);
			}
		}
		out.setStatu(true);
		out.setMsg("deleteDetails succ.");
		return out;
	}

	/**
	 * 根据标签id查询其下所有文献对比详情
	 * 
	 * @param labelid
	 * @return
	 */
	public BaseResponse queryDetails(int labelid) {
		BaseResponse out = new BaseResponse();
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("labelid", labelid);
		List<LiteratureCompDetail> data = literatureCompDetailMapper.selectByLabelId(para);

		Map<String, Map<String, Boolean>> filedshow = new HashMap<String, Map<String, Boolean>>();

		// 查询数据展示设置信息
		// 0.通过文献比较id获取用户默认的显示配置，没有得到走下面步骤
		LiteratureCompShowSet showSet = new LiteratureCompShowSet();
		showSet.setLabelid(labelid);
		List<LiteratureCompShowSet> setList = literatureCompShowSetMapper.selectShowSet(showSet);
		if (null == setList || setList.size() == 0) {

			// 1.先通过文献比较标签查询其下所有库id
			List<LiteratureCompDetail> allLibId = literatureCompDetailMapper.selectLibIdByLabelId(para);
			if (null != allLibId && allLibId.size() > 0) {
				LiteratureCompShowSet showset = initShowSetting(labelid, allLibId, filedshow);

				// 先删除再插入，防止已经记录上一个版本的显示设置
				literatureCompShowSetMapper.deleteByLabelId(labelid);
				literatureCompShowSetMapper.insertSelective(showset);
				para.clear();
				para.put("showsetting", showset);
			}
		} else {
			para.clear();
			para.put("showsetting", setList.get(0));
		}

		// 查询数据处理
		if (null != data) {
			LiteratureDetail temp = null;
			String indexName = null;
			List<Map<String, Object>> result = null;
			for (LiteratureCompDetail one : data) {

				// 需要根据文献id查询文献详情
				// 根据文献库类型决定查mysql的 literature_detail还是elastic search
				if (INNER_DATA.contains(one.getType())) {

					// 查literature_detail
					temp = literatureDetailMapper.selectByPrimaryKey(one.getLiteratureid());
					if (null != temp) {
						// 将文献简报数据保存到索引名称字段返回
						one.setJsonbody(temp.getContent());
					}
				} else {
					indexName = one.getIndexname();
					if (null != indexName) {
						result = searchESIndexService.searchInfoFromIndexById(indexName, one.getLiteratureid());
						if (null != result && result.size() > 0) {
							one.setJsonbody(JSON.toJSONString(result.get(0)));
						}
					}
				}

				one.setFiledshow(filedshow.get(one.getIndexname()));
			}
		}

		out.setStatu(true);
		para.put("data", data);
		out.setData(para);
		out.setMsg("queryDetails succ.");
		return out;
	}

	/**
	 * 首次展示文献对比时生成默认展示设置
	 * 
	 * @param labelId
	 * @param allLibId
	 * @return
	 */
	private LiteratureCompShowSet initShowSetting(Integer labelId, List<LiteratureCompDetail> allLibId,
			Map<String, Map<String, Boolean>> filedshow) {
		List<LiteratureCompLibFiled> temp = null;
		Map<String, CompareSetStrcut> setStruct = new HashMap<String, CompareSetStrcut>();
		String cn = null, filedid = null, en = null;
		CompareSetStrcut struct = null;
		Set<String> setids = null;
		int totalCount = 0;
		Map<String, Object> para = new HashMap<String, Object>();
		Map<String, Boolean> filedshowdata = null;
		for (LiteratureCompDetail one : allLibId) {
			para.put("libid", one.getIndexname());

			// 2.再通过库id查询各个库要展示的字段并汇总
			temp = literatureCompLibFiledMapper.selectByLibid(para);

			filedshowdata = new HashMap<String, Boolean>();
			filedshow.put(one.getIndexname(), filedshowdata);

			if (null != temp && temp.size() > 0) {
				// 每个对比库字段相加
				totalCount += one.getLabelid();
				for (LiteratureCompLibFiled tt : temp) {
					cn = tt.getFilednamecn();

					filedshowdata.put(cn, true);

					filedid = tt.getFiledid();
					en = tt.getFilednameen();
					if (setStruct.containsKey(cn)) {
						struct = setStruct.get(cn);
						struct.getFiledid().add(filedid);
						struct.setOrder(struct.getOrder() + 1 * one.getLabelid());
					} else {
						struct = new CompareSetStrcut();
						setids = new LinkedHashSet<String>();
						struct.setFiledid(setids);
						setids.add(filedid);
						struct.setFilednamecn(cn);
						struct.setFilednameen(en);
						struct.setOrder(1 * one.getLabelid());
						setStruct.put(cn, struct);
					}
				}
			}
		}

		// 根据order值排序，升序得到拼接值
		Iterator<String> iter = setStruct.keySet().iterator();
		List<CompareSetStrcut> trueData = new ArrayList<CompareSetStrcut>();
		while (iter.hasNext()) {
			trueData.add(setStruct.get(iter.next()));
		}

		// 冒泡排序
		CompareSetStrcut tempData = null;
		for (int i = 0; i < trueData.size() - 1; i++) {
			for (int j = i + 1; j < trueData.size(); j++) {
				if (trueData.get(i).getOrder() < trueData.get(j).getOrder()) {
					tempData = trueData.get(i);
					trueData.set(i, trueData.get(j));
					trueData.set(j, tempData);
				}
			}
		}

		// 3.将数据保存到展示配置表中后返回前端
		String filedsnamecn = "", filedids = "";
		CompareSetStrcut ttemp = null;
		Iterator<String> setString = null;
		for (int i = 0; i < trueData.size(); i++) {
			ttemp = trueData.get(i);
			// 设置百分比
			ttemp.setCents(CommonUtil.appendPercentage(String.valueOf(ttemp.getOrder() / (totalCount * 1d) * 100)));

			// 1是默认展示这一列，预置数据列全部不展示
			filedsnamecn += ttemp.getFilednamecn() + "," + ttemp.getFilednameen() + "," + ttemp.getCents() + ",0" + "|";
			setString = ttemp.getFiledid().iterator();
			while (setString.hasNext()) {
				filedids += setString.next() + ",";
			}
			filedids = filedids.substring(0, filedids.length() - 1) + "|";
		}
		if (!StringUtil.isEmpty(filedsnamecn)) {
			filedsnamecn = filedsnamecn.substring(0, filedsnamecn.length() - 1);
		}
		if (!StringUtil.isEmpty(filedids)) {
			filedids = filedids.substring(0, filedids.length() - 1);
		}
		LiteratureCompShowSet showset = new LiteratureCompShowSet();
		showset.setLabelid(labelId);
		showset.setFiledsnamecn(filedsnamecn);
		showset.setFiledids(filedids);

		// 通过label id获取其版本字段
		LiteratureCompLabel tempLabel = literatureCompLabelMapper.getVersionById(labelId);
		if (tempLabel != null) {
			showset.setVersion(tempLabel.getVersion());
		}
		return showset;
	}
}
