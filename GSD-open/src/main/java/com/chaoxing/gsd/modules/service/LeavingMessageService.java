package com.chaoxing.gsd.modules.service;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.chaoxing.gsd.config.PropertiesConf;
import com.chaoxing.gsd.core.utils.DateUtil;
import com.chaoxing.gsd.core.utils.MailUtil;
import com.chaoxing.gsd.modules.entity.UserLeavingMessage;
import com.chaoxing.gsd.modules.mapper.UserLeavingMessageMapper;
import com.chaoxing.gsd.web.res.BaseResponse;

/**
 * 用户留言服务
 * @author winsl
 *
 */
@Service
public class LeavingMessageService {
	
	private static Logger logger = LoggerFactory.getLogger(LeavingMessageService.class);

	@Autowired
	private UserLeavingMessageMapper userLeavingMessageMapper;
	
	public BaseResponse addLeavingMessage(UserLeavingMessage message)
	{
		BaseResponse out = new BaseResponse();
		try
		{
			int num = userLeavingMessageMapper.insertSelective(message);
			
			// 入库后再异步发邮件给系统邮箱
			if(num == 1)
			{
				resetValue(message);
				StringBuilder msg = new StringBuilder("");
				msg.append("<b>用户:   </b>").append(message.getUsername()).append("<br><br>");
				msg.append("<b>留言类型:  </b>").append(message.getType()).append("<br><br>");
				msg.append("<b>留言级别:  </b>").append(message.getLevel()).append("<br><br>");
				msg.append("<b>留言来源:  </b>").append(message.getFromwhere()).append("<br><br>");
				msg.append("<b>留言时间:  </b>").append(DateUtil.dateToString(new Date(), "yyyy-MM-dd HH:mm:ss")).append("<br><br>");
				msg.append("<b>留言标题:  </b>").append(message.getTitle()).append("<br><br>");
				msg.append("<b>留言内容:  </b>").append(message.getMessage()).append("<br><br>");
				msg.append("<b>联系qq:  </b>").append(message.getQq()).append("<br><br>");
				msg.append("<b>联系Email:  </b>").append(message.getEmail()).append("<br><br>");
				
				new Thread(new Runnable()
	            {

					@Override
					public void run() {
						// TODO Auto-generated method stub
						MailUtil.sendEmail(PropertiesConf.properties, msg.toString(), "text/html;charset=gb2312", message.getTitle(), "gsd@chaoxing.com", PropertiesConf.GSD_INQUIRY_MAIL, PropertiesConf.CC_MAIL_TO);
					}
	            	
	            }).start();
				
				logger.debug("to send mail to gsd-inquiry@chaoxing.com. info is:{}", JSON.toJSONString(message));
			}
		}
		catch(Exception e)
		{
			logger.error("addLeavingMessage error:{}", e);
			out.setStatu(false);
			out.setMsg("add leaving message fail!!!");
			return out;
		}
		out.setStatu(true);
		out.setMsg("add leaving message succ.");
		return out;
	}
	
	/**
	 * bean对象值转换
	 * @param message
	 */
	private void resetValue(UserLeavingMessage message)
	{
		if(message.getType() != null)
		{
			switch(message.getType())
			{
			case "1":
				message.setType("意见建议");
				break;
			case "2":
				message.setType("问题反馈");
				break;
			case "3":
				message.setType("合作");
				break;
			case "4":
				message.setType("其它");
				break;
			}
		}
		
		if(message.getLevel() != null)
		{
			switch(message.getLevel())
			{
			case "1":
				message.setLevel("提示");
				break;
			case "2":
				message.setLevel("一般");
				break;
			case "3":
				message.setLevel("紧急");
				break;
			case "4":
				message.setLevel("严重");
				break;
			}
		}
		
		if(message.getFromwhere() != null)
		{
			switch(message.getFromwhere())
			{
			case "1":
				message.setFromwhere("gsd web");
				break;
			case "2":
				message.setFromwhere("gsd app");
				break;
		}
	}
	}
}
