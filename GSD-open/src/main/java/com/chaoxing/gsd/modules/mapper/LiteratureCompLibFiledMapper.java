package com.chaoxing.gsd.modules.mapper;

import java.util.List;
import java.util.Map;

import com.chaoxing.gsd.modules.entity.LiteratureCompLibFiled;

public interface LiteratureCompLibFiledMapper {
	
	List<LiteratureCompLibFiled> selectByLibid(Map<String, Object> para);
	
    int deleteByPrimaryKey(Integer id);

    int insert(LiteratureCompLibFiled record);

    int insertSelective(LiteratureCompLibFiled record);

    LiteratureCompLibFiled selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(LiteratureCompLibFiled record);

    int updateByPrimaryKey(LiteratureCompLibFiled record);
}