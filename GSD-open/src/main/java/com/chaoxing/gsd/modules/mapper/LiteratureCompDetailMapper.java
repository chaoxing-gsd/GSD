package com.chaoxing.gsd.modules.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.chaoxing.gsd.modules.entity.LiteratureCompDetail;
@Service
public interface LiteratureCompDetailMapper {
	
	List<LiteratureCompDetail> selectLibIdByLabelId(Map<String, Object> para);
	
    int insert(LiteratureCompDetail record);

    int insertSelective(LiteratureCompDetail record);
    
    List<LiteratureCompDetail> selectByLabelId(Map<String, Object> para);
    
    void deleteAllByLabelId(Integer labelId);
    
    void deleteByLabelId(Map<String, Object> para);
    
}