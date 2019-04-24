package com.chaoxing.gsd.web;

import javax.ws.rs.POST;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chaoxing.gsd.modules.service.LoginInAndOutService;
import com.chaoxing.gsd.web.res.BaseResponse;

/**
 * 登录，登出处理
 * 
 * @author winsl
 *
 */
@Controller
@RequestMapping("/gsd")
public class LoginInAndOutController {

	private static final Logger logger = LoggerFactory.getLogger(LoginInAndOutController.class);

	@Autowired
	private LoginInAndOutService loginInAndOutService;

	/**
	 * 登录验证
	 * @param username
	 * @param password
	 * @return
	 */
	@POST
	@RequestMapping("/login")
	@ResponseBody
	public BaseResponse login(@RequestParam(value = "username", required = true) String username,
			@RequestParam(value = "password", required = true) String password) {
		logger.info("user: {} is try to login.", username);
		BaseResponse rsp = null;
		if (null == password) {
			rsp = new BaseResponse();
			rsp.setStatu(false);
			rsp.setMsg("Password can't both empty!!!");
			return rsp;
		}
		rsp = loginInAndOutService.login(username, password);
		return rsp;
	}

	/**
	 * 注册账号
	 * @param username
	 * @param password
	 * @return
	 */
	@POST
	@RequestMapping("/register")
	@ResponseBody
	public BaseResponse register(@RequestParam(value = "username", required = true) String username,
			@RequestParam(value = "password", required = true) String password) {
		logger.info("user: {} is to register.", username);
		BaseResponse rsp = null;
		if (null == password) {
			rsp = new BaseResponse();
			rsp.setStatu(false);
			rsp.setMsg("Password can't both empty!!!");
			return rsp;
		}
		rsp = loginInAndOutService.register(username, password);
		return rsp;
	}
}
