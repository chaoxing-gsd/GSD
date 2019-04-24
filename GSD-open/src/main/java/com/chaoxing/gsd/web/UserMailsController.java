package com.chaoxing.gsd.web;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chaoxing.gsd.web.res.BaseResponse;
import com.chaoxing.gsd.modules.entity.UserLeavingMessage;
import com.chaoxing.gsd.modules.entity.UserMails;
import com.chaoxing.gsd.modules.service.LeavingMessageService;
import com.chaoxing.gsd.modules.service.UserMailsService;

/**
 * 用户绑定的注册邮箱，用户留言管理
 * 
 * @author winsl
 *
 */
@Controller
@RequestMapping("/gsd")
public class UserMailsController {

	@Autowired
	UserMailsService userMailsService;

	@Autowired
	LeavingMessageService leavingMessageService;

	/**
	 * 用户反馈留言
	 * 
	 * @param message
	 *            留言内容
	 * @return
	 */
	@POST
	@RequestMapping("/addLeavingMessage")
	@ResponseBody
	public BaseResponse addLeavingMessage(@RequestBody UserLeavingMessage message) {
		BaseResponse rsp = leavingMessageService.addLeavingMessage(message);
		return rsp;
	}

	/**
	 * 用户绑定邮箱
	 * 
	 * @param userid
	 * @param mail
	 * @return
	 */
	@POST
	@RequestMapping("/userBindMail")
	@ResponseBody
	public BaseResponse userBindMail(@RequestParam(value = "userid", required = true) String userid,
			@RequestParam(value = "mail", required = true) String mail) {
		UserMails bean = new UserMails();
		bean.setUserid(userid);
		bean.setMail(mail);
		BaseResponse rsp = userMailsService.bindUserMail(bean);
		return rsp;
	}

	/**
	 * 查询用户绑定的邮箱
	 * 
	 * @param userid
	 * @return
	 */
	@GET
	@RequestMapping("/getBindMail")
	@ResponseBody
	public BaseResponse getBindMail(@RequestParam(value = "userid", required = true) String userid) {
		BaseResponse rsp = userMailsService.queryUserBindMails(userid);
		return rsp;
	}

	/**
	 * 用户删除绑定的邮箱
	 * 
	 * @param userid
	 * @return
	 */
	@DELETE
	@RequestMapping("/deleteBindMail")
	@ResponseBody
	public BaseResponse deleteBindMail(@RequestParam(value = "userid", required = true) String userid,
			@RequestParam(value = "mail", required = true) String mail) {
		UserMails bean = new UserMails();
		bean.setUserid(userid);
		bean.setMail(mail);
		BaseResponse rsp = userMailsService.deleteBindMail(bean);
		return rsp;
	}
}
