package com.chaoxing.gsd.modules.entity;
/**
 * 对应表 export_literature_record_detail
 * @author winsl
 *
 */
public class ExportLiteratureRecordDetail {

	private String userid;
	
	private Long recordid;
	
	private String literatureid;

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

	public String getLiteratureid() {
		return literatureid;
	}

	public void setLiteratureid(String literatureid) {
		this.literatureid = literatureid;
	}

}
