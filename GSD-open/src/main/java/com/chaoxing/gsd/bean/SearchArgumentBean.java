package com.chaoxing.gsd.bean;

/**
 * @author heyang
 * @date 2018/09/27 describe:搜索条件实体类
 */
public class SearchArgumentBean {

	private String field; // 检索字段
	
	private String beginYear; // 开始年
	
	private String endYear; // 结束年
	
	private String secondGroup; // 第二级分组
	
	private String thirdGroup; // 第三级分组

	public String getField() {
		return field;
	}

	public void setField(String field) {
		this.field = field;
	}

	public String getBeginYear() {
		return beginYear;
	}

	public void setBeginYear(String beginYear) {
		this.beginYear = beginYear;
	}

	public String getEndYear() {
		return endYear;
	}

	public void setEndYear(String endYear) {
		this.endYear = endYear;
	}

	public String getSecondGroup() {
		return secondGroup;
	}

	public void setSecondGroup(String secondGroup) {
		this.secondGroup = secondGroup;
	}

	public String getThirdGroup() {
		return thirdGroup;
	}

	public void setThirdGroup(String thirdGroup) {
		this.thirdGroup = thirdGroup;
	}
}
