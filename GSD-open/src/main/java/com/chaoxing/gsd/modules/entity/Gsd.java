package com.chaoxing.gsd.modules.entity;

public class Gsd {
	
	private String userid;
	
    private String categoryid1;
    
    private String categoryid2;
    
    private Integer type;

    public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getCategoryid1() {
        return categoryid1;
    }

    public void setCategoryid1(String categoryid1) {
        this.categoryid1 = categoryid1;
    }

    public String getCategoryid2() {
        return categoryid2;
    }

    public void setCategoryid2(String categoryid2) {
        this.categoryid2 = categoryid2;
    }

}
