package com.chaoxing.gsd.modules.entity;

public class GsdUser2 {
	private String userid;
	private String username;
	private boolean opensearchrecord;
	private boolean sharewebpage;

	public boolean isSharewebpage() {
		return sharewebpage;
	}

	public void setSharewebpage(boolean sharewebpage) {
		this.sharewebpage = sharewebpage;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public boolean isOpensearchrecord() {
		return opensearchrecord;
	}

	public void setOpensearchrecord(boolean opensearchrecord) {
		this.opensearchrecord = opensearchrecord;
	}
}
