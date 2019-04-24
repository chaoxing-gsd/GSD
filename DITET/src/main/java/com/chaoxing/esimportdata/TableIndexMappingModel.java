package com.chaoxing.esimportdata;

import java.util.List;

/**
 * @Author: longrui
 * @Date: 2018/4/28 10:42
 */
public class TableIndexMappingModel {

	private String table_field_name;
	
	private String index_field_name;
	
	private String index_field_type;
	
	private String index;
	
	private String index_analyzer;
	
	private String fielddata;
	
	private List<TableIndexMappingModel> fieldList;

	public String getIndex() {
		return index;
	}

	public void setIndex(String index) {
		this.index = index;
	}

	public String getTable_field_name() {
		return table_field_name;
	}

	public void setTable_field_name(String table_field_name) {
		this.table_field_name = table_field_name;
	}

	public String getIndex_field_name() {
		return index_field_name;
	}

	public void setIndex_field_name(String index_field_name) {
		this.index_field_name = index_field_name;
	}

	public String getIndex_field_type() {
		return index_field_type;
	}

	public void setIndex_field_type(String index_field_type) {
		this.index_field_type = index_field_type;
	}

	public String getIndex_analyzer() {
		return index_analyzer;
	}

	public void setIndex_analyzer(String index_analyzer) {
		this.index_analyzer = index_analyzer;
	}

	public String getFielddata() {
		return fielddata;
	}

	public void setFielddata(String fielddata) {
		this.fielddata = fielddata;
	}

	public List<TableIndexMappingModel> getFieldList() {
		return fieldList;
	}

	public void setFieldList(List<TableIndexMappingModel> fieldList) {
		this.fieldList = fieldList;
	}
}
