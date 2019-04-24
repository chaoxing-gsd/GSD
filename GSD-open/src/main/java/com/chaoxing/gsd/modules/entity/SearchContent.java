package com.chaoxing.gsd.modules.entity;

import java.util.Date;

public class SearchContent {


    private String userid;
    private String content;
    private Date created;
    private String contentid;
    
    /** 表统计用字段**/
    private Integer num;
    
    /** 关键字搜索周增长率**/
    private String weekIncrease;

    public String getWeekIncrease() {
		return weekIncrease;
	}

	public void setWeekIncrease(String weekIncrease) {
		this.weekIncrease = weekIncrease;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public String getContentid() {
        return contentid;
    }

    public void setContentid(String contentid) {
        this.contentid = contentid;
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }
}
