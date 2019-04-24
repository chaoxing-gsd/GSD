package com.chaoxing.gsd.web;

import com.chaoxing.gsd.config.PropertiesConf;
import com.chaoxing.gsd.core.utils.DateUtil;
import com.chaoxing.gsd.core.utils.MailUtil;
import com.chaoxing.gsd.modules.entity.*;
import com.chaoxing.gsd.modules.service.RsService;
import com.chaoxing.gsd.utils.IPUtils;
import com.chaoxing.gsd.web.res.BaseRes;
import com.chaoxing.gsd.web.res.BaseResponse;
import com.github.pagehelper.PageInfo;
import com.github.pagehelper.util.StringUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import java.util.*;

/**
 * @author heyang
 * @date 2018/08/27 describe:用户搜索历史，浏览记录及用户设置操作。
 */
@Controller
@RequestMapping("/gsd")
public class RsController {
	private static Logger logger = LoggerFactory.getLogger(RsController.class);

	@Autowired
	private RsService rsService;

	/**
	 * 用户删除搜索及浏览记录
	 * 
	 * @param userid
	 * @param searchcontent
	 * @param datetimetype
	 * @return
	 */
	@DELETE
	@RequestMapping("/deleteSearchHistory")
	@ResponseBody
	public BaseResponse deleteSearchHistory(@RequestParam(value = "userid", required = true) String userid,
			@RequestParam(value = "searchcontent", required = true) String searchcontent,
			@RequestParam(value = "datetimetype", required = true) String datetimetype) {
		BaseResponse rsp = null;
		if (!"0".equals(datetimetype) && !"1".equals(datetimetype) && !"2".equals(datetimetype)
				&& !"3".equals(datetimetype)) {
			rsp = new BaseResponse();
			rsp.setStatu(false);
			rsp.setMsg("datetime type must is : 0 or 1 or 2 or 3 or 4, not other values.");
			return rsp;
		}

		rsp = rsService.deleteSearchHistory(userid, searchcontent, datetimetype);
		return rsp;
	}

	/**
	 * 取用户最近创建的5个专业库查询标签及其下库信息
	 * 
	 * @param userId
	 *            用户id
	 * @param type
	 *            查询类型（1是最近创建的5个标签，2是最近使用的5个标签）
	 * @return
	 */
	@GET
	@RequestMapping("/getLatestFiveCategory")
	@ResponseBody
	public BaseResponse getLatestFiveCategory(@RequestParam(value = "userid", required = true) String userId,
			@RequestParam(value = "type", required = true) String type) {
		BaseResponse rsp = rsService.getLatestFiveCategory(userId, type);
		return rsp;
	}

	/**
	 * 录入库信息
	 * @param userId
	 * @param categoryName
	 * @return
	 */
	@POST
	@RequestMapping("/insertcategory")
	@ResponseBody
	public BaseResponse insertCategory(@RequestParam(value = "userid", required = true) String userId,
			@RequestParam(value = "categoryname", required = true) String categoryName) {
		BaseResponse rsp;
		try {
			rsp = rsService.insertCategory(userId, categoryName);
		} catch (Exception e) {
			logger.error("insertcategory error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * 修改库信息
	 * @param userId
	 * @param categoryid
	 * @param categoryname
	 * @return
	 */
	@POST
	@RequestMapping("/renamecategory")
	@ResponseBody
	public BaseResponse reNameCategory(@RequestParam(value = "userid", required = true) String userId,
			@RequestParam(value = "categoryid", required = true) String categoryid,
			@RequestParam(value = "categoryname", required = true) String categoryname) {
		BaseResponse rsp;
		try {
			rsp = rsService.reNameCategory(userId, categoryid, categoryname);
		} catch (Exception e) {
			logger.error("renamecategory error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;

	}

	/**
	 * 删除库信息
	 * @param userId
	 * @param categoryid
	 * @return
	 */
	@PostMapping("/delcategory")
	@ResponseBody
	public BaseResponse delCategory(@RequestParam(value = "userid", required = true) String userId,
			@RequestParam(value = "categoryid", required = true) String categoryid) {
		BaseResponse rsp = new BaseResponse();
		try {
			rsService.delCategory(userId, categoryid);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("delcategory error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * 查询用户自定义搜索标签信息
	 * @param userid
	 * @return
	 */
	@GET
	@RequestMapping("/getdefinedcategory")
	@ResponseBody
	public BaseResponse getCategoryByUserid(String userid) {
		BaseResponse rsp = new BaseResponse();
		try {
			List<DefinedCategory> list = rsService.getCategoryByUserid(userid);
			if (list.size() == 0) {
				rsp.setMsg("该用户没有自定义类");
			}
			rsp.setData(list);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("getdefinedcategory error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * 查询所有默认库(参数 无)
	 * @return
	 */
	@GET
	@RequestMapping("/getalldefaultlib")
	@ResponseBody
	public BaseResponse getLib() {
		BaseResponse rsp = new BaseResponse();
		try {
			HashMap<String, Object> map = rsService.getLib();
			rsp.setData(map);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("getalldefaultlib error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * 保存用户点击的自定义库和默认库（参数String userid,String categoryid1,String categoryid2）
	 * @param gsd
	 * @return
	 */
	@PostMapping("/insertgsd")
	@ResponseBody
	public BaseResponse insertGsd(Gsd gsd) {
		BaseResponse rsp;
		try {
			rsp = rsService.insertGsd(gsd);
		} catch (Exception e) {
			logger.error("insertgsd error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * 根据用户自定义库查询绑定的所有默认库（参数String userid,String categoryid1）
	 * @param gsd
	 * @return
	 */
	@PostMapping("/getgsdbydefinedcategory")
	@ResponseBody
	public BaseResponse getGsd(Gsd gsd) {
		BaseResponse rsp = new BaseResponse();
		try {
			List<String> list = rsService.getCategoryid2(gsd);
			rsp.setData(list);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("getgsdbydefinedcategory error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * 删除用户点击自定义库和默认库（参数String userid,String categoryid1,String categoryid2）
	 * @param gsd
	 * @return
	 */
	@PostMapping("/delgsd")
	@ResponseBody
	public BaseResponse delGsd(Gsd gsd) {
		BaseResponse rsp = new BaseResponse();
		try {
			rsService.delGsd(gsd);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("delgsd error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * 录入浏览记录操作
	 * @param request
	 * @param searchrecord
	 * @return
	 */
	@PostMapping("/insertsearchrecord")
	@ResponseBody
	public BaseResponse insertSearchRecord(HttpServletRequest request, SearchRecord searchrecord) {
		BaseResponse rsp = new BaseResponse();
		try {
			String ip = request.getHeader("x-forwarded-for");
			if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getHeader("Proxy-Client-IP");
			}
			if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getHeader("WL-Proxy-Client-IP");
			}
			if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getRemoteAddr();
			}
			try {
				Map<String, String> map = IPUtils.getPointAndAddress(ip);
				String address = map.get("address");
				String point = map.get("point");
				searchrecord.setAddress(address);
				searchrecord.setPoint(point);
			} catch (Exception e) {
				logger.error("根据该ip:" + ip + "获取gps位置失败{}", e);
			}
			searchrecord.setCreated(new Date());
			searchrecord.setIp(ip);
			rsService.insertSearchRecord(searchrecord);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("insertsearchrecord error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * 清空指定用户的所有浏览记录(参数String userid)
	 * @param userId
	 * @return
	 */
	@PostMapping("/delsearchrecordbyuserid")
	@ResponseBody
	public BaseResponse delSearchRecordByUserId(@RequestParam(value = "userid", required = true) String userId) {
		BaseResponse rsp = new BaseResponse();
		try {
			rsService.delSearchRecordByUserId(userId);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("delsearchrecordbyuserid error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * 清空用户指定的搜索内容相关的所有浏览记录(参数String userid,String content)
	 * @param userId
	 * @param content
	 * @return
	 */
	@PostMapping("/delsearchrecordbycontent")
	@ResponseBody
	public BaseResponse delSearchRecordByContent(@RequestParam(value = "userid", required = true) String userId,
			@RequestParam(value = "content", required = true) String content) {
		BaseResponse rsp = new BaseResponse();
		try {
			rsService.delSearchRecordByContent(userId, content);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("delsearchrecordbycontent error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * @author heyang
	 * @param ${userid}
	 *            用户id
	 * @param ${content}
	 *            搜索内容 describe: 查询浏览记录分时间段展示（分析功能）
	 */
	@PostMapping("/getsearchrecordbycontent")
	@ResponseBody
	public BaseResponse getsearchrecordByContent(@RequestParam(value = "userid", required = true) String userId,
			@RequestParam(value = "content", required = true) String content) {
		BaseResponse rsp = new BaseResponse();
		try {
			Map<String, Object> result = rsService.getsearchrecordByContent(userId, content);
			rsp.setData(result);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("getsearchrecordbycontent error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * @author heyang describe: 查找gps坐标
	 */
	@PostMapping("/getgpsmessage")
	@ResponseBody
	public BaseResponse getGPSMessage() {
		BaseResponse rsp = new BaseResponse();
		try {
			List<?> result = rsService.getGPSMessage();
			rsp.setData(result);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("getgpsmessage error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * @author heyang
	 * @param ${userid}
	 *            describe: 用户打开保存浏览记录功能
	 */
	@PostMapping("/opensearchrecord")
	@ResponseBody
	public BaseResponse openSearch(@RequestParam(value = "userid", required = true) String userId) {
		BaseResponse rsp = new BaseResponse();
		try {
			rsService.openSearch(userId);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("opensearchrecord error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * @author heyang
	 * @param ${userid}
	 *            describe: 用户关闭保存浏览记录功能
	 */
	@PostMapping("/closesearchrecord")
	@ResponseBody
	public BaseResponse closeSearch(@RequestParam(value = "userid", required = true) String userId) {
		BaseResponse rsp = new BaseResponse();
		try {
			rsService.closeSearch(userId);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("closesearchrecord error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * @author heyang
	 * @param ${userid}
	 *            describe: 用户打开分享网页功能
	 */
	@PostMapping("/opensharewebpage")
	@ResponseBody
	public BaseResponse openShareWebpage(@RequestParam(value = "userid", required = true) String userId) {
		BaseResponse rsp = new BaseResponse();
		try {
			rsService.openShareWebpage(userId);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("opensharewebpage error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * @author heyang
	 * @param ${userid}
	 *            describe: 用户关闭分享网页功能
	 */
	@PostMapping("/closesharewebpage")
	@ResponseBody
	public BaseResponse closeShareWebpage(@RequestParam(value = "userid", required = true) String userId) {
		BaseResponse rsp = new BaseResponse();
		try {
			rsService.closeShareWebpage(userId);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("closesharewebpage error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * @author heyang
	 * @param ${userid}
	 *            describe: 查询用户是否开启保存搜索记录功能和是否开启分享网页功能
	 */
	@PostMapping("/findusersetting")
	@ResponseBody
	public BaseResponse findUserSetting(@RequestParam(value = "userid", required = true) String userId) {
		BaseResponse rsp = new BaseResponse();
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			GsdUser2 gsdUser2 = rsService.findUserSetting(userId);
			map.put("remembersearchrecord", gsdUser2.isOpensearchrecord());
			map.put("sharewebpage", gsdUser2.isSharewebpage());
			rsp.setStatu(true);
			rsp.setData(map);
		} catch (Exception e) {
			logger.error("findusersetting error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * @author heyang
	 * @param ${userid}
	 * @param ${content}
	 *            搜索内容 describe: 保存用户搜索内容
	 */
	@PostMapping("/insertsearchcontent")
	@ResponseBody
	public BaseResponse insertSearchContent(@RequestParam(value = "userid", required = true) String userId,
			@RequestParam(value = "content", required = true) String content) {
		BaseResponse rsp = new BaseResponse();
		try {
			rsService.insertSearchContent(userId, content);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("insertsearchcontent error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * @author heyang
	 * @param ${userid}
	 *            describe: 查询用户搜索内容,按时间分类且同一时间段去重
	 */
	@PostMapping("/getsearchcontentbyuserId")
	@ResponseBody
	public BaseResponse getSearchContentByUserId(@RequestParam(value = "userid", required = true) String userId) {
		BaseResponse rsp = new BaseResponse();
		try {
			Map<String, Object> map = rsService.getSearchContentByUserId(userId);
			rsp.setData(map);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("getsearchcontentbyuserId error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * @author heyang
	 * @param ${userid}
	 * @param ${content}
	 *            搜索内容 describe: 查询用户是否搜索过该内容
	 */
	@PostMapping("/hascontent")
	@ResponseBody
	public boolean hasContent(@RequestParam(value = "userid", required = true) String userId,
			@RequestParam(value = "content", required = true) String content) {
		return rsService.hasContent(userId, content);
	}

	/**
	 * @author heyang
	 * @param ${userid}
	 *            describe: 删除用户所有搜索内容
	 */
	@PostMapping("/deluserallcontent")
	@ResponseBody
	public BaseResponse delAllContent(@RequestParam(value = "userid", required = true) String userId) {
		BaseResponse rsp = new BaseResponse();
		try {
			rsService.delAllContent(userId);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("deluserallcontent error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * @author heyang
	 * @param ${userid}
	 * @param ${content}
	 *            搜索内容
	 * @param ${contentid}
	 *            搜索内容id describe: 删除用户指定的搜索内容
	 */
	@PostMapping("/delusercontent")
	@ResponseBody
	public BaseResponse delContent(@RequestParam(value = "userid", required = true) String userId,
			@RequestParam(value = "content", required = true) String content,
			@RequestParam(value = "contentid", required = true) String contentid) {
		BaseResponse rsp = new BaseResponse();
		try {
			rsService.delContent(userId, content, contentid);
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("delusercontent error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * @author heyang
	 * @param ${name}
	 *            数据源名称
	 * @param ${domainname}
	 *            域名
	 * @param ${tel}
	 *            电话
	 * @param ${email}
	 *            邮箱
	 * @param ${wiki}
	 * @param ${message}
	 *            信息
	 * @param ${updatetype}
	 *            更新方式，目前全部输入手动
	 * @param ${userid}
	 * @param ${csvurl}
	 *            库文件路径 describe: 用户提交库（索引内文档）
	 */
	@PostMapping("/putindex")
	@ResponseBody
	public BaseResponse PutIndex(GsdIndex gsdIndex) {
		BaseResponse rsp = new BaseResponse();
		try {
			rsService.insertGsdindex(gsdIndex);
			rsp.setStatu(true);

			// 异步发送邮件给处理人员
			StringBuilder msg = new StringBuilder();
			msg.append("<b>数据源名称:   </b>").append(gsdIndex.getName()).append("<br><br>");
			msg.append("<b>数据源域名:  </b>").append(gsdIndex.getDomainname()).append("<br><br>");
			msg.append("<b>联系电话:  </b>").append(StringUtil.isEmpty(gsdIndex.getTel()) ? "无" : gsdIndex.getTel())
					.append("<br><br>");
			msg.append("<b>邮箱:  </b>").append(gsdIndex.getEmail()).append("<br><br>");
			msg.append("<b>数据源Wiki:  </b>").append(StringUtil.isEmpty(gsdIndex.getWiki()) ? "无" : gsdIndex.getWiki())
					.append("<br><br>");
			msg.append("<b>文件地址:  </b>").append(gsdIndex.getCsvurl()).append("<br><br>");
			msg.append("<b>发送时间:  </b>").append(DateUtil.dateToString(new Date(), "yyyy-MM-dd HH:mm:ss"))
					.append("<br><br>");
			msg.append("<b>其他信息:  </b>").append(StringUtil.isEmpty(gsdIndex.getMessage()) ? "无" : gsdIndex.getMessage())
					.append("<br>");
			new Thread(new Runnable() {

				@Override
				public void run() {
					// TODO Auto-generated method stub
					MailUtil.sendEmail(PropertiesConf.properties, msg.toString(), "text/html;charset=gb2312", "新数据源通知",
							"gsd@chaoxing.com", PropertiesConf.GSD_INQUIRY_MAIL, PropertiesConf.CC_MAIL_TO);
				}

			}).start();
		} catch (Exception e) {
			logger.error("putindex error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

	/**
	 * @author heyang
	 * @param ${userid}
	 *            传查找该用户提交的库，不传则查找所有用户提交的库
	 * @param ${pageNum}
	 *            第几页 从1开始
	 * @param ${pageSize}
	 *            每页个数 describe: 查找用户提交过的库
	 */
	@PostMapping("/getindex")
	@ResponseBody
	public BaseResponse SelectIndex(@RequestParam(value = "userid", required = false) String userId,
			@RequestParam(value = "pageNum") Integer pageNum, @RequestParam(value = "pageSize") Integer pageSize) {
		BaseResponse rsp = new BaseResponse();
		try {
			if (null != userId && !"".equals(userId)) {
				PageInfo<GsdIndex> result = rsService.SelectUserIndex(userId, pageNum, pageSize);
				rsp.setData(result);
			} else {
				PageInfo<GsdIndex> result = rsService.SelectAllIndex(pageNum, pageSize);
				rsp.setData(result);
			}
			rsp.setStatu(true);
		} catch (Exception e) {
			logger.error("getindex error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;
	}

}
