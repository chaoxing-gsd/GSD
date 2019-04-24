package com.chaoxing.gsd.modules.mapper;

import java.util.List;
import java.util.Map;

import com.chaoxing.gsd.modules.entity.LiteratureDownLabel;

public interface LiteratureDownLabelMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(LiteratureDownLabel record);

    int insertSelective(LiteratureDownLabel record);

    LiteratureDownLabel selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(LiteratureDownLabel record);

    int updateByPrimaryKey(LiteratureDownLabel record);
    
    LiteratureDownLabel getCount(Map<String, Object> para);
    
    List<LiteratureDownLabel> selectByUserId(Map<String, Object> para);
}