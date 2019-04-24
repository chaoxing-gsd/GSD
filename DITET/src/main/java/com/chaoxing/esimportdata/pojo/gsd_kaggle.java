package com.chaoxing.esimportdata.pojo;
/**
 * 对应Kaggle数据集  gsd_kaggle
 * @author winsl
 *
 */
public class gsd_kaggle {

	private String basic_type;	
	
	private String basic_creator;	
	
	private String basic_publisher;	
	
	private String basic_title_url;	
	
	private Integer viewcount;	
	
	private Integer downloadcount;	
	
	private String basic_date_time;	
	
	private Long datasetsize;	
	
	private String basic_title;	
	
	private String basic_cover_url;

	public Integer getViewcount() {
		return viewcount;
	}

	public void setViewcount(Integer viewcount) {
		this.viewcount = viewcount;
	}

	public Integer getDownloadcount() {
		return downloadcount;
	}

	public void setDownloadcount(Integer downloadcount) {
		this.downloadcount = downloadcount;
	}

	public Long getDatasetsize() {
		return datasetsize;
	}

	public void setDatasetsize(Long datasetsize) {
		this.datasetsize = datasetsize;
	}

	public String getBasic_type() {
		return basic_type;
	}

	public void setBasic_type(String basic_type) {
		this.basic_type = basic_type;
	}

	public String getBasic_creator() {
		return basic_creator;
	}

	public void setBasic_creator(String basic_creator) {
		this.basic_creator = basic_creator;
	}

	public String getBasic_publisher() {
		return basic_publisher;
	}

	public void setBasic_publisher(String basic_publisher) {
		this.basic_publisher = basic_publisher;
	}

	public String getBasic_title_url() {
		return basic_title_url;
	}

	public void setBasic_title_url(String basic_title_url) {
		this.basic_title_url = basic_title_url;
	}

	public String getBasic_date_time() {
		return basic_date_time;
	}

	public void setBasic_date_time(String basic_date_time) {
		this.basic_date_time = basic_date_time;
	}

	public String getBasic_title() {
		return basic_title;
	}

	public void setBasic_title(String basic_title) {
		this.basic_title = basic_title;
	}

	public String getBasic_cover_url() {
		return basic_cover_url;
	}

	public void setBasic_cover_url(String basic_cover_url) {
		this.basic_cover_url = basic_cover_url;
	}
	
}
