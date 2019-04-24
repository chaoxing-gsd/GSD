package com.chaoxing.gsd.bean;

import java.util.Set;

/**
 * 文献对比展示设置结构体
 * @author winsl
 *
 */
public class CompareSetStrcut {

	/** 库字段在展示名同名情况下的集合**/
	private Set<String> filedid;
	
	/** 中文名**/
	private String filednamecn;
	
	/** 英文名**/
	private String filednameen;
	
	/** 字段占百分比**/
	private String cents;
	
	/** 顺序**/
	private int order;

	public String getCents() {
		return cents;
	}

	public void setCents(String cents) {
		this.cents = cents;
	}

	public Set<String> getFiledid() {
		return filedid;
	}

	public void setFiledid(Set<String> filedid) {
		this.filedid = filedid;
	}

	public String getFilednamecn() {
		return filednamecn;
	}

	public void setFilednamecn(String filednamecn) {
		this.filednamecn = filednamecn;
	}

	public String getFilednameen() {
		return filednameen;
	}

	public void setFilednameen(String filednameen) {
		this.filednameen = filednameen;
	}

	public int getOrder() {
		return order;
	}

	public void setOrder(int order) {
		this.order = order;
	}

}
