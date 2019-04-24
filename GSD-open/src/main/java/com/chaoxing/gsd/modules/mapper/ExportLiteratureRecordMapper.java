package com.chaoxing.gsd.modules.mapper;

import org.springframework.stereotype.Service;

import com.chaoxing.gsd.modules.entity.ExportLiteratureRecord;
@Service
public interface ExportLiteratureRecordMapper {

	void insertOne(ExportLiteratureRecord data);
	
	ExportLiteratureRecord getLastestRecord(String userId);
}
