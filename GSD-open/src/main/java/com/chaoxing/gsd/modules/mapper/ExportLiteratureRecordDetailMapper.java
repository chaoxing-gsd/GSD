package com.chaoxing.gsd.modules.mapper;

import org.springframework.stereotype.Service;

import com.chaoxing.gsd.modules.entity.ExportLiteratureRecordDetail;

@Service
public interface ExportLiteratureRecordDetailMapper {

	int getRecordCount(String userId);
	
	void insertOne(ExportLiteratureRecordDetail data);
}
