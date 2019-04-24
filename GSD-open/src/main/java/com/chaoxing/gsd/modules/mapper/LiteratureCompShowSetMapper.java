package com.chaoxing.gsd.modules.mapper;

import java.util.List;

import com.chaoxing.gsd.modules.entity.LiteratureCompShowSet;

public interface LiteratureCompShowSetMapper {
	
	List<LiteratureCompShowSet> selectShowSet(LiteratureCompShowSet para);
	
    int insert(LiteratureCompShowSet record);

    int insertSelective(LiteratureCompShowSet record);
    
    int updateByPrimaryKeySelective(LiteratureCompShowSet record);
    
    int deleteByLabelId(Integer labelid);
}