package com.chaoxing.gsd.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.chaoxing.gsd.modules.entity.UserFileDetail;
import com.chaoxing.gsd.modules.entity.UserFileMain;
import com.chaoxing.gsd.modules.service.ResourcePoolService;
import com.chaoxing.gsd.utils.FileTypeUtil;
import com.chaoxing.gsd.web.res.BaseResponse;

/**
 * 资源池处理
 * 
 * @author winsl
 *
 */
@Controller
@RequestMapping("/gsd")
public class ResourcePoolController {

	@Autowired
	private ResourcePoolService resourcePoolService;

	/**
	 * 符合查询接口
	 * 
	 * @param userid
	 *            用户id
	 * @param type
	 *            资源类型
	 * @param filename
	 *            资源名称
	 * @param typedatetime
	 *            创建时间 0 升序 1倒叙
	 * @param typefilesize
	 *            文件大小 0 升序 1倒叙
	 * @param index
	 *            开始下标
	 * @param limit
	 *            每页数目
	 * @return
	 */
	@GET
	@RequestMapping("/compoundQuery")
	@ResponseBody
	public BaseResponse compoundQuery(@RequestParam(value = "userid", required = true) String userid,
			@RequestParam(value = "type", required = false) String type,
			@RequestParam(value = "filename", required = false) String filename,
			@RequestParam(value = "filenamesort", required = false) Integer filenamesort,
			@RequestParam(value = "typedatetime", required = false) Integer typedatetime,
			@RequestParam(value = "typefilesize", required = false) Integer typefilesize,
			@RequestParam(value = "index", required = true) Integer index,
			@RequestParam(value = "limit", required = true) Integer limit) {
		String file = ascOrDesc(filenamesort), time = ascOrDesc(typedatetime), size = ascOrDesc(typefilesize);

		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userid", userid);
		para.put("type", type);

		para.put("filenamesort", filenamesort);
		para.put("filename", filename);

		para.put("index", index);
		para.put("limit", limit);

		if (filenamesort != null || typedatetime != null || typefilesize != null) {
			para.put("orderis", "true");
		}

		String ordermessage = "";
		if (filenamesort != null) {
			ordermessage = ordermessage.concat(" f.filename ").concat(file).concat(" , ");
		}
		if (typedatetime != null) {
			ordermessage = ordermessage.concat(" f.createtime ").concat(time).concat(" , ");
		}
		if (typefilesize != null) {
			ordermessage = ordermessage.concat(" f.filesize ").concat(size).concat(" , ");
		}

		// 去除最后的[, ]
		if (ordermessage.length() > 0) {
			ordermessage = ordermessage.substring(0, ordermessage.length() - 2);
			para.put("ordermessage", ordermessage);
		}

		BaseResponse rsp = resourcePoolService.compoundQuery(para);
		return rsp;
	}

	/**
	 * 通过值判断是升序还是降序
	 * 
	 * @param num
	 *            0 升序 1倒叙
	 * @return
	 */
	private String ascOrDesc(Integer num) {
		if (null != num) {
			if (0 == num) {
				return "asc";
			} else {
				return "desc";
			}
		}
		return null;
	}

	/**
	 * 通过文件名分页查询用户下 据名称模糊匹配的所有文件
	 * 
	 * @param userid
	 *            用户id
	 * @param filename
	 *            匹配名称
	 * @param index
	 *            开始下标
	 * @param limit
	 *            分页限制查询量
	 * @return
	 */
	@GET
	@RequestMapping("/getfilesbyname")
	@ResponseBody
	public BaseResponse getFilesByName(@RequestParam(value = "userid", required = true) String userid,
			@RequestParam(value = "filename", required = true) String filename,
			@RequestParam(value = "index", required = true) Integer index,
			@RequestParam(value = "limit", required = true) Integer limit) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userid", userid);
		para.put("filename", filename);
		para.put("index", index);
		para.put("limit", limit);
		BaseResponse rsp = resourcePoolService.getFilesByName(para);
		return rsp;
	}

	/**
	 * 根据文件id删除关联关系
	 * 
	 * @param fileids
	 * @return
	 */
	@DELETE
	@RequestMapping("/deleteFilesByIds")
	@ResponseBody
	public BaseResponse deleteFilesByIds(@RequestBody String req) {
		BaseResponse rsp = null;
		JSONObject json = JSON.parseObject(req);
		if (null == req || null == json) {
			rsp = new BaseResponse();
			rsp.setStatu(false);
			rsp.setMsg("deleteFilesByIds fail, parameter error.");
			return rsp;
		}
		List<Integer> fileids = json.getJSONArray("fileids").toJavaList(Integer.class);
		String userid = json.getString("userid");
		try {
			rsp = resourcePoolService.deleteFilesByIds(fileids, userid);
		} catch (Exception e) {
			rsp = new BaseResponse();
			rsp.setStatu(false);
			rsp.setMsg("deleteFilesByIds fail.");
		}
		return rsp;
	}

	/**
	 * 根据文件id修改文件名
	 * 
	 * @param fileids
	 * @return
	 */
	@PUT
	@RequestMapping("/updateFileNameById")
	@ResponseBody
	public BaseResponse updateFileNameById(@RequestParam(value = "fileid", required = true) Integer fileid,
			@RequestParam(value = "filenewname", required = false) String filenewname,
			@RequestParam(value = "filenewurl", required = false) String filenewurl,
			@RequestParam(value = "filenewsize", required = false) Long filenewsize,
			@RequestParam(value = "newobjectid", required = false) String newobjectid,
			@RequestParam(value = "newfilefrom", required = false) String newfilefrom) {
		UserFileDetail para = new UserFileDetail();
		para.setFileid(fileid);
		para.setFilename(filenewname);
		para.setFilefrom(newfilefrom);
		para.setFilesize(filenewsize);
		para.setFileurl(filenewurl);
		para.setObjectid(newobjectid);
		BaseResponse rsp = null;
		try {
			rsp = resourcePoolService.updateFileNameById(para);
		} catch (Exception e) {
			rsp = new BaseResponse();
			rsp.setStatu(false);
			rsp.setMsg("updateFileNameById fail.");
		}
		return rsp;
	}

	/**
	 * 通过文件类型分页查询某类资源
	 * 
	 * @param userid
	 *            用户id
	 * @param type
	 *            类型
	 * @param index
	 *            开始下标
	 * @param limit
	 *            分页限制查询量
	 * @return
	 */
	@GET
	@RequestMapping("/getfilesbytype")
	@ResponseBody
	public BaseResponse getFilesByType(@RequestParam(value = "userid", required = true) String userid,
			@RequestParam(value = "type", required = true) String type,
			@RequestParam(value = "index", required = true) Integer index,
			@RequestParam(value = "limit", required = true) Integer limit) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userid", userid);
		para.put("type", type);
		para.put("index", index);
		para.put("limit", limit);
		BaseResponse rsp = resourcePoolService.getFilesByType(para);
		return rsp;
	}

	/**
	 * 分页查询用户最近上传文件
	 * 
	 * @param userid
	 * @param type
	 *            类型 0表示查最近创建文件 1表示查询最近编辑文件
	 * @param index
	 * @param limit
	 * @return
	 */
	@GET
	@RequestMapping("/getfilesoflatest")
	@ResponseBody
	public BaseResponse getFilesOfLatest(@RequestParam(value = "userid", required = true) String userid,
			@RequestParam(value = "type", required = true) String type,
			@RequestParam(value = "index", required = true) Integer index,
			@RequestParam(value = "limit", required = true) Integer limit) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userid", userid);
		para.put("type", type);
		para.put("index", index);
		para.put("limit", limit);
		BaseResponse rsp = resourcePoolService.getFilesOfLatest(para);
		return rsp;
	}

	/**
	 * 资源池数据录入
	 * 
	 * @param userid
	 *            用户id
	 * @param filetype
	 *            文件类型（大类）1、文档 2、图片 3、视频 4、音频
	 * @param filename
	 *            文件名称
	 * @param fileurl
	 *            文件资源路径
	 * @param objectid
	 *            文件objectid
	 * @param filefrom
	 *            文件来源 1、中心云存储
	 * @return
	 */
	@POST
	@RequestMapping("/insertPoolData")
	@ResponseBody
	public BaseResponse insertPoolData(@RequestParam(value = "userid", required = true) String userid,
			@RequestParam(value = "filetype", required = true) String filetype,
			@RequestParam(value = "filename", required = true) String filename,
			@RequestParam(value = "fileurl", required = true) String fileurl,
			@RequestParam(value = "filesize", required = true) Long filesize,
			@RequestParam(value = "objectid", required = false) String objectid,
			@RequestParam(value = "filefrom", required = true) String filefrom) {
		UserFileDetail para = new UserFileDetail();
		para.setFiletype(filetype);
		para.setFilename(filename);
		para.setFileurl(fileurl);
		para.setFilesize(filesize);
		para.setObjectid(objectid);
		para.setFilefrom(filefrom);
		para.setFilesmallclass(FileTypeUtil.getSamllClass(filename));

		UserFileMain record = new UserFileMain();
		record.setUserid(userid);

		BaseResponse rsp = null;
		try {
			rsp = resourcePoolService.insertPoolData(para, record);
		} catch (Exception e) {
			rsp = new BaseResponse();
			rsp.setStatu(false);
			rsp.setMsg("insertPoolData fail.");
		}
		return rsp;
	}

	/**
	 * 关系批量处理
	 * 
	 * @param json
	 * @return
	 */
	@POST
	@RequestMapping("/insertPoolDataBatch")
	@ResponseBody
	public BaseResponse insertPoolDataBatch(@RequestBody String json) {
		BaseResponse rsp = null;
		List<UserFileDetail> allData = JSON.parseArray(json, UserFileDetail.class);
		String userId = allData.get(0).getUserid();
		if (null != allData && allData.size() > 0 && userId != null) {
			UserFileMain record = new UserFileMain();
			record.setUserid(userId);
			rsp = resourcePoolService.insertPoolDataBatch(allData, record);
		} else {
			rsp = new BaseResponse();
			rsp.setStatu(false);
			rsp.setMsg("insertPoolDataBatch fail, request body is empty.");
		}
		return rsp;
	}

	/**
	 * 根据文件大小正反序分页查询
	 * 
	 * @param userid
	 * @param index
	 * @param limit
	 * @param type
	 *            0 升序， 1降序
	 * @return
	 */
	@GET
	@RequestMapping("/selectByFileSize")
	@ResponseBody
	public BaseResponse selectByFileSize(@RequestParam(value = "userid", required = true) String userid,
			@RequestParam(value = "index", required = true) Integer index,
			@RequestParam(value = "limit", required = true) Integer limit,
			@RequestParam(value = "type", required = true) Integer type) {
		BaseResponse rsp = null;
		try {
			rsp = resourcePoolService.selectByFileSize(userid, index, limit, type);
		} catch (Exception e) {
			rsp = new BaseResponse();
			rsp.setStatu(false);
			rsp.setMsg("selectByFileSize fail.");
		}
		return rsp;
	}

}
