package com.chaoxing.gsd.modules.entity;

import java.util.Date;

/**
 * 用户绑定邮箱pojo
 * @author winsl
 *
 */
public class UserMails {
	
	private String userid;
	
	private String mail;
	
	private Date createtime;

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

}
