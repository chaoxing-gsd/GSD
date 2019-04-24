package com.chaoxing.gsd.modules.entity;

import java.util.Date;

/**
 * 对应表 export_literature_record
 * @author winsl
 *
 */
public class ExportLiteratureRecord {

	private String userid;
	
	private Long recordid;
	
	private Date createtime;

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public Long getRecordid() {
		return recordid;
	}

	public void setRecordid(Long recordid) {
		this.recordid = recordid;
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
	
}
