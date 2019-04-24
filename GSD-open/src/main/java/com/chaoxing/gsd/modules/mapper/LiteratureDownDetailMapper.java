package com.chaoxing.gsd.modules.mapper;

import java.util.List;
import java.util.Map;

import com.chaoxing.gsd.modules.entity.LiteratureDownDetail;

public interface LiteratureDownDetailMapper {
    int insert(LiteratureDownDetail record);

    int insertSelective(LiteratureDownDetail record);
    
    void deleteAllByLabelId(Integer labelId);
    
    void deleteByLabelId(Map<String, Object> para);
    
    List<LiteratureDownDetail> selectByLabelId(Map<String, Object> para);
}