package com.chaoxing.gsd.modules.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chaoxing.gsd.modules.entity.UserFileDetail;
import com.chaoxing.gsd.modules.entity.UserFileMain;
import com.chaoxing.gsd.modules.mapper.UserFileDetailMapper;
import com.chaoxing.gsd.modules.mapper.UserFileMainMapper;
import com.chaoxing.gsd.utils.FileTypeUtil;
import com.chaoxing.gsd.web.res.BaseResponse;

@Service
public class ResourcePoolService {

	private static Logger logger = LoggerFactory.getLogger(ResourcePoolService.class);

	@Autowired
	private UserFileMainMapper userFileMainMapper;

	@Autowired
	private UserFileDetailMapper userFileDetailMapper;
	
	@Transactional
	public BaseResponse deleteFilesByIds(List<Integer> fileids, String userid) throws RuntimeException
	{
		logger.info("ResourcePoolService deleteFilesByIds.");
		
		UserFileMain record = null;
		
		for(Integer one : fileids)
		{
			// 先删除详情
			
			userFileDetailMapper.deleteByPrimaryKey(one);
			
			// 再删除主表
			record = new UserFileMain();
			record.setUserid(userid);
			record.setFileid(one);
			userFileMainMapper.deleteByPrimaryKey(record);
		}
		BaseResponse out = new BaseResponse();
		out.setStatu(true);
		out.setMsg("deleteFilesByIds succ.");
		return out;
	}
	
	@Transactional
	public BaseResponse updateFileNameById(UserFileDetail para) throws RuntimeException
	{
		logger.info("ResourcePoolService updateFileNameById.");
		BaseResponse out = new BaseResponse();
		
		// 如果是修改文件名，则先判断新名称是否重名，重名则需要给出推荐名称入库并返回
		int num = userFileDetailMapper.checkFileName(para);
		Map<String, String> outPara = null;
		if(num != 0)
		{
			String rename = recommendedFileName(para.getFilename());
			
			// 推荐名称入库
			para.setFilename(rename);
			outPara = new HashMap<String, String>();
			outPara.put("recommendedname", rename);
			out.setData(outPara);
		}
		
		userFileDetailMapper.updateByPrimaryKeySelective(para);
		out.setStatu(true);
		out.setMsg("updateFileNameById succ.");
		return out;
	}
	

	/**
	 * 通过文件名分页查询用户下
	 * 据名称模糊匹配的所有文件
	 * @param para
	 * @return
	 */
	public BaseResponse getFilesByName(Map<String, Object> para)
	{
		logger.info("ResourcePoolService getFilesByName.");
		Map<String, Object> data = new HashMap<String, Object>();
		UserFileDetail temp = userFileDetailMapper.getFilesByNameTotal(para);
		BaseResponse out = new BaseResponse();
		out.setStatu(true);
		out.setMsg("getFilesByName succ.");
		data.put("total", temp == null ? 0 : temp.getFileid());
		data.put("data", userFileDetailMapper.getFilesByName(para));
		out.setData(data);
		return out;
	}
	
	/**
	 * 多条件复合查询
	 * @param para
	 * @return
	 */
	public BaseResponse compoundQuery(Map<String, Object> para)
	{
		logger.info("ResourcePoolService compoundQuery.");
		Map<String, Object> data = new HashMap<String, Object>();
		UserFileDetail temp = userFileDetailMapper.compoundQueryTotal(para);
		BaseResponse out = new BaseResponse();
		out.setStatu(true);
		out.setMsg("compoundQuery succ.");
		data.put("total", temp == null ? 0 : temp.getFileid());
		data.put("data", userFileDetailMapper.compoundQuery(para));
		out.setData(data);
		return out;
	}

	/**
	 * 通过文件类型分页查询某类资源
	 * @param para
	 * @return
	 */
	public BaseResponse getFilesByType(Map<String, Object> para)
	{
		logger.info("ResourcePoolService getFilesByType.");
		Map<String, Object> data = new HashMap<String, Object>();
		UserFileDetail temp = userFileDetailMapper.getFilesByTypeTotal(para);
		BaseResponse out = new BaseResponse();
		out.setStatu(true);
		out.setMsg("getFilesByType succ.");
		data.put("total", temp == null ? 0 : temp.getFileid());
		data.put("data", userFileDetailMapper.getFilesByType(para));
		out.setData(data);
		return out;
	}

	/**
	 * 分页查询用户最近上传文件
	 * @param para
	 * @return
	 */
	public BaseResponse getFilesOfLatest(Map<String, Object> para)
	{
		logger.info("ResourcePoolService getFilesOfLatest.");
		Map<String, Object> data = new HashMap<String, Object>();
		UserFileDetail temp = userFileDetailMapper.getFilesOfLatestUpTotal(para);
		BaseResponse out = new BaseResponse();
		String type = (String) para.get("type");
		
		// 走查询资源创建时间方式
		if("0".equals(type))
		{
			out.setStatu(true);
			out.setMsg("getFilesOfLatest succ.");
			data.put("total", temp == null ? 0 : temp.getFileid());
			data.put("data", userFileDetailMapper.getFilesOfLatestUp(para));
		}
		// 走查询资源修改时间方式
		else if("1".equals(type))
		{
			out.setStatu(true);
			out.setMsg("getFilesOfLatest succ.");
			data.put("total", temp == null ? 0 : temp.getFileid());
			data.put("data", userFileDetailMapper.getFilesOfLatestMod(para));
		}
		else
		{
			out.setStatu(false);
			out.setMsg("getFilesOfLatest fail.");
			logger.warn("ResourcePoolService getFilesOfLatest type is must need.");
		}
		out.setData(data);
		return out;
	}
	
	/**
	 * 往资源池表中插入关联数据
	 * @param para
	 * @return
	 */
	@Transactional
	public BaseResponse insertPoolData(UserFileDetail para, UserFileMain record) throws RuntimeException 
	{
		logger.info("ResourcePoolService insertPoolData.");
		BaseResponse out = new BaseResponse();
		try
		{
			// 先查询是否文件重名，是则加时间戳返回推荐名称
			int num = userFileDetailMapper.checkFileName(para);
			Map<String, String> outPara = null;
			if(num != 0)
			{
				String rename = recommendedFileName(para.getFilename());
				
				// 推荐名称入库
				para.setFilename(rename);
				outPara = new HashMap<String, String>();
				outPara.put("recommendedname", rename);
				out.setData(outPara);
			}
			
			// 先往资源详情表中插入数据
			userFileDetailMapper.insertSelective(para);
			int fileId = para.getFileid();
			logger.info("fileId is:{}", fileId);

			// 再往资源用户关联表中插入关联关系
			record.setFileid(fileId);
			userFileMainMapper.insertSelective(record);
		}
		catch(Exception e)
		{
			logger.error("insertPoolData db exception: {}", e);
			throw new RuntimeException();
		}

		out.setStatu(true);
		out.setMsg("insertPoolData succ.");
		return out;
	}
	
	/**
	 * 给文件名添加时间戳去重
	 * @param fileName
	 * @return
	 */
	private String recommendedFileName(String fileName)
	{
		if(fileName != null)
		{
			if(fileName.contains("."))
			{
				int index = fileName.lastIndexOf(".");
				return fileName.substring(0, index).concat("_").concat(String.valueOf(System.currentTimeMillis())).concat(fileName.substring(index));
			}
			else
			{
				return fileName.concat("_").concat(String.valueOf(System.currentTimeMillis()));
			}
		}
		return fileName;
	}
	
	
	/**
	 * 批量录入关系
	 * @param para
	 * @param record
	 * @return
	 * @throws RuntimeException
	 */
	@SuppressWarnings("unchecked")
	@Transactional
	public BaseResponse insertPoolDataBatch(List<UserFileDetail> para, UserFileMain record)
	{
		logger.info("ResourcePoolService insertPoolDataBatch.");
		BaseResponse out = new BaseResponse();
		List<String> errorFileList = new ArrayList<String>();
		List<String> renameList = new ArrayList<String>();
		Map<String, Object> outPara = new HashMap<String, Object>();
		outPara.put("renamelist", renameList);
		outPara.put("errorfilelist", errorFileList);
		if(null != para && para.size() > 0)
		{
			BaseResponse temp = null;
			Map<String, String> mapTemp = null;
			for(UserFileDetail one : para)
			{
				one.setFilesmallclass(FileTypeUtil.getSamllClass(one.getFilename()));
				try
				{
					temp = insertPoolData(one, record);
					if(temp.getData() != null)
					{
						mapTemp = (Map<String, String>) temp.getData();
						renameList.add(mapTemp.get("recommendedname"));
					}
					else
					{
						renameList.add(one.getFilename());
					}
				}
				catch(Exception e)
				{
					logger.error("insertPoolDataBatch db exception: {}, file name is: {}", e, one.getFilename());
					errorFileList.add(one.getFilename());
				}
			}
		}

		if(errorFileList.size() == 0)
		{
			out.setStatu(true);
			out.setData(outPara);
			out.setMsg("insertPoolDataBatch succ.");
		}
		else
		{
			out.setStatu(false);
			out.setData(outPara);
			out.setMsg("insertPoolDataBatch fail, filename to see data filed.");
		}
		return out;
	}
	
	/**
	 * 根据文件大小正反序分页查询
	 * @param userid
	 * @param index
	 * @param limit
	 * @param desc 0 升序， 1降序
	 * @return
	 * @throws RuntimeException
	 */
	public BaseResponse selectByFileSize(String userid, int index, int limit, int desc) throws RuntimeException 
	{
		logger.info("ResourcePoolService selectByFileSize.");
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userid", userid);
		para.put("index", index);
		para.put("limit", limit);
		para.put("sizes", desc == 0 ? "asc" : "desc");
		BaseResponse out = new BaseResponse();
		try
		{
			// 查询数据
			List<UserFileDetail> data = userFileDetailMapper.selectByFileSize(para);

			// 查询总数
			UserFileDetail num = userFileDetailMapper.getFilesOfLatestUpTotal(para);
			int total = 0;
			if(null != num)
			{
				total = num.getFileid();
			}
			para.clear();
			para.put("total", total);
			para.put("data", data);
		}
		catch(Exception e)
		{
			logger.error("selectByFileSize db exception: {}", e);
			throw new RuntimeException();
		}

		out.setStatu(true);
		out.setMsg("selectByFileSize succ.");
		out.setData(para);
		return out;
	}
}
