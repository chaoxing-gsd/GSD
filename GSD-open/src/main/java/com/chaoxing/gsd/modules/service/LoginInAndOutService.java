package com.chaoxing.gsd.modules.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chaoxing.gsd.core.utils.EhCacheUtils;
import com.chaoxing.gsd.core.utils.JwtUtils;
import com.chaoxing.gsd.modules.entity.Users;
import com.chaoxing.gsd.modules.entity.UsersExample;
import com.chaoxing.gsd.modules.mapper.UsersMapper;
import com.chaoxing.gsd.web.res.BaseResponse;
/**
 * 登录，登出服务
 * @author winsl
 *
 */
@Service
public class LoginInAndOutService {

	private static Logger logger = LoggerFactory.getLogger(LoginInAndOutService.class);
	
	@Autowired
	JwtUtils jwtUtils;
	
	@Autowired
	UsersMapper usersMapper;
	
	/** at过期时间是一天**/
	private static final int AT_EXPIRED_TIME = 24*60*60;
	
	/**
	 * 登录服务
	 * @param userName
	 * @param passWord
	 * @param verCode
	 * @return
	 */
	public BaseResponse login(String userName, String passWord)
	{
		logger.info("Enter into method login.");
		BaseResponse out = new BaseResponse();

		Map<String, Object> reqPara = new HashMap<String, Object>();

		String uid = null;

		String at = null;

		// TODO 需要实现简单的密码校验登录验证
		Users example = new Users();
		example.setName(userName);
		example.setPassword(passWord);
		
		List<Users> userlist = usersMapper.checkUserInfo(example);
		if(null != userlist && userlist.size() == 1)
		{
			Users temp = userlist.get(0);
			uid = String.valueOf(temp.getId());
			Object atTemp = EhCacheUtils.get(uid);
			if(null == atTemp)
			{
				at = jwtUtils.generateToken(uid);
				EhCacheUtils.put(uid, at, AT_EXPIRED_TIME);
				logger.info("user: {} get at from ehcache is empty.", userName);
			}
			else
			{
				at = String.valueOf(atTemp);
			}
			logger.info("login succ, user: {} get at is: {}.", userName, at);
			reqPara.put("userid", uid);
			reqPara.put("token", at);
			reqPara.put("timeouthours", 24*30);
			reqPara.put("name", userName);
			reqPara.put("mail", temp.getEmail());
			out.setStatu(true);
			out.setData(reqPara);
			out.setMsg("login succ.");
		}
		else
		{
			logger.info("login fail, user: {}.", userName);
			out.setStatu(false);
			out.setMsg("login fail!!!");
		}
		return out;
	}
	
	/**
	 * 注册
	 * @param userName
	 * @param passWord
	 * @return
	 */
	public BaseResponse register(String userName, String passWord)
	{
		logger.info("Enter into method register.");
		BaseResponse out = new BaseResponse();

		Map<String, Object> reqPara = new HashMap<String, Object>();

		UsersExample example = new UsersExample();
		example.or().andNameEqualTo(userName);
		List<Users> userlist = usersMapper.selectByExample(example);
		
		// 用户名已经存在
		if(null != userlist && userlist.size() > 0)
		{
			logger.info("register fail, user name: {} is exist.", userName);
			out.setStatu(false);
			out.setMsg("register fail, username:" + userName + " is exist!!!");
		}
		else
		{
			// 不存在则开始注册
			Users user = new Users();
			user.setName(userName);
			user.setPassword(passWord);
			
			usersMapper.insertSelective(user);
			
			// 返回用户id
			reqPara.put("uid", user.getId());
			
			out.setStatu(true);
			out.setData(reqPara);
			out.setMsg("register succ.");
		}
		return out;
	}
}
