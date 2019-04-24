package com.chaoxing.gsd.modules.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chaoxing.gsd.modules.entity.UserMails;
import com.chaoxing.gsd.modules.mapper.UserMailsMapper;
import com.chaoxing.gsd.web.res.BaseResponse;

/**
 * 用户绑定邮箱服务
 * @author winsl
 *
 */
@Service
public class UserMailsService {
	
	private static Logger logger = LoggerFactory.getLogger(UserMailsService.class);

	@Autowired
	private UserMailsMapper userMailsMapper;

	/**
	 * 用户绑定邮箱
	 * @param bean
	 * @return
	 */
	public BaseResponse bindUserMail(UserMails bean)
	{
		BaseResponse resp = new BaseResponse();
		try
		{
			userMailsMapper.insertUserMail(bean);
		}
		catch(Exception e)
		{
			resp.setMsg("bind mail fail.");
			resp.setStatu(false);
			logger.error("Bind mail fail:{}", e);
			return resp;
		}
		resp.setStatu(true);
		resp.setMsg("bind mail succ.");
		return resp;
	}

	/**
	 * 查询用户绑定的邮箱
	 * @param userid
	 * @return
	 */
	public BaseResponse queryUserBindMails(String userid)
	{
		BaseResponse resp = new BaseResponse();
		List<UserMails> out = userMailsMapper.getUserMails(userid);
		resp.setStatu(true);
		resp.setMsg("query bind mail succ.");
		resp.setData(out);
		return resp;
	}
	
	/**
	 * 用户删除绑定的邮箱
	 * @param userid
	 * @return
	 */
	public BaseResponse deleteBindMail(UserMails bean)
	{
		BaseResponse resp = new BaseResponse();
		userMailsMapper.deleteMail(bean);
		resp.setStatu(true);
		resp.setMsg("delete bind mail succ.");
		return resp;
	}

	/**
	 * 通过绑定邮箱查询用户id
	 * @param mail
	 * @return 用户id
	 */
	public String queryUserByMails(String mail)
	{
		String out = null;
		UserMails bean = userMailsMapper.getUserByMail(mail);
		if(null != bean)
		{
			out = bean.getUserid();
		}
		return out;
	}
}
