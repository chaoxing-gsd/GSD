package com.chaoxing.gsd.modules.service;

import java.util.HashMap;
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
import com.chaoxing.gsd.modules.entity.LiteratureDownDetail;
import com.chaoxing.gsd.modules.entity.LiteratureDownLabel;
import com.chaoxing.gsd.modules.mapper.LiteratureDownDetailMapper;
import com.chaoxing.gsd.modules.mapper.LiteratureDownLabelMapper;
import com.chaoxing.gsd.service.SearchESIndexService;
import com.chaoxing.gsd.web.res.BaseResponse;
/**
 * 文献下载服务
 * @author winsl
 *
 */
@Service
public class LiteratureDownService {

	private static Logger logger = LoggerFactory.getLogger(LiteratureCompService.class);

	@Autowired
	private LiteratureDownLabelMapper literatureDownLabelMapper;

	@Autowired
	private LiteratureDownDetailMapper literatureDownDetailMapper;

	@Autowired
	private SearchESIndexService searchESIndexService;

	private static final Set<String> INNER_DATA = new LinkedHashSet<String>();
	static
	{
		INNER_DATA.add("0");
		INNER_DATA.add("1");
	}

	/**
	 * 创建标签
	 * @param labelName
	 * @param userId
	 * @return
	 */
	public BaseResponse createLabel(String labelName, String userId)
	{
		BaseResponse out = new BaseResponse();
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userid", userId);
		para.put("labelname", labelName);
		
		Integer labelId = null;

		// 先查询名称是否存在
		LiteratureDownLabel data = literatureDownLabelMapper.getCount(para);
		if(null != data && data.getId() == 0)
		{
			LiteratureDownLabel record = new LiteratureDownLabel();
			record.setLabelname(labelName);
			record.setUserid(userId);
			literatureDownLabelMapper.insertSelective(record);

			// 插入成功则查询标签id返回 
			labelId = record.getId();
		}
		else
		{
			logger.error("createLabel error!!!");
			out.setStatu(false);
			out.setMsg("labelName is exist or db error!!!");
			return out;
		}
		out.setStatu(null == labelId ? false : true);
		out.setData(labelId);
		out.setMsg("createLabel succ.");
		return out;
	}

	/**
	 * 删除标签及标签下文献下载详情
	 * @param labelId
	 * @return
	 */
	@Transactional
	public BaseResponse deleteLabel(int labelId)
	{
		BaseResponse out = new BaseResponse();
		literatureDownLabelMapper.deleteByPrimaryKey(labelId);
		literatureDownDetailMapper.deleteAllByLabelId(labelId);
		out.setStatu(true);
		out.setMsg("deleteLabel succ.");
		return out;
	}

	/**
	 * 更新标签
	 * @param labelId
	 * @param labelName
	 * @return
	 */
	public BaseResponse updateLabel(int labelId, String labelName)
	{
		BaseResponse out = new BaseResponse();
		LiteratureDownLabel data = new LiteratureDownLabel();
		data.setId(labelId);
		data.setLabelname(labelName);
		try
		{
			literatureDownLabelMapper.updateByPrimaryKeySelective(data);
		}
		catch(Exception e)
		{
			logger.warn("update comp download label error, label name: {} is repeat!!!", labelName);
			out.setStatu(false);
			out.setMsg("updateLabel fail, labelName is repeat!!!");
			return out;
		}
		out.setStatu(true);
		out.setMsg("updateLabel succ.");
		return out;
	}

	/**
	 * 查询用户下所有标签
	 * @param userId
	 * @return
	 */
	public BaseResponse queryLabels(String userId)
	{
		BaseResponse out = new BaseResponse();
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userid", userId);
		List<LiteratureDownLabel> data = literatureDownLabelMapper.selectByUserId(para);
		para.clear();
		para.put("data", data);
		out.setStatu(true);
		out.setData(para);
		out.setMsg("queryLabels succ.");
		return out;
	}

	/**
	 * 插入文献下载详情
	 * @param data
	 * @return
	 */
	public BaseResponse insertDetails(List<LiteratureDownDetail> data)
	{
		BaseResponse out = new BaseResponse();
		if(null != data)
		{
			for(LiteratureDownDetail record : data)
			{
				try
				{
					literatureDownDetailMapper.insertSelective(record);
				}
				catch(Exception e)
				{
					// 不走事务，忽略重复的文献添加到同个文献标签下
					logger.warn("download labelid: {}, literatureid:{} is not unique!!!", record.getLabelid(), record.getLiteratureid());
				}
			}
			
		}
		out.setStatu(true);
		out.setMsg("insertDetails succ.");
		return out;
	}

	/**
	 * 删除文献下载详情
	 * @param data
	 * @return
	 */
	public BaseResponse deleteDetails(List<LiteratureDownDetail> data)
	{
		BaseResponse out = new BaseResponse();
		Map<String, Object> para = new HashMap<String, Object>();
		if(null != data)
		{
			for(LiteratureDownDetail one : data)
			{
				para.put("labelid", one.getLabelid());
				para.put("literatureid", one.getLiteratureid());
				literatureDownDetailMapper.deleteByLabelId(para);
			}
		}
		out.setStatu(true);
		out.setMsg("deleteDetails succ.");
		return out;
	}

	/**
	 * 根据标签id查询其下所有文献下载详情
	 * @param labelid
	 * @return
	 */
	public BaseResponse queryDetails(int labelid)
	{
		BaseResponse out = new BaseResponse();

		// 查询数据
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("labelid", labelid);
		List<LiteratureDownDetail> data = literatureDownDetailMapper.selectByLabelId(para);
		if(null != data)
		{
			String indexName = null;
			List<Map<String,Object>> result = null;
			for(LiteratureDownDetail one : data)
			{
					indexName = one.getIndexname();
					if(null != indexName)
					{
						result = searchESIndexService.searchInfoFromIndexById(indexName, one.getLiteratureid());
						if(null != result && result.size() > 0)
						{
							one.setJsonbody(JSON.toJSONString(result.get(0)));
						}
					}
			}
		}
		out.setStatu(true);
		para.put("data", data);
		out.setData(para);
		out.setMsg("queryDetails succ.");
		return out;
	}

}

